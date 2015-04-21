'use strict';

requirejs.config(
    {
        paths: {
            'd3': 'lib/d3.min',
            'step': 'drawer/step',
            'path': 'drawer/path',
            'infos': 'drawer/infos',
            'endstep': 'drawer/endStep',
            'modal': 'drawer/modal'
        }
    }
);
define(
    [
        'jquery-private',
        'step',
        'path',
        'modal',
        'd3'
    ],
    function($, Step, Path, Modal)
    {
        function Drawer()
        {
            this.DEFAULT_STEP_DISTANCE = 50;
            this.DEFAULT_SIZE = 800;
            this.STROKE_COLOR = d3.rgb(4, 97, 201);
            this.ARROW_SIZE = 10;
            this.MARGIN = 100;

            this.maxInfosSize = {
                'width': this.DEFAULT_SIZE * 0.75,
                'height': this.DEFAULT_SIZE * 0.75
            };

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

            this.modal = new Modal();

            this.data = {};

            this.dragListener = d3.behavior.drag()
                .on("dragstart", function() {
                    d3.event.sourceEvent.stopPropagation();
                })
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

            throw new Error('You try to link a step to a non created step !');
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
                    'outputLock': 0,
                    'inputLock': 0,
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

            this.draw();
        };
        Drawer.prototype.draw = function() {
            this.nextPosition.y = 25;
            this.svg.selectAll('g').remove();

            this.drawPaths();
            this.drawSteps();
        };
        Drawer.prototype.drawPaths = function() {
            this.paths = this.svg
                .append('svg:g')
                .attr('id', 'paths');

            this.paths = this.paths
                .selectAll('g')
                .data(this.data.paths)
                .enter()
                .append('svg:g')
                .attr(
                    'id',
                    function(d) {
                        return 'group_' + d.path.getKey().replace(' ', '_') + '_' + d.source.step.getKey() + '_' + d.target.step.getKey();
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
                .on(
                    'mouseover',
                    (function(d) {
                        this.svg.select('#group_' + d.path.getKey().replace(' ', '_') + '_' + d.source.step.getKey() + '_' + d.target.step.getKey())
                            .select('image')
                            .style('opacity', 1);
                    }).bind(this)
                    )
                .on(
                    'mouseout',
                    (function(d) {
                        this.svg.select('#group_' + d.path.getKey().replace(' ', '_') + '_' + d.source.step.getKey() + '_' + d.target.step.getKey())
                            .select('image')
                            .style('opacity', 0);
                    }).bind(this)
                    );

            this.paths.select('.box')
                .append('svg:image')
                .attr('x', -12.5)
                .attr('y', -12.5)
                .attr('width', 25)
                .attr('height', 25)
                .attr('xlink:href', 'images/info_icon.svg')
                .style('opacity', 0)
                .on(
                    'click',
                    (function(d) {
                        this.displayPathInfos(d);
                    }).bind(this)
                    );

            this.refreshPaths();
        };

        Drawer.prototype.displayPathInfos = function(d) {
            this.modal.append(d.path.getInfosDOM());
        };

        Drawer.prototype.setPath = function(d) {
            d.source.outputLock++;
            d.target.inputLock++;

            d.sx = d.source.x - d.source.step.getSize().width * 0.5 + (d.source.step.getSize().width / (d.source.output + 1)) * d.source.outputLock;
            d.sy = d.source.y + d.source.step.getSize().height * 0.5;
            d.msy = d.sy + 25;

            d.tx = d.target.x - d.target.step.getSize().width * 0.5 + (d.target.step.getSize().width / (d.target.input + 1)) * d.target.inputLock;
            d.ty = d.target.y - (d.target.step.getSize().height * 0.5 + this.ARROW_SIZE);
            d.mty = d.ty - 25;

            d.mx = d.sx + (d.target.x - d.source.x) * 0.5;

            if (d.ty < d.sy) {
                if (d.tx > d.sx) {
                    d.mx = d.tx + (d.target.step.getSize().width * 0.5 + 25);
                } else {
                    d.mx = d.tx - (d.target.step.getSize().width * 0.5 + 25);
                }
            }

            return 'M' + d.sx + ',' + d.sy +
                'L' + d.sx + ',' + d.msy +
                'L' + d.mx + ',' + d.msy +
                'L' + d.mx + ',' + d.mty +
                'L' + d.tx + ',' + d.mty +
                'L' + d.tx + ',' + d.ty;
        };

        Drawer.prototype.setArrow = function(d) {
            d.source.outputLock = 0;
            d.target.inputLock = 0;

            return 'M' + d.tx + ',' + (d.ty + this.ARROW_SIZE) +
                'L' + (d.tx + this.ARROW_SIZE * 0.5) + ',' + d.ty +
                'L' + (d.tx - this.ARROW_SIZE * 0.5) + ',' + d.ty +
                'L' + d.tx + ',' + (d.ty + this.ARROW_SIZE);
        };

        Drawer.prototype.drawSteps = function() {
            this.steps = this.svg
                .append('svg:g')
                .attr('id', 'steps');


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
                )
                .on(
                    'mouseover',
                    (function(d) {
                        this.svg.select('#group_' + d.step.getKey())
                            .select('image')
                            .style('opacity', 1);
                    }).bind(this)
                    )
                .on(
                    'mouseout',
                    (function(d) {
                        this.svg.select('#group_' + d.step.getKey())
                            .select('image')
                            .style('opacity', 0);
                    }).bind(this)
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

            this.steps
                .append('svg:image')
                .attr('x', function(d) {
                    return -(d.step.getSize().width / 2) + 5;
                })
                .attr('y', function(d) {
                    return -(d.step.getSize().height / 2) + 5;
                })
                .attr('width', 25)
                .attr('height', 25)
                .attr('xlink:href', 'images/info_icon.svg')
                .style('opacity', 0)
                .on(
                    'click',
                    (function(d) {
                        this.displayStepInfos(d);
                    }).bind(this)
                    );

            this.translateSteps();
        };

        Drawer.prototype.displayStepInfos = function(d) {
            this.modal.append(d.step.getInfosDOM());
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
                    return 'translate(' + d.mx + ',' + (d.msy + (d.mty - d.msy) * 0.5) + ')';
                });
        };
        return Drawer;
    }
);