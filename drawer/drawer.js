function Drawer(stage)
{
    this.defaultMinYOrigin = 50;
    this.stage = stage;

    this.stage.canvas.width = $(window).width();
    this.stage.canvas.height = $(window).height();

    this.nextOrigin = new createjs.Point(this.stage.canvas.width / 2, this.defaultMinYOrigin);
    
    this.setBackground();
}

//Add step to canvas
Drawer.prototype.addStep = function(key, step)
{
    var step = new Step(this.nextOrigin, key, new Infos(step));
    
    //update the position for the next step
    this.nextOrigin.y = this.nextOrigin.y + step.getOuterBounds().height + step.getMargin();
    
    //Add all step's elements we need to draw on canvas
    for(child in step.getChildren()){
        this.stage.addChild(step.getChildren()[child]);
    }
    
    this.stage.update();
};

//Add path to canvas
Drawer.prototype.addPath = function(key, path)
{

};

//Set canvas background
Drawer.prototype.setBackground = function()
{
    var graphics = new createjs.Graphics();
    
    graphics.beginFill(createjs.Graphics.getRGB(183,196,189));
    graphics.drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    
    var shape = new createjs.Shape(graphics);
    shape.x = 0;
    shape.y = 0;
    
    this.stage.addChild(shape);
    this.stage.update();
};