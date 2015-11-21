/* global angular */
(function(module){
  
  module.factory('chartService',
                                ['lineChart' 
                                ,'sunburstChart'
                                ,'barChart'
                                ,'bubbleChart'
                                ,'treemapChart'
                                ,'parallelCoordinatesChart'
                                ,factory]);
  
  function factory(lineChart,
                   sunburstChart,
                   barChart,
                   bubbleChart,
                   treemapChart,
                   parallelCoordinatesChart) {
                     
    return {
      addSunburstChart: addSunburstChart,
      addLineChart: addLineChart,
      addBarChart: addBarChart,
      addBubbleChart: addBubbleChart,
      addTreemapChart: addTreemapChart,
      addParallelCoordinatesChart: addParallelCoordinatesChart
    };
    
    function addParallelCoordinatesChart(elem, data, options) {
      elem.find('#chart svg').empty();
      parallelCoordinatesChart.add(elem, data, options);
    }
    
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
      lineChart.add(elem, data.filter(function(item) { return item.values.length > 0; }), options);
    }
    
    function addBarChart(elem, data, options) {
      elem.find('#chart svg').empty();
      barChart.add(elem, data.filter(function(item) { return item.values.length > 0; }), options);
    }
    
    function addTreemapChart(elem, data, options) {
      elem.find('#chart svg').empty();
      treemapChart.add(elem, data, options);
    }
  }
  
})(angular.module('app'));