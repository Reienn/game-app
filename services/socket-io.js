const GamePlay = require('../models/game-play');
const createNamespaceService = require('../services/create-namespace');
const newGameController = require('../controllers/new-game-play');

module.exports.socketIo = function(server) {
  const io = require('socket.io')(server);

  GamePlay.find({}, function(err, res){
		if(err){throw err;}

    io.on('connection', socket => {
      console.log('Dashboard socket connected');
      let gameList = [];
      res.forEach((el) => {
        gameList.push({id: el._id, players: el.players});
        createNamespaceService.createNamespace(io, el);
      });      
      socket.emit('game-list', gameList);

      socket.on('new-game-play', data => {
        newGameController.newGamePlay(io);
      });
    });


  });

 
  
}