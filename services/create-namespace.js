const GamePlay = require('../models/game-play');

module.exports.createNamespace = function(io, el) {
  
  el.socket = io.of('/' + el._id).on('connection', socket => {
    console.log('Socket connected, game id: ' + el._id);

    socket.emit('cards', el.cards);
    socket.emit('chat', el.chat);
    socket.emit('players', el.players);

    socket.on('players', updated => {
      switch(updated.change) {
        case 'add_waiting':
          if (!el.players.waiting.includes(updated.user)) {
            el.players.waiting.push(updated.user);
          }
          break;
        case 'remove_waiting':
          let indexW = el.players.waiting.indexOf(updated.user);
          if (indexW > -1) {
            el.players.waiting.splice(indexW, 1);
          }
          break;
        case 'add_ready':
          if (!el.players.ready.includes(updated.user)) {
            el.players.ready.push(updated.user);
          }
          break;
        case 'remove_ready':
          let indexR = el.players.ready.indexOf(updated.user);
          if (indexR > -1) {
            el.players.ready.splice(indexR, 1);
          }
          break;
        default:
          throw('Unknown update request');
      }
      GamePlay.findOneAndUpdate({_id: el._id}, { $set: { players: {waiting: el.players.waiting, ready: el.players.ready} }}, function(err){
        if(err){throw err;}
      });
      socket.emit('players', el.players);
    });   

    socket.on('cards', updated => {
      el.cards = updated;
      GamePlay.findOneAndUpdate({_id: el._id}, { $set: { cards: el.cards }}, function(err){
        if(err){throw err;}
      });
      socket.broadcast.emit('cards', el.cards);
    });        

    socket.on('chat', updated => {
      el.chat.push(updated);
      GamePlay.findOneAndUpdate({_id: el._id}, { $set: { chat: el.chat }}, function(err){
        if(err){throw err;}
      });
      socket.broadcast.emit('chat', el.chat);
    });

    socket.on('typing', user => {
      socket.broadcast.emit('typing', user);
    });

    socket.on('not-typing', user => {
      socket.broadcast.emit('not-typing', '');
    });
    
  });

}