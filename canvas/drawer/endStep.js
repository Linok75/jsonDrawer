'use strict';

var infosVisible = false;

define(
    [
    ],
    function()
    {
        function EndStep(origin)
        {
            this.STROKE_STYLE = 2;
            this.STROKE_COLOR = createjs.Graphics.getRGB(4, 97, 201);
            this.FILL_COLOR = createjs.Graphics.getRGB(5, 9, 255);
            this.MARGIN = 80;
            this.SIZE = 20;

            this.inPaths = new Array();
            this.shape = new createjs.Shape();
            
            this.setBox(origin);
            this.addEventListener();
        }

        EndStep.prototype.setBox = function(origin)
        {
            this.box = new createjs.Rectangle(
                origin.x - this.SIZE / 2,
                origin.y,
                this.SIZE,
                this.SIZE
                );
            this.initBoxShape();
        };
//Return all elements should be drawed
        EndStep.prototype.getChildren = function()
        {
            this.initBoxShape();
            var children = [this.shape];
            return children;
        };
//Return the box rectangle
        EndStep.prototype.getOuterBounds = function()
        {
            return this.box;
        };
//Return the content bounds (without box)
        EndStep.prototype.getInnerBounds = function()
        {
            return this.SIZE;
        };
//Return the box margin
        EndStep.prototype.getMargin = function()
        {
            return this.MARGIN;
        };
//Return the box shape to draw it
        EndStep.prototype.initBoxShape = function()
        {
            var graphics = new createjs.Graphics();
            graphics.setStrokeStyle(this.STROKE_STYLE);
            graphics.beginStroke(this.STROKE_COLOR);
            graphics.beginFill(this.FILL_COLOR);
            graphics.drawCircle(this.SIZE/2, this.SIZE/2, this.SIZE/2);
            this.shape.graphics = graphics;
            this.shape.x = this.box.x;
            this.shape.y = this.box.y;
        };
        EndStep.prototype.addEventListener = function()
        {
            var self = this;
            this.shape.on("pressmove", function(e)
            {
                self.setBox(new createjs.Point(e.stageX, e.stageY));
                self.refreshInPathsEndPoint();
                changed = true;
            }).bind(self);
        };
//add path (somewhere to this)
        EndStep.prototype.addInPath = function(path)
        {
            this.inPaths.push(path);
            this.refreshInPathsEndPoint();
        };
//refresh inPaths endPoint
        EndStep.prototype.refreshInPathsEndPoint = function()
        {
            var point = new createjs.Point(
                this.getOuterBounds().x + this.getOuterBounds().width / (this.inPaths.length + 1),
                this.getOuterBounds().y-this.STROKE_STYLE
                )
                ;
            for (var path in this.inPaths) {
                this.inPaths[path].setEndPoint(point);
                point = new createjs.Point(point.x + this.getOuterBounds().width / (this.inPaths.length + 1),
                    point.y
                    );
            }
        };
        return EndStep;
    }
);
