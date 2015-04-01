'use strict';

var infosVisible = false;

define(
    [
    ],
    function()
    {
        function Step(origin, name, type, infos)
        {
            this.STROKE_STYLE = 2;
            this.STROKE_COLOR = createjs.Graphics.getRGB(4, 97, 201);
            this.FILL_COLOR = createjs.Graphics.getRGB(255, 255, 255);
            this.FONT_STYLE = "Arial";
            this.FONT_SIZE = "20px";
            this.FONT_COLOR = "#000000";
            this.PADDING = 10;
            this.MARGIN = 80;
            this.RADIUS = 5; //Round rect radius
            this.INFOS_BUTTON_SCALE = 0.035;

            this.infos = infos;
            this.inPaths = new Array();
            this.outPaths = new Array();
            this.shape = new createjs.Shape();
            this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
            this.type = new createjs.Text("<" + type + ">", this.FONT_SIZE * 0.75 + " " + this.FONT_STYLE, this.FONT_COLOR);
            this.infosButton = new createjs.Bitmap();
            this.setBox(origin);
            this.initInfosButton();
            this.addEventListener();
        }

        Step.prototype.setBox = function(origin)
        {
            this.box = new createjs.Rectangle(
                origin.x - this.getInnerBounds().width / 2 - this.PADDING,
                origin.y,
                this.getInnerBounds().width + this.PADDING * 2,
                this.getInnerBounds().height + this.PADDING * 2
                );
            this.name.x = origin.x - this.name.getBounds().width / 2;
            this.name.y = this.box.y + this.PADDING;

            this.type.x = origin.x - this.type.getBounds().width / 2;
            this.type.y = this.name.y + this.name.getBounds().height + this.PADDING;
            this.initBoxShape();
        };
        Step.prototype.getName = function()
        {
            return this.name.text;
        };
//Return all elements should be drawed
        Step.prototype.getChildren = function()
        {
            this.initBoxShape();
            var children = [this.shape, this.name, this.type, this.infosButton];
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
            var bounds;
            var width;

            if (this.name.getBounds().width > this.type.getBounds().width) {
                width = this.name.getBounds().width;
            } else {
                width = this.type.getBounds().width;
            }

            if (typeof (this.box) === "undefined") {
                bounds = new createjs.Rectangle(0, 0, width, this.name.getBounds().height + this.type.getBounds().height + this.PADDING);
            } else {
                bounds = new createjs.Rectangle(this.box.x + this.PADDING, this.box.y + this.PADDING, width, this.name.getBounds().height + this.type.getBounds().height + this.PADDING);
            }
            return bounds;
        };
//Return the box margin
        Step.prototype.getMargin = function()
        {
            return this.MARGIN;
        };
//Return the box shape to draw it
        Step.prototype.initBoxShape = function()
        {
            var graphics = new createjs.Graphics();
            graphics.setStrokeStyle(this.STROKE_STYLE);
            graphics.beginStroke(this.STROKE_COLOR);
            graphics.beginFill(this.FILL_COLOR);
            graphics.drawRoundRect(0, 0, this.box.width, this.box.height, this.RADIUS);
            this.shape.graphics = graphics;
            this.shape.x = this.box.x;
            this.shape.y = this.box.y;
        };
        Step.prototype.addEventListener = function()
        {
            var self = this;
            this.shape.on("pressmove", function(e)
            {
                self.setBox(new createjs.Point(e.stageX, e.stageY));
                self.refreshOutPathsStartPoint();
                self.refreshInPathsEndPoint();
                self.refreshInfosButton();
                changed = true;
            }).bind(self);
            this.shape.on("mouseover", function(e)
            {
                if (!infosVisible) {
                    self.refreshInfosButton();
                    changed = true;
                }
            }).bind(self);
            this.shape.on("mouseout", function(e)
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
                infosVisible = true;
                changed = true;
            }).bind(self);
        };

        Step.prototype.initInfosButton = function()
        {
            var self = this;
            var img = new Image();
            img.src = "images/info_icon.svg";

            img.onload = (function() {
                self.infosButton.image = img;
                self.infosButton.scaleX = self.INFOS_BUTTON_SCALE;
                self.infosButton.scaleY = self.INFOS_BUTTON_SCALE;
                var oldBounds = self.infosButton.getBounds();
                self.infosButton.setBounds(
                    oldBounds.x,
                    oldBounds.y,
                    oldBounds.width * this.INFOS_BUTTON_SCALE,
                    oldBounds.height * this.INFOS_BUTTON_SCALE
                    );
                self.infosButton.visible = false;
            }).bind(self);
        };

        Step.prototype.refreshInfosButton = function()
        {
            var oldBounds = this.infosButton.getBounds();
            this.infosButton.x = this.box.x + 2;
            this.infosButton.y = this.box.y + 2;
            this.infosButton.setBounds(
                this.infosButton.x,
                this.infosButton.y,
                oldBounds.width,
                oldBounds.height
                );
            this.infosButton.visible = true;
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
                this.getOuterBounds().y - this.STROKE_STYLE
                )
                ;
            for (var path in this.inPaths) {
                this.inPaths[path].setEndPoint(point);
                point = new createjs.Point(point.x + this.getOuterBounds().width / (this.inPaths.length + 1),
                    point.y
                    );
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
                this.getOuterBounds().y + this.getOuterBounds().height
                );
            for (var path in this.outPaths) {
                this.outPaths[path].setMaxWidth(this.getOuterBounds().width / (this.outPaths.length + 1));
                this.outPaths[path].setStartPoint(point);
                point = new createjs.Point(point.x + this.getOuterBounds().width / (this.outPaths.length + 1),
                    point.y
                    );
            }
        };
        return Step;
    }
);
