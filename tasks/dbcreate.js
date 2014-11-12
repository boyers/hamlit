var db = require('../db');

db.executeGlobal('CREATE DATABASE eigenfeed;', [], function(err, result) {
  if (err) {
    console.error('Error creating database.', err);
    process.exit(1);
    return;
  }
  console.log(result);
  process.exit(0);
});
