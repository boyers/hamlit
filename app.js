var _ = require('lodash');
var unorm = require('unorm');
var constants = require('./constants');
var database = require('./database');

database.connect(function() {
  var app = require('express')();
  app.disable('x-powered-by');
  app.enable('strict routing');
  app.set('trust proxy', constants.trustProxy);
  app.disable('view cache');
  app.set('view engine', 'html');
  app.engine('html', require('garnet').__express);

  app.use(function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      if (req.protocol.toLowerCase() !== 'https') {
        res.redirect(301, 'https://' + req.hostname + req.url);
      } else {
        next();
      }
    } else {
      next();
    }
  });

  var morgan = require('morgan');
  app.use(morgan('short'));

  var compression = require('compression');
  app.use(compression());

  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(function(req, res, next) {
    req.body = _.cloneDeep(req.body, function(value) {
      if (_.isString(value)) {
        return unorm.nfc(value);
      } else {
        return undefined;
      }
    });
    next();
  });

  var secret_key = process.env.SECRET_KEY;
  if (!secret_key) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Set the SECRET_KEY environment variable for production.');
      process.exit(1);
    } else {
      secret_key = 'abc123';
    }
  }

  var cookieParser = require('cookie-parser');
  app.use(cookieParser(secret_key));

  var garnet = require('garnet');
  garnet.templateExt = '.html';
  garnet.enableCaching = (process.env.NODE_ENV === 'production');

  require('./routes/routes').config(app);

  var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port %d.', server.address().port);
  });
});
