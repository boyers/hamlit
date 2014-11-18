var constants = require('./constants');
var assets = require('./assets');
var models = require('./models');
var bcrypt = require('bcrypt');

var htmlRoutes = /^\/(about)?$/;

var renderError = function(res, err) {
  console.error(err);

  return res.json({
    error: 'Something went wrong.',
    validationErrors: { }
  });
};

var getUserData = function(user) {
  return {
    email: user.email
  };
};

var auth = function(req, res, callback) {
  if (req.signedCookies.sessionId) {
    models.Session.where({ _id: req.signedCookies.sessionId }).findOne(function(err, session) {
      if (err || !session) {
        res.clearCookie('sessionId');
        return res.json({
          error: 'Please log in.'
        });
      }

      if (session.data.userId) {
        models.User.where({ _id: session.data.userId }).findOne(function(err, user) {
          if (err || !user) {
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
  if (process.env.NODE_ENV === 'production') {
    app.get(htmlRoutes, function(req, res) {
      res.sendFile(__dirname + '/public/assets/application.html');
    });
  } else {
    app.get(htmlRoutes, function(req, res) {
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });
  }

  app.post('/api/get_user_data', function(req, res) {
    auth(req, res, function(session, user) {
      return res.json({
        error: null,
        user: getUserData(user)
      });
    });
  });

  app.post('/api/log_out', function(req, res) {
    if (req.signedCookies.sessionId) {
      Session.remove({ _id: req.signedCookies.sessionId }, function() {
        res.clearCookie('sessionId');
        return res.json({
          error: null
        });
      });
    }
  });

  app.post('/api/log_in', function(req, res) {
    var email = req.body.email.replace(/^\s+|\s+$/g, '');
    var password = req.body.password;

    if (email === '') {
      return res.json({
        error: null,
        validationErrors: {
          email: 'Please enter an email address.'
        }
      });
    }

    if (!/^.{1,64}@.{1,253}$/.test(email)) {
      return res.json({
        error: null,
        validationErrors: {
          email: 'That email address doesn&rsquo;t look valid.'
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

    models.User.where({ email: email }).findOne(function(err, user) {
      if (err || !user) {
        return res.json({
          error: 'Invalid email or password.',
          validationErrors: { }
        });
      }

      bcrypt.compare(password, user.passwordHash, function(err, result) {
        if (err) {
          return renderError(res, err);
        }

        if (result) {
          var session = new models.Session({
            data: { userId: user._id }
          });

          session.save(function(err) {
            if (err) {
              return renderError(res, err);
            }

            res.cookie('sessionId', session.id, {
              signed: true,
              maxAge: constants.sessionTTL * 1000
            });

            return res.json({
              error: null,
              validationErrors: { },
              user: getUserData(user)
            });
          });
        } else {
          return res.json({
            error: 'Invalid email or password.',
            validationErrors: { }
          });
        }
      });
    });
  });

  app.post('/api/sign_up', function(req, res) {
    var email = req.body.email.replace(/^\s+|\s+$/g, '');
    var password = req.body.password;

    if (email === '') {
      return res.json({
        error: null,
        validationErrors: {
          email: 'Please enter an email address.'
        }
      });
    }

    if (!/^.{1,64}@.{1,253}$/.test(email)) {
      return res.json({
        error: null,
        validationErrors: {
          email: 'That email address doesn&rsquo;t look valid.'
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

    if (password !== req.body.verifyPassword) {
      return res.json({
        error: null,
        validationErrors: {
          verifyPassword: 'Your passwords do not match.'
        }
      });
    }

    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return renderError(res, err);
      }

      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          return renderError(res, err);
        }

        var user = new models.User({
          email: email,
          passwordHash: hash,
          passwordSalt: salt
        });

        user.save(function(err) {
          if (err) {
            if (err.code === 11000) {
              return res.json({
                error: null,
                validationErrors: {
                  email: 'That email address is already registered.'
                }
              });
            }
          }

          var session = new models.Session({
            data: { userId: user._id }
          });

          session.save(function(err) {
            if (err) {
              return renderError(res, err);
            }

            res.cookie('sessionId', session.id, {
              signed: true,
              maxAge: constants.sessionTTL * 1000
            });

            return res.json({
              error: null,
              validationErrors: { },
              user: getUserData(user)
            });
          });
        });
      });
    });
  });
};
