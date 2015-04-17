'use strict';

define(
    [
        'jquery-private'
    ],
    function($) {
        function Path(path) {
            this.PADDING = 20;
            this.FONT_FAMILY = 'Arial';

            this.key = path.options.next_options.label;
            this.path = path;

            this.indentLevel = 0;
            this.indentSize = 17;

            this.initSize();
            this.initInfosSize();
        }

        Path.prototype.parseInfos = function(obj, struct) {
            for (var key in obj) {
                if (typeof (obj[key]) === 'object') {
                    var subStruct = $('<div></div>');
                    var pKey = $('<p></p>').text('"' + key + '": {');
                    var pCloseObj = $('<p></p>').text('},');

                    pKey.css('margin', 0);
                    pKey.css('font-size', '17px');
                    pKey.css('padding-left', this.indentLevel * this.indentSize);
                    pKey.css('color', 'red');
                    pKey.css('font-weight', 'bold');

                    pCloseObj.css('margin', 0);
                    pCloseObj.css('font-size', '17px');
                    pCloseObj.css('padding-left', this.indentLevel * this.indentSize);

                    subStruct.append(pKey);
                    this.indentLevel++;
                    this.parseInfos(obj[key], subStruct);
                    subStruct.append(pCloseObj);

                    struct.append(subStruct);
                } else {
                    var pKeyValue = $('<p></p>');
                    var sKey = $('<span></span>').text('"' + key + '": ');
                    var sValue = $('<span></span>').text('"' + obj[key] + '", ');

                    pKeyValue.css('margin', 0);
                    pKeyValue.css('font-size', '17px');
                    pKeyValue.css('padding-left', this.indentLevel * this.indentSize);
                    
                    sKey.css('color', 'red');
                    sKey.css('font-weight', 'bold');

                    sValue.css('margin', 0);
                    sValue.css('font-size', '17px');
                    
                    pKeyValue.append(sKey,sValue);

                    struct.append(pKeyValue);
                }
            }
        };

        Path.prototype.initInfosSize = function() {
            var struct = $('<div></div>');

            struct.css('margin', 0);
            struct.css('padding', '17px');
            struct.css('position', 'absolute');
            struct.css('font-family', this.FONT_FAMILY);

            this.parseInfos(this.path, struct);

            struct.appendTo('body');

            this.infosSize = {
                'width': struct.width() + 2 * 17,
                'height': struct.height() - 17
            };

//            struct.remove();
        };

        Path.prototype.initSize = function() {
            var struct = $('<div></div>');
            var pKey = $('<p></p>').text(this.key);

            struct.css('margin', 0);
            struct.css('padding', this.PADDING + 'px');
            struct.css('position', 'absolute');
            struct.css('font-family', this.FONT_FAMILY);
            struct.css('text-align', 'center');

            pKey.css('margin', 0);
            pKey.css('font-size', '15px');

            struct.append(pKey);
            struct.appendTo('body');

            this.size = {
                'width': struct.width() + 2 * this.PADDING,
                'height': struct.height() + 2 * (this.PADDING * 0.25)
            };

            struct.remove();
        };

        Path.prototype.getKey = function() {
            return this.key;
        };

        Path.prototype.getPadding = function() {
            return this.PADDING;
        };

        Path.prototype.getSize = function() {
            return this.size;
        };

        Path.prototype.getInfosSize = function() {
            return this.infosSize;
        };

        Path.prototype.getPath = function() {
            return this.path;
        };

        return Path;
    });