/* global angular */
(function(module) {
  
  module.run(($rootScope, queryStringService, optionsService) => {
	  $rootScope.$on("$stateChangeError", console.log.bind(console));
	  
	  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) { 
	    if (fromState.name !== "")
	      optionsService.reset();
    });
	  
	  queryStringService.parseParams();
	});
  
})(angular.module('app'));