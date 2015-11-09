/* global angular */
(function(module){
  
  module.controller('budgetPicker', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    dataService.getBudgetList().then(function(data) {
      vm.locals = data;
      vm.years = [];
      
      vm.local = vm.locals.filter(function(item) {
        return item.code === 'BRA';
      })[0];
      vm.year = '2014';
      onChangeYear(vm.year);
    });
    
    vm.onChangeYear = onChangeYear;
    
    function onChangeYear(year) {
      if (!vm.local)
        return;
      if (!year)
        return;
        
      optionsService.setBudget({
        year: year,
        code: vm.local.code
      });
    }
  }
  
})(angular.module('app'));