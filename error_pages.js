var assets = require('./assets');

exports.config = function(app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      res.status(404);
      res.render('layout', {
        styles: assets.getStyles(),
        scripts: assets.getScripts(),
        view: '404'
      });
    });

    app.use(function(err, req, res, next){
      res.status(500);
      res.render('layout', {
        styles: assets.getStyles(),
        scripts: assets.getScripts(),
        view: '500'
      });
    });
  }
};
