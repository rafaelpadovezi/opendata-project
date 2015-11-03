/* global angular */
(function(module) {
  
  module.controller('indicatorPicker', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    dataService.getIndicatorList().then(function(data) {
      vm.indicators = data;
      
      vm.indicator = data[0];
    });
    
    $scope.$watch('vm.indicator', function() {
      if (!vm.indicator) {
        return;
      }
      optionsService.setIndicator(vm.indicator);
    });
  }
  
})(angular.module("app"));