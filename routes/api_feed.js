var account = require('./api_account');

exports.config = function(app) {
  app.post('/api/home', function(req, res) {
    account.auth(req, res, function(session, user) {
      return res.json({
        error: null,
        posts: []
      });
    });
  });

  app.post('/api/user', function(req, res) {
    account.auth(req, res, function(session, user) {
      return res.json({
        error: null,
        posts: []
      });
    });
  });
};
