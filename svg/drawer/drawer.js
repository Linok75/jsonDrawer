'use strict';

requirejs.config(
    {
        paths: {
            'd3': 'lib/d3.min',
            'step': 'drawer/step',
            'path': 'drawer/path',
            'infos': 'drawer/infos',
            'endstep': 'drawer/endStep'
        }
    }
);
define(
    [
        'jquery-private',
        'step',
        'd3'
    ],
    function($, Step)
    {
        function Drawer()
        {
            this.DEFAULT_STEP_DISTANCE = 50;
            this.DEFAULT_SIZE = 500;
            this.STROKE_COLOR = d3.rgb(4, 97, 201);

            this.viewbox = {
                'x': 0,
                'y': 0,
                'width': this.DEFAULT_SIZE,
                'height': this.DEFAULT_SIZE
            };

            this.svg = d3.select('#svgBox')
                .append('svg:svg')
                .attr('id', 'drawingboard')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .style('background-color', d3.rgb(183, 196, 189));

            this.steps = this.svg
                .append('svg:g')
                .attr('id', 'steps');

            this.data = {};

            this.setViewbox();

            this.nextPosition = {
                'x': this.viewbox.width / 2,
                'y': this.DEFAULT_STEP_DISTANCE
            };
        }

        Drawer.prototype.setViewbox = function() {
            this.svg.attr(
                'viewBox',
                this.viewbox.x + ' ' + this.viewbox.y + ' ' + this.viewbox.width + ' ' + this.viewbox.height
                );
        };

        Drawer.prototype.setData = function(data) {
            var steps = [];
            var paths = [];

            for (var step in data.steps) {
                steps.push(new Step(step, data.steps[step]));
            }

            this.data = {
                'steps': steps,
                'paths': paths
            };

            this.draw();
        };

        Drawer.prototype.draw = function() {
            this.drawSteps();
        };
        
        Drawer.prototype.drawSteps = function() {
            this.steps = this.steps
                .selectAll('g')
                .data(this.data.steps)
                .enter();

            var groups = this.steps.append('svg:g')
                .attr(
                    'id',
                    function(d) {
                        return 'group_' + d.getKey();
                    }
                )
                .attr(
                    'transform',
                    function(d) {
                        var res = 'translate(' + this.nextPosition.x + ',' + this.nextPosition.y + ')';

                        this.nextPosition.y += d.getSize().height + this.DEFAULT_STEP_DISTANCE;
                        this.viewbox.height = this.nextPosition.y;
                        this.setViewbox();

                        return res;
                    }.bind(this)
                    );

            groups.append('svg:rect')
                .attr('x', function(d) {
                    return -(d.getSize().width / 2);
                })
                .attr('y', function(d) {
                    return -((d.getSize().height - d.getPadding()) / 2) ;
                })
                .attr('width', function(d) {
                    return d.getSize().width;
                })
                .attr('height', function(d) {
                    return d.getSize().height;
                })
                .attr('rx', 5)
                .attr('ry', 5)
                .style('stroke-width', 2)
                .style('fill', d3.rgb(255, 255, 255))
                .style('stroke', this.STROKE_COLOR);

            var txt = groups.append('svg:text')
                .attr('font-family', 'Arial')
                .attr('text-anchor', 'middle');

            txt.append('svg:tspan')
                .attr('x', 0)
                .attr('y', 0)
                .attr('font-size', '20px')
                .attr('font-weight', 'bold')
                .text(function(d) {
                    return d.getKey();
                });

            txt.append('svg:tspan')
                .attr('x', 0)
                .attr('dy', '2em')
                .attr('font-size', '17px')
                .text(function(d) {
                    return '<' + d.getType() + '>';
                });
        };

        return Drawer;
    }
);