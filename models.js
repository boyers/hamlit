var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: {
      type: String,
      unique: true,
      validate: function(value) {
        return /^.{1,64}@.{1,253}$/.test(value);
      }
    },
    passwordHash: {
      type: String,
      validate: function(value) {
        return /^[.\/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$]{60}$/.test(value);
      }
    },
    passwordSalt: {
      type: String,
      validate: function(value) {
        return /^[.\/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$]{29}$/.test(value);
      }
    }
});

userSchema.index({ email: 1 });

exports.User = mongoose.model('User', userSchema);
