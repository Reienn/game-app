module.exports.authUser = function(req, res, next) {
  let user = req.userData;
  res.json({user});
}