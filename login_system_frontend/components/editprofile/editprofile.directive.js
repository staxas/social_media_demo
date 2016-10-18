var app = angular.module('app');
app.directive('editProfile', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/editprofile/editprofile.tpl.html',
    scope: {},
    controller: function($rootScope, $scope, Upload, $timeout, DbConnectService, toastr) {
      DbConnectService.getUser().then(function(resp) {
        console.log(resp);
        $scope.currName = resp.name;
        $scope.currAddress = resp.address;
        $scope.currCity = resp.city;
        $scope.currZipcode = resp.zipcode
      });

      $scope.uploadPic = function(file) {

        file.upload = Upload.upload({
          url: 'http://127.0.0.1:8000/api/files/avatar',
          data: {
            file: file
          },
        });

        file.upload.then(function(response) {
          $timeout(function() {
            file.result = response.data;
            $rootScope.avatarUrl = $rootScope.avatarPath + response.data.avatar;
          });
        }, function(error) {
          if (error.status > 0)
            $scope.errorMsg = error.status + ': ' + error.data;
        }, function(evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
      $scope.updateUserData = function() {
        var userData = {};
        userData.name = $scope.currName;
        userData.address = $scope.currAddress;
        userData.city = $scope.currCity;
        userData.zipcode = $scope.currZipcode;
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({
          'address': $scope.currZipcode
        }, function(results, status) {
          userData.lat = results[0].geometry.location.lat();
          userData.lng = results[0].geometry.location.lng();
          console.log(userData);
          DbConnectService.updateUser(userData).then(function(resp) {
            console.log(resp);
            toastr.success('User data saved');
          }, function(error) {
            console.log(error)
            toaster.error('User data not saved');
          })

        });

      }
    }
  }
})
