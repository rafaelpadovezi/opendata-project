/* global angular */
(function(module){
  
  module.controller('budgetPicker', ['$scope', 'dataService', 'optionsService', controller]);
  
  function controller($scope, dataService, optionsService) {
    var vm = this;
    
    dataService.getBudgetList().then(function(data) {
      vm.locals = data;
      vm.years = [];
      
      
      if (optionsService.search('year') && optionsService.search('code')) {
        vm.local = vm.locals.filter(function(item) {
          return item.code === optionsService.search('code');
        })[0];
        
        vm.year = optionsService.search('year');  
      } else {
        vm.local = vm.locals.filter(function(item) {
          return item.code === 'BRA';
        })[0];
        vm.year = '2014';
      }
      
      onChangeYear(vm.year);
    });
    
    vm.onChangeYear = onChangeYear;
    
    function onChangeYear(year) {
      if (!vm.local)
        return;
      if (!year)
        return;
        
      optionsService.search('year', year);
      optionsService.search('code', vm.local.code);
    }
  }
  
})(angular.module('app'));