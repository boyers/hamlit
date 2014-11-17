var mongoose = require('mongoose');

var kittySchema = mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function() {
  console.log(this.name ? "Meow name is " + this.name : "I don't have a name");
};

exports.Kitten = mongoose.model('Kitten', kittySchema);
