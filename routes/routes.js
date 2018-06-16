const cors = require('cors');

const loginController= require('../controllers/login');
const signupController = require('../controllers/signup');
const dashboardController = require('../controllers/dashboard');
const gameController = require('../controllers/new-game-play');
const jwt = require('../services/jwt');


module.exports = function(app) {
  const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions));

  app.get('/', (req, res) => {
    res.send('Hello from Express!')
  }); 

  app.post('/login', loginController.login);

  app.post('/signup', signupController.signup);

  app.get('/dashboard', jwt.verifyToken, dashboardController.dashboard);

  app.post('/new-game-play', jwt.verifyToken, gameController.newGamePlay);
}


/*
app.post('/signup', urlencodedParser, signupController.signup);
app.post('/login', urlencodedParser, loginController.login);

app.get('/', function(req, res){
  if(!req.session.user){ return res.render('home'); }
  res.redirect('/dashboard');
});
app.get('/login', function(req, res){
  if(!req.session.user){ return res.render('login'); }
  res.redirect('/dashboard')  ;
});
app.get('/signup', function(req, res){
  if(!req.session.user){ return res.render('signup'); }
  res.redirect('/dashboard');
});
app.get('/dashboard', function(req, res){
  if(!req.session.user){ return res.render('home', {err: 'Nie jesteś zalogowany.'}); }
  res.render('dashboard', {user: req.session.user});
});
app.get("/logout", function(req, res){
  if(!req.session.user){ return res.redirect('/'); }
  req.session.destroy();
  res.redirect('/');
});
app.get("/tables", gameController.newGame);
app.get("/tables/:tableId", gameController.joinGame);
*/