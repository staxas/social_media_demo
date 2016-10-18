var app = angular.module('app');
app.directive('foundUser', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'components/searchuser/founduser.tpl.html',
    scope: {
      user: "="
    },
    controller: function($rootScope, $scope, DbConnectService) {
      setFollowable();
      $scope.follow = function() {
        var userUpdate = {};
        userUpdate.slave_user_id = $scope.user._id;
        userUpdate.action = 'follow';
        DbConnectService.updateUser(userUpdate).then(function(resp){
          $rootScope.userData.following = resp.following;
          $rootScope.userData.followed_by = resp.followed_by;
          setFollowable();
        });
      }
      $scope.unfollow = function() {
        var userUpdate = {};
        userUpdate.slave_user_id = $scope.user._id;
        userUpdate.action = 'unfollow';
        DbConnectService.updateUser(userUpdate).then(function(resp){
          console.log(resp);
          $rootScope.userData.following = resp.following;
          $rootScope.userData.followed_by = resp.followed_by;
          setFollowable();
        });
      }
      function setFollowable() {

        if($rootScope.userData.following.indexOf($scope.user._id) > -1) {
          $scope.followable = false;
        } else {
          $scope.followable = true;
        }
      }
    } // end of controller
  }
})
