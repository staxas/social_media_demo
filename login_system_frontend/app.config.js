app.config(function($stateProvider, $urlRouterProvider, $httpProvider, toastrConfig) {

  // Routing configuration
  $urlRouterProvider.otherwise("/login");

  $stateProvider
  .state('login', {
    url: "/login",
    template: "<login-screen></login-screen>"
  })
  .state('admin', {
    url: "/admin",
    template: "<admin-panel></admin-panel>"
  })
  .state('home', {
    url: "/home",
    template: "<home-screen></home-screen>"
  })
  .state('editprofile', {
    url: "/profile",
    template: "<edit-profile></edit-profile>"
  })
  .state('searchuser', {
    url: "/search",
    template: "<search-user></search-user>"
  });
  // HTTP header injection
  $httpProvider.interceptors.push('APIInterceptor');

  // toastr configuration
  angular.extend(toastrConfig, {
    positionClass: 'toast-bottom-right'
  })
})
