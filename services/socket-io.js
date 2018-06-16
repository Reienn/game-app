const GamePlay = require('../models/game-play');

module.exports.socketIo = function(server) {
  const io = require('socket.io')(server);

  let gameCards = [];
  let gameChats = [];
  let gamePlayers = [];
  let groupSockets = [];

  GamePlay.find({}, function(err, gamePlays){
    if(err) { return next(err); }
    
    gamePlays.forEach( (el, i) => {   
      gameCards[i] = el.cards;
      gameChats[i] = el.chat;
      gamePlayers[i] = el.players;
      
      groupSockets[i] = io.of('/' + el._id).on('connection', socket => {
        console.log('Socket connected, game id: ' + el._id);

        socket.emit('cards', gameCards[i]);
        socket.emit('chat', gameChats[i]);
        socket.emit('players', gamePlayers[i]);

        socket.on('players', updated => {
          switch(updated.change) {
            case 'add_waiting':
              if (!gamePlayers[i].waiting.includes(updated.user)) {
                gamePlayers[i].waiting.push(updated.user);
              }
              break;
            case 'remove_waiting':
              let indexW = gamePlayers[i].waiting.indexOf(updated.user);
              if (indexW > -1) {
                gamePlayers[i].waiting.splice(indexW, 1);
              }
              break;
            case 'add_ready':
              if (!gamePlayers[i].ready.includes(updated.user)) {
                gamePlayers[i].ready.push(updated.user);
              }
              break;
            case 'remove_ready':
              let indexR = gamePlayers[i].ready.indexOf(updated.user);
              if (indexR > -1) {
                gamePlayers[i].ready.splice(indexR, 1);
              }
              break;
            default:
              throw('Unknown update request');
          }
          GamePlay.findOneAndUpdate({_id: el._id}, { $set: { players: {waiting: gamePlayers[i].waiting, ready: gamePlayers[i].ready} }}, function(err){
            if(err){throw err;}
          });
          socket.emit('players', gamePlayers[i]);
        });   

        socket.on('cards', updated => {
          gameCards[i] = updated;
          GamePlay.findOneAndUpdate({_id: el._id}, { $set: { cards: gameCards[i] }}, function(err){
            if(err){throw err;}
          });
          socket.broadcast.emit('cards', gameCards[i]);
        });        

        socket.on('chat', updated => {
          gameChats[i].push(updated);
          GamePlay.findOneAndUpdate({_id: el._id}, { $set: { chat: gameChats[i] }}, function(err){
            if(err){throw err;}
          });
          socket.broadcast.emit('chat', gameChats[i]);
        });

        socket.on('typing', user => {
          socket.broadcast.emit('typing', user);
        });

        socket.on('not-typing', user => {
          socket.broadcast.emit('not-typing', '');
        });
        
      });
    });

  });
  
}