var _ = require('lodash');
var bcrypt = require('bcrypt');
var constants = require('../constants');
var helpers = require('./helpers');
var models = _.merge(
  require('../models/session.js'),
  require('../models/user.js')
);

exports.auth = function(req, res, callback) {
  if (req.signedCookies.sessionId) {
    models.Session.where({ _id: req.signedCookies.sessionId }).findOne(function(err, session) {
      if (err) {
        return helpers.renderAPIError(res, err);
      }

      if (!session) {
        res.clearCookie('sessionId');
        return res.json({
          error: 'Please log in.'
        });
      }

      if (session.data.userId) {
        models.User.where({ _id: session.data.userId }).findOne(function(err, user) {
          if (err) {
            return helpers.renderAPIError(res, err);
          }

          if (!user) {
            return res.json({
              error: 'Please log in.'
            });
          }

          callback(session, user);
        });
      } else {
        return res.json({
          error: 'Please log in.'
        });
      }
    });
  } else {
    res.clearCookie('sessionId');
    return res.json({
      error: 'Please log in.'
    });
  }
};

exports.config = function(app) {
  app.post('/api/get_user_data', function(req, res) {
    exports.auth(req, res, function(session, user) {
      return res.json({
        error: null,
        user: helpers.getUserData(user)
      });
    });
  });

  app.post('/api/sign_up', function(req, res) {
    var username = req.body.username.replace(/^\s+|\s+$/g, '');
    var password = req.body.password;
    var verifyPassword = req.body.verifyPassword;

    if (username === '') {
      return res.json({
        error: null,
        validationErrors: {
          username: 'Please enter a username.'
        }
      });
    }

    if (!models.User.validateUsername(username)) {
      return res.json({
        error: null,
        validationErrors: {
          username: 'That username doesn&rsquo;t look valid. Please use only letters, digits, and underscores.'
        }
      });
    }

    models.User.findOne({
        usernameLowercase: username.toLowerCase()
      }, function(err, existingUser) {
      if (err) {
        return helpers.renderAPIError(res, err);
      }

      if (existingUser) {
        return res.json({
          error: null,
          validationErrors: {
            username: 'That username is already taken.'
          }
        });
      }

      if (password === '') {
        return res.json({
          error: null,
          validationErrors: {
            password: 'Please enter a password.'
          }
        });
      }

      if (verifyPassword === '') {
        return res.json({
          error: null,
          validationErrors: {
            verifyPassword: 'Please re-enter your password here.'
          }
        });
      }

      if (password !== verifyPassword) {
        return res.json({
          error: null,
          validationErrors: {
            verifyPassword: 'Your passwords do not match.'
          }
        });
      }

      bcrypt.genSalt(constants.bcryptRounds, function(err, salt) {
        if (err) {
          return helpers.renderAPIError(res, err);
        }

        bcrypt.hash(password, salt, function(err, hash) {
          if (err) {
            return helpers.renderAPIError(res, err);
          }

          var user = new models.User({
            username: username,
            usernameLowercase: username.toLowerCase(),
            passwordHash: hash,
            passwordSalt: salt
          });

          user.save(function(err) {
            if (err) {
              if (err.code === 11000) {
                return res.json({
                  error: null,
                  validationErrors: {
                    username: 'That username is already taken.'
                  }
                });
              }

              return helpers.renderAPIError(res, err);
            }

            var session = new models.Session({
              data: { userId: user._id }
            });

            session.save(function(err) {
              if (err) {
                return helpers.renderAPIError(res, err);
              }

              res.cookie('sessionId', session.id, {
                signed: true,
                maxAge: constants.sessionTTL * 1000
              });

              return res.json({
                error: null,
                validationErrors: { },
                user: helpers.getUserData(user)
              });
            });
          });
        });
      });
    });
  });

  app.post('/api/log_in', function(req, res) {
    var username = req.body.username.replace(/^\s+|\s+$/g, '');
    var password = req.body.password;

    if (username === '') {
      return res.json({
        error: null,
        validationErrors: {
          username: 'Please enter your username.'
        }
      });
    }

    if (password === '') {
      return res.json({
        error: null,
        validationErrors: {
          password: 'Please enter a password.'
        }
      });
    }

    models.User.where({ usernameLowercase: username.toLowerCase() }).findOne(function(err, user) {
      if (err) {
        return helpers.renderAPIError(res, err);
      }

      if (!user) {
        return res.json({
          error: 'Incorrect username or password.',
          validationErrors: { }
        });
      }

      bcrypt.compare(password, user.passwordHash, function(err, result) {
        if (err) {
          return helpers.renderAPIError(res, err);
        }

        if (result) {
          var session = new models.Session({
            data: { userId: user._id }
          });

          session.save(function(err) {
            if (err) {
              return helpers.renderAPIError(res, err);
            }

            res.cookie('sessionId', session.id, {
              signed: true,
              maxAge: constants.sessionTTL * 1000
            });

            return res.json({
              error: null,
              validationErrors: { },
              user: helpers.getUserData(user)
            });
          });
        } else {
          return res.json({
            error: 'Incorrect username or password.',
            validationErrors: { }
          });
        }
      });
    });
  });

  app.post('/api/log_out', function(req, res) {
    if (req.signedCookies.sessionId) {
      models.Session.remove({ _id: req.signedCookies.sessionId }, function(err) {
        if (err) {
          return helpers.renderAPIError(res, err);
        }

        res.clearCookie('sessionId');
        return res.json({
          error: null
        });
      });
    }
  });

  app.post('/api/check_username', function(req, res) {
    var username = req.body.username.replace(/^\s+|\s+$/g, '');

    models.User.findOne({
        usernameLowercase: username.toLowerCase()
      }, function(err, user) {
      if (err) {
        return helpers.renderAPIError(res, err);
      }

      return res.json({
        error: null,
        result: (user === null)
      });
    });
  });

  app.post('/api/update_username', function(req, res) {
    exports.auth(req, res, function(session, user) {
      var username = req.body.username.replace(/^\s+|\s+$/g, '');

      if (username === '') {
        return res.json({
          error: null,
          validationErrors: {
            username: 'Please enter a username.'
          }
        });
      }

      if (!models.User.validateUsername(username)) {
        return res.json({
          error: null,
          validationErrors: {
            username: 'That username doesn&rsquo;t look valid. Please use only letters, digits, and underscores.'
          }
        });
      }

      user.username = username;
      user.usernameLowercase = username.toLowerCase();

      user.save(function(err) {
        if (err) {
          if (err.code === 11000) {
            return res.json({
              error: null,
              validationErrors: {
                username: 'That username is already taken.'
              }
            });
          }

          return helpers.renderAPIError(res, err);
        }

        return res.json({
          error: null,
          user: helpers.getUserData(user)
        });
      });
    });
  });

  app.post('/api/update_password', function(req, res) {
    exports.auth(req, res, function(session, user) {
      var newPassword = req.body.newPassword;
      var verifyPassword = req.body.verifyPassword;
      var oldPassword = req.body.oldPassword;

      if (newPassword === '') {
        return res.json({
          error: null,
          validationErrors: {
            newPassword: 'Please enter your new password.'
          }
        });
      }

      if (verifyPassword === '') {
        return res.json({
          error: null,
          validationErrors: {
            verifyPassword: 'Please re-enter your new password here.'
          }
        });
      }

      if (newPassword !== verifyPassword) {
        return res.json({
          error: null,
          validationErrors: {
            verifyPassword: 'Your passwords do not match.'
          }
        });
      }

      if (oldPassword === '') {
        return res.json({
          error: null,
          validationErrors: {
            oldPassword: 'Please enter your old password.'
          }
        });
      }

      bcrypt.compare(oldPassword, user.passwordHash, function(err, result) {
        if (err) {
          return helpers.renderAPIError(res, err);
        }

        if (result) {
          bcrypt.genSalt(constants.bcryptRounds, function(err, salt) {
            if (err) {
              return helpers.renderAPIError(res, err);
            }

            bcrypt.hash(newPassword, salt, function(err, hash) {
              if (err) {
                return helpers.renderAPIError(res, err);
              }

              user.passwordHash = hash;
              user.passwordSalt = salt;

              user.save(function(err) {
                if (err) {
                  return helpers.renderAPIError(res, err);
                }

                return res.json({
                  error: null,
                  user: helpers.getUserData(user)
                });
              });
            });
          });
        } else {
          return res.json({
            error: null,
            validationErrors: {
              oldPassword: 'Incorrect password.'
            }
          });
        }
      });
    });
  });

  app.post('/api/delete_account', function(req, res) {
    exports.auth(req, res, function(session, user) {
      session.remove(function(err) {
        if (err) {
          return helpers.renderAPIError(res, err);
        }

        user.remove(function(err) {
          if (err) {
            return helpers.renderAPIError(res, err);
          }

          return res.json({
            error: null,
            user: helpers.getUserData(user)
          });
        });
      });
    });
  });
};
