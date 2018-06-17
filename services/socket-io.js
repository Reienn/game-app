const GamePlay = require('../models/game-play');
const createNamespaceService = require('./create-namespace');

module.exports.socketIo = function(server) {
  const io = require('socket.io')(server);

  let gamesDetails = {
    gameList: [],
    gameCards: [],
    gameChats: [],
    gamePlayers: [],
    groupSockets: []
  }
 

let gameList = [];

  GamePlay.find({}, function(err, res){
		if(err){throw err;}
    //console.log(res);
    res.forEach((el) => {
     // console.log(gamesDetails);
      /*gamesDetails.*/gameList.push(el._id);
      createNamespaceService.createNamespace(io, el);
    });
  });

  io.on('connection', socket => {
    socket.emit('game-list', gameList);

    socket.on('new-game-play', data => {
      const newGameController = require('../controllers/new-game-play');
      newGameController.newGamePlay.then( newGame => {
        gameList.push(newGame._id);
        createNamespaceService.createNamespace(io, newGame);
        io.emit('game-list', gameList);
      });
    });
  });
  
}