(function(module){
  
  module.factory('lineChart', ['d3Service', 'nvd3Service', factory]);
  
  function factory(d3Service, nvd3Service) {
    var chart = undefined;
    
    return {
      add:add
    };
    
    function add(elem, data, options) {
      d3Service.d3().then(function(d3) {
        nvd3Service.nvd3().then(function(nv) {
          
          chart = nv.models.lineWithFocusChart()
            .color(["#9d71fc", "#0ff4fc", "#16934a",
              "#f9b595", "#4e3593", "#b7e050", "#63b3f9",
              "#105172", "#ed40de", "#45b505", "#df89ff",
              "#9df268", "#f43356", "#afa8ed", "#6044b5"])
            .margin({left: 100})
            .useInteractiveGuideline(true);
          
          chart.xAxis
            .tickFormat(d3.format('d'));
          
          chart.yAxis
            .tickFormat(d3.format(',.2f'));
        
          chart.y2Axis
            .tickFormat(d3.format('d'));
          
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
            .transition().duration(1000)
            .call(chart);
        
          //nv.utils.windowResize(chart.update);
          
          return chart;
        });
      });
    }

  }
  /*global angular*/
})(angular.module('app'));