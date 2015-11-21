/* global angular */
(function(module) {
  
  module.factory('util', [factory]);
  
  function factory() {
    return {
      unwind: unwind,
      tablerize: tablerize
    };
    
    function tablerize(data) {
      var manipulatedData = [ ];
      data.forEach(function(country) {
        var manipulatedItem = {
          'key': country.countryName,
          'values': []
        };
        
        country.values.forEach(function(item, i) {
          manipulatedItem.values.push({
            x: item.year,
            y: item.value
          });
        });
        
        manipulatedData.push(manipulatedItem);
      });
      
      return manipulatedData;
    }
    
    function unwind(data) {
    	var parsedObj = { };
    	data.forEach(function(indicator) {
    		indicator.values.forEach(function(value) {
    			if (!parsedObj[value.year]) {
    				parsedObj[value.year] = {
    					Year: Number(value.year)
    				};
    			}/*global d3*/
    			(parsedObj[value.year])[indicator.name] = d3.round(value.value,5);
    		});
    	});
    
    	var parsedData = [];
    	for(var key in parsedObj) {
    		parsedData.push(parsedObj[key]);
    	}
    	return parsedData;
    }
  }
  
})(angular.module('app'));