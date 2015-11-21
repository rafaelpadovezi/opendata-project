/* global _ */
(function(module) {
  
  module.controller('experiment', ['dataService', 'optionsService', 'util', controller]);
  
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
    
    vm.createChart = createChart;
    
    dataService.getIndicatorList().then(function(data) {
      vm.indicators = data;
    });
    
    dataService.getCountries().then(function(data) {
      vm.countries = data;
    });
    
    function createChart() {
      var indicators = _.map(vm.indicator, function(item) {
        return item.code;
      });
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