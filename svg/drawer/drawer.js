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
            'path',
            'd3'
        ],
        function ($, Step, Path)
        {
            function Drawer()
            {
                this.DEFAULT_STEP_DISTANCE = 50;
                this.DEFAULT_SIZE = 800;
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

                this.paths = this.svg
                        .append('svg:g')
                        .attr('id', 'paths');

                this.data = {};
            }

            Drawer.prototype.createLayout = function () {
                this.layout = d3.layout.force()
                        .nodes(this.data.steps)
                        .links(this.data.paths)
                        .size([this.viewbox.width, this.viewbox.height])
                        .linkDistance(150)
                        .charge(-2000)
                        .on('tick', (function () {
                            console.log(this.steps.data());
                            this.paths.select('path')
                                    .attr(
                                            'd',
                                            function (d) {
                                                return 'M'+d.source.x+','+d.source.y+'L'+d.target.x+','+d.target.y;
                                            }
                                    );

                            this.steps
                                    .attr(
                                            'transform',
                                            function (d) {
                                                return 'translate(' + d.x + ',' + d.y + ')';
                                            }
                                    );
                        }).bind(this));
            };

            Drawer.prototype.getStep = function (key) {
                for (var i = 0; i < this.data.steps.length; i++) {
                    console.log(this.data.steps[i].step.getKey() + '===' + key);
                    if (this.data.steps[i].step.getKey() === key) {
                        return this.data.steps[i];
                    }
                }
            };

            Drawer.prototype.setData = function (data) {
                var steps = [];
                var paths = [];

                for (var step in data.steps) {
                    steps.push({
                        'x': this.viewbox.width / 2,
                        'y': this.viewbox.height / 2,
                        'step': new Step(step, data.steps[step])
                    });
                }

                this.data.steps = steps;

                for (var path in data.paths) {
                    paths.push({
                        'source': this.getStep(data.paths[path].options.source),
                        'target': this.getStep(data.paths[path].options.destination),
                        'path': new Path(data.paths[path])
                    });
                }

                this.data.paths = paths;

                this.createLayout();
                this.draw();
            };

            Drawer.prototype.draw = function () {
                this.drawSteps();
                this.drawPaths();

                this.layout.start();
            };

            Drawer.prototype.drawPaths = function () {
                this.paths = this.paths
                        .selectAll('g')
                        .data(this.data.paths)
                        .enter()
                        .append('svg:g')
                        .attr(
                                'id',
                                function (d) {
                                    return 'group_' + d.path.getKey();
                                }
                        );

                this.paths.append('path')
                        .style('stroke', this.STROKE_COLOR)
                        .style('stroke-width', 2);
            };

            Drawer.prototype.drawSteps = function () {
                this.steps = this.steps
                        .selectAll('g')
                        .data(this.data.steps)
                        .enter()
                        .append('svg:g')
                        .attr(
                                'id',
                                function (d) {
                                    return 'group_' + d.step.getKey();
                                }
                        );

                this.steps.append('svg:rect')
                        .attr('x', function (d) {
                            return -(d.step.getSize().width / 2);
                        })
                        .attr('y', function (d) {
                            return -((d.step.getSize().height - d.step.getPadding()) / 2);
                        })
                        .attr('width', function (d) {
                            return d.step.getSize().width;
                        })
                        .attr('height', function (d) {
                            return d.step.getSize().height;
                        })
                        .attr('rx', 5)
                        .attr('ry', 5)
                        .style('stroke-width', 2)
                        .style('fill', d3.rgb(255, 255, 255))
                        .style('stroke', this.STROKE_COLOR);

                var txt = this.steps.append('svg:text')
                        .attr('font-family', 'Arial')
                        .attr('text-anchor', 'middle');

                txt.append('svg:tspan')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('font-size', '20px')
                        .attr('font-weight', 'bold')
                        .text(function (d) {
                            return d.step.getKey();
                        });

                txt.append('svg:tspan')
                        .attr('x', 0)
                        .attr('dy', '2em')
                        .attr('font-size', '17px')
                        .text(function (d) {
                            return '<' + d.step.getType() + '>';
                        });
            };

            return Drawer;
        }
);