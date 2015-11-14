/* global angular */
(function(module) {
  
  module.factory('bubbleChart', ['d3Service', factory]);
  
  function factory(d3Service) {
    return {
      add: add
    };
    
    function add(elem, root, options) {
      d3Service.d3().then(function(d3) {
        var totalSize = sumEverything(root);
        var diameter = Math.min(options.size.w, options.size.h),
            format = d3.format(",d"),
            color = d3.scale.category20c();
        
        var bubble = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(1.5);
        
        var svg = d3.select(elem.find('#chart svg')[0])
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");
        
        var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root))
                .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
        node.append("title")
            .text(function(d) { 
              return d.className + ": " + d3.round(100*d.value/totalSize,2) + '%'; });
    
        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.packageName); });
    
        node.append("text")
            .classed("bubble-text", true)
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); });
        
        // Returns a flattened hierarchy containing all leaf nodes under the root.
        function classes(root) {
            var classes = [];
        
            function recurse(name, node) {
                if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
                else classes.push({packageName: name, className: node.name, value: node.size});
            }
        
            recurse(null, root);
            return {children: classes};
        }
        
        function sumEverything(data) {
          var sum = 0;
          data.children.forEach(function(node) {
            node.children.forEach(function(item) {
              sum += item.size;
            });
          });
          return sum;
        }
      });
    }
  }
  
})(angular.module('app'));