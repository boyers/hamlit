var account = require('./account');
var pages = require('./pages');

exports.config = function(app) {
  pages.config(app);
  account.config(app);
};
