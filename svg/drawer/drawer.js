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
    function($, Step, Path)
    {
        function Drawer()
        {
            this.DEFAULT_STEP_DISTANCE = 50;
            this.DEFAULT_SIZE = 800;
            this.STROKE_COLOR = d3.rgb(4, 97, 201);
            this.ARROW_SIZE = 10;
            this.MARGIN = 100;

            this.viewbox = {
                'x': 0,
                'y': 0,
                'width': this.DEFAULT_SIZE,
                'height': this.DEFAULT_SIZE
            };

            this.nextPosition = {
                'x': this.viewbox.width / 2,
                'y': 25
            };

            this.svg = d3.select('#svgBox')
                .append('svg:svg')
                .attr('id', 'drawingboard')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', 0 + ' ' + 0 + ' ' + this.DEFAULT_SIZE + ' ' + this.DEFAULT_SIZE)
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

            this.dragListener = d3.behavior.drag()
                .on('drag', (function(d) {
                    this.drag(d);
                }).bind(this));
        }

        Drawer.prototype.drag = function(d) {
            var point = d3.mouse(this.svg[0][0]);

            d.x = point[0];
            d.y = point[1];

            this.translateSteps();
            this.refreshPaths();
        };

        Drawer.prototype.getStep = function(key, output) {
            for (var i = 0; i < this.data.steps.length; i++) {
                if (this.data.steps[i].step.getKey() === key) {
                    if (output) {
                        this.data.steps[i].output++;
                    } else {
                        this.data.steps[i].input++;
                    }

                    return this.data.steps[i];
                }
            }
        };

        Drawer.prototype.setData = function(data) {
            var steps = [];
            var paths = [];

            for (var step in data.steps) {
                var newStep = new Step(step, data.steps[step]);

                this.nextPosition.y += newStep.getSize().height;

                steps.push({
                    'x': this.nextPosition.x,
                    'y': this.nextPosition.y,
                    'output': 0,
                    'input': 0,
                    'step': newStep
                });

                this.nextPosition.y += newStep.getSize().height / 2 + this.MARGIN;
            }

            this.data.steps = steps;

            for (var path in data.paths) {
                paths.push({
                    'source': this.getStep(data.paths[path].options.source, true),
                    'target': this.getStep(data.paths[path].options.destination, false),
                    'path': new Path(data.paths[path])
                });
            }

            this.data.paths = paths;

//                this.createLayout();
            this.draw();
        };

        Drawer.prototype.draw = function() {
            this.drawSteps();
            this.drawPaths();

//            this.layout.start();
        };

        Drawer.prototype.drawPaths = function() {
            this.paths = this.paths
                .selectAll('g')
                .data(this.data.paths)
                .enter()
                .append('svg:g')
                .attr(
                    'id',
                    function(d) {
                        return 'group_' + d.path.getKey();
                    }
                );

            this.paths.append('svg:path')
                .attr('class', 'link')
                .style('stroke', this.STROKE_COLOR)
                .style('stroke-width', 2)
                .style('fill', 'transparent');

            this.paths.append('svg:path')
                .attr('class', 'arrow')
                .style('stroke', this.STROKE_COLOR)
                .style('stroke-width', 2)
                .style('fill', this.STROKE_COLOR);

            this.paths.append('svg:g')
                .attr('class', 'box')
                .append('svg:circle')
                .attr('r', 20)
                .style('stroke', this.STROKE_COLOR)
                .style('stroke-width', 2)
                .style('fill', d3.rgb(255, 255, 255));

            this.paths.select('.box')
                .append('svg:image')
                .attr('x', -15)
                .attr('y', -15)
                .attr('width', 30)
                .attr('height', 30)
                .attr('xlink:href', 'images/info_icon.svg');

            this.refreshPaths();
        };

        Drawer.prototype.setPath = function(d) {
            if (d.source.y > d.target.y) {
                if (d.target.x >= d.source.x) {
                    d.sx = d.source.x + d.source.step.getSize().width / 2;
                    d.sy = d.source.y;

                    d.tx = d.target.x + d.target.step.getSize().width / 2;
                    d.ty = d.target.y;

                    d.mx = d3.max([d.sx + this.MARGIN * 0.5, d.tx + this.MARGIN * 0.5]);
                    d.my = d.sy - Math.abs(d.ty - d.sy) * 0.5;

                    return 'M' + d.sx + ',' + d.sy + 'L' + d.mx + ',' + d.sy + 'L' + d.mx + ',' + d.ty + 'L' + (d.tx + this.ARROW_SIZE) + ',' + d.ty;
                } else {
                    d.sx = d.source.x - d.source.step.getSize().width / 2;
                    d.sy = d.source.y;

                    d.tx = d.target.x - d.target.step.getSize().width / 2;
                    d.ty = d.target.y;

                    d.mx = d3.min([d.sx - this.MARGIN * 0.5, d.tx - this.MARGIN * 0.5]);
                    d.my = d.sy - Math.abs(d.ty - d.sy) * 0.5;

                    return 'M' + d.sx + ',' + d.sy + 'L' + d.mx + ',' + d.sy + 'L' + d.mx + ',' + d.ty + 'L' + (d.tx - this.ARROW_SIZE) + ',' + d.ty;
                }
            } else {
                d.sx = d.source.x;
                d.sy = d.source.y + d.source.step.getSize().height / 2;
                d.tx = d.target.x;
                d.ty = d.target.y - d.target.step.getSize().height / 2;

                d.mx = d.sx + (d.tx - d.sx) * 0.5;
                d.my = d.sy + Math.abs(d.ty - d.sy) * 0.5;

                return 'M' + d.sx + ',' + d.sy +
                    'L' + d.sx + ',' + d.my +
                    'L' + d.tx + ',' + d.my +
                    'L' + d.tx + ',' + (d.ty - this.ARROW_SIZE);
            }
        };

        Drawer.prototype.setArrow = function(d) {
            if (d.source.y > d.target.y) {
                if (d.target.x >= d.source.x) {
                    return 'M' + d.tx + ',' + d.ty +
                        'L' + (d.tx + this.ARROW_SIZE) + ',' + (d.ty + this.ARROW_SIZE * 0.5) +
                        'L' + (d.tx + this.ARROW_SIZE) + ',' + (d.ty - this.ARROW_SIZE * 0.5) +
                        'L' + d.tx + ',' + d.ty;
                } else {
                    return 'M' + d.tx + ',' + d.ty +
                        'L' + (d.tx - this.ARROW_SIZE) + ',' + (d.ty + this.ARROW_SIZE * 0.5) +
                        'L' + (d.tx - this.ARROW_SIZE) + ',' + (d.ty - this.ARROW_SIZE * 0.5) +
                        'L' + d.tx + ',' + d.ty;
                }
            } else {
                return 'M' + d.tx + ',' + d.ty +
                    'L' + (d.tx + this.ARROW_SIZE * 0.5) + ',' + (d.ty - this.ARROW_SIZE) +
                    'L' + (d.tx - this.ARROW_SIZE * 0.5) + ',' + (d.ty - this.ARROW_SIZE) +
                    'L' + d.tx + ',' + d.ty;
            }
        };

        Drawer.prototype.drawSteps = function() {
            this.steps = this.steps
                .selectAll('g')
                .data(this.data.steps)
                .enter()
                .append('svg:g')
                .attr(
                    'id',
                    function(d) {
                        return 'group_' + d.step.getKey();
                    }
                );

            this.steps.append('svg:rect')
                .attr('x', function(d) {
                    return -(d.step.getSize().width / 2);
                })
                .attr('y', function(d) {
                    return -(d.step.getSize().height / 2);
                })
                .attr('width', function(d) {
                    return d.step.getSize().width;
                })
                .attr('height', function(d) {
                    return d.step.getSize().height;
                })
                .attr('rx', 5)
                .attr('ry', 5)
                .style('stroke-width', 2)
                .style('fill', d3.rgb(255, 255, 255))
                .style('stroke', this.STROKE_COLOR)
                .call(this.dragListener);

            var txt = this.steps.append('svg:text')
                .attr('font-family', 'Arial')
                .attr('text-anchor', 'middle');

            txt.append('svg:tspan')
                .attr('x', 0)
                .attr('dy', '-0.5em')
                .attr('font-size', '20px')
                .attr('font-weight', 'bold')
                .text(function(d) {
                    return d.step.getKey();
                });

            txt.append('svg:tspan')
                .attr('x', 0)
                .attr('dy', '2em')
                .attr('font-size', '17px')
                .text(function(d) {
                    return '<' + d.step.getType() + '>';
                });

            this.translateSteps();
        };

        Drawer.prototype.translateSteps = function() {
            this.steps.attr(
                'transform',
                function(d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                }
            );
        };

        Drawer.prototype.refreshPaths = function() {
            this.paths.select('.link')
                .attr(
                    'd',
                    (function(d) {
                        return this.setPath(d);
                    }).bind(this)
                    );

            this.paths.select('.arrow')
                .attr(
                    'd',
                    (function(d) {
                        return this.setArrow(d);
                    }).bind(this)
                    );

            this.paths.select('.box')
                .attr('transform', function(d) {
                    return 'translate(' + d.mx + ',' + d.my + ')';
                });
        };

        return Drawer;
    }
);