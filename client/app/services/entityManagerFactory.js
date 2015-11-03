(function(module) {
    
  module.factory('entityManagerFactory', ['breeze', 'metadata', 'apiService', factory]);

  function factory(breeze, metadata, apiService) {
    var serviceName = apiService.serviceName;
    
    var masterManager = null;
    
    var metadataStore = getMetadataStore();
    
    var dataService = new breeze.DataService({
      serviceName: serviceName,
      hasServerMetadata: false  // don't ask the server for metadata
    }); 

    breeze.config.initializeAdapterInstance("dataService", "mongo", true);
    // Convert properties between server-side PascalCase and client-side camelCase
    breeze.NamingConvention.camelCase.setAsDefault();
    
    var create = {
        newManager: newManager,
        getManager: getManager
    };
    
    return create;
    
    function newManager() {
      return new breeze.EntityManager({
        dataService: dataService,
        metadataStore: metadataStore
      });
    }
    
    function getManager(){
      return masterManager || (masterManager = newManager());
    }
    
    function getMetadataStore() {
      var store = new breeze.MetadataStore();

      metadata.fillStore(store);
      
      return store;
    }
  }
  
})(angular.module('app'));