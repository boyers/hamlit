var path = require('path');
var assets = require('./assets');

// Note: Other routes should be installed before this.
exports.config = function(app) {
  // "Catch-all" route that just serves a 404.
  app.use(function(req, res, next) {
    console.error('['+ (new Date()).toUTCString() +'] 404: ' + req.path);
    res.status(404);
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.resolve(__dirname, '..', 'public/assets/application.html'));
    } else {
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    // If an error happens, serve a 500.
    app.use(function(err, req, res, next) {
      console.error('['+ (new Date()).toUTCString() +'] error:');
      console.error(err.stack);
      res.status(500);
      res.sendFile(path.resolve(__dirname, '..', 'public/assets/application.html'));
    });
  }
};
