(function(module){
  
  module.directive('lineChart', ['d3Service', 'nvd3Service', directive]);
  
  function directive(d3Service, nvd3Service) {
    var chart = undefined;
    
    return {
      restrict: 'E',
      link: link,
      scope: {
        data: '=',
        options: '='
      },
      template: '<div id="chart"><svg></svg></div>'
    };
    
    function link(scope, elem, attrs) {
      scope.$watch('data', render);
      scope.$watch('options', update, true);
      
      function render() {
        if (scope.data === undefined)
          return;
        if (scope.options == undefined) {
          if (scope.options.size == undefined) {
            scope.options.size.h = 400;
            scope.options.size.w = 600;
          }
        }
        
        d3Service.d3().then(function(d3) {
          nvd3Service.nvd3().then(function(nv){
            elem.find("#chart svg")
              .width(scope.options.size.w)
              .height(scope.options.size.h);
            
            
            addChart.apply(nv.addChart, [scope.data, scope.options]);
            
            function addChart(data, options) {

              chart = nv.models.lineWithFocusChart()
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
            
              nv.utils.windowResize(chart.update);
              
              return chart;
            }
          }); 
        });
      }
      
      function update() {
        var notReady = 
          scope.options == undefined || chart == undefined;
        if (notReady) return;
        d3Service.d3().then(function(d3) {
          nvd3Service.nvd3().then(function(nv){
            updateChart(scope.options);
          }); 
        });
      }
      
      function updateChart(options) {
        elem.find("#chart svg")
          .width(options.size.w)
          .height(options.size.h);
          
        chart.update();
      }
    }

  }
  
  /*global angular*/
})(angular.module('app'));