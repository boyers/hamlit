var path = require('path');
var assets = require('./assets');
var htmlRoutes = /^\/(about)?$/;

exports.config = function(app) {
  if (process.env.NODE_ENV === 'production') {
    app.get(htmlRoutes, function(req, res) {
      res.sendFile(path.resolve(__dirname, '..', 'public/assets/application.html'));
    });
  } else {
    app.get(htmlRoutes, function(req, res) {
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });
  }
};
