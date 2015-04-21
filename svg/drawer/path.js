'use strict';

define(
    [
        'jquery-private',
        'infos'
    ],
    function($, Infos) {
        function Path(path) {
            this.PADDING = 20;
            this.FONT_FAMILY = 'Arial';

            this.key = path.options.next_options.label;
            this.path = path;
            this.infos = new Infos(this.path);

            this.initSize();
        }

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

        Path.prototype.getInfosDOM = function() {
            return this.infos.getDOM();
        };

        Path.prototype.getPath = function() {
            return this.path;
        };

        return Path;
    });