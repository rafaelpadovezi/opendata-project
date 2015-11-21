/* global angular */
(function(module) {
  
  module.factory('parallelCoordinatesChart', ['d3Service', 'nvd3Service',factory]);
  
  function factory(d3Service, nvd3Service) {
    return {
      add: add
    };
    
    function add(elem, data, options) {
      d3Service.d3().then(function(d3) {
        nvd3Service.nvd3().then(function(nv) {
          var chart;
          nv.addGraph(function() {
            chart = nv.models.parallelCoordinates()
                .dimensionNames(options.names)
                //.dimensionFormats(options.format)
                .lineTension(0.85);
        		
            d3.select(elem.find('#chart svg')[0])
                    .datum(data)
                    .call(chart);
                    
            nv.utils.windowResize(chart.update);
            return chart;
          });
        });
      });
    }
  }
  
})(angular.module('app'));