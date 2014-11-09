var pg = require('pg');

exports.execute = function(query, params, done) {
  var url = process.env.DATABASE_URL || 'postgres://stephan@localhost/eigenfeed';

  pg.connect(url, function(err, client, release) {
    if (err) {
      return done(err);
    }

    client.query(query, params, function(err, result) {
      release();

      if (err) {
        return done(err);
      }

      done(null, result);
    });
  });
};

exports.executeGlobal = function(query, params, done) {
  var url = process.env.DATABASE_GLOBAL_URL || 'postgres://stephan@localhost/postgres';

  pg.connect(url, function(err, client, release) {
    if (err) {
      return done(err);
    }

    client.query(query, params, function(err, result) {
      release();

      if (err) {
        return done(err);
      }

      done(null, result);
    });
  });
};
