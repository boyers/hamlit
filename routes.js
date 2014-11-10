var assets = require('./assets');

exports.config = function(app) {
  app.get('/', function(req, res) {
    res.render('layout', {
      styles: assets.getStyles(),
      scripts: assets.getScripts(),
      view: 'index'
    });
  });

  app.get('/about', function(req, res) {
    res.render('layout', {
      styles: assets.getStyles(),
      scripts: assets.getScripts(),
      view: 'about'
    });
  });
};
