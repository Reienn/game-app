const socket = require('socket.io');
const GamePlay = require('../models/game-play');

module.exports.socketIo = function(server) {
  const io = socket(server);

  GamePlay.find({}, function(err, gamePlays){
    if(err) { return next(err); }
    gamePlays.forEach( el => {   
      let gameCards = el.cards;
      let gameChats = el.chat;
      const groupSocket = io.of('/' + el._id);      
      
      groupSocket.on('connection', group => {
        console.log('Socket connected: ' + el._id);

        group.emit('cards', gameCards);
        group.emit('chat', gameChats);
      
        /*
        group.on('getGamePlay', () => {
          group.broadcast.emit('cards', gameCards);
        });
        */
        group.on('cards', updated => {
          gameCards = updated;
          GamePlay.findOneAndUpdate({_id: el._id}, { $set: { cards: gameCards }}, function(err){
            if(err){throw err;}
          });
          group.broadcast.emit('cards', gameCards);
        });        

        group.on('chat', updated => {
          gameChats.push(updated);
          GamePlay.findOneAndUpdate({_id: el._id}, { $set: { chat: gameChats }}, function(err){
            if(err){throw err;}
          });
          group.broadcast.emit('chat', gameChats);
        });

        group.on('typing', user => {
          group.broadcast.emit('typing', user);
        });

        group.on('not-typing', user => {
          group.broadcast.emit('not-typing', '');
        });
        
      });




    });
  });


 
  
}