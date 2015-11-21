/* global angular */
(function(module) {
  
  module.controller('world', ['dataService', 'optionsService', controller]);
  
  function controller(dataService, optionsService) {
    var vm = this;
    
    optionsService.onChangeOptions(function(options) {
      if (!options.indicator)
        return;
      
      dataService.getIndicator(options.indicator.code).then(function(data) {
        vm.data = worldData(data);
        vm.yearRange = getYearRange(vm.data);
        vm.year = Number(vm.yearRange.max);
        console.log(vm.data);
        console.log(vm.yearRange);
      });
      
      function worldData(data) {
        var parsedData = {};
        data.forEach(function(country) {
          country.values.forEach(function(item) {
            if (!parsedData[item.year]) {
              parsedData[item.year] = [];
            }
            parsedData[item.year].push({
              code: country.country,
              name: country.countryName,
              value: item.value
            });
          });
        });
        return parsedData;
      }
      
      function getYearRange(data) {
        return {
          min: Math.min.apply(Math, Object.keys(data)),
          max: Math.max.apply(Math, Object.keys(data))
        };
      }
    });
  }
  
})(angular.module('app'));