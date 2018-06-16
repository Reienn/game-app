const GamePlay = require('../models/game-play');

module.exports.dashboard = function(req, res, next) {
  let dashboard = {
    user: req.userData,  
    gamePlayList: []
  };

  GamePlay.find({}, function(err, gamePlays){
    if(err) { return next(err); }
     gamePlays.forEach( el => {
      dashboard.gamePlayList.push(el._id);
    });
    res.json({dashboard});
  }); 
}