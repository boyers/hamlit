var app = require('express')();
app.use(require('compression')());
app.disable('x-powered-by');
app.enable('strict routing');
app.disable('view cache');
app.set('view engine', 'html');
app.engine('html', require('garnet').__express);

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
