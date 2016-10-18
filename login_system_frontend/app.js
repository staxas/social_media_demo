var app = angular.module('app');

app.controller('MainCtrl', function($rootScope, $scope, $localStorage, $sessionStorage, ConfigService, DbConnectService, $state) {
  $rootScope.isAdmin = false;
  $rootScope.loggedIn = false;
  $rootScope.avatarPath = ConfigService.api_uri + '/images/'
  $scope.signOutUser = function() {
    console.log('Signed user out');
    delete $localStorage.userToken;
    $rootScope.isAdmin = false;
    $rootScope.loggedIn = false;
    $state.go("login");
  }
  $scope.searchUser = function() {

    if (typeof $rootScope.findName != 'undefined') {
      $state.go("searchuser");

      DbConnectService.findUser($rootScope.findName).then(function(resp) {
        // $rootscope.foundUsers = resp;
        $rootScope.$emit('userSearchResults', resp);
      }).catch(function(error) {
        console.log(error);
      });
    }
  }

});
