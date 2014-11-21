var constants = require('../constants');
var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    expires: constants.sessionTTL
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: { }
  }
});

exports.Session = mongoose.model('Session', sessionSchema);
