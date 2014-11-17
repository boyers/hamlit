var app = require('express')();
app.disable('x-powered-by');
app.enable('strict routing');
app.disable('view cache');
app.set('view engine', 'html');
app.engine('html', require('garnet').__express);

var compression = require('compression');
app.use(compression());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

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

app.use(function(req, res, next) {
  console.log('['+ (new Date()).toUTCString() +'] ' + req.path);
  next();
});

require('./routes').config(app);
require('./assets').config(app);
require('./error_pages').config(app);

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d.', server.address().port);
});
