(function(module){
  
  module.factory('barChart', ['d3Service', 'nvd3Service', factory]);
  
  function factory(d3Service, nvd3Service) {
    var chart = undefined;
    
    return {
      add: add
    };
    
    function add(elem, data, options) {
      d3Service.d3().then(function(d3) {
        nvd3Service.nvd3().then(function(nv) {
          chart = nv.models.multiBarWithFocusChart()
            .groupSpacing(0.1);
          
          chart.xAxis
            .tickFormat(d3.format('d'));
          
          chart.yAxis
            .tickFormat(d3.format(',.2f'));
          
          if (options) {
            if (options.axisLabel) {
              chart.xAxis
                .axisLabel(options.axisLabel.x);
              chart.yAxis
                .axisLabel(options.axisLabel.y);
            }
          }
          
          d3.select(elem.find('#chart svg')[0])
            .datum(data)
            .call(chart);
        
          //nv.utils.windowResize(chart.update);
          
          return chart;
        });
      });
    }
  }
  
  /*global angular*/
})(angular.module('app'));