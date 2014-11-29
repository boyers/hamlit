var constants = require('../constants');
var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: { }
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
    index: true
  }
});

exports.Session = mongoose.model('Session', sessionSchema);
