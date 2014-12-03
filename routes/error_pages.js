var path = require('path');
var assets = require('./assets');

// Render a 404 page.
exports.render404 = function(req, res) {
  console.error('['+ (new Date()).toUTCString() +'] 404: ' + req.path);
  res.status(404);
  if (process.env.NODE_ENV === 'production') {
    return res.sendFile(path.resolve(__dirname, '..', 'build/application.html'));
  } else {
    return res.render('application', {
      styles: assets.getStyles(),
      scripts: assets.getScripts()
    });
  }
};

// Render a 500 page.
exports.render500 = function(req, res, err) {
  console.error('['+ (new Date()).toUTCString() +'] error:');
  console.error(err.stack);
  res.status(500);
  res.set('Content-Type', 'text/plain');
  if (process.env.NODE_ENV === 'production') {
    return res.send('Something isn\'t right. Please come back later.');
  } else {
    return res.send(err.stack);
  }
}

// Note: Other routes should be installed before this.
exports.config = function(app) {
  // "Catch-all" route that just serves a 404.
  app.use(function(req, res, next) {
    return exports.render404(req, res);
  });

  // If an error happens, serve a 500.
  app.use(function(err, req, res, next) {
    return exports.render500(req, res, err);
  });
};
