var assets = require('./assets');

var logRequest = function(req) {
  console.log('['+ (new Date()).toUTCString() +'] serving: ' + req.path);
};

exports.config = function(app) {
  app.get(/^\/(about)?$/, function(req, res) {
    logRequest(req);
    res.render('application', {
      styles: assets.getStyles(),
      scripts: assets.getScripts()
    });
  });

  app.post('/api/log_in', function(req, res) {
    logRequest(req);
    res.json({
      error: 'Incorrect email or password.',
      validationErrors: null
    });
  });

  app.post('/api/sign_up', function(req, res) {
    logRequest(req);
    res.json({
      error: null,
      validationErrors: {
        password: 'Pick a better password.'
      }
    });
  });
};
