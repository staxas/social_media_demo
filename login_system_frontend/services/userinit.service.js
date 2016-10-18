function userInitService( $rootScope, DbConnectService) {
  return {
    initUser: function() {
      DbConnectService.getUser().then(function(resp) {
        $rootScope.userData = resp;
        $rootScope.$emit('userData_loaded')
        if (typeof resp.avatar != "undefined") {
          $rootScope.avatarUrl = $rootScope.avatarPath + resp.avatar;
        } else {
          $rootScope.userAvatar = "default.jpg";
        }
        if (resp.role == "admin") {
          $rootScope.isAdmin = true;
        } else {
          $rootScope.isAdmin = false;
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  }
}

angular.module('app').service('UserInitService', ['$rootScope','DbConnectService', userInitService]);
