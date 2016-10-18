var app = angular.module('app');
app.directive('updateUser', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'components/adminpanel/updateuser.tpl.html',
    scope: {
      user: "="
    },
    controller: function($scope, ngDialog, DbConnectService) {

      $scope.userUpdate = {};
      // set user role select to current user role
      $scope.selectedRole = '';
      $scope.roles = ['user', 'admin'];
      for (i in $scope.roles) {
        if ($scope.user.role == $scope.roles[i]) {
          $scope.selectedRole = $scope.roles[i];
        }
      }

      $scope.openChangeUser = function() {
        $scope.userUpdate.newEmail = $scope.user.email;
        $scope.savedNewEmail = false;
        ngDialog.open({
          template: 'components/adminpanel/changeuser.popup.html',
          scope: $scope
        });
        if ($scope.savedNewEmail == false) {
          $scope.newEmail = $scope.user.email;
        }

      }

      $scope.saveNewUserName = function(user) {
        $scope.userUpdate.email = $scope.user.email;
        $scope.user.email = $scope.userUpdate.newEmail;
        $scope.savedNewEmail = true;
        ngDialog.close();
      }

      $scope.updateUser = function() {
        $scope.userUpdate.email = $scope.userUpdate.email || $scope.user.email;
        $scope.userUpdate.newEmail = $scope.userUpdate.newEmail || $scope.user.email;
        $scope.userUpdate.newRole = $scope.selectedRole;
        $scope.userUpdate.id = $scope.user._id;
        DbConnectService.adminUpdateUser($scope.userUpdate).then(function(resp) {
        });
      }

    }
  }
})
