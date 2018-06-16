const mongoose = require('mongoose');

const GamePlaySchema = new mongoose.Schema({
  active: Boolean,
  answer: String,
  players: [{
    user: String,
    active: Boolean
  }],
  chat: [{
    user: String,
    message: String
  }],
  cards: [{
    id: String,
		x: Number,
		y: Number,
		fill: String
  }]  
});

module.exports = mongoose.model('GamePlay', GamePlaySchema);