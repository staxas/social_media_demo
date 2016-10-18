var app = angular.module('app');

app.directive('loginScreen', function() {
  return {
    restrict : 'E',
    templateUrl: 'components/loginscreen/login.tpl.html',
    scope: {},
    controller: function($rootScope, $scope, $localStorage, $sessionStorage, DbConnectService, $state) {
      $scope.showLogin = true;
      $scope.showRegister = false;
      $scope.showError = "";
      $scope.loggedIn = false;
      $scope.correctToken = false;
      $scope.$storage = $localStorage;
      // $scope.test = DbConnectService.users;
      // $scope.addUser = DbConnectService.postUser($scope.userName);
      // $scope.addUser = function() { DbConnectService.postUser($scope.userName); };
      // $scope.createUser = function() {};
      $scope.startSignin = function() {
        $scope.showLogin = true;
        $scope.showRegister = false;
      };
      $scope.startRegister = function() {
        $scope.showLogin = false;
        $scope.showRegister = true;
      };
      $scope.signInUser = function() {
        DbConnectService.loginUser($scope.signinEmail, $scope.signinPassword).then(function(resp) {

          if (resp) {
            $scope.showError = "";
            $localStorage.userToken = resp;
            $rootScope.loggedIn = true;
            $state.go("home");
          }
          DbConnectService.checkToken($localStorage.userToken).then(function(resp) {

            if(typeof resp.data.avatar != "undefined") {
            $rootScope.avatarUrl = $rootScope.avatarPath + resp.data.avatar;
            $rootScope.following = resp.data.following;
            $rootScope.followed_by = resp.data.followed_by;
          } else {
            $rootScope.userAvatar = "default.jpg";
          }
              if (resp.data.role == "admin") {
                $rootScope.isAdmin = true;
              } else {
                $rootScope.isAdmin = false;
              }
            },
            function(error) {
              delete $localStorage.userToken;
            });
        }, function(error) {
          console.log(error);
          if (error.status == 404) {
            $scope.showError = "Email not found";
          } else if (error.status == 401) {
            $scope.showError = "Password incorrect";
          }
        });
      };

      $scope.registerUser = function() {
        DbConnectService.postUser($scope.registerEmail, $scope.registerPassword);
      };

      $scope.checkUserRole = function() {
        DbConnectService.checkUserRole($localStorage.userToken).then(function(resp) {
            if (resp.data.role = "admin") {
              $rootScope.isAdmin = true;
            } else {
              $rootScope.isAdmin = false;
            }
          },
          function(error) {
            delete $localStorage.userToken;
          });
      }
    }
  }
})
