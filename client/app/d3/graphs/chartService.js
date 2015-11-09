/* global angular */
(function(module){
  
  module.factory('chartService', ['lineChart' ,'sunburstChart', 'barChart', 'bubbleChart', factory]);
  
  function factory(lineChart, sunburstChart, barChart, bubbleChart) {
    var chart = undefined;
    
    return {
      addSunburstChart: addSunburstChart,
      addLineChart: addLineChart,
      addBarChart: addBarChart,
      addBubbleChart: addBubbleChart
    };
    
    function addBubbleChart(elem, data, options) {
      elem.find('#chart svg').empty();
      bubbleChart.add(elem, data, options);
    }
    
    function addSunburstChart(elem, data, options) {
      sunburstChart.remove(elem);
      sunburstChart.add(elem, data, options);  
    }
    
    function addLineChart(elem, data, options) {
      elem.find('#chart svg').empty();
      lineChart.add(elem, data, options);
    }
    
    function addBarChart(elem, data, options) {
      elem.find('#chart svg').empty();
      barChart.add(elem, data, options);
    }
  }
  
})(angular.module('app'));