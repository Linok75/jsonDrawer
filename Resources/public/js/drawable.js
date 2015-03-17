function Drawable() {
    this.points = [];
}

Drawable.prototype.draw = function (context) {
    var moved = false;
    var index,point;

    context.beginPath();

    for (index=0;index<this.points.length;index++) {
        point=this.points.valueOf(index)[0];
        if (!moved) {
            context.moveTo(point[0],point[1]);
            moved = true;
        }
        context.lineTo(point[0],point[1]);
    }
    
    context.stroke();
    context.closePath();
};

Drawable.prototype.addPoint = function (point) {
    this.points.push(point);
};