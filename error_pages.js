var assets = require('./assets');

exports.config = function(app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      console.log('404: ' + req.path);
      res.status(404);
      res.render('layout', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });

    app.use(function(err, req, res, next) {
      console.log(err.stack);
      res.status(500);
      res.render('layout', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });
  }
};
