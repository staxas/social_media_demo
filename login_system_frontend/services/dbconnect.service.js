function dbConnectService($http, $q, ConfigService) {
  return {
    adminGetAllUsers: function() {
      var defer = $q.defer();
      $http.get(ConfigService.api_uri + '/api/users/admin').success(function(response) {
        defer.resolve(response);
      });
      return defer.promise;
    },

    adminGetUserByEmail: function(userEmail) {
      var defer = $q.defer();
      $http.get(ConfigService.api_uri + '/api/users/admin/' + userEmail).success(function(response) {
        defer.resolve(response);
      });
      return defer.promise;
    },

    adminGetUserById: function(userId) {
      var defer = $q.defer();
      $http.get(ConfigService.api_uri + '/api/users/admin/' + userId + '?findBy=id').success(function(response) {
        defer.resolve(response);
      });
      return defer.promise;
    },

    adminUpdateUser: function(payload) {
      var defer = $q.defer();
      $http.patch(ConfigService.api_uri + '/api/users/admin?findBy=id', payload).then(function(resp) {
        defer.resolve(resp.data);
      }, function(error) {
        defer.reject(error);
      });
      return defer.promise;
    },
    postUser: function(userEmail, userPassword) {
      $http.post(ConfigService.api_uri + '/api/users', {
        email: userEmail,
        password: userPassword
      });
    },

    loginUser: function(userEmail, userPassword) {

      var defer = $q.defer();
      $http.post(ConfigService.api_uri + '/api/login', {
        email: userEmail,
        password: userPassword
      }).then(function(resp) {
        // here comes the resp
        defer.resolve(resp.data);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    },

    getUser: function() {
      var defer = $q.defer();
      $http.get(ConfigService.api_uri + '/api/users').success(function(response) {
        defer.resolve(response);
      });
      return defer.promise;
    },
    getUserById: function(user_id) {
      var defer = $q.defer();
      $http.get(ConfigService.api_uri + '/api/users/' + user_id + 'findBy=id').success(function(response) {
        defer.resolve(response);
      });
      return defer.promise;
    },
    updateUser: function(payload) {
      var defer = $q.defer();

      $http.patch(ConfigService.api_uri + '/api/users', payload).then(function(resp) {
        defer.resolve(resp.data);
      }, function(error) {
        defer.reject(error);
      });
      return defer.promise;
    },

    findUser: function(user_name) {
      var defer = $q.defer();
      $http.get(ConfigService.api_uri + '/api/users/' + user_name).success(function(response) {
        defer.resolve(response);
      });
      return defer.promise;
    },

    checkToken: function(token) {
      var defer = $q.defer();
      $http.post(ConfigService.api_uri + '/api/secret').then(function(resp) {
        // $http.post(ConfigService.api_uri + '/api/secret?token=' + token).then(function (resp) {
        defer.resolve(resp);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }
  }
}

angular.module('app').service('DbConnectService', ['$http', '$q', 'ConfigService', dbConnectService]);
