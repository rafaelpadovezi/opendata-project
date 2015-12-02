/* global angular */
(function(module) {
  
  module.factory('queryStringService', ['optionsService', '$location', factory]);
  
  function factory(optionsService, $location) {
    optionsService.onChangeOptions(function(options) {
      Object.keys(options).forEach(function(key) {
        $location.search(key, JSON.stringify(options[key]));  
      });
    });
    
    function parseParams() {
      Object.keys($location.$$search).forEach(function(key) {
        optionsService.search(key, JSON.parse($location.$$search[key]));
      });
    }
    
    return {
      parseParams: parseParams
    };
  }
  
})(angular.module('app'));