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
      getIndicator: getIndicator,
      getIndicatorList: getIndicatorList,
      getCountries: getCountries
    };
    
    return service;
    
    function getIndicator(indicator, countries) {
      var preds = [ ];
      countries.forEach(function(country, i) {
        preds.push(Predicate.create('country', 'eq', country));
      });
      var newPred = Predicate.or(preds);
      var query = indicatorQuery
        .where(newPred)
        .where('code', 'eq', indicator);
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
        .where('name', 'eq', year);
      return manager.executeQuery(query)
          .then(function(data) {
            return data.httpResponse.data;
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
  
})(angular.module('app'));