var mongoose = require('mongoose');

mongoose.connection.on('connecting', function() {
  console.log('Database connecting...');
});

mongoose.connection.on('connected', function() {
  console.log('Database connected.');
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

// Determine the database connection settings from the
// environment variables.
exports.databaseURL = process.env.DATABASE_URL;
if (!exports.databaseURL) {
  if (process.env.NODE_ENV === 'production') {
    console.error('Set the DATABASE_URL environment variable for production.');
    process.exit(1);
  } else {
    exports.databaseURL = 'mongodb://localhost/hamlit';
  }
}

// Ping the database every few seconds.
// If the database connection fails, the driver often
// doesn't know about it until a query attempted.
// This "keepalive" mechanism helps the driver detect when
// the connection is down in the absence of active queries.
setInterval(function() {
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.db.admin().ping(function(err, result) {
      if (err) {
        console.error('Database ping error:', err.stack);
      }
    });
  }
}, 30000);

exports.connect = function(done) {
  mongoose.connection.once('open', function() {
    done();
  });

  // Start connecting only if we're disconnected.
  // If the database doesn't connect on the first try,
  // we retry once every second. Once we are connected, mongodb's
  // auto_reconnect mechanism will handle future connection
  // failures.
  if (mongoose.connection.readyState === 0) {
    var connect = function() {
      mongoose.connect(exports.databaseURL, function(err) {
        if (err) {
          console.error('Database error:', err.stack);
          setTimeout(function() {
            connect();
          }, 1000);
        }
      });
    };

    connect();
  }
};
