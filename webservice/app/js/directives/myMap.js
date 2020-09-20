angular.module('ediCreatorApp')
.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        var map_center = new google.maps.LatLng(22.7, 75.9);
        var location_name = scope.mapCenter;
        // check min length
        if (!scope.mapCenter || scope.mapCenter == '') {
          scope.mapCenter = 'Indore';
        }
        console.log(scope.mapCenter);
        // map config
        var mapOptions = {
            center: map_center,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }    
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
        setMarker(map, map_center, 'Indore', 'Lab is here');
        
        
    };
    
    return {
        restrict: 'A',
        template: '<div class="gmaps"></div>',
        replace: true,
        link: link,
        scope: {
            mapCenter: '@'
        }
    };
});