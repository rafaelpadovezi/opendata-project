/* global angular */
(function(module) {
  
  module.factory('optionsService', [factory]);
  
  function factory() {
    var observerCallbacks = [];
    var options = { };
    //register an observer
    function registerObserverCallback (callback){
      observerCallbacks.push(callback);
    };
  
    //call this when you know 'foo' has been changed
    function setCountries(countries) {
      options.countries = countries;
      notifyObservers();
    };
    
    function setIndicator(indicator) {
      options.indicator = indicator;
      notifyObservers();
    }
    
    function notifyObservers() {
      angular.forEach(observerCallbacks, function(callback){
        callback(options);
      });
    }
    
    return {
      onChangeOptions: registerObserverCallback,
      setCountries: setCountries,
      setIndicator: setIndicator
    }
  }
  
})(angular.module('app'));