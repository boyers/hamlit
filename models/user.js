var _ = require('lodash');
var mongoose = require('mongoose');
var xregexp = require('xregexp');
var unorm = require('unorm');

var validateUsername = function(value) {
  // Make sure value is a string.
  if (!_.isString(value)) {
    return false;
  }

  // encodeURIComponent (used by getNormalizedUsername) fails if
  // value contains an unpaired surrogate.
  try {
    encodeURIComponent(value);
  } catch (e) {
    return false;
  }

  // Make sure the value is normalized to NFC.
  if (value !== unorm.nfc(value)) {
    return false;
  }

  // Allow 1-32 letters, digits, underscores, dashes, and spaces.
  // Leading and trailing spaces are not allowed.
  return xregexp.XRegExp('^([0-9_\-]|\\p{L})(([0-9_ \-]|\\p{L}){0,30}([0-9_\-]|\\p{L}))?$').test(value);
};

// Note: This function will fail if username is not valid.
var getNormalizedUsername = function(username) {
  if (!validateUsername(username)) {
    throw 'Invalid username.';
  }

  return encodeURIComponent(username.toLowerCase().replace(/\s+/g, ''));
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
    required: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true,
    match: /^[.\/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$]{60}$/
  },
  passwordSalt: {
    type: String,
    required: true,
    match: /^[.\/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$]{29}$/
  }
});

userSchema.path('normalizedUsername').validate(function(value) {
  return (validateUsername(this.username) && value === getNormalizedUsername(this.username));
});

userSchema.statics.validateUsername = validateUsername;
userSchema.statics.getNormalizedUsername = getNormalizedUsername;
userSchema.statics.usernameValidationError = 'That username doesn&rsquo;t look valid. Please use only letters, digits, underscores, dashes, and spaces. Usernames cannot be longer than 32 characters.';

exports.User = mongoose.model('User', userSchema);
