var assets = require('./assets');

exports.config = function(app) {
  app.get(/^\/(about)?$/, function(req, res) {
    console.log('serving: ' + req.path);
    res.render('layout', {
      styles: assets.getStyles(),
      scripts: assets.getScripts()
    });
  });
};
