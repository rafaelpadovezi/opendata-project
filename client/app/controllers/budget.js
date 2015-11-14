/* global angular*/
(function(module) {
  
  module.controller('budget', ['dataService', 'optionsService', controller]);
  
  function controller(dataService, optionsService) {
    var vm = this;
    
    vm.data = undefined;
    vm.options = {
      size: {
        w: 800,
        h: 600
      }
    };
    
    optionsService.onChangeOptions(function(options) {
      if (!options.budget)
        return;
        
      dataService.getBudget(options.budget.code, options.budget.year)
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