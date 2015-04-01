'use strict';
define(
        [
        ],
        function ()
        {
            function Infos(obj, origin)
            {
                this.STROKE_STYLE = 2;
                this.STROKE_COLOR = createjs.Graphics.getRGB(4, 97, 201);
                this.FILL_COLOR = createjs.Graphics.getRGB(255, 255, 255);
                this.FONT_SIZE = "10px";
                this.FONT_STYLE = "Arial";
                this.FONT_COLOR = "#000000";
                this.PADDING = 10;
                this.RADIUS = 5; //Round rect radius
                this.CLOSER_SCALE = 0.04;

                this.infosString = "";
                this.origin = origin;
                this.addObjInfos(obj, 0);

                this.crossBitmap = new createjs.Bitmap();
                this.boxShape = new createjs.Shape();
                this.infosDisplay = new createjs.Text(this.infosString, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);

                this.initBox();
                this.initBoxShape();
                this.initCrossBitmap();
                this.addEventListener();
            }

            Infos.prototype.addEventListener = function ()
            {
                var self = this;

                this.crossBitmap.on("click", function (e) {
                    for (var child in self.getChildren()) {
                        e.target.stage.removeChild(self.getChildren()[child]);
                    }
                    changed = true;
                }).bind(self);
            };

            Infos.prototype.initCrossBitmap = function () {
                var self = this;
                var img = new Image();
                img.src = "images/close_icon.svg";
                img.onload = (function () {
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

            Infos.prototype.initBox = function () {
                this.box = new createjs.Rectangle(
                        this.origin.x - this.getInnerBounds().width / 2 - this.PADDING,
                        this.origin.y - this.getInnerBounds().height / 2 - this.PADDING,
                        this.getInnerBounds().width + this.PADDING * 2,
                        this.getInnerBounds().height + this.PADDING * 2
                        );

                this.infosDisplay.x = this.box.x + this.PADDING;
                this.infosDisplay.y = this.box.y + this.PADDING;
            };

            Infos.prototype.initBoxShape = function () {
                var graphics = new createjs.Graphics();

                graphics.setStrokeStyle(this.STROKE_STYLE);
                graphics.beginStroke(this.STROKE_COLOR);
                graphics.beginFill(this.FILL_COLOR);

                graphics.drawRoundRect(0, 0, this.box.width, this.box.height, this.RADIUS);

                this.boxShape.graphics = graphics;
                this.boxShape.x = this.box.x;
                this.boxShape.y = this.box.y;
            };

            Infos.prototype.getChildren = function () {
                var children = [this.boxShape, this.infosDisplay, this.crossBitmap];

                return children;
            };

            Infos.prototype.getInnerBounds = function () {
                return this.infosDisplay.getBounds();
            };

            Infos.prototype.addObjInfos = function (obj, indentLevel) {
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