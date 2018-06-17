const cors = require('cors');

const loginController= require('../controllers/login');
const signupController = require('../controllers/signup');
const authUserController = require('../controllers/auth-user');
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

  app.get('/auth-user', jwt.verifyToken, authUserController.authUser);
}