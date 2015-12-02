/* global angular */
(function(module) {
  
  module.controller('indicatorPicker', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    dataService.getIndicatorList().then(function(data) {
      vm.indicators = data;
      // Set initial indicator
      if (optionsService.search('indicators')) {
        vm.indicator = data.filter(function(item) {
          return optionsService.search('indicators').indexOf(item.code) > -1;
        })[0];
      } else {
        vm.indicator = data.filter(function(item) {
          return item.code === 'IT.NET.USER.P2';
        })[0];  
      }
      
    });
    
    $scope.$watch('vm.indicator', function() {
      if (!vm.indicator) {
        return;
      }
      optionsService.setOption({
        indicators: vm.indicator.code
      });
    });
  }
  
})(angular.module("app"));