var fs = require('fs');
var Boom = require('boom');
var Mongoose = require('mongoose');

var config = require('./../config')

var Token = require('./token.funcs');

module.exports.uploadAvatar = function(request, reply) {

  var h = request.headers;

  Token.checkToken(h.authorization, function(err, response) {
    if (err) {
      return reply(err);
    } else {
      var writeStream = fs.createWriteStream(config.files.avatar_path + request.payload.file.hapi.filename);
      request.payload.file.pipe(writeStream);

      var user = Mongoose.models.User.findOneAndUpdate({
        _id: response.user_id
      },{ avatar: request.payload.file.hapi.filename }, {new: true});
      user.exec(function(err, resp) {
        if(!err) {
          console.log('user', resp)
          return reply({avatar: request.payload.file.hapi.filename });

        } else {
          return reply(err)
        }
      })
    }
  })
}

module.exports.downloadAvatar = function(request, reply) {

}
