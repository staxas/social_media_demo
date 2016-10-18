var app = angular.module('app');
app.directive('bsActiveLink', ['$rootScope', '$location', '$state', function($rootScope, $location, $state) {
  return {
    restrict: 'A',
    replace: false,
    link: function(scope, elem) {
      $rootScope.$on("$stateChangeSuccess", function() {
        angular.forEach(elem.find('a'), function (a) {
          a = angular.element(a);
          if(a.attr('ui-sref') == $state.current.name) {
            a.parent().addClass('active');
          } else {
            a.parent().removeClass('active');
          }
        })

      });
    }
  }
}]);