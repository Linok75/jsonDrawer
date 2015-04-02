'use strict';
define(
    [
    ],
    function()
    {
        function Path(name, source, destination, infos)
        {
            this.STROKE_STYLE = 2;
            this.STROKE_COLOR = createjs.Graphics.getRGB(4, 97, 201);
            this.FILL_COLOR = createjs.Graphics.getRGB(255, 255, 255);
            this.FONT_SIZE = "10px";
            this.FONT_STYLE = "Arial";
            this.FONT_COLOR = "#000000";
            this.PADDING = 5;
            this.ARROW_SIZE = 10;
            this.INFOS_BUTTON_SCALE = 0.035;

            this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
            this.arrowShape = new createjs.Shape();
            this.boxShape = new createjs.Shape();
            this.source = source;
            this.destination = destination;
            this.infos = infos;
            this.drawable = false;
            this.infosButton = new createjs.Bitmap();

            this.source.addOutPath(this);
            this.destination.addInPath(this);
            this.initInfosButton();
            this.addEventListener();
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
            var children = [this.boxShape, this.arrowShape, this.name];

            return children;
        };

        Path.prototype.addEventListener = function()
        {
            var self = this;

            this.boxShape.on("mouseover", function(e)
            {
                if (!infosVisible) {
                    self.refreshInfosButton();
                    changed = true;
                }
            }).bind(self);

            this.boxShape.on("mouseout", function(e)
            {
                if (!self.infosButton.getBounds().contains(e.stageX, e.stageY)) {
                    self.infosButton.visible = false;
                    changed = true;
                }
            }).bind(self);

            this.infosButton.on("click", function(e) {
                for (var child in self.infos.getChildren()) {
                    e.target.stage.addChild(self.infos.getChildren()[child]);
                }
                self.infosButton.visible = false;
                changed = true;
                infosVisible = true;
            }).bind(self);
        };

        Path.prototype.initInfosButton = function()
        {
            var self = this;
            var img = new Image();
            img.src = "images/info_icon.svg";

            img.onload = (function() {
                this.infosButton.image = img;
                this.infosButton.scaleX = this.INFOS_BUTTON_SCALE;
                this.infosButton.scaleY = this.INFOS_BUTTON_SCALE;

                var oldBounds = this.infosButton.getBounds();
                this.infosButton.setBounds(
                    oldBounds.x,
                    oldBounds.y,
                    oldBounds.width * this.INFOS_BUTTON_SCALE,
                    oldBounds.height * this.INFOS_BUTTON_SCALE
                    );
            }).bind(self);
        };

        Path.prototype.refreshInfosButton = function()
        {
            var oldBounds = this.infosButton.getBounds();

            this.infosButton.x = this.startPoint.x - this.infosButton.getBounds().width / 2;
            this.infosButton.y = this.startPoint.y + this.box.height - this.PADDING - this.infosButton.getBounds().height / 2;

            this.infosButton.setBounds(
                this.infosButton.x,
                this.infosButton.y,
                oldBounds.width,
                oldBounds.height
                );

            this.infosButton.visible = true;
        };

        Path.prototype.initPathShape = function()
        {

            if (this.drawable) {
                var graphics = new createjs.Graphics();

                graphics.setStrokeStyle(this.STROKE_STYLE);
                graphics.beginStroke(this.STROKE_COLOR);
                graphics.beginFill(this.FILL_COLOR);

                //Name block
                graphics.moveTo(0, 0);
                graphics.lineTo(0, this.box.height);
                graphics.lineTo(this.box.width / 2, this.box.height + this.PADDING * 2);
                graphics.lineTo(this.box.width, this.box.height);
                graphics.lineTo(this.box.width, 0);
                graphics.lineTo(0, 0);

                this.boxShape.graphics = graphics;
                this.boxShape.x = this.box.x;
                this.boxShape.y = this.box.y;


                graphics = new createjs.Graphics();

                graphics.setStrokeStyle(this.STROKE_STYLE);
                graphics.beginStroke(this.STROKE_COLOR);

                //Ligne
                graphics.moveTo(this.box.x + this.box.width / 2, this.box.y + this.box.height + this.PADDING * 2);
                if (this.box.y + this.box.height < this.destination.getOuterBounds().y) {
                    graphics.lineTo(this.box.x + this.box.width / 2, this.box.y + this.box.height + Math.abs((this.endPoint.y - this.startPoint.y) / 2));
                    graphics.lineTo(this.endPoint.x, this.box.y + this.box.height + Math.abs((this.endPoint.y - this.startPoint.y) / 2));
                } else {
                    graphics.lineTo(this.destination.getOuterBounds().x + this.destination.getOuterBounds().width + this.PADDING, this.box.y + this.box.height + this.PADDING * 2);
                    graphics.lineTo(this.destination.getOuterBounds().x + this.destination.getOuterBounds().width + this.PADDING, this.destination.getOuterBounds().y - this.ARROW_SIZE - this.PADDING);
                    graphics.lineTo(this.endPoint.x, this.destination.getOuterBounds().y - this.ARROW_SIZE - this.PADDING);
                }
                graphics.lineTo(this.endPoint.x, this.endPoint.y);

                //Arrow
                graphics.beginFill(this.STROKE_COLOR);

                graphics.lineTo(this.endPoint.x - this.ARROW_SIZE / 2, this.endPoint.y - this.ARROW_SIZE);
                graphics.lineTo(this.endPoint.x + this.ARROW_SIZE / 2, this.endPoint.y - this.ARROW_SIZE);
                graphics.lineTo(this.endPoint.x, this.endPoint.y);
                graphics.lineTo(this.endPoint.x - this.ARROW_SIZE / 2, this.endPoint.y - this.ARROW_SIZE);

                this.arrowShape.graphics = graphics;
                this.arrowShape.x = 0;
                this.arrowShape.y = 0;

            } else {
                throw Error("Path not completed, impossible to draw it.");
            }
        };

        return Path;
    }
);