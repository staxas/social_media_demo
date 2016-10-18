var app = angular.module('app');
app.directive('homeScreen', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/homescreen/home.tpl.html',
    scope: {},
    controller: function($scope, $rootScope, DbConnectService) {
      $rootScope.$on('userData_loaded', function() {
        $scope.people = [];
        var you = {
          name: $rootScope.userData.name,
          lat: $rootScope.userData.lat,
          lng: $rootScope.userData.lng
        };
        $scope.people.push(you);

        for(i in $rootScope.userData.following) {
          console.log($rootScope.userData.following[i]);
          // DbConnectService.getUserById($rootScope.userData.following[i]).then(function(resp) {});
        }

      })

    }
  }
})
