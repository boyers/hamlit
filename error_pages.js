var assets = require('./assets');

exports.config = function(app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      console.error('404: ' + req.path);
      res.status(404);
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });

    app.use(function(err, req, res, next) {
      console.error(err.stack);
      res.status(500);
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });
  }
};
