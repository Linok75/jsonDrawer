'use strict';

var infosVisible = false;

define(
    [
        'jquery-private'
    ],
    function($)
    {
        function Step(origin, name, type, infos)
        {
            this.STROKE_STYLE = 2;
            this.STROKE_COLOR = d3.rgb(4, 97, 201);
            this.FILL_COLOR = d3.rgb(255, 255, 255);
            this.FONT_COLOR = d3.rgb(0, 0, 0);
            this.PADDING = 10;
            this.MARGIN = 80;
            this.RADIUS = 5; //Round rect radius
            this.INFOS_BUTTON_SCALE = 0.035;

            this.infos = infos;
            this.inPaths = new Array();
            this.outPaths = new Array();

            this.draw = d3.select("#steps")
                .append('svg:g')
                .attr('id', name);

            this.initText(name, type);
            this.translateStep(origin);

//                this.name = new createjs.Text(name, this.FONT_SIZE + " " + this.FONT_STYLE, this.FONT_COLOR);
//                this.type = new createjs.Text("<" + type + ">", this.FONT_SIZE * 0.75 + " " + this.FONT_STYLE, this.FONT_COLOR);

//                this.infosButton = new createjs.Bitmap();

            /*****INITIALISATION*****/
//                this.initBox(origin);
//                this.initBoxShape();
//                this.initTextPosition();
//                this.initInfosButton();
//
//                this.addEventListener();
        }

        Step.prototype.translateStep = function(position) {
            this.draw.attr('transform', 'translate(' + position.x + ',' + position.y + ')');
        };

        Step.prototype.initText = function(name, type) {
            var size = {
                'width': 0,
                'height': 0
            };
            
            
            /*
             * Create dom structure to get the text size
             */
            var struct = $('<div></div>');
            var nameSpan = $('<span></span>').text(name);
            var typeSpan = $('<span></span>').text('<' + type + '>');
            
            struct.css('padding', this.PADDING);
            struct.css('text-align', 'center');
            struct.css('font-family', 'Arial');
            struct.css('visibility', 'hidden');
            struct.css('position', 'absolute');
            
            nameSpan.css('font-size', '20px');
            nameSpan.css('font-weight', 'bold');
            nameSpan.css('display', 'block');
            nameSpan.css('margin-bottom', this.PADDING);
            
            typeSpan.css('font-size', '15px');
            typeSpan.css('display', 'block');
            
            struct.append(nameSpan, typeSpan);
            struct.appendTo($('body'));
            
            /*
             * Save the global box size
             */
            size.width = struct.width();
            size.height = struct.height();
            
            /*
             * Append text in step group
             */
            this.draw.append('svg:text')
                .style('text-anchor', 'middle')
                .style('font-family', 'Arial')
                .style('color', d3.rgb(0, 0, 0))
                .append('svg:tspan')
                .attr('x', this.PADDING + 'px')
                .attr('y', this.PADDING + 'px')
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .text(name);
            
            this.draw.select('text')
                .append('svg:tspan')
                .attr('x', this.PADDING + 'px')
                .attr('y', this.PADDING + nameSpan.height() + 'px')
                .style('font-size', '15px')
                .text('<' + type + '>');

            struct.remove();
            
            this.initBox(size);
        };
        
        Step.prototype.initBox = function(size) {
            this.draw.insert('svg:rect', 'text')
                .attr('x', -(size.width/2))
                .attr('y', -this.PADDING)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('width', size.width + this.PADDING*2)
                .attr('height', size.height)
                .style('fill', d3.rgb(255,255,255))
                .style('stroke', d3.rgb(4,97,201))
                .style('stroke-width', 2);
        };
        
        Step.prototype.getName = function()
        {
            return this.draw.select('text').text();
        };
//Return all elements should be drawed
        Step.prototype.getChildren = function()
        {
            return this.draw;
        };
//Return the box rectangle
        Step.prototype.getOuterBounds = function()
        {
            var outer = {
                'x': 0,
                'y': 0,
                'width': parseInt(this.draw.select('rect').attr('width')),
                'height': parseInt(this.draw.select('rect').attr('height'))
            };
            
            return outer;
        };
//Return the content bounds (without box)
        Step.prototype.getInnerBounds = function()
        {
            var inner = {
                'x': this.draw.attr('x') + this.PADDING,
                'y': this.draw.attr('y') + this.PADDING,
                'width': this.draw.attr('width') - this.PADDING*2,
                'height': this.draw.attre('height') - this.PADDING*2
            };
            
            return inner;
        };
//Return the box margin
        Step.prototype.getMargin = function()
        {
            return this.MARGIN;
        };
        
        Step.prototype.addEventListener = function()
        {
            var self = this;
            this.box.on("pressmove", function(e)
            {
                self.setOrigin(new createjs.Point(e.stageX, e.stageY));
                self.refreshOutPathsStartPoint();
                self.refreshInPathsEndPoint();
                changed = true;
            }).bind(self);
            this.box.on("mouseover", function(e)
            {
                if (!infosVisible) {
                    self.infosButton.visible = true;
                    changed = true;
                }
            }).bind(self);
            this.box.on("mouseout", function(e)
            {
                if (!self.infosButton.getBounds().contains(e.stageX, e.stageY)) {
                    self.infosButton.visible = false;
                    changed = true;
                }
            }).bind(self);
            this.infosButton.on("click", function(e) {
                e.target.stage.addChild(self.infos.getChildren());
                self.infosButton.visible = false;
                infosVisible = true;
                changed = true;
            }).bind(self);
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
        Step.prototype.addOutPath = function(path)
        {
            this.outPaths.push(path);
            this.refreshOutPathsStartPoint();
        };
//refresh inPaths endPoint
        Step.prototype.refreshOutPathsStartPoint = function()
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
