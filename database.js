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

  mongoose.connection.on('connecting', function() {
    console.log('Database connecting...');
  });

  mongoose.connection.on('connected', function() {
    console.log('Database connected.');
  });

  mongoose.connection.once('open', function() {
    done();
  });

  mongoose.connection.on('disconnecting', function() {
    console.log('Database disconnecting...');
  });

  mongoose.connection.on('disconnected', function() {
    console.log('Database disconnected.');
  });

  mongoose.connection.on('close', function() {
    console.log('Database closed.');
  });

  mongoose.connection.on('reconnected', function() {
    console.log('Database reconnected.');
  });

  mongoose.connection.on('error', function(err) {
    console.error('Database error:', err.stack);
  });

  mongoose.connection.on('fullsetup', function() {
    console.log('Database connected to all replicas.');
  });
};
