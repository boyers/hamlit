var assets = require('./assets');
var pages = require('./pages');
var account = require('./account');
var errorPages = require('./error_pages');

exports.config = function(app) {
  assets.config(app);
  pages.config(app);
  account.config(app);
  errorPages.config(app);
};
