const GamePlay = require('../models/game-play');

module.exports.newGamePlay = new Promise((resolve, reject) => {
  let gamePlay = new GamePlay({
    active: false,
    answer: 'Gwiezdne Wojny',
    players: {
      waiting: [],
      ready: [],
    },
    cards: [
      {id: '001', x: 100, y: 20, fill: '#444444'},
      {id: '002', x: 250, y: 20, fill: '#ff550d'},
      {id: '003', x: 400, y: 20, fill: '#800080'},
      {id: '004', x: 550, y: 20, fill: '#0c64e8'},
      {id: '005', x: 100, y: 150, fill: '#b21a1a'}
    ]   
  });
  gamePlay.save(function(err, newGame){
    if(err) { reject(err); }
    console.log('New game created, id: ' + newGame._id);
    resolve(newGame);
  });
});