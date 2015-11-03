/* global angular */
(function(module) {
  
  module.controller('countryPicker', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    dataService.getCountries().then(function(data) {
      vm.countries = data;
      
      vm.country = vm.countries.filter(function(country) {
        return (country._id === 'BRA' || country._id === 'USA');
      });
    });
    
    $scope.$watch('vm.country', function() {
      if (!vm.country) {
        return;
      }
      optionsService.setCountries(vm.country);
    });
  }
  
})(angular.module('app'));