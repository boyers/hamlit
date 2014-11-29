var path = require('path');
var unorm = require('unorm');
var assets = require('./assets');
var models = require('../models/user');
var helpers = require('../helpers');

exports.config = function(app) {
  app.get('/', function(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.resolve(__dirname, '..', 'public/assets/application.html'));
    } else {
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    }
  });

  app.get('/:username', function(req, res, next) {
    var UnnormalizedUsername = helpers.strip(req.params.username);

    if (!models.User.validateUsername(UnnormalizedUsername)) {
      return next();
    }

    var normalizedUsername = models.User.getNormalizedUsername(UnnormalizedUsername);

    var url = '/' + normalizedUsername;
    if (url !== req.url) {
      return res.redirect(url);
    }

    models.User.findOne({ normalizedUsername: normalizedUsername }, function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        if (process.env.NODE_ENV === 'production') {
          res.sendFile(path.resolve(__dirname, '..', 'public/assets/application.html'));
        } else {
          return res.render('application', {
            styles: assets.getStyles(),
            scripts: assets.getScripts()
          });
        }
      } else {
        next();
      }
    });
  });
};
