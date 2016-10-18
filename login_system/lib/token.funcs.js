var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var Moment = require('moment');

var tokenPassword = 'aStrongPassword123';

module.exports.createToken = function(doc) {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log('doc',doc);
  if(!doc.avatar) {
    doc.avatar = 'default.jpg';
  }
  var token = Jwt.sign({
    user_email: doc.email,
    user_id: doc._id,
    avatar: doc.avatar,
    following: doc.following,
    followed_by: doc.followed_by,
    expireDate: tomorrow,
    role: doc.role
  }, tokenPassword);
  return token;
}

module.exports.checkToken = function(token, callback) {
  Jwt.verify(token, tokenPassword, function(err, decoded) {
    if (err) {
      return callback(Boom.unauthorized('invalid token'), null);
    } else {
      // return data
      now = new Date();
      if (Moment(decoded.expireDate) < Moment(now)) {
        return callback(Boom.unauthorized('token expired'), null)
      }
      // if login succeded, run callback
      return callback(null, decoded);
    }
  });
}
