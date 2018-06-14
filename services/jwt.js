const jwt = require('jsonwebtoken');

module.exports.verifyToken = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.userData = jwt.verify(token, 'secretkey');
    next();
  } catch (error) {
    res.status(400).send('Token verification failed');
  }
}