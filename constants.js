// How long sessions live (in milliseconds).
exports.sessionTTL = 1000 * 60 * 60 * 24 * 30; // 30 days

// How difficult it is to hash passwords.
exports.bcryptRounds = 10;

// The "trust proxy" setting for Express.
exports.trustProxy = true;
