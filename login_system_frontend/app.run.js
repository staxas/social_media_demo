angular.module('app').run(function($rootScope, $localStorage, $state, DbConnectService, UserInitService) {

  if ($localStorage.userToken) {
    DbConnectService.checkToken($localStorage.userToken).then(function(resp) {
        $rootScope.loggedIn = true;
        UserInitService.initUser();
        // DbConnectService.getUser().then(function(resp) {
        //   $rootScope.following = resp.following;
        //   $rootScope.followed_by = resp.followed_by;
        // }).catch(function(error) {
        //   console.log(error);
        // });
        // $rootScope.following = resp.data.following;
        // $rootScope.followed_by = resp.data.followed_by;
        $state.go("home");
      },
      function(error) {
        delete $localStorage.userToken;
        $rootScope.isAdmin = false;
        $rootScope.loggedIn = false;
        $rootScope.userData = {};
        $rootScope.following = [];
        $rootScope.followed_by = [];
        $state.go("login");
      });
  } else {
    $rootScope.isAdmin = false;
    $rootScope.loggedIn = false;
    $state.go("login");
  }
});
