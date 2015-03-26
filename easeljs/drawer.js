function Drawer(stage)
{
    this.defaultMinYOrigin = 50;
    this.stage = stage;

    this.stage.canvas.width = $(window).width();
    this.stage.canvas.height = $(window).height();

    this.defaultNextOrigin = {
        "x": this.stage.canvas.width / 2,
        "y": this.defaultMinYOrigin
    };
}

Drawer.prototype.addStep = function(key, step)
{

};

Drawer.prototype.addPath = function(key, path)
{

};