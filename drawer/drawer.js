'use strict';

var changed = false;

requirejs.config(
    {
        paths: {
            'step': 'drawer/step',
            'path': 'drawer/path',
            'infos': 'drawer/infos'
        }
    }
);

define(
    [
        'jquery-private',
        'step',
        'path',
        'infos'
    ],
    function($, Step, Path, Infos)
    {
        function Drawer(stage)
        {
            this.defaultMinYOrigin = 50;
            this.stage = stage;
            this.background = new createjs.Shape();
            this.resize();

            this.stage.enableMouseOver(10);
            this.stage.mouseMoveOutside = true;

            this.nextOrigin = new createjs.Point(this.stage.canvas.width / 2, this.defaultMinYOrigin);
            this.steps = new Array();
            this.paths = new Array();

            var self = this;
            $(window).resize(function() {
                self.resize();
            });

            createjs.Ticker.addEventListener("tick", function(event) {
                self.tick(event);
            });
        }

        Drawer.prototype.resize = function() {
            this.stage.canvas.width = $(window).width();
            this.stage.canvas.height = $(window).height();
            this.stage.removeChild(this.background);
            this.setBackground();
        };

        Drawer.prototype.tick = function(event) {
            // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
            if (changed) {
                changed = false; // only update once
                this.stage.update(event);
            }
        };

//Add step to canvas
        Drawer.prototype.addStep = function(key, step)
        {
            var step = new Step(
                this.nextOrigin,
                key,
                new Infos(
                    step,
                    new createjs.Point(
                        this.stage.canvas.width / 2,
                        this.stage.canvas.height / 2
                        )
                    )
                );

            //update the position for the next step
            this.nextOrigin.y = this.nextOrigin.y + step.getOuterBounds().height + step.getMargin();

            //Add all step's elements we need to draw on canvas
            for (var child in step.getChildren()) {
                this.stage.addChild(step.getChildren()[child]);
            }

            this.stage.update();
            this.steps[step.getName()] = step;
        };

//Add path to canvas
        Drawer.prototype.addPath = function(key, path)
        {
            var path = new Path(
                key,
                this.getStep(path.options.source),
                this.getStep(path.options.destination),
                new Infos(
                    path,
                    new createjs.Point(
                        this.stage.canvas.width / 2,
                        this.stage.canvas.height / 2
                        )
                    )
                );
            
            //Add all step's elements we need to draw on canvas
            for (var child in path.getChildren()) {
                this.stage.addChild(path.getChildren()[child]);
            }

            this.stage.update();
            this.paths[path.getName()] = path;
        };

//Set canvas background
        Drawer.prototype.setBackground = function()
        {
            var graphics = new createjs.Graphics();

            graphics.beginFill(createjs.Graphics.getRGB(183, 196, 189));
            graphics.drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);

            this.background.graphics = graphics;
            this.background.x = 0;
            this.background.y = 0;

            this.stage.addChildAt(this.background, 0);
            this.stage.update();
        };

        Drawer.prototype.getStep = function(name)
        {
            if (typeof (this.steps[name]) === 'undefined') {
                throw Error("Require step " + name + " is undefined.");
            }

            return this.steps[name];
        };

        return Drawer;
    }
);