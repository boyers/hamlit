var db = require('../db');

var queries = [
  'CREATE TABLE users (\
    id integer, \
    email varchar(255), \
    password_hash varchar(255), \
    password_salt varchar(255), \
    PRIMARY KEY(id) \
  );'
];

function runNextQuery() {
  if (queries.length === 0) {
    process.exit(0);
    return;
  }

  var query = queries.shift();
  console.log(query);
  db.execute(query, [], function(err, result) {
    if (err) {
      console.error('Error migrating database.', err);
      process.exit(1);
      return;
    }
    console.log(result);
    runNextQuery();
  });
}

runNextQuery();
