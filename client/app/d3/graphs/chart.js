(function(module){
  
  module.directive('chart', ['d3Service', 'nvd3Service', 'chartService', directive]);
  
  function directive(d3Service, nvd3Service, chartService) {
    var chart = undefined;
    
    return {
      restrict: 'E',
      link: link,
      scope: {
        data: '=',
        options: '=',
        type: '='
      },
      template: '<div id="chart"><svg></svg></div>'
    };
    
    function link(scope, elem, attrs) {
      scope.$watch('data', render);
      scope.$watch('options', update, true);
      scope.$watch('type', changeType);
      
      function changeType() {
        if (scope.type === undefined)
        return;
        
        render();
      }
      
      function render() {
        if (scope.data === undefined)
          return;
        if (scope.options == undefined) {
          scope.options = { };
        }
        if (scope.options.size == undefined) {
          scope.options.size = {
            h: 480,
            w: 600
          };
        }
        if (!scope.type)
          return;
        
        elem.find("#chart svg")
          .width(scope.options.size.w)
          .height(scope.options.size.h);
        
        d3Service.d3().then(function(d3) {
          nvd3Service.nvd3().then(function(nv){
            
            
            var createChart;
            switch (scope.type) {
              case 'lineChart':
                createChart = chartService.addLineChart;
                break;
              case 'barChart':
                createChart = chartService.addBarChart;
                break;
              case 'sunburstChart': 
                createChart = chartService.addSunburstChart;
                break;
              case 'bubbleChart':
                createChart = chartService.addBubbleChart;
                break;
              case 'treemapChart':
                createChart = chartService.addTreemapChart;
                break;
              case 'parallelCoordinatesChart':
                createChart = chartService.addParallelCoordinatesChart;
                break;
              default:
                // code
            }
            createChart.apply(nv.addChart, [elem, scope.data, scope.options]);
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