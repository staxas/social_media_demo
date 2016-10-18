var app = angular.module('app');
app.service('APIInterceptor', function($rootScope, $localStorage) {

  var service = this;

  service.request = function(config) {
    var token = $localStorage.userToken ? $localStorage.userToken : null;
    if (token) {
      config.headers.authorization = token;
    }

    return config;
  }

  service.responseError = function(response) {

    if (response.status === 401) {
      $rootScope.$broadcast('unauthorized');
    }

    return response;
  };

})
