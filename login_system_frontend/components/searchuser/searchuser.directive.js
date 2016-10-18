var app = angular.module('app');
app.directive('searchUser', function() {
  return {
    restrict : 'E',
    templateUrl: 'components/searchuser/searchuser.tpl.html',
    scope: {},
    controller: function( $rootScope,  $scope, DbConnectService ) {

      $rootScope.$on('userSearchResults', function (event, data) {
          $scope.foundUsers = data;
      });

    }
  }
})
