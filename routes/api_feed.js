var _ = require('lodash');
var account = require('./api_account');
var helpers = require('../helpers');
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
    account.auth(req, res, function(session, user) {
      var UnnormalizedUsername = helpers.strip(req.body.username);

      if (!models.User.validateUsername(UnnormalizedUsername)) {
        return res.json({
          error: 'That user does not exist.'
        });
      }

      var normalizedUsername = models.User.getNormalizedUsername(UnnormalizedUsername);

      models.User.findOne({ normalizedUsername: normalizedUsername }, function(err, user) {
        if (err) {
          throw err;
        }

        if (user) {
          var url = '/' + normalizedUsername;
          if (url !== req.url) {
            return res.json({
              redirect: url
            });
          }

          return res.json({
            error: null
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
