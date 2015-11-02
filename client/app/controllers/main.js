(function(module) {
  
  module.controller('main', ['dataService', '$timeout', controller]);
  
  function controller(dataService, $timeout) {
    var vm = this;
    
    vm.data = undefined;
    vm.options = {
      size: {
        w: 600,
        h: 400
      }
    };
    
    dataService.getIndicator('NY.GDP.MKTP.KD.ZG', ['BRA', 'USA'])
      .then(function(data) {
        
        vm.data = parseData(data);
        vm.options.axisLabel = {
            x: 'Year',
            y: data[0].name,
          };

      });
      
    /*$timeout(function() {
      dataService.getIndicator('NY.GDP.MKTP.KD.ZG', ['BRA', 'CAN'])
      .then(function(data) {
        
        vm.data = parseData(data);
      });
    }, 2000);*/
    
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