var db = require('../db');

db.executeGlobal('DROP DATABASE eigenfeed;', [], function(err, result) {
  if (err) {
    console.error('Error dropping database.', err);
    process.exit(1);
    return;
  }
  console.log(result);
  process.exit(0);
});
