var constants = require('../constants');
var database = require('../database');
var session = require('../models/session');

function killOldSessions() {
  var killDate = Date.now() - constants.sessionTTL;

  console.log('Killing sessions older than ' + String(new Date(killDate)) + '...');

  session.Session.remove({
    lastAccessed: { $lte: killDate }
  }, function(err, count) {
    if (err) {
      console.error(err);
    } else {
      console.log('Killed ' + String(count) + ' sessions.');
    }

    setTimeout(killOldSessions, 1000 * 60);
  });
}

database.connect(function() {
  killOldSessions();
});
