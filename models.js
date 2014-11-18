var constants = require('./constants');
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

var userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: function(value) {
      return /^.{1,64}@.{1,253}$/.test(value);
    }
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

userSchema.index({ email: 1 });

exports.User = mongoose.model('User', userSchema);
