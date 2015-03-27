define(
    [
        
    ],
    function()
    {
        function Step(origin, name, infos)
        {
            this.FONT_STYLE = "Arial";
            this.FONT_SIZE = "20px";
            this.FONT_COLOR = "#000000";
            this.PADDING = 10;
            this.MARGIN = 50;
            this.RADIUS = 5; //Round rect radius

            this.infos = infos;
            this.inPaths = new Array();
            this.outPaths = new Array();
            this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);

            this.setBox(origin);
        }

        Step.prototype.setBox = function(origin)
        {
            this.box = new createjs.Rectangle(
                origin.x - this.getInnerBounds().width / 2 - this.PADDING,
                origin.y,
                this.getInnerBounds().width + this.PADDING * 2,
                this.getInnerBounds().height + this.PADDING * 2
                );

            this.name.x = this.box.x + this.PADDING;
            this.name.y = this.box.y + this.PADDING;
        };

//Return all elements should be drawed
        Step.prototype.getChildren = function()
        {
            var children = [this.getBoxShape(), this.name];
            return children;
        };

//Return the box rectangle
        Step.prototype.getOuterBounds = function()
        {
            return this.box;
        };

//Return the content bounds (without box)
        Step.prototype.getInnerBounds = function()
        {
            return this.name.getBounds();
        };

//Return the box margin
        Step.prototype.getMargin = function()
        {
            return this.MARGIN;
        };

//Return the box shape to draw it
        Step.prototype.getBoxShape = function()
        {
            var graphics = new createjs.Graphics();

            graphics.setStrokeStyle(1);
            graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
            graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255));

            graphics.drawRoundRect(0, 0, this.box.width, this.box.height, this.RADIUS);

            var shape = new createjs.Shape(graphics);
            shape.x = this.box.x;
            shape.y = this.box.y;

            return shape;
        };

//add path (somewhere to this)
        Step.prototype.addInPath = function(path)
        {
            this.inPaths.push(path);
            this.refreshInPathsEndPoint();
        };

//refresh inPaths endPoint
        Step.prototype.refreshInPathsEndPoint = function()
        {
            var point = new createjs.Point(
                this.getOuterBounds().x + this.getOuterBounds().width / (this.inPaths.length + 1),
                this.getOuterBounds().y
                );

            for (path in this.inPaths) {
                path.setEndPoint(point);
                point.x = point.x + this.getOuterBounds().width / (this.inPaths.length + 1);
            }
        };

//add path (this to somewhere)
        Step.prototype.addOutPath = function(path)
        {
            this.outPaths.push(path);
            this.refreshOutPathsStartPoint();
        };

//refresh inPaths endPoint
        Step.prototype.refreshOutPathsStartPoint = function()
        {
            var point = new createjs.Point(
                this.getOuterBounds().x + this.getOuterBounds().width / (this.outPaths.length + 1),
                this.getOuterBounds().y
                );

            for (path in this.inPaths) {
                path.setEndPoint(point);
                point.x = point.x + this.getOuterBounds().width / (this.inPaths.length + 1);
            }
        };
        
        return Step;
    }
);
