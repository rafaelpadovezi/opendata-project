/* global angular */
(function(module) {
  
  module.controller('world', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    optionsService.onChangeOptions(function(options) {
      if (!options.indicators)
        return;
      
      dataService.getIndicator(options.indicators).then(function(data) {
        vm.data = worldData(data);
        vm.yearRange = getYearRange(vm.data);
        vm.year = Number(vm.yearRange.max);
      });
      
      function worldData(data) {
        var parsedData = data.reduce(function(accData, country) {
          country.values.forEach(function(item) {
            if (!accData[item.year])
              accData[item.year] = [];
            accData[item.year].push({
              value: item.value,
              code: country.country,
              name: country.countryName
            });
          });
          
          return accData;
        },
        {});
        
        return parsedData;
        
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