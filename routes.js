var assets = require('./assets');
var models = require('./models');

var htmlRoutes = /^\/(about)?$/;

exports.config = function(app) {
  if (process.env.NODE_ENV === 'production') {
    app.get(htmlRoutes, function(req, res) {
      res.sendFile(__dirname + '/public/assets/application.html');
    });
  } else {
    app.get(htmlRoutes, function(req, res) {
      res.render('application', {
        styles: assets.getStyles(),
        scripts: assets.getScripts()
      });
    });
  }

  app.post('/api/log_in', function(req, res) {
    res.json({
      error: 'Incorrect email or password.',
      validationErrors: null
    });
  });

  app.post('/api/sign_up', function(req, res) {
    var fluffy = new models.Kitten({ name: 'fluffy' });

    fluffy.save(function(err, fluffy) {
      if (err) {
        return console.error(err);
      }

      fluffy.speak();
    });

    res.json({
      error: null,
      validationErrors: {
        password: 'Pick a better password.'
      }
    });
  });
};
