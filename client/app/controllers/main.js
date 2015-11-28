/* global _ */
(function(module) {
  
  module.controller('main', ['dataService', 'optionsService', 'util', controller]);
  
  function controller(dataService, optionsService, util) {
    var vm = this;
    
    vm.data = undefined;
    vm.options = {
      size: {
        w: 800,
        h: 480
      }
    };
    
    optionsService.onChangeOptions(function(options) {
      if (!options.indicator)
        return;
      if (!options.countries)
        return;
      if (options.countries.length === 0)
        return;
        
      var countriesIds = _.map(options.countries, function(country) {
        return country._id;
      });
        
      dataService.getIndicator(options.indicator.code, countriesIds)
        .then(getData);
    });
    
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
  }
  /*global angular*/
})(angular.module('app'));