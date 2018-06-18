const GamePlay = require('../models/game-play');

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

module.exports.createNamespace = function(io, el) {

  el.socket = io.of('/' + el._id).on('connection', socket => {
    console.log('Socket connected, game id: ' + el._id);

    socket.emit('cards', el.cards);
    socket.emit('chat', el.chat);
    socket.emit('players', {players: el.players, active: el.active});

    socket.on('players', updated => {
      switch(updated.change) {
        case 'add_waiting':
          if (!el.active && !el.players.waiting.includes(updated.user)) {
            el.players.waiting.push(updated.user);
          } else if (el.active && !el.players.ready.includes(updated.user)) {
            el.players.ready.push(updated.user);
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
      if(el.players.waiting.length == 0 && el.players.ready.length == 0){
        GamePlay.deleteOne({_id: el._id}, function(err){
          if(err){throw err;}
        });
        socket.disconnect();
        console.log('Game ' + el._id + ' is over');
      } else {
        GamePlay.findOneAndUpdate({_id: el._id}, { $set: { players: {waiting: el.players.waiting, ready: el.players.ready} }}, function(err){
          if(err){throw err;}
          emitList(io);
        });
        el.socket.emit('players', {players: el.players, active: el.active});
      }
      
    });

    socket.on('activate', status => {
      if (!el.active) {
        el.active = status;
        console.log('Game ' + el._id + ' active')
        GamePlay.findOneAndUpdate({_id: el._id}, { $set: { active: el.active }}, function(err){
          if(err){throw err;}
          emitList(io);
        });
        el.socket.emit('answer', {answer: el.answer, player: el.players.ready[el.activePlayer]});
      }
      
    });

    socket.on('cards', updated => {
      el.cards = updated;
      GamePlay.findOneAndUpdate({_id: el._id}, { $set: { cards: el.cards }}, function(err){
        if(err){throw err;}
      });
      socket.broadcast.emit('cards', el.cards);
    });        

    socket.on('chat', updated => {
      if (updated.message == el.answer){
        updated.status = true;
        el.socket.emit('win', updated);
      } else {
        el.chat.push(updated);
        GamePlay.findOneAndUpdate({_id: el._id}, { $set: { chat: el.chat }}, function(err){
          if(err){throw err;}
        });
        socket.broadcast.emit('chat', el.chat);
      }
     
    });

    socket.on('typing', user => {
      socket.broadcast.emit('typing', user);
    });

    socket.on('not-typing', user => {
      socket.broadcast.emit('not-typing', '');
    });
    
  });

}