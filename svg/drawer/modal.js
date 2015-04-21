'use strict';

define(
    [
        'jquery-private'
    ],
    function($) {
        function Modal() {
            this.container = $('<div></div>');
            this.modal = $('<div></div>');
            this.closeButton = $('<img />');
            this.oldData;

            this.initContainer();
            this.initModal();
            this.initCloseButton();
        }

        Modal.prototype.initCloseButton = function() {
            var buttonSize = '13px';

            this.closeButton.attr('src', 'images/close_icon.svg');

            this.closeButton.css('position', 'fixed');
            this.closeButton.css('right', '20%');
            this.closeButton.width(buttonSize);
            this.closeButton.height(buttonSize);
            this.closeButton.css('cursor', 'pointer');

            this.closeButton.click(
                (function(e) {
                    this.container.css('display', 'none');
                    this.oldData.remove();
                }).bind(this)
            );

            this.modal.append(this.closeButton);
        };

        Modal.prototype.initContainer = function() {
            this.container.attr('id', 'modal_drawer_container');

            this.container.css('background-color', 'rgba(0,0,0,0.5)');
            this.container.css('position', 'absolute');
            this.container.css('top', 0);
            this.container.css('left', 0);
            this.container.css('width', '100%');
            this.container.css('height', '100%');
            this.container.css('z-index', 500);
            this.container.css('display', 'none');

            this.container.append(this.modal);
            this.container.appendTo($('#container'));
        };

        Modal.prototype.initModal = function() {
            this.modal.attr('id', 'modal_drawer');

            this.modal.css('background-color', 'white');
            this.modal.css('border', '2px solid rgb(4, 97, 201)');
            this.modal.css('border-radius', '5px');
            this.modal.css('width', '60%');
            this.modal.css('height', '75%');
            this.modal.css('position', 'absolute');
            this.modal.css('left', '20%');
            this.modal.css('top', '12%');
            this.modal.css('padding', '10px');
            this.modal.css('overflow', 'scroll');
            this.modal.css('white-space', 'nowrap');
        };

        Modal.prototype.append = function(element) {
            this.oldData = element;
            this.modal.append(this.oldData);
            this.container.css('display', 'block');
        };

        return Modal;
    });