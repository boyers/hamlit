var database = require('./database');

database.connect(function() {
  repl = require('repl');
  repl.start({ });
});
