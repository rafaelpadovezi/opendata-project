/* global _ */
(function(module) {
  
  module.controller('compare', ['dataService', 'optionsService', 'util', controller]);
  
  function controller(dataService, optionsService, util) {
    var vm = this;
    
    vm.data = undefined;
    vm.options = {
      size: {
        w: 800,
        h: 480
      }
    };
    
    optionsService.onChangeOptions(loadChart);
    
    function getData(data) {
      vm.data = util.tablerize(data);
      vm.options.axisLabel = {
          x: 'Year',
          y: data[0].name,
        };
      if (data[0].source)
        vm.source = 'Source: ' + data[0].source;
      else
        vm.source = '';
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
    
    function loadChart(options) {
      var ready = options.indicators && options.countries && options.countries.length > 0;
      if (!ready)
        return;
        
      dataService.getIndicator(options.indicators, options.countries)
        .then(getData);
    }
  }
  /*global angular*/
})(angular.module('app'));