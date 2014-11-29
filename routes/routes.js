var assets = require('./assets');
var mainPages = require('./main_pages');
var apiAccount = require('./api_account');
var apiFeed = require('./api_feed');
var errorPages = require('./error_pages');

exports.config = function(app) {
  // Routes that are faster to process should come first.
  // Routes that are hit more frequently should come first as well.
  assets.config(app);
  mainPages.config(app);
  apiAccount.config(app);
  apiFeed.config(app);
  errorPages.config(app); // This needs to come last.
};
