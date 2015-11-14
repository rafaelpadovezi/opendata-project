/* global angular */
(function(module){
  
  module.factory('chartService',
                                ['lineChart' 
                                ,'sunburstChart'
                                ,'barChart'
                                ,'bubbleChart'
                                ,'treemapChart'
                                ,factory]);
  
  function factory(lineChart, sunburstChart, barChart, bubbleChart, treemapChart) {
    var chart = undefined;
    
    return {
      addSunburstChart: addSunburstChart,
      addLineChart: addLineChart,
      addBarChart: addBarChart,
      addBubbleChart: addBubbleChart,
      addTreemapChart: addTreemapChart
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
    
    function addTreemapChart(elem, data, options) {
      elem.find('#chart svg').empty();
      treemapChart.add(elem, data, options);
    }
  }
  
})(angular.module('app'));