var _ = require('lodash');
var account = require('./api_account');
var helpers = require('../helpers');
var apiHelpers = require('./api_helpers');
var models = _.merge(
  require('../models/session.js'),
  require('../models/user.js')
);

exports.config = function(app) {
  app.post('/api/home', function(req, res) {
    account.auth(req, res, function(session, user) {
      return res.json({
        error: null
      });
    });
  });

  app.post('/api/user', function(req, res) {
    account.auth(req, res, function(session, loggedInUser) {
      var username = req.body.username;

      models.User.findOne({ normalizedUsername: username }, function(err, user) {
        if (err) {
          return apiHelpers.internalError(res, err);
        }

        if (user) {
          var url = '/' + encodeURIComponent(user.normalizedUsername);
          if (username !== user.normalizedUsername) {
            return res.json({
              redirect: url
            });
          }

          return res.json({
            error: null,
            user: apiHelpers.getUserData(user)
          });
        } else {
          return res.json({
            error: 'That user does not exist.'
          });
        }
      });
    });
  });
};
