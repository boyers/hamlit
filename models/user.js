var mongoose = require('mongoose');
var xregexp = require('xregexp');

var validateUsername = function(value) {
  return value && xregexp.XRegExp('^([0-9_]|\\p{L}){1,32}$').test(value);
};

var validateUsernameLowercase = function(value) {
  return value && validateUsername(value) && value === value.toLowerCase();
};

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: validateUsername
  },
  usernameLowercase: {
    type: String,
    unique: true,
    required: true,
    validate: validateUsernameLowercase
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

userSchema.path('usernameLowercase').validate(function(value) {
  return (value === this.username.toLowerCase());
});

userSchema.index({ usernameLowercase: 1 });

userSchema.statics.validateUsername = validateUsername;

exports.User = mongoose.model('User', userSchema);
