var _ = require('lodash');
var unorm = require('unorm');

// Check if the value is an NFC-normalized String
// containing no unpaired surrogates.
// Only save strings to the database if they pass this method.
exports.isNormalizedString = function(value) {
  // Make sure value is a string.
  if (!_.isString(value)) {
    return false;
  }

  // This fails if value contains an unpaired surrogate.
  try {
    encodeURIComponent(value);
  } catch (e) {
    return false;
  }

  // Make sure the value is normalized to NFC.
  if (value !== unorm.nfc(value)) {
    return false;
  }

  return true;
};

// Strip a string of leading and trailing whitespace.
exports.strip = function(value) {
  return value.replace(/^\s+|\s+$/g, '');
};
