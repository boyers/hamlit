exports.connect = function(done) {
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
    done();
  });
};
