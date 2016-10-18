var mongoose = require('mongoose');
var faker = require('faker');
var Hapi = require('hapi');
var inert = require('inert');

var config = require('./config')

var User = require('./models/user.model');

var UserRequests = require('./lib/user.requests')
var AdminRequests = require('./lib/admin.requests')
var FileRequests = require('./lib/file.requests')

mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db);

var server = new Hapi.Server();

server.connection({
  port: config.server.port,
  host: config.server.host,
  routes: {
    cors: true
  }
});

server.register([inert], (err) => {

    if (err) {
        throw err;
    }

    server.route({
      method: 'GET',
      path: '/images/{param*}',
      handler: {
           directory: {
               path: config.files.avatar_path
           }
       }
    })

});

// Add the route

server.route({
  method: 'POST',
  path: '/api/users',
  handler: UserRequests.postUser
});

server.route({
  method: 'PATCH',
  path: '/api/users',
  handler: UserRequests.updateUser
});

server.route({
  method: 'GET',
  path: '/api/users',
  handler: UserRequests.getUser
});

server.route({
  method: 'GET',
  path: '/api/users/{name}',
  handler: UserRequests.getUserByName
});


server.route({
  method: 'PATCH',
  path: '/api/users/admin',
  handler: AdminRequests.adminUpdateUser
});

server.route({
  method: 'GET',
  path: '/api/users/admin/{id}',
  handler: AdminRequests.adminGetUser
});

server.route({
  method: 'GET',
  path: '/api/users/admin',
  handler: AdminRequests.adminGetAllUsers
});

server.route({
  method: 'POST',
  path: '/api/login',
  handler: UserRequests.loginUser
});

server.route({
  method: 'POST',
  path: '/api/secret',
  handler: UserRequests.postSecret
})

server.route({
  method: 'POST',
  path: '/api/files/avatar',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    }
  },
  handler: FileRequests.uploadAvatar
})

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
