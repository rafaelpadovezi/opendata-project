/* global angular */
(function(module) {
  
  module.factory('optionsService', [factory]);
  
  function factory() {
    var observerCallbacks = [];
    var options = { };
    
    function registerObserverCallback (callback){
      observerCallbacks.push(callback);
    }
  
    function setOption(obj) {
      Object.keys(obj).forEach(function(key) {
        options[key] = obj[key];
      });
      notifyObservers();
    }
    
    function notifyObservers() {
      angular.forEach(observerCallbacks, function(callback){
        callback(options);
      });
    }
    
    function reset() {
      options = { };
    }
    
    function search() {
      if (arguments.length === 1) {
        return options[arguments[0]];
      }
      if (arguments.length === 2) {
        options[arguments[0]] = arguments[1];
        notifyObservers();
        return arguments[1];
      }
      throw "unvalid number of arguments";
    }
    
    return {
      onChangeOptions: registerObserverCallback,
      setOption: setOption,
      reset: reset,
      search: search,
      $$search: options
    };
  }
  
})(angular.module('app'));