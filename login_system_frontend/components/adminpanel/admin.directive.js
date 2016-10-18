var app = angular.module('app');
app.directive('adminPanel', function() {
  return {
    restrict : 'E',
    replace: true,
    // template: 'Test',
    templateUrl: 'components/adminpanel/admin.tpl.html',
    scope: {},
    controller: function($scope, $localStorage, $sessionStorage, DbConnectService) {
      DbConnectService.adminGetAllUsers().then(function(resp) {
        $scope.allUsers = resp;
      });
    }
  }
})
