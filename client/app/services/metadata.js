(function(module) {
    
  module.factory('metadata', ['breeze', factory]);
  
  function factory(breeze) {
    return {
      fillStore: fillStore
    };
    
    function fillStore(store) {
      var keyGen = breeze.AutoGeneratedKeyType.Identity;
      var namespace = 'OpenData';
      var helper = new breeze.config.MetadataHelper(namespace, keyGen);
      var addType = function (type) { helper.addTypeToStore(store, type); };
       
      var DT = breeze.DataType;
      var BOOL = DT.Boolean;
      var DATE = DT.DateTime;
      var DECIMAL = DT.Decimal;
      var LUID = DT.Int32; // "Lookup" Id
      var ID = DT.MongoObjectId; // Root entity Id
      
      addBudget();
      addBudgetNode();
      addCountry();
      addTabularData();
      addIndicator();
      
      function addBudget() {
        addType({
          name: 'Budget',
          dataProperties: {
            _id: { type: ID, isPartOfKey: true},
            code: { maxLength: 3, required: true },
            countryName: {maxLength:255, required: true },
            name: { maxLength: 63, required: true },
            year: { maxLength: 63, required: true }
          }
        });
      }
      
      function addBudgetNode() {
        addType({
          name: 'budgetNode',
          dataProperties: {
            code: { maxLength: 15, required: true, isPartOfKey: true },
            name: { maxLength: 255, required: true },
            size: { type: DECIMAL, required: true }
          }
        });
      }
      
      function addCountry() {
        addType({
          name: 'Country',
          dataProperties: {
            _id: { maxLength:3, isPartOfKey: true },
            name: { maxLength: 255, required: true },
            region: {maxLength:255 }
          }
        });
      }
      
      function addIndicator() {
        addType({
          name: 'Indicator',
          dataProperties: {
            _id: { type: ID, isPartOfKey: true},
            code: {maxLength: 255, required: true},
            name: {maxLength: 255},
            source: {maxLength: 255},
            countryName: {maxLength: 255},
            values: {'complex': 'tabularData', hasMany: true},
            country: { maxLength: 3, required: true }
          }
          /*navigationProperties: {
            country: { type: 'Country'}
          }*/
        });
      }
      
      function addTabularData() {
        addType({
          name: 'tabularData',
          isComplexType: true,
          dataProperties: {
            year: {maxLength: 255},
            value: {type: DECIMAL}
          }
        });
      }
    }
  }
    
})(angular.module('app'));