var _ = require('lodash');
var bcrypt = require('bcrypt');
var constants = require('../constants');
var helpers = require('../helpers');
var apiHelpers = require('./api_helpers');
var models = _.merge(
  require('../models/session.js'),
  require('../models/user.js')
);

exports.auth = function(req, res, callback) {
  if (req.signedCookies.sessionId) {
    models.Session.findOne({ _id: req.signedCookies.sessionId }, function(err, session) {
      if (err) {
        throw err;
      }

      if (!session) {
        res.clearCookie('sessionId');
        return res.json({
          error: 'Please log in.'
        });
      }

      session.lastAccessed = Date.now();
      session.save();

      if (session.data.userId) {
        models.User.findOne({ _id: session.data.userId }, function(err, user) {
          if (err) {
            throw err;
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
        user: apiHelpers.getUserData(user)
      });
    });
  });

  app.post('/api/sign_up', function(req, res) {
    var username = helpers.strip(req.body.username);
    var password = req.body.password;
    var verifyPassword = req.body.verifyPassword;

    if (username === '') {
      return res.json({
        error: 'Please fix the error(s) below.',
        validationErrors: {
          username: 'Enter a username.'
        }
      });
    }

    if (!models.User.validateUsername(username)) {
      return res.json({
        error: 'Please fix the error(s) below.',
        validationErrors: {
          username: 'Invalid username.'
        }
      });
    }

    models.User.findOne({
        normalizedUsername: models.User.getNormalizedUsername(username)
      }, function(err, existingUser) {
      if (err) {
        throw err;
      }

      if (existingUser) {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            username: 'That username is already taken.'
          }
        });
      }

      if (password === '') {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            password: 'Enter a password.'
          }
        });
      }

      if (verifyPassword === '') {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            verifyPassword: 'Re-enter your password here.'
          }
        });
      }

      if (password !== verifyPassword) {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            verifyPassword: 'Your passwords do not match.'
          }
        });
      }

      bcrypt.genSalt(constants.bcryptRounds, function(err, salt) {
        if (err) {
          throw err;
        }

        bcrypt.hash(password, salt, function(err, hash) {
          if (err) {
            throw err;
          }

          var user = new models.User({
            username: username,
            normalizedUsername: models.User.getNormalizedUsername(username),
            passwordHash: hash,
            passwordSalt: salt
          });

          user.save(function(err) {
            if (err) {
              if (err.code === 11000) {
                return res.json({
                  error: 'Please fix the error(s) below.',
                  validationErrors: {
                    username: 'That username is already taken.'
                  }
                });
              }

              throw err;
            }

            var session = new models.Session({
              data: { userId: user._id }
            });

            session.save(function(err) {
              if (err) {
                throw err;
              }

              res.cookie('sessionId', session.id, {
                signed: true,
                maxAge: constants.sessionTTL
              });

              return res.json({
                error: null,
                user: apiHelpers.getUserData(user)
              });
            });
          });
        });
      });
    });
  });

  app.post('/api/log_in', function(req, res) {
    var username = helpers.strip(req.body.username);
    var password = req.body.password;

    if (username === '') {
      return res.json({
        error: 'Please fix the error(s) below.',
        validationErrors: {
          username: 'Enter your username.'
        }
      });
    }

    if (!models.User.validateUsername(username)) {
      return res.json({
        error: 'Incorrect username or password.',
        validationErrors: { }
      });
    }

    if (password === '') {
      return res.json({
        error: 'Please fix the error(s) below.',
        validationErrors: {
          password: 'Enter your password.'
        }
      });
    }

    models.User.findOne({ normalizedUsername: models.User.getNormalizedUsername(username) }, function(err, user) {
      if (err) {
        throw err;
      }

      if (!user) {
        return res.json({
          error: 'Incorrect username or password.'
        });
      }

      bcrypt.compare(password, user.passwordHash, function(err, result) {
        if (err) {
          throw err;
        }

        if (result) {
          var session = new models.Session({
            data: { userId: user._id }
          });

          session.save(function(err) {
            if (err) {
              throw err;
            }

            res.cookie('sessionId', session.id, {
              signed: true,
              maxAge: constants.sessionTTL
            });

            return res.json({
              error: null,
              user: apiHelpers.getUserData(user)
            });
          });
        } else {
          return res.json({
            error: 'Incorrect username or password.'
          });
        }
      });
    });
  });

  app.post('/api/log_out', function(req, res) {
    if (req.signedCookies.sessionId) {
      models.Session.remove({ _id: req.signedCookies.sessionId }, function(err) {
        if (err) {
          throw err;
        }

        res.clearCookie('sessionId');
        return res.json({
          error: null
        });
      });
    }
  });

  app.post('/api/check_username', function(req, res) {
    var username = helpers.strip(req.body.username);
    var oldUsername = req.body.oldUsername ? helpers.strip(req.body.oldUsername) : null;

    if (!models.User.validateUsername(username)) {
      return res.json({
        error: models.User.usernameValidationError,
        result: false
      });
    }

    if (oldUsername !== null) {
      if (!models.User.validateUsername(oldUsername)) {
        return res.json({
          error: 'Invalid old username.'
        });
      }

      if (models.User.getNormalizedUsername(username) === models.User.getNormalizedUsername(oldUsername)) {
        return res.json({
          error: null,
          result: null
        });
      }
    }

    models.User.findOne({
        normalizedUsername: models.User.getNormalizedUsername(username)
    }, function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        return res.json({
          error: 'That username is already taken.',
          result: false
        });
      }

      return res.json({
        error: null,
        result: true
      });
    });
  });

  app.post('/api/update_username', function(req, res) {
    exports.auth(req, res, function(session, user) {
      var username = helpers.strip(req.body.username);

      if (username === '') {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            username: 'Enter a username.'
          }
        });
      }

      if (!models.User.validateUsername(username)) {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            username: 'Invalid username.'
          }
        });
      }

      user.username = username;
      user.normalizedUsername = models.User.getNormalizedUsername(username);

      user.save(function(err) {
        if (err) {
          if (err.code === 11000) {
            return res.json({
              error: 'Please fix the error(s) below.',
              validationErrors: {
                username: 'That username is already taken.'
              }
            });
          }

          throw err;
        }

        return res.json({
          error: null,
          user: apiHelpers.getUserData(user)
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
          error: 'Please fix the error(s) below.',
          validationErrors: {
            newPassword: 'Enter your new password.'
          }
        });
      }

      if (verifyPassword === '') {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            verifyPassword: 'Re-enter your new password here.'
          }
        });
      }

      if (newPassword !== verifyPassword) {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            verifyPassword: 'Your passwords do not match.'
          }
        });
      }

      if (oldPassword === '') {
        return res.json({
          error: 'Please fix the error(s) below.',
          validationErrors: {
            oldPassword: 'Enter your old password.'
          }
        });
      }

      bcrypt.compare(oldPassword, user.passwordHash, function(err, result) {
        if (err) {
          throw err;
        }

        if (result) {
          bcrypt.genSalt(constants.bcryptRounds, function(err, salt) {
            if (err) {
              throw err;
            }

            bcrypt.hash(newPassword, salt, function(err, hash) {
              if (err) {
                throw err;
              }

              user.passwordHash = hash;
              user.passwordSalt = salt;

              user.save(function(err) {
                if (err) {
                  throw err;
                }

                return res.json({
                  error: null,
                  user: apiHelpers.getUserData(user)
                });
              });
            });
          });
        } else {
          return res.json({
            error: 'Please fix the error(s) below.',
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
          throw err;
        }

        user.remove(function(err) {
          if (err) {
            throw err;
          }

          return res.json({
            error: null
          });
        });
      });
    });
  });
};
