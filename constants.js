// How long sessions live, in seconds.
// If you change this value, be sure to re-build
// MongoDB's TTL index on the sessions collection.
exports.sessionTTL = 60 * 60 * 24 * 30;

// How difficult it is to hash passwords.
exports.bcryptRounds = 10;
