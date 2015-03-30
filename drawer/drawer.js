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

            this.stage.canvas.width = $(window).width();
            this.stage.canvas.height = $(window).height();

            this.nextOrigin = new createjs.Point(this.stage.canvas.width / 2, this.defaultMinYOrigin);
            this.steps = new Array();
            this.paths = new Array();

            this.setBackground();

        }
        
//Add step to canvas
        Drawer.prototype.addStep = function(key, step)
        {
            var step = new Step(this.nextOrigin, key, new Infos(step));

            //update the position for the next step
            this.nextOrigin.y = this.nextOrigin.y + step.getOuterBounds().height + step.getMargin();

            //Add all step's elements we need to draw on canvas
            for (child in step.getChildren()) {
                this.stage.addChild(step.getChildren()[child]);
            }

            this.stage.update();
            this.steps[step.getName()] = step;
        };

//Add path to canvas
        Drawer.prototype.addPath = function(key, path)
        {
            var path = new Path(key, this.getStep(path.options.source), this.getStep(path.options.destination), new Infos(path));

            //Add all step's elements we need to draw on canvas
            for (child in path.getChildren()) {
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

            var shape = new createjs.Shape(graphics);
            shape.x = 0;
            shape.y = 0;

            this.stage.addChild(shape);
            this.stage.update();
        };

        Drawer.prototype.getStep = function(name)
        {
            if( typeof(this.steps[name]) === 'undefined' ){
                throw Error("Require step " + name + " is undefined.");
            }
            
            return this.steps[name];
        };

        return Drawer;
    }
);