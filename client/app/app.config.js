/* global angular */
(function(module) {
  
  module.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', config]);


	function config($httpProvider, $stateProvider, $urlRouterProvider) {
		
		// For any unmatched url, redirect to /state1
		//$urlRouterProvider.otherwise("index");
		//
		// Now set up the states
		$stateProvider
		.state('index', {
		  url: '^',
		  templateUrl: "../template/index.html"
		})
		.state('app', {
		  url: 'app',
		  templateUrl: '../template/app.html'
		})
		.state('app.compare', {
            url: "compare",
            templateUrl: "../template/compare.html"
		})
		.state('app.budget', {
            url: "budget",
            templateUrl: "../template/budget.html"
		});
	}
  
})(angular.module('app'));