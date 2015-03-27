define(
    [
    ],
    function()
    {
        function Path(name, source, destination, infos)
        {
            this.FONT_SIZE = "10px";
            this.FONT_STYLE = "Arial";
            this.FONT_COLOR = "#000000";

            this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
            this.source = source;
            this.destination = destination;
            this.infos = infos;
            this.drawable = false;

            this.source.addOutPath(this);
            this.destination.addOutPath(this);
        }

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

        Path.prototype.setSartPoint = function(point)
        {
            this.startPoint = point;
            this.setBox();

            if (typeof (this.endPoint) !== 'undefined') {
                this.drawable = true;
            }
        };

        Path.prototype.setEndPoint = function(point)
        {
            this.endPoint = point;

            if (typeof (this.startPoint) !== 'undefined') {
                this.drawable = true;
            }
        };

        Path.prototype.getChildren = function()
        {
            var children = [this.getPathShape(), this.name];
            return children;
        };

        Path.prototype.getPathShape = function()
        {
            if (this.drawable) {
                var graphics = new createjs.Graphics();

                graphics.setStrokeStyle(1);
                graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
                graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255));

                graphics.drawRoundRect(0, 0, this.box.width, this.box.height, this.RADIUS);

                var shape = new createjs.Shape(graphics);
                shape.x = this.box.x;
                shape.y = this.box.y;

                return shape;
            } else {
                throw Error("Path not completed, impossible to draw it.");
            }
        };

        return Path;
    }
);