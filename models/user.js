var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  user: {
    type: String,
  },
})

var User = mongoose.model('User', UserSchema);

module.exports = User;