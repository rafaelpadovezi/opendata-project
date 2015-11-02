(function(module){
  
  module.controller('lineChart', ['d3Service', 'dataService', controller])
  
  function controller(d3Service, dataService) {
    var vm = this;
    var d3 = d3Service;
    vm.data = { };
    dataService
      .getData({country: 'BRA', indicator: 'NY.GDP.MKTP.KD.ZG'})
      .then(getData)
      .catch(onFail);
      
    function getData(data) {
      vm.data = data[0].values;
      render(vm.data);
    }
    
    function render(data) {
      // Setup
      var h = 100;
      var w = 400;
      var scale = 6;
      var lableOffset = -20;
      
      var lineFun = d3.svg.line()
        .x(function(d) { return (d.year - data[0].year)*scale; })
        .y(function(d) { return h - 20 -(d.value)*4; })
        .interpolate('linear');
        
      var svg = d3.select('body')
        .append('svg')
        .attr({ width: w, height: h});
          
      var viz = svg.append('path')
        .attr({
          d: lineFun(data),
          'stroke': 'purple',
          'stroke-width': 2,
          fill: 'none'
        });
        
      /*var labels = svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(function(d) {return d.value;})
      .attr({
        x: function(d) { return (d.year - data[0].year)*scale + lableOffset;},
        y: function(d) {return h-d.value;},
        'font-size': '12px',
        'font-family': 'sans-serif',
        'fill': '#666666',
        'text-anchor': 'start',
        'dy': '.35em',
        'font-weight': function(d, i) {
          if (i ===0 || i ==data.length-1)
            return 'bold';
        }
      });*/
    }
    
    function onFail(err) {
      // body...
    }
  }
  
})(angular.module('app'));