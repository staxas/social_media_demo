var Mongoose = require('mongoose');
var Bcrypt = require('bcrypt');
var Boom = require('boom');
var Token = require('./token.funcs');

module.exports.adminGetAllUsers = function(request, reply) {

  var h = request.headers;

  Token.checkToken(h.authorization, function(err, response) {
    if (err) {
      return reply(err);
    } else {
      if (response.role = 'admin') {
        var allUsers = Mongoose.models.User.find({});
        allUsers.exec(function(err, docs) {
          if (!err) {
            return reply(docs);
          } else {
            return reply(err);
          }
        })
      } else {
        return reply(Boom.unauthorized('user not authorized'));
      }
    }
  });
}

module.exports.adminGetUser = function(request, reply) {
  var pay = request.payload;
  var par = request.params;
  var h = request.headers;
  var q = request.query;
  Token.checkToken(h.authorization, function(err, response) {
    if (err) {
      return reply(err);
    } else {
      if (response.role = 'admin') {
        if (q.findBy != 'id') {
          var user = Mongoose.models.User.findOne({
            email: par.email
          });
        } else {
          var user = Mongoose.models.User.findOne({
            _id: par.id
          });
        }
        user.exec(function(err, docs) {
          if (!err) {
            return reply(docs);
          } else {
            return reply(err);
          }
        })
      } else {
        return reply(Boom.unauthorized('user not authorized'));
      }
    }
  });
}

module.exports.adminUpdateUser = function(request, reply) {
  var pay = request.payload;
  var h = request.headers;
  var q = request.query;
  var findBy;
  Token.checkToken(h.authorization, function(err, response) {
    console.log('updateUser', err || response)
    if (err) {
      return reply(err);
    } else {
      if (q.findBy != "id") {
        findBy = {
          email: pay.email
        }
      } else {
        findBy = {
          _id: pay.id
        }
      }
      var updateUser = Mongoose.models.User.findOneAndUpdate(findBy, {
        email: pay.newEmail,
        role: pay.newRole
      }, {
        new: true
      });

      updateUser.exec(function(err, docs) {
        if (!err) {
          return reply(docs);
        } else {
          return reply(err);
        }
      })
    }
  });
}
