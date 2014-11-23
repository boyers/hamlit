var mongoose = require('mongoose');
var xregexp = require('xregexp');

var validateUsername = function(value) {
  return value && xregexp.XRegExp('^([0-9_ \-]|\\p{L}){1,32}$').test(value);
};

var getNormalizedUsername = function(username) {
  return username.toLowerCase().replace(/\s+/g, '');
};

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: validateUsername
  },
  normalizedUsername: {
    type: String,
    unique: true,
    required: true
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

userSchema.path('normalizedUsername').validate(function(value) {
  return (value === getNormalizedUsername(this.username));
});

userSchema.index({ normalizedUsername: 1 });

userSchema.statics.validateUsername = validateUsername;
userSchema.statics.getNormalizedUsername = getNormalizedUsername;

exports.User = mongoose.model('User', userSchema);
