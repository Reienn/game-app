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

module.exports.newGamePlay = function(io, socket){
  let gamePlay = new GamePlay({
    active: false,
    players: {
      waiting: [],
      ready: [],
    },
    activePlayer: 0, 
  });
  gamePlay.save(function(err, newGame){
    if(err) { throw(err); }
    createNamespaceService.createNamespace(io, newGame);
    emitList(io);
    socket.emit('join-new', newGame._id);
    console.log('New game created, id: ' + newGame._id);
  });
};