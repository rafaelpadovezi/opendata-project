(function(module) {
  
  module.factory('dataService', ['breeze', 'entityManagerFactory', '$q', '$http', 'apiService', factory]);
  
  function factory(breeze, entityManagerFactory, $q, $http, apiService) {
    var manager = entityManagerFactory.getManager();
    var Predicate = breeze.Predicate;
    
    var countryQuery =
      new breeze.EntityQuery()
        .from('Country');
    var indicatorQuery = 
      new breeze.EntityQuery()
        .from('Indicator');
    var budgetQuery =
      new breeze.EntityQuery()
        .from('Budget');
        
    var service = {
      getBudget: getBudget,
      getBudgetList: getBudetList,
      getIndicator: getIndicator,
      getIndicatorList: getIndicatorList,
      getCountries: getCountries
    };
    
    return service;
    
    function getIndicator() {
      if (arguments.length === 1)
        return _getIndicator(arguments[0]);
      else
        return _getIndicator(arguments[0], arguments[1]);
    }
    
    function _getIndicator(indicator, countries) {
      var preds = [ ];
      if (Array.isArray(countries)) {
        countries.forEach(function(country, i) {
          preds.push(Predicate.create('country', 'eq', country));
        });  
      } else {
        preds.push(Predicate.create('country', 'eq', countries));
      }
      
      var countriesPred = Predicate.or(preds);
      preds = [ ];
      
      if (Array.isArray(indicator)) {
        indicator.forEach(function(indicatorItem) {
          preds.push(Predicate.create('code', 'eq', indicatorItem));
        });
      } else {
        preds.push(Predicate.create('code', 'eq', indicator));
      }
      var indicatorPred = Predicate.or(preds);
      
      var query = indicatorQuery
        .where(countriesPred)
        .where(indicatorPred);
      return manager.executeQuery(query)
          .then(onResponse)
          .catch(onError);
    }
    
    function getIndicatorList() {
      return $http.get(apiService.serviceName + 'IndicatorList')
        .then(function(data) {
          return data.data;
        })
        .catch(onError);
    }
    
    function getCountries() {
      var query = countryQuery;
      return manager.executeQuery(query)
        .then(onResponse)
        .catch(onError);
    }
    
    function getBudget(code, year) {
      var query = budgetQuery
        .where('code', 'eq', code)
        .where('year', 'eq', year);
      return manager.executeQuery(query)
          .then(function(data) {
            return data.httpResponse.data;
          })
          .catch(onError);
    }
    
    function getBudetList() {
      return $http.get(apiService.serviceName + 'BudgetList')
        .then(function(data) {
          return data.data;
        })
        .catch(onError);
    }
    
    function onError(err) {
      console.log(err);
    }
    
    function onResponse(data) {
      return data.results;
    }
  }
  
  /* global angular */
})(angular.module('app'));