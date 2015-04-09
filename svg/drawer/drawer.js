'use strict';
var changed = false;
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
            'infos',
            'endstep',
            'd3'
        ],
        function ($, Step, Path, Infos, EndStep)
        {
            function Drawer()
            {
                this.svg = d3.select('svg');
                this.svg.style('background-color', d3.rgb(183, 196, 189));
                this.resize();

                this.steps = this.svg
                        .append('svg:g')
                        .attr('id', 'steps');
                this.paths = this.svg
                        .append('svg:g')
                        .attr('id', 'paths');

                this.nextOrigin = {
                    'x': this.svg.attr('width') / 2,
                    'y': 50
                };
                this.infosMaskBox = {
                    'x': this.svg.attr('width') * 0.5 - (this.svg.attr('width') * 0.75) * 0.5,
                    'y': this.svg.attr('height') * 0.5 - (this.svg.attr('height') * 0.75) * 0.5,
                    'width': this.svg.attr('width') * 0.75,
                    'height': this.svg.attr('height') * 0.75
                };
            }

            Drawer.prototype.clear = function () {

            };
            Drawer.prototype.getNeededSize = function () {
                var size = {"width": 0, "height": 0};
//                var bounds;
//                for (var step in this.steps) {
//                    bounds = this.steps[step].getOuterBounds();
//                    if (bounds.x + bounds.width + this.steps[step].getMargin() > size.width) {
//                        size.width = bounds.x + bounds.width + this.steps[step].getMargin();
//                    }
//                    if (bounds.y + bounds.height + this.steps[step].getMargin() > size.height) {
//                        size.height = bounds.y + bounds.height + this.steps[step].getMargin();
//                    }
//                }

                return size;
            };
            Drawer.prototype.resize = function () {
                var size = this.getNeededSize();
                if (size.width > $("#svgBox").width()) {
                    this.svg.attr('width', size.width);
                } else {
                    this.svg.attr('width', $("#svgBox").width());
                }

                if (size.height > $("#svgBox").height()) {
                    this.svg.attr('height', size.height);
                } else {
                    this.svg.attr('height', $("#svgBox").height());
                }

                if (typeof (this.nextOrigin) !== 'undefined') {
                    this.nextOrigin = {
                        'x': this.svg.attr('width') / 2,
                        'y': this.nextOrigin.y
                    };
                }
            };
            Drawer.prototype.tick = function (event) {
            };
//Add step to canvas
            Drawer.prototype.addStep = function (key, step)
            {
                var step = new Step(
                        this.nextOrigin,
                        key,
                        step.type,
                        new Infos(
                                step,
                                this.maskBox
                                )
                        );
                //update the position for the next step
                this.nextOrigin.y = this.nextOrigin.y + step.getOuterBounds().height + step.getMargin();
            };
//Add path to canvas
            Drawer.prototype.addPath = function (key, path)
            {

//                var path = new Path(
//                        key,
//                        d3.select("#" + path.options.source),
//                        d3.select("#" + path.options.destination),
//                        new Infos(
//                                path,
//                                this.maskBox
//                                )
//                        );
//
//                //Add all step's elements we need to draw on canvas
//                this.paths.append(path.getChildren());
            };

            return Drawer;
        }
);