const GamePlay = require('../models/game-play');
const createNamespaceService = require('../services/create-namespace');

function emitList(io) {
  GamePlay.find({active: false}, function(err, res){
    if(err){throw err;}
    let gameList = [];
    res.forEach((listEl) => {
      gameList.push({id: listEl._id, players: listEl.players});
    });
    io.emit('game-list', gameList);
  });
};

module.exports.newGamePlay = function(io){
  let gamePlay = new GamePlay({
    active: false,
    answer: 'Gwiezdne Wojny',
    players: {
      waiting: [],
      ready: [],
    },
    activePlayer: 0,
    cards: [
      {id: '001', x: 100, y: 20, fill: '#444444'},
      {id: '002', x: 250, y: 20, fill: '#ff550d'},
      {id: '003', x: 400, y: 20, fill: '#800080'},
      {id: '004', x: 550, y: 20, fill: '#0c64e8'},
      {id: '005', x: 100, y: 150, fill: '#b21a1a'}
    ]   
  });
  gamePlay.save(function(err, newGame){
    if(err) { throw(err); }
    createNamespaceService.createNamespace(io, newGame);
    emitList(io);
    console.log('New game created, id: ' + newGame._id);
  });
};