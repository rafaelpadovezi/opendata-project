(function(module){
  
  module.directive('chart', ['d3Service', 'nvd3Service', directive]);
  
  function directive(d3Service, nvd3Service) {
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
          if (scope.options.size == undefined) {
            scope.options.size.h = 400;
            scope.options.size.w = 600;
          }
        }
        if (!scope.type)
          return;
        
        d3Service.d3().then(function(d3) {
          nvd3Service.nvd3().then(function(nv){
            elem.find("#chart svg")
              .width(scope.options.size.w)
              .height(scope.options.size.h);
            
            var createChart;
            switch (scope.type) {
              case 'lineChart':
                createChart = addLineChart;
                break;
              case 'sunburstChart': 
                createChart = addSunburstChart;
              default:
                // code
            }
            createChart.apply(nv.addChart, [scope.data, scope.options]);
            
            function addLineChart(data, options) {

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
            
            function addSunburstChart(data, options) {
              sunburst(data, options);
              
              function sunburst(root, options) {
                // Dimensions of sunburst.
                var width = options.size.w;
                var height = options.size.h;
                var radius = Math.min(width, height) / 2;
                var x = d3.scale.linear()
                    .range([0, 2 * Math.PI]);
                
                var y = d3.scale.sqrt()
                    .range([0, radius]);
                
                // Mapping of step names to colors.
                var colors = d3.scale.category10();
                
                // Total size of all segments; we set this later, after loading the data.
                var totalSize = 0; 
                
                var vis = d3.select(elem.find('#chart svg')[0])
                    .attr("width", width)
                    .attr("height", height)
                    .append("svg:g")
                    .attr("id", "container")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                
                var partition = d3.layout.partition()
                    .size([2 * Math.PI, radius * radius])
                    .value(function(d) { return d.size; });
                
                var arc = d3.svg.arc()
                    .startAngle(function(d) { return d.x; })
                    .endAngle(function(d) { return d.x + d.dx; })
                    .innerRadius(function(d) { return Math.sqrt(d.y); })
                    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
                
                var explanation = d3.select(elem.find('#chart')[0])
                		.insert("div", ":first-child")
                		.attr('id', 'explanation')		
                		.style('top', height/2 - height/15 + 'px')
                		.style('left', width/2 - width/11 + 'px');
                		
                explanation.append('div')
                		.attr('id', 'percentage')
                explanation.append('div')
                		.attr('id', 'name');
                		
                createVisualization(root);
                
                // Main function to draw and set up the visualization, once we have the data.
                function createVisualization(json) {
                  // Bounding circle underneath the sunburst, to make it easier to detect
                  // when the mouse leaves the parent g.
                  vis.append("svg:circle")
                      .attr("r", radius)
                      .style("opacity", 0);
                
                  // For efficiency, filter nodes to keep only those large enough to see.
                  var nodes = partition.nodes(json)
                      .filter(function(d) {
                      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
                      });
                
                  var path = vis.data([json]).selectAll("path")
                      .data(nodes)
                      .enter().append("svg:path")
                      .attr("display", function(d) { return d.depth ? null : "none"; })
                      .attr("d", arc)
                      .attr("fill-rule", "evenodd")
                      .style("fill", function(d) { return colors((d.children ? d : d.parent).name); })
                      .style("opacity", 1)
                      .on("mouseover", mouseover)
                			.on("click", click);
                			
                	function click(d) {
                    path.transition()
                      .duration(750)
                      .attrTween("d", arcTween(d));
                  }
                	
                	function arcTween(d) {
                		var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                				yd = d3.interpolate(y.domain(), [d.y, 1]),
                				yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                		return function(d, i) {
                			return i
                					? function(t) { return arc(d); }
                					: function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                		};
                	}
                
                  // Add the mouseleave handler to the bounding circle.
                  d3.select(elem.find('#chart')[0]).on("mouseleave", mouseleave);
                
                  // Get total size of the tree = value of root node from partition.
                  totalSize = path.node().__data__.value;
                 };
                
                // Fade all but the current sequence, and show it in the breadcrumb trail.
                function mouseover(d) {
                
                  var percentage = (100 * d.value / totalSize).toPrecision(3);
                  var percentageString = percentage + "%";
                  if (percentage < 0.1) {
                    percentageString = "< 0.1%";
                  }
                
                  d3.select("#percentage")
                      .text(percentageString);
                	d3.select("#name")
                		.text(d.name);
                  d3.select("#explanation")
                      .style("visibility", "");
                
                  var sequenceArray = getAncestors(d);
                
                  // Fade all the segments.
                  d3.selectAll("path")
                      .style("opacity", 0.3);
                
                  // Then highlight only those that are an ancestor of the current segment.
                  vis.selectAll("path")
                      .filter(function(node) {
                                return (sequenceArray.indexOf(node) >= 0);
                              })
                      .style("opacity", 1);
                }
                
                // Restore everything to full opacity when moving off the visualization.
                function mouseleave(d) {
                
                  // Deactivate all segments during transition.
                  d3.selectAll("path").on("mouseover", null);
                
                  // Transition each segment to full opacity and then reactivate it.
                  d3.selectAll("path")
                      .transition()
                      .duration(1000)
                      .style("opacity", 1)
                      .each("end", function() {
                              d3.select(this).on("mouseover", mouseover);
                            });
                
                  d3.select("#explanation")
                      .style("visibility", "hidden");
                }
                
                // Given a node in a partition layout, return an array of all of its ancestor
                // nodes, highest first, but excluding the root.
                function getAncestors(node) {
                  var path = [];
                  var current = node;
                  while (current.parent) {
                    path.unshift(current);
                    current = current.parent;
                  }
                  return path;
                }
            
              }
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