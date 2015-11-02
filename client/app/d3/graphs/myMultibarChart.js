/*global angular*/
angular.module('nvd3')
  .factory('multiBarChart2', 'nvd3Service', 'd3Service', factory);

function factory(nvd3Service, d3Service) {
  d3Service.d3().then(function(d3) {
    nvd3Service.nvd3().then(function(nv) {
      nv.models.multiBarChart = function() {
        "use strict";
        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------
        var multibar = nv.models.multiBar(),
          xAxis = nv.models.axis(),
          yAxis = nv.models.axis(),
          legend = nv.models.legend(),
          controls = nv.models.legend(),
          tooltip = nv.models.tooltip();
        // My add
        var multibar2 = nv.models.multiBar(),
          x2Axis = nv.models.axis(),
          y2Axis = nv.models.axis(),
          interactiveLayer = nv.interactiveGuideline();
        var margin = {
            top: 30,
            right: 20,
            bottom: 50,
            left: 60
          },
          width = null,
          height = null,
          color = nv.utils.defaultColor(),
          showControls = true,
          controlLabels = {},
          showLegend = true,
          showXAxis = true,
          showYAxis = true,
          rightAlignYAxis = false,
          reduceXTicks = true // if false a tick will show for every data point
          ,
          staggerLabels = false,
          wrapLabels = false,
          rotateLabels = 0,
          x //can be accessed via chart.xScale()
          , y //can be accessed via chart.yScale()
          , state = nv.utils.state(),
          defaultState = null,
          noData = null,
          dispatch = d3.dispatch('stateChange', 'changeState',
            'renderEnd'),
          controlWidth = function() {
            return showControls ? 180 : 0
          },
          duration = 250;
        /* myAdd */
        var x2, y2, focusEnable = false,
          focusShowAxisY = false,
          focusShowAxisX = true,
          focusHeight = 50,
          margin2 = {
            top: 0,
            right: 20,
            bottom: 20,
            left: 60
          },
          brush = d3.svg.brush(),
          brushExtent = null;
        state.stacked = false // DEPRECATED Maintained for backward compatibility
        multibar.stacked(false);
        xAxis
          .orient('bottom')
          .tickPadding(7)
          .showMaxMin(false)
          .tickFormat(function(d) {
            return d
          });
        yAxis
          .orient((rightAlignYAxis) ? 'right' : 'left')
          .tickFormat(d3.format(',.1f'));
        tooltip
          .duration(0)
          .valueFormatter(function(d, i) {
            return yAxis.tickFormat()(d, i);
          })
          .headerFormatter(function(d, i) {
            return xAxis.tickFormat()(d, i);
          });
        controls.updateState(false);
        //============================================================
        // Private Variables
        //------------------------------------------------------------
        var renderWatch = nv.utils.renderWatch(dispatch);
        var stacked = false;
        var stateGetter = function(data) {
          return function() {
            return {
              active: data.map(function(d) {
                return !d.disabled
              }),
              stacked: stacked
            };
          }
        };
        var stateSetter = function(data) {
          return function(state) {
            if (state.stacked !== undefined)
              stacked = state.stacked;
            if (state.active !== undefined)
              data.forEach(function(series, i) {
                series.disabled = !state.active[i];
              });
          }
        };

        function chart(selection) {
          renderWatch.reset();
          renderWatch.models(multibar);
          renderWatch.models(multibar2);
          if (showXAxis) renderWatch.models(xAxis);
          if (showYAxis) renderWatch.models(yAxis);
          if (focusShowAxisX) renderWatch.models(x2Axis);
          if (focusShowAxisY) renderWatch.models(y2Axis);
          selection.each(function(data) {
            var container = d3.select(this),
              that = this;
            nv.utils.initSVG(container);
            var availableWidth = nv.utils.availableWidth(width,
                container, margin),
              availableHeight = nv.utils.availableHeight(height,
                container, margin) - (focusEnable ? focusHeight :
                0),
              availableHeight2 = focusHeight - margin2.top -
              margin2.bottom;
            chart.update = function() {
              if (duration === 0)
                container.call(chart);
              else
                container.transition()
                .duration(duration)
                .call(chart);
            };
            chart.container = this;
            state
              .setter(stateSetter(data), chart.update)
              .getter(stateGetter(data))
              .update();
            // DEPRECATED set state.disableddisabled
            state.disabled = data.map(function(d) {
              return !!d.disabled
            });
            if (!defaultState) {
              var key;
              defaultState = {};
              for (key in state) {
                if (state[key] instanceof Array)
                  defaultState[key] = state[key].slice(0);
                else
                  defaultState[key] = state[key];
              }
            }
            // Display noData message if there's nothing to show.
            if (!data || !data.length || !data.filter(function(d) {
                return d.values.length
              }).length) {
              nv.utils.noData(chart, container)
              return chart;
            } else {
              container.selectAll('.nv-noData').remove();
            }
            // Setup Scales
            x = multibar.xScale();
            y = multibar.yScale();
            x2 = multibar2.xScale();
            y2 = multibar2.yScale()
            // Setup containers and skeleton of chart
            var wrap = container.selectAll(
              'g.nv-wrap.nv-multiBarWithLegend').data([data]);
            var gEnter = wrap.enter().append('g').attr('class',
              'nvd3 nv-wrap nv-multiBarWithLegend').append('g');
            var g = wrap.select('g');
            gEnter.append('g').attr('class', 'nv-x nv-axis');
            gEnter.append('g').attr('class', 'nv-y nv-axis');
            gEnter.append('g').attr('class', 'nv-barsWrap');
            gEnter.append('g').attr('class', 'nv-legendWrap');
            gEnter.append('g').attr('class', 'nv-controlsWrap');
            var contextEnter = gEnter.append('g').attr('class',
              'nv-context');
            contextEnter.append('g').attr('class',
              'nv-background').append('rect');
            contextEnter.append('g').attr('class', 'nv-x nv-axis');
            contextEnter.append('g').attr('class', 'nv-y nv-axis');
            contextEnter.append('g').attr('class', 'nv-linesWrap');
            contextEnter.append('g').attr('class',
              'nv-brushBackground');
            contextEnter.append('g').attr('class',
              'nv-x nv-brush');
            // Legend
            if (showLegend) {
              legend.width(availableWidth - controlWidth());
              g.select('.nv-legendWrap')
                .datum(data)
                .call(legend);
              if (margin.top != legend.height()) {
                margin.top = legend.height();
                availableHeight = nv.utils.availableHeight(height,
                  container, margin);
              }
              g.select('.nv-legendWrap')
                .attr('transform', 'translate(' + controlWidth() +
                  ',' + (-margin.top) + ')');
            }
            // Controls
            if (showControls) {
              var controlsData = [{
                key: controlLabels.grouped || 'Grouped',
                disabled: multibar.stacked()
              }, {
                key: controlLabels.stacked || 'Stacked',
                disabled: !multibar.stacked()
              }];
              controls.width(controlWidth()).color(['#444',
                '#444', '#444'
              ]);
              g.select('.nv-controlsWrap')
                .datum(controlsData)
                .attr('transform', 'translate(0,' + (-margin.top) +
                  ')')
                .call(controls);
            }
            wrap.attr('transform', 'translate(' + margin.left +
              ',' + margin.top + ')');
            if (rightAlignYAxis) {
              g.select(".nv-y.nv-axis")
                .attr("transform", "translate(" + availableWidth +
                  ",0)");
            }
            // Main Chart Component(s)
            multibar
              .disabled(data.map(function(series) {
                return series.disabled
              }))
              .width(availableWidth)
              .height(availableHeight)
              .color(data.map(function(d, i) {
                return d.color || color(d, i);
              }).filter(function(d, i) {
                return !data[i].disabled
              }));
            var barsWrap = g.select('.nv-barsWrap')
              .datum(data.filter(function(d) {
                return !d.disabled
              }));
            barsWrap.call(multibar);
            // Setup Axes
            if (showXAxis) {
              xAxis
                .scale(x)
                ._ticks(nv.utils.calcTicksX(availableWidth / 100,
                  data))
                .tickSize(-availableHeight, 0);
              g.select('.nv-x.nv-axis')
                .attr('transform', 'translate(0,' + y.range()[0] +
                  ')');
              g.select('.nv-x.nv-axis')
                .call(xAxis);
              var xTicks = g.select('.nv-x.nv-axis > g').selectAll(
                'g');
              xTicks
                .selectAll('line, text')
                .style('opacity', 1)
              if (staggerLabels) {
                var getTranslate = function(x, y) {
                  return "translate(" + x + "," + y + ")";
                };
                var staggerUp = 5,
                  staggerDown = 17; //pixels to stagger by
                // Issue #140
                xTicks
                  .selectAll("text")
                  .attr('transform', function(d, i, j) {
                    return getTranslate(0, (j % 2 == 0 ?
                      staggerUp : staggerDown));
                  });
                var totalInBetweenTicks = d3.selectAll(
                  ".nv-x.nv-axis .nv-wrap g g text")[0].length;
                g.selectAll(".nv-x.nv-axis .nv-axisMaxMin text")
                  .attr("transform", function(d, i) {
                    return getTranslate(0, (i === 0 ||
                        totalInBetweenTicks % 2 !== 0) ?
                      staggerDown : staggerUp);
                  });
              }
              if (wrapLabels) {
                g.selectAll('.tick text')
                  .call(nv.utils.wrapTicks, chart.xAxis.rangeBand())
              }
              if (reduceXTicks)
                xTicks
                .filter(function(d, i) {
                  return i % Math.ceil(data[0].values.length /
                    (availableWidth / 100)) !== 0;
                })
                .selectAll('text, line')
                .style('opacity', 0);
              if (rotateLabels)
                xTicks
                .selectAll('.tick text')
                .attr('transform', 'rotate(' + rotateLabels +
                  ' 0,0)')
                .style('text-anchor', rotateLabels > 0 ? 'start' :
                  'end');
              g.select('.nv-x.nv-axis').selectAll(
                  'g.nv-axisMaxMin text')
                .style('opacity', 1);
            }
            if (showYAxis) {
              yAxis
                .scale(y)
                ._ticks(nv.utils.calcTicksY(availableHeight / 36,
                  data))
                .tickSize(-availableWidth, 0);
              g.select('.nv-y.nv-axis')
                .call(yAxis);
            }
            //============================================================
            // Update Axes
            //============================================================
            function updateXAxis() {
              if (showXAxis) {
                g.select('.nv-focus .nv-x.nv-axis')
                  .transition()
                  .duration(duration)
                  .call(xAxis);
              }
            }

            function updateYAxis() {
              if (showYAxis) {
                g.select('.nv-focus .nv-y.nv-axis')
                  .transition()
                  .duration(duration)
                  .call(yAxis);
              }
            }
            g.select('.nv-focus .nv-x.nv-axis')
              .attr('transform', 'translate(0,' + availableHeight +
                ')');
            if (!focusEnable) {
              linesWrap.call(lines);
              updateXAxis();
              updateYAxis();
            } else {
              multibar2
              //.defined(lines.defined())
                .width(availableWidth)
                .height(availableHeight2)
                .color(data.map(function(d, i) {
                  return d.color || color(d, i);
                }).filter(function(d, i) {
                  return !data[i].disabled;
                }));
              g.select('.nv-context')
                .attr('transform', 'translate(0,' + (
                  availableHeight + margin.bottom + margin2.top
                ) + ')')
                .style('display', focusEnable ? 'initial' :
                  'none');
              var contextLinesWrap = g.select(
                  '.nv-context .nv-linesWrap')
                .datum(data.filter(function(d) {
                  return !d.disabled;
                }));
              d3.transition(contextLinesWrap).call(multibar2);
              // Setup Brush
              brush
                .x(x2)
                .on('brush', function() {
                  onBrush();
                });
              if (brushExtent) brush.extent(brushExtent);
              var brushBG = g.select('.nv-brushBackground').selectAll(
                  'g')
                .data([brushExtent || brush.extent()]);
              var brushBGenter = brushBG.enter()
                .append('g');
              brushBGenter.append('rect')
                .attr('class', 'left')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', availableHeight2);
              brushBGenter.append('rect')
                .attr('class', 'right')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', availableHeight2);
              var gBrush = g.select('.nv-x.nv-brush')
                .call(brush);
              gBrush.selectAll('rect')
                .attr('height', availableHeight2);
              gBrush.selectAll('.resize').append('path').attr('d',
                resizePath);
              onBrush();
              g.select('.nv-context .nv-background rect')
                .attr('width', availableWidth)
                .attr('height', availableHeight2);
              // Setup Secondary (Context) Axes
              if (focusShowAxisX) {
                x2Axis
                  .scale(x2)
                  ._ticks(nv.utils.calcTicksX(availableWidth /
                    100, data))
                  .tickSize(-availableHeight2, 0);
                g.select('.nv-context .nv-x.nv-axis')
                  .attr('transform', 'translate(0,' + y2.range()[
                    0] + ')');
                d3.transition(g.select(
                    '.nv-context .nv-x.nv-axis'))
                  .call(x2Axis);
              }
              if (focusShowAxisY) {
                y2Axis
                  .scale(y2)
                  ._ticks(nv.utils.calcTicksY(availableHeight2 /
                    36, data))
                  .tickSize(-availableWidth, 0);
                d3.transition(g.select(
                    '.nv-context .nv-y.nv-axis'))
                  .call(y2Axis);
              }
              g.select('.nv-context .nv-x.nv-axis')
                .attr('transform', 'translate(0,' + y2.range()[0] +
                  ')');
            }
            //============================================================
            // Event Handling/Dispatching (in chart's scope)
            //------------------------------------------------------------
            legend.dispatch.on('stateChange', function(newState) {
              for (var key in newState)
                state[key] = newState[key];
              dispatch.stateChange(state);
              chart.update();
            });
            controls.dispatch.on('legendClick', function(d, i) {
              if (!d.disabled) return;
              controlsData = controlsData.map(function(s) {
                s.disabled = true;
                return s;
              });
              d.disabled = false;
              switch (d.key) {
                case 'Grouped':
                case controlLabels.grouped:
                  multibar.stacked(false);
                  break;
                case 'Stacked':
                case controlLabels.stacked:
                  multibar.stacked(true);
                  break;
              }
              state.stacked = multibar.stacked();
              dispatch.stateChange(state);
              chart.update();
            });
            // Update chart from a state object passed to event handler
            dispatch.on('changeState', function(e) {
              if (typeof e.disabled !== 'undefined') {
                data.forEach(function(series, i) {
                  series.disabled = e.disabled[i];
                });
                state.disabled = e.disabled;
              }
              if (typeof e.stacked !== 'undefined') {
                multibar.stacked(e.stacked);
                state.stacked = e.stacked;
                stacked = e.stacked;
              }
              chart.update();
            });
            //============================================================
            // Functions
            //------------------------------------------------------------
            // Taken from crossfilter (http://square.github.com/crossfilter/)
            function resizePath(d) {
              var e = +(d == 'e'),
                x = e ? 1 : -1,
                y = availableHeight2 / 3;
              return 'M' + (0.5 * x) + ',' + y + 'A6,6 0 0 ' + e +
                ' ' + (6.5 * x) + ',' + (y + 6) + 'V' + (2 * y -
                  6) + 'A6,6 0 0 ' + e + ' ' + (0.5 * x) + ',' +
                (2 * y) + 'Z' + 'M' + (2.5 * x) + ',' + (y + 8) +
                'V' + (2 * y - 8) + 'M' + (4.5 * x) + ',' + (y +
                  8) + 'V' + (2 * y - 8);
            }

            function updateBrushBG() {
              if (!brush.empty()) brush.extent(brushExtent);
              brushBG
                .data([brush.empty() ? x2.domain() : brushExtent])
                .each(function(d, i) {
                  var leftWidth = x2(d[0]) - x.range()[0],
                    rightWidth = availableWidth - x2(d[1]);
                  d3.select(this).select('.left')
                    .attr('width', leftWidth < 0 ? 0 :
                      leftWidth);
                  d3.select(this).select('.right')
                    .attr('x', x2(d[1]))
                    .attr('width', rightWidth < 0 ? 0 :
                      rightWidth);
                });
            }

            function onBrush() {
              brushExtent = brush.empty() ? null : brush.extent();
              var extent = brush.empty() ? x2.domain() : brush.extent();
              //The brush extent cannot be less than one.  If it is, don't update the line chart.
              if (Math.abs(extent[0] - extent[1]) <= 1) {
                return;
              }
              dispatch.brush({
                extent: extent,
                brush: brush
              });
              updateBrushBG();
              // Update Main (Focus)
              var focusLinesWrap = g.select(
                  '.nv-focus .nv-linesWrap')
                .datum(
                  data
                  .filter(function(d) {
                    return !d.disabled;
                  })
                  .map(function(d, i) {
                    return {
                      key: d.key,
                      area: d.area,
                      classed: d.classed,
                      values: d.values.filter(function(d, i) {
                        return lines.x()(d, i) >= extent[0] &&
                          lines.x()(d, i) <= extent[1];
                      }),
                      disableTooltip: d.disableTooltip
                    };
                  })
                );
              focusLinesWrap.transition().duration(duration).call(
                lines);
              // Update Main (Focus) Axes
              updateXAxis();
              updateYAxis();
            }
          });
          renderWatch.renderEnd('multibarchart immediate');
          return chart;
        }
        //============================================================
        // Event Handling/Dispatching (out of chart's scope)
        //------------------------------------------------------------
        multibar.dispatch.on('elementMouseover.tooltip', function(evt) {
          evt.value = chart.x()(evt.data);
          evt['series'] = {
            key: evt.data.key,
            value: chart.y()(evt.data),
            color: evt.color
          };
          tooltip.data(evt).hidden(false);
        });
        multibar.dispatch.on('elementMouseout.tooltip', function(evt) {
          tooltip.hidden(true);
        });
        multibar.dispatch.on('elementMousemove.tooltip', function(evt) {
          tooltip();
        });
        //============================================================
        // Expose Public Variables
        //------------------------------------------------------------
        // expose chart's sub-components
        chart.dispatch = dispatch;
        chart.multibar = multibar;
        chart.legend = legend;
        chart.controls = controls;
        chart.xAxis = xAxis;
        chart.yAxis = yAxis;
        chart.state = state;
        chart.tooltip = tooltip;
        chart.options = nv.utils.optionsFunc.bind(chart);
        chart._options = Object.create({}, {
          // simple options, just get/set the necessary values
          width: {
            get: function() {
              return width;
            },
            set: function(_) {
              width = _;
            }
          },
          height: {
            get: function() {
              return height;
            },
            set: function(_) {
              height = _;
            }
          },
          showLegend: {
            get: function() {
              return showLegend;
            },
            set: function(_) {
              showLegend = _;
            }
          },
          showControls: {
            get: function() {
              return showControls;
            },
            set: function(_) {
              showControls = _;
            }
          },
          controlLabels: {
            get: function() {
              return controlLabels;
            },
            set: function(_) {
              controlLabels = _;
            }
          },
          showXAxis: {
            get: function() {
              return showXAxis;
            },
            set: function(_) {
              showXAxis = _;
            }
          },
          showYAxis: {
            get: function() {
              return showYAxis;
            },
            set: function(_) {
              showYAxis = _;
            }
          },
          defaultState: {
            get: function() {
              return defaultState;
            },
            set: function(_) {
              defaultState = _;
            }
          },
          noData: {
            get: function() {
              return noData;
            },
            set: function(_) {
              noData = _;
            }
          },
          reduceXTicks: {
            get: function() {
              return reduceXTicks;
            },
            set: function(_) {
              reduceXTicks = _;
            }
          },
          rotateLabels: {
            get: function() {
              return rotateLabels;
            },
            set: function(_) {
              rotateLabels = _;
            }
          },
          staggerLabels: {
            get: function() {
              return staggerLabels;
            },
            set: function(_) {
              staggerLabels = _;
            }
          },
          wrapLabels: {
            get: function() {
              return wrapLabels;
            },
            set: function(_) {
              wrapLabels = !!_;
            }
          },
          focusEnable: {
            get: function() {
              return focusEnable;
            },
            set: function(_) {
              focusEnable = _;
            }
          },
          focusHeight: {
            get: function() {
              return height2;
            },
            set: function(_) {
              focusHeight = _;
            }
          },
          focusShowAxisX: {
            get: function() {
              return focusShowAxisX;
            },
            set: function(_) {
              focusShowAxisX = _;
            }
          },
          focusShowAxisY: {
            get: function() {
              return focusShowAxisY;
            },
            set: function(_) {
              focusShowAxisY = _;
            }
          },
          brushExtent: {
            get: function() {
              return brushExtent;
            },
            set: function(_) {
              brushExtent = _;
            }
          },
          // options that require extra logic in the setter
          margin: {
            get: function() {
              return margin;
            },
            set: function(_) {
              margin.top = _.top !== undefined ? _.top : margin
                .top;
              margin.right = _.right !== undefined ? _.right :
                margin.right;
              margin.bottom = _.bottom !== undefined ? _.bottom :
                margin.bottom;
              margin.left = _.left !== undefined ? _.left :
                margin.left;
            }
          },
          duration: {
            get: function() {
              return duration;
            },
            set: function(_) {
              duration = _;
              multibar.duration(duration);
              xAxis.duration(duration);
              yAxis.duration(duration);
              renderWatch.reset(duration);
            }
          },
          color: {
            get: function() {
              return color;
            },
            set: function(_) {
              color = nv.utils.getColor(_);
              legend.color(color);
            }
          },
          rightAlignYAxis: {
            get: function() {
              return rightAlignYAxis;
            },
            set: function(_) {
              rightAlignYAxis = _;
              yAxis.orient(rightAlignYAxis ? 'right' : 'left');
            }
          },
          barColor: {
            get: function() {
              return multibar.barColor;
            },
            set: function(_) {
              multibar.barColor(_);
              legend.color(function(d, i) {
                return d3.rgb('#ccc').darker(i * 1.5).toString();
              })
            }
          }
        });
        nv.utils.inheritOptions(chart, multibar);
        nv.utils.initOptions(chart);
        return chart;
      };
    });
  });
}