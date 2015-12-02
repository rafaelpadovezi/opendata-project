/* global angular */
(function(module) {
  
  module.controller('countryPicker', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    dataService.getCountries().then(function(data) {
      vm.countries = data;
      // Set initial countries
      if (optionsService.search('countries')) {
        vm.country = vm.countries.filter(function(country) {
          return optionsService.search('countries').indexOf(country._id) > -1; 
        });
      }
      else {
        vm.country = vm.countries.filter(function(country) {
          return (country._id === 'BRA' || country._id === 'USA');
        });
      }
    });
    
    $scope.$watch('vm.country', function() {
      if (!vm.country) {
        return;
      }
      
      optionsService.setOption({
        countries: vm.country.map(function(country) {
          return country._id;
        })
      });
    });
  }
  
})(angular.module('app'));