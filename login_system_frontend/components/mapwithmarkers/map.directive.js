var app = angular.module('app');
app.directive('mapWithMarkers', function($compile, $templateCache, $document) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/mapwithmarkers/map.tpl.html',
    scope: {
      myPlaces: '=places',
      address: '=',
      mapId: '@mapid',
      height: '@height',
      centerLat: '=lat',
      centerLong: '=lng'
    },
    link: function($scope, elem, attr) {
      if (typeof $scope.height === "undefined") {
        $scope.height = "380px"
      }
      elem.prepend("<div id=\"" + $scope.mapId + "\"" + " style=\"height: " + $scope.height + "\"></div>");

      $scope.selectedPlace = -1;

        var myCenter = new google.maps.LatLng($scope.centerLat, $scope.centerLong);
        var mapOptions = {
          zoom: 14,
          center: myCenter,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var centerPoint = myCenter;
        var myMap = new google.maps.Map(document.getElementById($scope.mapId), mapOptions);

        var infoWindow = new google.maps.InfoWindow();
        var centerListener = myMap.addListener('center_changed', function() {
          window.setTimeout(function() {
            myMap.panTo(centerPoint);
          }, 3000);
        });

        var markers = [];
        var viaSelect = false;
        var setMarker = function(place) {
          var myPos = new google.maps.LatLng(place.lat, place.lng);
          var marker = new google.maps.Marker({
            position: myPos,
            name: place.name,
            description: place.description
          });

          marker.setMap(myMap);

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              centerPoint = marker.getPosition();
              $scope.centerLat = centerPoint.lat();
              $scope.centerLong = centerPoint.lng();
              // console.log(centerPoint.lat(), centerPoint.lng());
              myMap.setCenter(centerPoint);
              infoWindow.setContent(place.name + '<br>' + place.description);
              infoWindow.open(myMap, marker);
              if (viaSelect === false) {
                $scope.$apply()
              };
              viaSelect = false;
            }
          })(marker, i));

          markers.push(marker);
        }

        for (i in $scope.myPlaces) {
          setMarker($scope.myPlaces[i]);
        }

        // console.log(myMap.getCenter());
        // console.log(markers[0].getPosition());
        $scope.$watch('selectedPlace', function(newVal, oldVal) {
          if (newVal >= 0) {
            viaSelect = true;
            google.maps.event.trigger(markers[newVal], 'click');

            // console.log(newVal, oldVal);
            // console.log(markers[newVal])
          }
        })
    }
  }
});
