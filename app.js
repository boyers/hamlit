var database_url = process.env.DATABASE_URL;
if (!database_url) {
  if (process.env.NODE_ENV === 'production') {
    console.error('Set the DATABASE_URL environment variable for production.');
    process.exit(1);
  } else {
    database_url = 'mongodb://localhost/hamlit';
  }
}

var mongoose = require('mongoose');
mongoose.connect(database_url);
var db = mongoose.connection;

db.on('error', function(err) {
  console.error('Database error:', err);
  process.exit(1);
});

db.once('open', function() {
  var app = require('express')();
  app.disable('x-powered-by');
  app.enable('strict routing');
  app.disable('view cache');
  app.set('view engine', 'html');
  app.engine('html', require('garnet').__express);

  var morgan = require('morgan');
  app.use(morgan('short'));

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

  require('./routes').config(app);
  require('./assets').config(app);
  require('./error_pages').config(app);

  var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port %d.', server.address().port);
  });
});
