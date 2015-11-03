(function(module) {
  
  module.controller('main', ['dataService', '$timeout', 'optionsService', controller]);
  
  function controller(dataService, $timeout, optionsService) {
    var vm = this;
    
    vm.data = undefined;
    vm.options = {
      size: {
        w: 600,
        h: 400
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
      vm.data = parseData(data);
      vm.options.axisLabel = {
          x: 'Year',
          y: data[0].name,
        };
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
    
    function parseData(data) {
      var manipulatedData = [ ];
      data.forEach(function(country) {
        var manipulatedItem = {
          'key': country.countryName,
          'values': []
        };
        
        country.values.forEach(function(item, i) {
          manipulatedItem.values.push({
            x: item.year,
            y: item.value
          });
        });
        
        manipulatedData.push(manipulatedItem);
      });
      
      return manipulatedData;
    }
  }
  /*global angular*/
})(angular.module('app'));