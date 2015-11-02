(function(module) {
  
  module.factory('dataService', ['breeze', 'entityManagerFactory', '$q', factory]);
  
  function factory(breeze, entityManagerFactory, $q) {
    var manager = entityManagerFactory.getManager();
    var Predicate = breeze.Predicate;
    
    var countryQuery =
      new breeze.EntityQuery()
        .from('Country');
    var indicatorQuery = 
      new breeze.EntityQuery()
        .from('Indicator');
        
    var service = {
      getIndicator: getIndicator
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
          
      function onResponse(data) {
        return data.results;
      }
    }
    
    function onError(err) {
      console.log(err);
    }
    
  }
  
})(angular.module('app'));