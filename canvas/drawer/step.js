'use strict';

var infosVisible = false;

define(
        [
        ],
        function ()
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

                this.box = new createjs.Container();

                this.shape = new createjs.Shape();
                this.shape.x = 0;
                this.shape.y = 0;

                this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
                this.type = new createjs.Text("<" + type + ">", this.FONT_SIZE * 0.75 + " " + this.FONT_STYLE, this.FONT_COLOR);

                this.infosButton = new createjs.Bitmap();

                /*****INITIALISATION*****/
                this.initBox(origin);
                this.initBoxShape();
                this.initTextPosition();
                this.initInfosButton();

                this.addEventListener();
            }

            Step.prototype.initBox = function (origin) {
                var width;

                if (this.name.getBounds().width > this.type.getBounds().width) {
                    width = this.name.getBounds().width;
                } else {
                    width = this.type.getBounds().width;
                }

                this.box.x = origin.x - width / 2 - this.PADDING;
                this.box.y = origin.y;

                this.box.setBounds(
                        this.box.x,
                        this.box.y,
                        width + this.PADDING * 2,
                        this.name.getBounds().height + this.type.getBounds().height + this.PADDING * 3
                        );

                this.box.addChild(this.shape, this.name, this.type, this.infosButton);
            };

            Step.prototype.initTextPosition = function () {
                var boxBounds = this.box.getBounds();
                var nameBounds = this.name.getBounds();

                this.name.x = boxBounds.width / 2 - nameBounds.width / 2;
                this.name.y = this.PADDING;

                this.type.x = boxBounds.width / 2 - this.type.getBounds().width / 2;
                this.type.y = this.name.y + nameBounds.height + this.PADDING;
            };

            Step.prototype.setOrigin = function (origin)
            {
                var oldBounds = this.box.getBounds();

                this.box.x = origin.x - this.box.getBounds().width / 2 - this.PADDING;
                this.box.y = origin.y;

                this.box.setBounds(
                        this.box.x,
                        this.box.y,
                        oldBounds.width,
                        oldBounds.height
                        );
            };
            Step.prototype.getName = function ()
            {
                return this.name.text;
            };
//Return all elements should be drawed
            Step.prototype.getChildren = function ()
            {
                return this.box;
            };
//Return the box rectangle
            Step.prototype.getOuterBounds = function ()
            {
                return this.box.getBounds();
            };
//Return the content bounds (without box)
            Step.prototype.getInnerBounds = function ()
            {
                var inner;
                var outer = this.box.getBounds();

                inner = new createjs.Rectangle(outer.x + this.PADDING, outer.y + this.PADDING, outer.width - this.PADDING * 2, outer.height - this.PADDING * 2);

                return inner;
            };
//Return the box margin
            Step.prototype.getMargin = function ()
            {
                return this.MARGIN;
            };
//Return the box shape to draw it
            Step.prototype.initBoxShape = function ()
            {
                var graphics = new createjs.Graphics();
                var boxBounds = this.getOuterBounds();

                graphics.setStrokeStyle(this.STROKE_STYLE);
                graphics.beginStroke(this.STROKE_COLOR);
                graphics.beginFill(this.FILL_COLOR);
                graphics.drawRoundRect(0, 0, boxBounds.width, boxBounds.height, this.RADIUS);

                this.shape.graphics = graphics;
            };
            Step.prototype.addEventListener = function ()
            {
                var self = this;
                this.box.on("pressmove", function (e)
                {
                    self.setOrigin(new createjs.Point(e.stageX, e.stageY));
                    self.refreshOutPathsStartPoint();
                    self.refreshInPathsEndPoint();
                    changed = true;
                }).bind(self);
                this.box.on("mouseover", function (e)
                {
                    if (!infosVisible) {
                        self.infosButton.visible = true;
                        changed = true;
                    }
                }).bind(self);
                this.box.on("mouseout", function (e)
                {
                    if (!self.infosButton.getBounds().contains(e.stageX, e.stageY)) {
                        self.infosButton.visible = false;
                        changed = true;
                    }
                }).bind(self);
                this.infosButton.on("click", function (e) {
                    e.target.stage.addChild(self.infos.getChildren());
                    self.infosButton.visible = false;
                    infosVisible = true;
                    changed = true;
                }).bind(self);
            };

            Step.prototype.initInfosButton = function ()
            {
                var self = this;
                var img = new Image();
                img.src = "images/info_icon.svg";

                img.onload = (function () {
                    self.infosButton.image = img;
                    self.infosButton.scaleX = self.INFOS_BUTTON_SCALE;
                    self.infosButton.scaleY = self.INFOS_BUTTON_SCALE;

                    var oldBounds = self.infosButton.getBounds();

                    self.infosButton.x = this.PADDING * 0.25;
                    self.infosButton.y = this.PADDING * 0.25;

                    self.infosButton.setBounds(
                            self.infosButton.x,
                            self.infosButton.x,
                            oldBounds.width * this.INFOS_BUTTON_SCALE,
                            oldBounds.height * this.INFOS_BUTTON_SCALE
                            );
                    self.infosButton.visible = false;
                }).bind(self);
            };

//add path (somewhere to this)
            Step.prototype.addInPath = function (path)
            {
                this.inPaths.push(path);
                this.refreshInPathsEndPoint();
            };
//refresh inPaths endPoint
            Step.prototype.refreshInPathsEndPoint = function ()
            {
                var outer = this.getOuterBounds();

                var point = new createjs.Point(
                        outer.x + outer.width / (this.inPaths.length + 1),
                        outer.y - this.STROKE_STYLE
                        )
                        ;
                for (var path in this.inPaths) {
                    this.inPaths[path].setEndPoint(point);
                    point = new createjs.Point(point.x + outer.width / (this.inPaths.length + 1),
                            point.y
                            );
                }
            };
//add path (this to somewhere)
            Step.prototype.addOutPath = function (path)
            {
                this.outPaths.push(path);
                this.refreshOutPathsStartPoint();
            };
//refresh inPaths endPoint
            Step.prototype.refreshOutPathsStartPoint = function ()
            {
                var outer = this.getOuterBounds();

                var point = new createjs.Point(
                        outer.x + outer.width / (this.outPaths.length + 1),
                        outer.y + outer.height
                        );
                for (var path in this.outPaths) {
                    this.outPaths[path].setMaxWidth(outer.width / (this.outPaths.length + 1));
                    this.outPaths[path].setStartPoint(point);
                    point = new createjs.Point(point.x + outer.width / (this.outPaths.length + 1),
                            point.y
                            );
                }
            };
            return Step;
        }
);
