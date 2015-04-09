'use strict';
define(
        [
        ],
        function ()
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

                this.box = new createjs.Container();

                this.crossBitmap = new createjs.Bitmap();
                this.boxShape = new createjs.Shape();
                this.infosDisplay = new createjs.Text(this.infosString, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
                this.mask = new createjs.Shape();

                //Arrow button to scroll text
                this.leftButton = new createjs.Shape();
                this.topButton = new createjs.Shape();
                this.rightButton = new createjs.Shape();
                this.botButton = new createjs.Shape();

                this.initChildren(maskBox);
                this.addEventListener();
            }
            
            Infos.prototype.initChildren = function (maskBox) {
                this.initBox(maskBox);
                
                this.initMask();
                this.initArrowButtons();
                this.initBoxShape();
                this.initCrossBitmap();
            };

            Infos.prototype.initBox = function (maskBox) {
                this.box.x = maskBox.x - this.PADDING;
                this.box.y = maskBox.y - this.PADDING;

                this.box.setBounds(
                        this.box.x,
                        this.box.y,
                        maskBox.width + this.PADDING * 2,
                        maskBox.height + this.PADDING * 2
                        );
                
                this.box.addChild(this.boxShape, this.infosDisplay, this.crossBitmap, this.leftButton, this.topButton, this.rightButton, this.botButton);
            };

            Infos.prototype.initArrowButtons = function () {
                var graphics = new createjs.Graphics();
                var rectFill = createjs.Graphics.getRGB(0, 0, 0);
                var arrowStroke = createjs.Graphics.getRGB(255, 255, 255);
                var strokeStyle = 5;
                var padding = 10;
                var size = 25;
                var radius = 5;
                var innerBounds = this.getInnerBounds();

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

                /********LEFT BUTTON********/
                this.leftButton.x = innerBounds.x + innerBounds.width - (size + padding * 2) * 2;
                this.leftButton.y = innerBounds.y + innerBounds.height - (size + padding * 2);
                this.leftButton.rotation = 180;
                this.leftButton.alpha = this.BUTTON_ALPHA;
                if (this.infosDisplay.x >= innerBounds.x) {
                    this.leftButton.visible = false;
                }

                /********TOP BUTTON********/
                this.topButton.x = innerBounds.x + innerBounds.width - (size + padding * 2) * 2;
                this.topButton.y = innerBounds.y + innerBounds.height - (size + padding * 2) * 2;
                this.topButton.rotation = 270;
                this.topButton.alpha = this.BUTTON_ALPHA;
                if (this.infosDisplay.y >= innerBounds.y) {
                    this.topButton.visible = false;
                }

                /********RIGHT BUTTON********/
                this.rightButton.x = innerBounds.x + innerBounds.width - (size + padding * 2);
                this.rightButton.y = innerBounds.y + innerBounds.height - (size + padding * 2) * 2;
                this.rightButton.alpha = this.BUTTON_ALPHA;
                if (this.infosDisplay.x + this.infosDisplay.getBounds().width <= innerBounds.x + innerBounds.width) {
                    this.rightButton.visible = false;
                }

                /********BOT BUTTON********/
                this.botButton.x = innerBounds.x + innerBounds.width - (size + padding * 2);
                this.botButton.y = innerBounds.y + innerBounds.height - (size + padding * 2);
                this.botButton.rotation = 90;
                this.botButton.alpha = this.BUTTON_ALPHA;
                if (this.infosDisplay.y + this.infosDisplay.getBounds().height <= innerBounds.y + innerBounds.height) {
                    this.botButton.visible = false;
                }

            };

            /*
             * Mask used to hide text overflow
             */
            Infos.prototype.initMask = function () {
                var graphics = new createjs.Graphics();
                var innerBounds = this.getInnerBounds();

                graphics.drawRect(0, 0, innerBounds.width, innerBounds.height);

                this.mask.graphics = graphics;
                this.mask.x = innerBounds.x;
                this.mask.y = innerBounds.y;

                this.infosDisplay.mask = this.mask;

                this.infosDisplay.x = innerBounds.x;
                this.infosDisplay.y = innerBounds.y;
            };

            Infos.prototype.addEventListener = function ()
            {
                var self = this;
                var innerBounds = this.getInnerBounds();

                this.crossBitmap.on("click", function (e) {
                    e.target.stage.removeChild(self.box);
                    infosVisible = false;
                    changed = true;
                }).bind(self);

                
                /**************START TICK EVENT**************/
                this.infosDisplay.on("tick", function (e) {
                    if (self.scroll) {
                        self.infosDisplay.x += self.xScrollSpeed;
                        self.infosDisplay.y += self.yScrollSpeed;
                        changed = true;
                    }

                    /************LEFT ARROW VISIBILTY***********/
                    if (self.infosDisplay.x >= innerBounds.x) {
                        if (self.leftButton.visible) {
                            self.leftButton.visible = false;
                            self.scroll = false;
                        }
                    } else {
                        self.leftButton.visible = true;
                    }

                    /************TOP ARROW VISIBILTY***********/
                    if (self.infosDisplay.y >= innerBounds.y) {
                        if (self.topButton.visible) {
                            self.topButton.visible = false;
                            self.scroll = false;
                        }
                    } else {
                        self.topButton.visible = true;
                    }

                    /************RIGHT ARROW VISIBILTY***********/
                    if (self.infosDisplay.x + self.infosDisplay.getBounds().width <= innerBounds.x + innerBounds.width) {
                        if (self.rightButton.visible) {
                            self.rightButton.visible = false;
                            self.scroll = false;
                        }
                    } else {
                        self.rightButton.visible = true;
                    }

                    /************BOT ARROW VISIBILTY***********/
                    if (self.infosDisplay.y + self.infosDisplay.getBounds().height <= innerBounds.y + innerBounds.height) {
                        if (self.botButton.visible) {
                            self.botButton.visible = false;
                            self.scroll = false;
                        }
                    } else {
                        self.botButton.visible = true;
                    }
                }).bind(self);
                /****************END TICK EVENT****************/


                /***************** LEFT ARROW BUTTON EVENT ***************/
                this.leftButton.on("mouseover", function (e) {
                    self.leftButton.alpha = self.OVER_BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.leftButton.on("mouseout", function (e) {
                    self.leftButton.alpha = self.BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.leftButton.on("mousedown", function (e) {
                    self.scroll = true;
                    self.xScrollSpeed += self.SCROLL_SPEED;
                    changed = true;
                }).bind(self);

                this.leftButton.on("pressup", function (e) {
                    self.scroll = false;
                    self.xScrollSpeed = 0;
                }).bind(self);

                /***************** TOP ARROW BUTTON EVENT ***************/
                this.topButton.on("mouseover", function (e) {
                    self.topButton.alpha = self.OVER_BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.topButton.on("mouseout", function (e) {
                    self.topButton.alpha = self.BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.topButton.on("mousedown", function (e) {
                    self.scroll = true;
                    self.yScrollSpeed += self.SCROLL_SPEED;
                    changed = true;
                }).bind(self);

                this.topButton.on("pressup", function (e) {
                    self.scroll = false;
                    self.yScrollSpeed = 0;
                }).bind(self);

                /***************** RIGHT ARROW BUTTON EVENT ***************/
                this.rightButton.on("mouseover", function (e) {
                    self.rightButton.alpha = self.OVER_BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.rightButton.on("mouseout", function (e) {
                    self.rightButton.alpha = self.BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.rightButton.on("mousedown", function (e) {
                    self.scroll = true;
                    self.xScrollSpeed -= self.SCROLL_SPEED;
                    changed = true;
                }).bind(self);

                this.rightButton.on("pressup", function (e) {
                    self.scroll = false;
                    self.xScrollSpeed = 0;
                }).bind(self);

                /***************** BOT ARROW BUTTON EVENT ***************/
                this.botButton.on("mouseover", function (e) {
                    self.botButton.alpha = self.OVER_BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.botButton.on("mouseout", function (e) {
                    self.botButton.alpha = self.BUTTON_ALPHA;
                    changed = true;
                }).bind(self);

                this.botButton.on("mousedown", function (e) {
                    self.scroll = true;
                    self.yScrollSpeed -= self.SCROLL_SPEED;
                    changed = true;
                }).bind(self);

                this.botButton.on("pressup", function (e) {
                    self.scroll = false;
                    self.yScrollSpeed = 0;
                }).bind(self);
            };

            Infos.prototype.initCrossBitmap = function () {
                var self = this;
                var img = new Image();
                var outerBounds = this.box.getBounds();
                
                img.src = "images/close_icon.svg";
                img.onload = (function () {
                    self.crossBitmap.image = img;
                    self.crossBitmap.scaleX = self.CLOSER_SCALE;
                    self.crossBitmap.scaleY = self.CLOSER_SCALE;

                    var oldBounds = self.crossBitmap.getBounds();

                    self.crossBitmap.x = outerBounds.width - self.PADDING - oldBounds.width * self.CLOSER_SCALE;
                    self.crossBitmap.y = self.PADDING;

                    self.crossBitmap.setBounds(
                            self.crossBitmap.x,
                            self.crossBitmap.y,
                            oldBounds.width * self.crossBitmap.scaleX,
                            oldBounds.height * self.crossBitmap.scaleY
                            );
                }).bind(self);
            };
            
            Infos.prototype.initBoxShape = function () {
                var graphics = new createjs.Graphics();
                var outerBounds = this.box.getBounds();

                graphics.setStrokeStyle(this.STROKE_STYLE);
                graphics.beginStroke(this.STROKE_COLOR);
                graphics.beginFill(this.FILL_COLOR);

                graphics.drawRoundRect(0, 0, outerBounds.width, outerBounds.height, this.RADIUS);

                this.boxShape.graphics = graphics;
                this.boxShape.x = 0;
                this.boxShape.y = 0;
            };

            Infos.prototype.getChildren = function () {
                return this.box;
            };

            Infos.prototype.getInnerBounds = function () {
                var outer = this.box.getBounds();
                
                return new createjs.Rectangle(this.PADDING, this.PADDING, outer.width - this.PADDING*2, outer.height - this.PADDING*2);
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