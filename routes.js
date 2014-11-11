var assets = require('./assets');

exports.config = function(app) {
  app.get(/^\/(about)?$/, function(req, res) {
    console.log('['+ (new Date()).toUTCString() +'] serving: ' + req.path);
    res.render('application', {
      styles: assets.getStyles(),
      scripts: assets.getScripts()
    });
  });
};
