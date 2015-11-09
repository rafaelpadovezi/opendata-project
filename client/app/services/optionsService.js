/* global angular */
(function(module) {
  
  module.factory('optionsService', [factory]);
  
  function factory() {
    var observerCallbacks = [];
    var options = { };
    //register an observer
    function registerObserverCallback (callback){
      observerCallbacks.push(callback);
    }
  
    function setCountries(countries) {
      options.countries = countries;
      notifyObservers();
    }
    
    function setBudget(budget) {
      options.budget = {
        year: budget.year,
        code: budget.code
      };
      notifyObservers();
    }
    
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
      setIndicator: setIndicator,
      setBudget: setBudget
    };
  }
  
})(angular.module('app'));