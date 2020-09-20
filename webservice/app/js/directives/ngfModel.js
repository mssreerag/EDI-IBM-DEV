'use strict';

angular.module('ediCreatorApp')
.directive('ngfModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var ngmodel = $parse(attrs.ngfModel);
            var modelAssign = ngmodel.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelAssign(scope, element[0].files[0]);
                });
            });
        }
    };
}])