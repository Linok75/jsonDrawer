'use strict';

define(
    [
        'jquery-private'
    ],
    function($) {
        function Step(key, step) {
            this.PADDING = 20;
            this.FONT_FAMILY = 'Arial';
            
            this.key = key;
            this.step = step;
            
            this.initSize();
        }
        
        Step.prototype.initSize = function() {
            var struct = $('<div></div>');
            var pKey = $('<p></p>').text(this.key);
            var pType = $('<p></p>').text(this.step.type);
            
            struct.css('margin', 0);
            struct.css('padding', this.PADDING + 'px');
            struct.css('position', 'absolute');
            struct.css('font-family', this.FONT_FAMILY);
            struct.css('text-align', 'center');
            
            pKey.css('margin', 0);
            pKey.css('margin-bottom', this.PADDING + 'px');
            pKey.css('font-size', '20px');
            pKey.css('font-weight', 'bold');
            
            pType.css('font-size', '17px');
            pType.css('margin', 0)
            
            struct.append(pKey,pType);
            struct.appendTo('body');
            
            this.size = {
                'width': struct.width() + 2*this.PADDING,
                'height': struct.height() + 2*(this.PADDING*0.25)
            };
            
//            struct.remove();
        };
        
        Step.prototype.getKey = function() {
            return this.key;
        };
        
        Step.prototype.getType = function() {
            return this.step.type;
        };
        
        Step.prototype.getPadding = function() {
            return this.PADDING;
        };
        
        Step.prototype.getSize = function() {
            return this.size;
        };
        
        return Step;
    });