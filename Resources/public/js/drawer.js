/* global drawingboard, Drawable, context */

var drawer;
var drawable;

function Drawer() {
    this.drawables = new Array();
    this.context = context;
}

Drawer.prototype.addDrawableElement = function (drawable) {
    this.drawables.push(drawable);
};

Drawer.prototype.draw = function () {
    var index, drawable;

    for (index = 0; index < this.drawables.length; index++) {
        drawable = this.drawables[index];
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

//test variable
drawable = new Drawable();

//Test values
drawable.addPoint([500, 300]);
drawable.addPoint([500, 500]);
drawable.addPoint([700, 500]);
drawable.addPoint([700, 300]);
drawable.addPoint([500, 300]);
drawer.addDrawableElement(drawable);

drawer.draw();