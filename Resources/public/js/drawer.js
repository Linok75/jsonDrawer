/* global drawingboard, Drawable */

var drawer;
var drawable;

function Drawer() {
    this.drawables = new Array();
    this.context = drawingboard.getContext('2d');
}

Drawer.prototype.addDrawableElement = function (drawable) {
    this.drawables.push(drawable);
};

Drawer.prototype.draw = function () {
    var index, drawable;

    for (index=0;index<this.drawables.length;index++) {
        drawable = this.drawables.valueOf(index)[0];
        if (drawable instanceof Drawable) {
            drawable.draw(this.context);
        }
    }
};

Drawer.prototype.removeDrawableElement = function (drawable) {
    var targetIndex;

    targetIndex = this.drawables.indexOf(drawable);
    if (targetIndex > -1) {
        this.drawables.splice(targetIndex, 1);
    }
};


drawer = new Drawer();

//test variable
drawable = new Drawable();

//Test values
drawable.addPoint([100, 100]);
drawable.addPoint([150, 100]);
drawable.addPoint([100, 150]);
drawable.addPoint([150, 150]);
drawable.addPoint([200, 200]);
drawer.addDrawableElement(drawable);

drawer.draw();