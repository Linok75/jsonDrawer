define(
    [
    ],
    function()
    {
        function Path(name, source, destination, infos)
        {
            this.STROKE_STYLE = 2;
            this.FONT_SIZE = "10px";
            this.FONT_STYLE = "Arial";
            this.FONT_COLOR = "#000000";
            this.PADDING = 5;
            this.ARROW_SIZE = 10;

            this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
            this.shape = new createjs.Shape();
            this.source = source;
            this.destination = destination;
            this.infos = infos;
            this.drawable = false;

            this.source.addOutPath(this);
            this.destination.addInPath(this);
        }

        Path.prototype.setMaxWidth = function(maxWidth)
        {
            this.name.lineWidth = maxWidth - this.PADDING * 2;
            this.name.maxWidth = this.name.lineWidth;
        };

        Path.prototype.setBox = function()
        {
            this.box = new createjs.Rectangle(
                this.startPoint.x - this.getInnerBounds().width / 2 - this.PADDING,
                this.startPoint.y,
                this.getInnerBounds().width + this.PADDING * 2,
                this.getInnerBounds().height + this.PADDING * 2
                );

            this.name.x = this.box.x + this.PADDING;
            this.name.y = this.box.y + this.PADDING;
        };

        //Return the box rectangle
        Path.prototype.getOuterBounds = function()
        {
            return this.box;
        };

//Return the content bounds (without box)
        Path.prototype.getInnerBounds = function()
        {
            return this.name.getBounds();
        };

        Path.prototype.setStartPoint = function(point)
        {
            this.startPoint = point;
            this.setBox();

            if (typeof (this.endPoint) !== 'undefined') {
                this.drawable = true;
                this.initPathShape();
            }
        };

        Path.prototype.setEndPoint = function(point)
        {
            this.endPoint = point;
            if (typeof (this.startPoint) !== 'undefined') {
                this.drawable = true;
                this.initPathShape();
            }
        };

        Path.prototype.getName = function()
        {
            return this.name.text;
        };

        Path.prototype.getChildren = function()
        {
            var children = [this.shape, this.name];

            return children;
        };

        Path.prototype.initPathShape = function()
        {

            if (this.drawable) {
                var graphics = new createjs.Graphics();

                graphics.setStrokeStyle(this.STROKE_STYLE);
                graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
                graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255));

                //Name block
                graphics.moveTo(this.box.x, this.box.y);
                graphics.lineTo(this.box.x, this.box.y + this.box.height);
                graphics.lineTo(this.box.x + this.box.width / 2, this.box.y + this.box.height + this.PADDING * 2);
                graphics.lineTo(this.box.x + this.box.width, this.box.y + this.box.height);
                graphics.lineTo(this.box.x + this.box.width, this.box.y);
                graphics.lineTo(this.box.x, this.box.y);

                graphics.endFill();

                //Ligne
                graphics.moveTo(this.box.x + this.box.width / 2, this.box.y + this.box.height + this.PADDING * 2);
                if (this.box.y + this.box.height < this.destination.getOuterBounds().y) {
                    graphics.lineTo(this.box.x + this.box.width / 2, this.box.y + this.box.height + Math.abs((this.endPoint.y - this.startPoint.y) / 2));
                    graphics.lineTo(this.endPoint.x, this.box.y + this.box.height + Math.abs((this.endPoint.y - this.startPoint.y) / 2));
                } else {
                    graphics.lineTo(this.destination.getOuterBounds().x+this.destination.getOuterBounds().width, this.box.y + this.box.height + this.PADDING * 2);
                    graphics.lineTo(this.destination.getOuterBounds().x+this.destination.getOuterBounds().width + this.PADDING, this.destination.getOuterBounds().y -this.ARROW_SIZE - this.PADDING);
                    graphics.lineTo(this.endPoint.x, this.destination.getOuterBounds().y -this.ARROW_SIZE - this.PADDING);
                }
                graphics.lineTo(this.endPoint.x, this.endPoint.y);

                //Arrow
                graphics.beginFill(createjs.Graphics.getRGB(0, 0, 0));
                graphics.lineTo(this.endPoint.x - this.ARROW_SIZE / 2, this.endPoint.y - this.ARROW_SIZE);
                graphics.lineTo(this.endPoint.x + this.ARROW_SIZE / 2, this.endPoint.y - this.ARROW_SIZE);
                graphics.lineTo(this.endPoint.x, this.endPoint.y);

                this.shape.graphics = graphics;
                this.shape.x = 0;
                this.shape.y = 0;

            } else {
                throw Error("Path not completed, impossible to draw it.");
            }
        };

        return Path;
    }
);