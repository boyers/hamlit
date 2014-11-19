var constants = require('./constants');
var mongoose = require('mongoose');
var xregexp = require('xregexp');

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

var validateUsername = function(value) {
  return xregexp.XRegExp('^([0-9_]|\\p{L}){1,32}$').test(value);
};

var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: validateUsername
  },
  passwordHash: {
    type: String,
    required: true,
    validate: function(value) {
      return /^[.\/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$]{60}$/.test(value);
    }
  },
  passwordSalt: {
    type: String,
    required: true,
    validate: function(value) {
      return /^[.\/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$]{29}$/.test(value);
    }
  }
});

userSchema.statics.validateUsername = validateUsername;

userSchema.index({ username: 1 });

exports.User = mongoose.model('User', userSchema);
