var Mongoose = require('mongoose');
var Bcrypt = require('bcrypt');
var Boom = require('boom');
var Token = require('./token.funcs');


module.exports.postUser = function(request, reply) {

  var p = request.payload;
  var userExist = Mongoose.models.User.find({
    email: p.email
  });

  userExist.exec(function(err, docs) {
    if (!docs.length) {
      Bcrypt.genSalt(10, function(err, salt) {
        Bcrypt.hash(p.password, salt, function(err, hash) {
          // save hash as password
          var newUser = new Mongoose.models.User({
            email: p.email,
            password: hash,
            role: 'user'
          });

          newUser.save(function(err, resp) {
            if (!err) {
              return reply(resp);
            } else {
              return reply(err);
            }
          })
        });
      });
    } else {
      return reply(Boom.badRequest('user exists'));
      console.log('user exists');
    }
  })
}

module.exports.loginUser = function(request, reply) {
  var p = request.payload;
  var user = Mongoose.models.User.findOne({
    email: p.email
  });

  user.exec(function(err, doc) {
    if (!err && doc) {
      Bcrypt.compare(p.password, doc.password, function(err, res) {
        if (err || res == false) {
          return reply(Boom.unauthorized('invalid password'));
        } else {
          // right password so generate a new TOKEN or whatever login system
          token = Token.createToken(doc);
          return reply(token)
        }
      });
    } else if (!doc) {
      return reply(Boom.notFound('user not found'));
    } else {
      return reply(err);
    }
  })
}

module.exports.getUser = function(request, reply) {
  var h = request.headers;
  Token.checkToken(h.authorization, function(err, decoded) {
    if (!err) {
      user = Mongoose.models.User.findOne({
        _id: decoded.user_id
      });
      user.exec(function(err, resp) {
        if (!err) {
          return reply(resp)
        } else {
          return reply(err);
        }
      })

    } else {
      // token not authorized
      return reply(err);
    }
  })
}

module.exports.getUserByName = function(request, reply) {
  var h = request.headers;
  var par = request.params;
  var q = request.query;
  Token.checkToken(h.authorization, function(err, decoded) {
      if (!err) {
        if (typeof q.findBy != 'undefined' && q.findBy === "id") {
          var userSearch = Mongoose.models.User.findOne({
            _id: par.name
          });
        } else if (par.name != 'undefined') {
          var names = par.name.split(" ").join("|");
          var pattern = new RegExp('.*' + names + '.*', 'ig');

          var userSearch = Mongoose.models.User.find({
            name: {
              $regex: pattern
            }
          });
        }
        if (typeof userSearch != 'undefined') {
          userSearch.exec(function(error, resp) {
            if (!error) {
              console.log(resp);
              return reply(resp);
            } else {
              return reply(error);
            }
          })
        } else {
          return reply(Boom.badRequest('not enough data'));
        }
      } else {
        // token not authorized
        return reply(err)
      }
    }) //end of token check
}

module.exports.updateUser = function(request, reply) {
  var h = request.headers;
  var p = request.payload;
  var q = request.query;
  console.log(p);
  Token.checkToken(h.authorization, function(err, decoded) {
    if (!err) {

      var update = {};
      var updateSlave = {};
      if (typeof p != 'undefined') {
        if (typeof p.name != 'undefined') {
          update.name = p.name;
        }
        if (typeof p.address != 'undefined') {
          update.address = p.address;
        }
        if (typeof p.city != 'undefined') {
          update.city = p.city;
        }
        if (typeof p.zipcode != 'undefined') {
          update.zipcode = p.zipcode;
        }
        if (typeof p.lat != 'undefined') {
          update.lat = p.lat;
        }
        if (typeof p.lng != 'undefined') {
          update.lng = p.lng;
        }
        if (typeof p.action != 'undefined' && typeof p.slave_user_id != 'undefined' && p.slave_user_id != decoded.user_id) {
          if (p.action == "follow") {
            update.$addToSet = {
              following: p.slave_user_id
            };
            updateSlave.$addToSet = {
              followed_by: decoded.user_id
            };

          } else if (p.action == "unfollow") {
            update.$pull = {
              following: p.slave_user_id
            };
            updateSlave.$pull = {
              followed_by: decoded.user_id
            };
          } else {
            return reply(Boom.badRequest('incorrect action received'));
          }
        }
        console.log('update: ', update);
        console.log('updateSlave: ', updateSlave);
      }

      if (update != {}) {
        var userUpdate = Mongoose.models.User.findOneAndUpdate({
          _id: decoded.user_id
        }, update, {
          new: true
        });

        userUpdate.exec(function(err, doc) {
          if (!err) {
            if (updateSlave != {}) {
              var slaveUpdate = Mongoose.models.User.findOneAndUpdate({
                _id: p.slave_user_id
              }, updateSlave, {
                new: true
              });
              slaveUpdate.exec(function(err2, doc2) {
                if (err2) {
                  return reply(err2)
                }
              })
            }
            return reply(doc);
          } else {
            return reply(err);
          }
        })

      } else {
        return reply(Boom.badRequest('not enough data'));
      }
    } else {
      // token not authorized
      return reply(err);
    }
  });



}

module.exports.postSecret = function(request, reply) {
  var h = request.headers;

  Token.checkToken(h.authorization, function(err, decoded) {
    if (err) {
      return reply(err);
    } else {
      return reply(decoded);
    }
  });
}
