/* global _ */
(function(module) {
  
  module.controller('parallel', ['dataService', 'optionsService', 'util', controller]);
  
  function controller(dataService, optionsService, util) {
    var vm = this;
    
    vm.chartType = 'parallelCoordinatesChart';
    vm.data = undefined;
    vm.options = {
      size: {
        w: 800,
        h: 600
      }
    };
    
    function changeOptions(country, indicators) {
      optionsService.search('country', country);
      optionsService.search('indicators', indicators);
    }
    
    vm.createChart = createChart;
    
    dataService.getIndicatorList().then(function(data) {
      vm.indicators = data;
      if (optionsService.search('indicators'))
        vm.indicator = vm.indicators.filter(function(indicator) {
          return optionsService.search('indicators').indexOf(indicator.code) > -1;
        });
      if (vm.country && vm.indicators)
        createChart();
    });
    
    dataService.getCountries().then(function(data) {
      vm.countries = data;
      if (optionsService.search('country'))
        vm.country = vm.countries.filter(function(country) {
          return country._id === optionsService.search('country');
        })[0];
      if (vm.country && vm.indicators)
        createChart();
    });
    
    function createChart() {
      var indicators = _.map(vm.indicator, function(item) {
        return item.code;
      });
      changeOptions(vm.country._id, indicators);
      dataService.getIndicator(indicators, vm.country._id)
        .then(getData);
    }
    
    function getData(data) {
      vm.data = util.unwind(data);
      vm.options.names = [ ];
      data.forEach(function(item) {
        vm.options.names.push(item.name);
      });
      vm.options.names.push('Year');
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
    };
  }
  /*global angular*/
})(angular.module('app'));