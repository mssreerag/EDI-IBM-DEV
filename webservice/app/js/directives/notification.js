angular.module('ediCreatorApp')
.directive('notification', function($timeout){
  return {
     restrict: 'E',
     replace: true,
     scope: {
         ngModel: '='
     },
     template: '<div class="alert fade" bs-alert="ngModel"></div>',
     link: function(scope, element, attrs){
         $timeout(function(){
             element.remove();
         }, 5000);
     }
  }
});