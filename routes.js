var assets = require('./assets');

exports.config = function(app) {
  app.get(/^\/(about)?$/, function(req, res) {
    res.render('application', {
      styles: assets.getStyles(),
      scripts: assets.getScripts()
    });
  });

  app.post('/api/log_in', function(req, res) {
    res.json({
      error: 'Incorrect email or password.',
      validationErrors: null
    });
  });

  app.post('/api/sign_up', function(req, res) {
    res.json({
      error: null,
      validationErrors: {
        password: 'Pick a better password.'
      }
    });
  });
};
