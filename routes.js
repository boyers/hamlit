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

  app.post('/api/log_in', function(req, res) {
    res.json({
      error: 'Incorrect email or password.',
      validationErrors: null
    });
  });

  app.post('/api/sign_up', function(req, res) {
    var email = req.body.email.replace(/^\s+|\s+$/g, '');
    var password = req.body.password;

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

            return renderError(res, err);
          }

          return res.json({
            error: null,
            validationErrors: { }
          });
        });
      });
    });
  });
};
