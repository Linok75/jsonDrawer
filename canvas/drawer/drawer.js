'use strict';

var changed = false;

requirejs.config(
        {
            paths: {
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
            'endstep'
        ],
        function ($, Step, Path, Infos, EndStep)
        {
            function Drawer(stage)
            {
                this.defaultMinYOrigin = 50;
                this.stage = stage;
                
                this.background = new createjs.Shape();

                this.stage.enableMouseOver(10);
                this.stage.mouseMoveOutside = true;

                this.resize();

                this.nextOrigin = new createjs.Point(this.stage.canvas.width / 2, this.defaultMinYOrigin);
                this.steps = new Array();
                this.paths = new Array();

                var self = this;
                createjs.Ticker.addEventListener("tick", function (event) {
                    self.tick(event);
                });
            }

            Drawer.prototype.clear = function () {
                this.stage.removeAllChildren();
                this.steps = new Array();
                this.paths = new Array();
                this.resize();
                this.nextOrigin = new createjs.Point(this.stage.canvas.width / 2, this.defaultMinYOrigin);

                infosVisible = false;

                this.setBackground();
            };

            Drawer.prototype.getNeededSize = function () {
                var size = {"width": 0, "height": 0};
                var bounds;
                for (var step in this.steps) {
                    bounds = this.steps[step].getOuterBounds();
                    if (bounds.x + bounds.width + this.steps[step].getMargin() > size.width) {
                        size.width = bounds.x + bounds.width + this.steps[step].getMargin();
                    }
                    if (bounds.y + bounds.height + this.steps[step].getMargin() > size.height) {
                        size.height = bounds.y + bounds.height + this.steps[step].getMargin();
                    }
                }

                return size;
            };

            Drawer.prototype.resize = function () {
                var size = this.getNeededSize();

                if (size.width > $("#canvasViewer").width()) {
                    this.stage.canvas.width = size.width;
                } else {
                    this.stage.canvas.width = $("#canvasViewer").width();
                }

                if (size.height > $("#canvasViewer").height()) {
                    this.stage.canvas.height = size.height;
                } else {
                    this.stage.canvas.height = $("#canvasViewer").height();
                }

                this.stage.removeChild(this.background);
                this.setBackground();
            };

            Drawer.prototype.tick = function (event) {
                // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
                if (changed) {
                    changed = false; // only update once
                    this.resize();
                    this.stage.update(event);
                }
            };

//Add step to canvas
            Drawer.prototype.addStep = function (key, step)
            {
                var maskBox = new createjs.Rectangle(
                        this.stage.canvas.width * 0.5 - (this.stage.canvas.width * 0.75) * 0.5,
                        this.stage.canvas.height * 0.5 - (this.stage.canvas.height * 0.75) * 0.5,
                        this.stage.canvas.width * 0.75,
                        this.stage.canvas.height * 0.75
                        );
                var step = new Step(
                        this.nextOrigin,
                        key,
                        step.type,
                        new Infos(
                                step,
                                maskBox
                                )
                        );

                //update the position for the next step
                this.nextOrigin.y = this.nextOrigin.y + step.getOuterBounds().height + step.getMargin();

                //Add all step's elements we need to draw on canvas
                    this.stage.addChild(step.getChildren());

                changed = true;
                this.steps[step.getName()] = step;
            };

//Add path to canvas
            Drawer.prototype.addPath = function (key, path)
            {
                var maskBox = new createjs.Rectangle(
                        this.stage.canvas.width * 0.5 - (this.stage.canvas.width * 0.75) * 0.5,
                        this.stage.canvas.height * 0.5 - (this.stage.canvas.height * 0.75) * 0.5,
                        this.stage.canvas.width * 0.75,
                        this.stage.canvas.height * 0.75
                        );

                var path = new Path(
                        key,
                        this.getStep(path.options.source),
                        this.getStep(path.options.destination),
                        new Infos(
                                path,
                                maskBox
                                )
                        );

                //Add all step's elements we need to draw on canvas
                for (var child in path.getChildren()) {
                    this.stage.addChild(path.getChildren()[child]);
                }

                changed = true;
                this.paths[path.getName()] = path;
            };

//Set canvas background
            Drawer.prototype.setBackground = function ()
            {
                var graphics = new createjs.Graphics();

                graphics.beginFill(createjs.Graphics.getRGB(183, 196, 189));
                graphics.drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);

                this.background.graphics = graphics;
                this.background.x = 0;
                this.background.y = 0;

                this.stage.addChildAt(this.background, 0);
                changed = true;
            };

            Drawer.prototype.getStep = function (name)
            {
                if (typeof (this.steps[name]) === 'undefined') {
                    var endStep = new EndStep(this.nextOrigin);

                    //update the position for the next step
                    this.nextOrigin.y = this.nextOrigin.y + endStep.getOuterBounds().height + endStep.getMargin();

                    //Add all step's elements we need to draw on canvas
                    for (var child in endStep.getChildren()) {
                        this.stage.addChild(endStep.getChildren()[child]);
                    }

                    this.steps.push(endStep);

                    return endStep;
                }

                return this.steps[name];
            };

            return Drawer;
        }
);