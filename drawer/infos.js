'use strict';
define(
    [
    ],
    function()
    {
        function Infos(obj, maskBox)
        {
            this.STROKE_STYLE = 2;
            this.STROKE_COLOR = createjs.Graphics.getRGB(4, 97, 201);
            this.FILL_COLOR = createjs.Graphics.getRGB(255, 255, 255);
            this.FONT_SIZE = "12px";
            this.FONT_STYLE = "Arial";
            this.FONT_COLOR = "#000000";
            this.PADDING = 10;
            this.RADIUS = 5; //Round rect radius
            this.CLOSER_SCALE = 0.04;
            this.BUTTON_ALPHA = 0.5;
            this.OVER_BUTTON_ALPHA = 0.8;
            this.SCROLL_SPEED = 10;

            this.xScrollSpeed = 0;
            this.yScrollSpeed = 0;
            this.scroll = false;
            this.infosString = "";
            this.addObjInfos(obj, 0);

            this.crossBitmap = new createjs.Bitmap();
            this.boxShape = new createjs.Shape();
            this.infosDisplay = new createjs.Text(this.infosString, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
            this.maskBox = maskBox;
            this.mask = new createjs.Shape();

            //Arrow button to scroll text
            this.leftButton = new createjs.Shape();
            this.topButton = new createjs.Shape();
            this.rightButton = new createjs.Shape();
            this.botButton = new createjs.Shape();

            this.initChildren();
            this.addEventListener();
        }

        Infos.prototype.initChildren = function() {
            this.initMask();
            this.initArrowButtons();
            this.initBox();
            this.initBoxShape();
            this.initCrossBitmap();
        };

        Infos.prototype.initArrowButtons = function() {
            var graphics = new createjs.Graphics();
            var rectFill = createjs.Graphics.getRGB(0, 0, 0);
            var arrowStroke = createjs.Graphics.getRGB(255, 255, 255);
            var strokeStyle = 5;
            var padding = 10;
            var size = 25;
            var radius = 5;

            graphics.beginFill(rectFill);
            graphics.drawRoundRect(0, 0, size + padding * 2, size + padding * 2, radius);
            graphics.endFill();

            graphics.beginStroke(arrowStroke);
            graphics.setStrokeStyle(strokeStyle, "round", "round");
            graphics.moveTo(padding, padding);
            graphics.lineTo(padding + size, padding + (size / 2));
            graphics.lineTo(padding, padding + size);

            this.leftButton.graphics = graphics;
            this.topButton.graphics = graphics;
            this.rightButton.graphics = graphics;
            this.botButton.graphics = graphics;

            this.leftButton.x = this.maskBox.x + this.maskBox.width - (size + padding * 2) * 2;
            this.leftButton.y = this.maskBox.y + this.maskBox.height - (size + padding * 2);
            this.leftButton.rotation = 180;
            this.leftButton.alpha = this.BUTTON_ALPHA;

            this.topButton.x = this.maskBox.x + this.maskBox.width - (size + padding * 2) * 2;
            this.topButton.y = this.maskBox.y + this.maskBox.height - (size + padding * 2) * 2;
            this.topButton.rotation = 270;
            this.topButton.alpha = this.BUTTON_ALPHA;

            this.rightButton.x = this.maskBox.x + this.maskBox.width - (size + padding * 2);
            this.rightButton.y = this.maskBox.y + this.maskBox.height - (size + padding * 2) * 2;
            this.rightButton.alpha = this.BUTTON_ALPHA;

            this.botButton.x = this.maskBox.x + this.maskBox.width - (size + padding * 2);
            this.botButton.y = this.maskBox.y + this.maskBox.height - (size + padding * 2);
            this.botButton.rotation = 90;
            this.botButton.alpha = this.BUTTON_ALPHA;

        };

        Infos.prototype.initMask = function() {
            var graphics = new createjs.Graphics();

            graphics.drawRect(0, 0, this.maskBox.width, this.maskBox.height);

            this.mask.graphics = graphics;
            this.mask.x = this.maskBox.x;
            this.mask.y = this.maskBox.y;

            this.infosDisplay.mask = this.mask;

            this.infosDisplay.x = this.maskBox.x;
            this.infosDisplay.y = this.maskBox.y;
        };

        Infos.prototype.addEventListener = function()
        {
            var self = this;

            this.crossBitmap.on("click", function(e) {
                var stage = e.target.stage;
                for (var child in self.getChildren()) {
                    stage.removeChild(self.getChildren()[child]);
                }
                infosVisible = false;
                changed = true;
            }).bind(self);

            this.infosDisplay.on("tick", function(e) {
                if (self.scroll) {
                    self.infosDisplay.x += self.xScrollSpeed;
                    self.infosDisplay.y += self.yScrollSpeed;
                    changed = true;
                }
            }).bind(self);

            /***************** LEFT ARROW BUTTON EVENT ***************/
            this.leftButton.on("mouseover", function(e) {
                self.leftButton.alpha = self.OVER_BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.leftButton.on("mouseout", function(e) {
                self.leftButton.alpha = self.BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.leftButton.on("mousedown", function(e) {
                self.scroll = true;
                self.xScrollSpeed += self.SCROLL_SPEED;
                changed = true;
            }).bind(self);

            this.leftButton.on("pressup", function(e) {
                self.scroll = false;
                self.xScrollSpeed = 0;
            }).bind(self);

            /***************** TOP ARROW BUTTON EVENT ***************/
            this.topButton.on("mouseover", function(e) {
                self.topButton.alpha = self.OVER_BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.topButton.on("mouseout", function(e) {
                self.topButton.alpha = self.BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.topButton.on("mousedown", function(e) {
                self.scroll = true;
                self.yScrollSpeed += self.SCROLL_SPEED;
                changed = true;
            }).bind(self);

            this.topButton.on("pressup", function(e) {
                self.scroll = false;
                self.yScrollSpeed = 0;
            }).bind(self);

            /***************** RIGHT ARROW BUTTON EVENT ***************/
            this.rightButton.on("mouseover", function(e) {
                self.rightButton.alpha = self.OVER_BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.rightButton.on("mouseout", function(e) {
                self.rightButton.alpha = self.BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.rightButton.on("mousedown", function(e) {
                self.scroll = true;
                self.xScrollSpeed -= self.SCROLL_SPEED;
                changed = true;
            }).bind(self);

            this.rightButton.on("pressup", function(e) {
                self.scroll = false;
                self.xScrollSpeed = 0;
            }).bind(self);

            /***************** BOT ARROW BUTTON EVENT ***************/
            this.botButton.on("mouseover", function(e) {
                self.botButton.alpha = self.OVER_BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.botButton.on("mouseout", function(e) {
                self.botButton.alpha = self.BUTTON_ALPHA;
                changed = true;
            }).bind(self);

            this.botButton.on("mousedown", function(e) {
                self.scroll = true;
                self.yScrollSpeed -= self.SCROLL_SPEED;
                changed = true;
            }).bind(self);

            this.botButton.on("pressup", function(e) {
                self.scroll = false;
                self.yScrollSpeed = 0;
            }).bind(self);
        };

        Infos.prototype.initCrossBitmap = function() {
            var self = this;
            var img = new Image();
            img.src = "images/close_icon.svg";
            img.onload = (function() {
                self.crossBitmap.image = img;
                self.crossBitmap.scaleX = self.CLOSER_SCALE;
                self.crossBitmap.scaleY = self.CLOSER_SCALE;

                var oldBounds = self.crossBitmap.getBounds();

                self.crossBitmap.x = self.box.x + self.box.width - self.PADDING - oldBounds.width * self.CLOSER_SCALE;
                self.crossBitmap.y = self.box.y + self.PADDING;

                self.crossBitmap.setBounds(
                    self.crossBitmap.x,
                    self.crossBitmap.y,
                    oldBounds.width * self.crossBitmap.scaleX,
                    oldBounds.height * self.crossBitmap.scaleY
                    );
            }).bind(self);
        };

        Infos.prototype.initBox = function() {
            this.box = new createjs.Rectangle(
                this.maskBox.x - this.PADDING,
                this.maskBox.y - this.PADDING,
                this.maskBox.width + this.PADDING * 2,
                this.maskBox.height + this.PADDING * 2
                );
        };

        Infos.prototype.initBoxShape = function() {
            var graphics = new createjs.Graphics();

            graphics.setStrokeStyle(this.STROKE_STYLE);
            graphics.beginStroke(this.STROKE_COLOR);
            graphics.beginFill(this.FILL_COLOR);

            graphics.drawRoundRect(0, 0, this.box.width, this.box.height, this.RADIUS);

            this.boxShape.graphics = graphics;
            this.boxShape.x = this.box.x;
            this.boxShape.y = this.box.y;
        };

        Infos.prototype.getChildren = function() {
            var children = [this.boxShape, this.infosDisplay, this.crossBitmap, this.leftButton, this.topButton, this.rightButton, this.botButton];

            return children;
        };

        Infos.prototype.getInnerBounds = function() {
            return this.infosDisplay.getBounds();
        };

        Infos.prototype.addObjInfos = function(obj, indentLevel) {
            for (var key in obj) {
                if (typeof (obj[key]) === "object") {
                    if (typeof (key) === "string") {
                        for (var i = 0; i < indentLevel; i++) {
                            this.infosString += "\t";
                        }
                        this.infosString += key + " : \n"
                    }
                    this.addObjInfos(obj[key], indentLevel + 1);
                } else {
                    for (var i = 0; i < indentLevel; i++) {
                        this.infosString += "\t";
                    }
                    this.infosString += key + " : " + obj[key] + "\n";
                }
            }
        };

        return Infos;
    }
);