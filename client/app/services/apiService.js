/* global angular */
(function(module) {
  
  module.service('apiService', ['$window', service]);
  
  function service($window) {
    var serviceRoot = $window.location.protocol + '//' + window.location.host + '/';
    this.serviceName = serviceRoot + 'api/';
  }
  
})(angular.module('app'));