module.exports.newGame = function(req, res) {
    if(!req.session.user){ return res.render('home', {err: 'Nie jesteś zalogowany.'}); }
    let tableId = new Date().valueOf();
    //tables.push(tableId);
    res.render('dashboard', {user: req.session.user});
    

    let setTable = new Tables({id: tableId, players: [], active: false});
    setTable.save(function(err){
        if(err) return handleError(err);
    });
    
    createNamespace(tableId, cardSchema, Chats, Turns, db, dashboardSocket, Tables);

    console.log('New table: '+tableId);
}

module.exports.joinGame = function(req, res) {
    if(!req.session.user){
        return res.render('home', {err: 'Nie jesteś zalogowany.'});
    }	

    /*
    Tables.findOne({id: req.params['tableId']}, function(err, res){
        if(err){throw err;}
        if(res['active']){
            res.redirect('/dashboard');
        }
    });
    */
    res.render('game', {user: req.session.user});
}