/* global angular*/
(function(module) {
  
  module.controller('budget', ['dataService', 'optionsService', controller]);
  
  function controller(dataService, optionsService) {
    var vm = this;
    vm.chartType = "sunburstChart";
    
    vm.data = undefined;
    vm.options = {
      size: {
        w: 600,
        h: 400
      }
    };
    
    dataService.getBudget('BRA', '2014')
        .then(getData);
    
    optionsService.onChangeOptions(function(options) {
      if (!options.indicator)
        return;
      if (!options.countries)
        return;
      if (options.countries.length === 0)
        return;
      /* global _ */
      var countriesIds = _.map(options.countries, function(country) {
        return country._id;
      });
        
      dataService.getBudget('BRA', '2014')
        .then(getData);
    });
    
    function getData(data) {
      vm.data = data;
    }

    vm.toggleSize = function() {
      if (vm.options.size.w === 800) {
        vm.options.size.w = 600;
        vm.options.size.h = 400;
      }
      else {
        vm.options.size.w = 800;
        vm.options.size.h = 600;
      }
    }
  }
  
})(angular.module('app'));