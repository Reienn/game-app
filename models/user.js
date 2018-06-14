const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mail: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  psw: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);