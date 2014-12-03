var path = require('path');
var unorm = require('unorm');
var assets = require('./assets');
var models = require('../models/user');
var helpers = require('../helpers');
var errorPages = require('./error_pages');

exports.config = function(app) {
  app.get('/', function(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.resolve(__dirname, '..', 'build/application.html'));
    } else {
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    }
  });

  app.get('/:username', function(req, res, next) {
    var username = req.params.username;

    models.User.findOne({ normalizedUsername: username }, function(err, user) {
      if (err) {
        return errorPages.render500(req, res, err);
      }

      if (user) {
        var url = '/' + encodeURIComponent(user.normalizedUsername);
        if (username !== user.normalizedUsername) {
          return res.redirect(url);
        }

        if (process.env.NODE_ENV === 'production') {
          res.sendFile(path.resolve(__dirname, '..', 'build/application.html'));
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
