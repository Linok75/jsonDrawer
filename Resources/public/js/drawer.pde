float framerate = 24;
int minY = 50; //Top of ordinate axe
ArrayList drawables; //Elements to draw
Point topPosition; //Default position of the first element

//Init drawer
void setup(){
    size(500,500);
    frameRate(framerate);
    noLoop();
    stroke(#000000);
    fill(#ffffff);
    background(#ffffff);
    
    this.drawables = new ArrayList();
    this.topPosition = new Point(width/2,minY);
}

//Draw on canvas
void draw() {
    for(int i=0;i<this.drawables.size();i++){
        this.drawables.get(i).draw();
    }
}

//Set canvas size
void canvasSize(int w, int h){
    size(w,h);
    this.setTopPosition(w/2, minY);
}

//Set first element position
void setTopPosition(int x, int y){
    this.topPosition.setCoordinates(x, y);
}

//Add new element to draw
void addDrawable(Drawable drawable){
    //Set origin if origin is not set
    if(!drawable.isFixed()){
        Point origin;
        if(this.drawables.size() == 0){
            origin = new Point(this.topPosition.getX()-(drawable.getSize().getWidth()/2), this.topPosition.getY());
        }else{
            Point previousPosition;
            Drawable previousObject;
          
            previousObject = this.drawables.get(this.drawables.size()-1);
            previousPosition = new Point(previousObject.getOrigin().getX()+(previousObject.getSize().getWidth()/2), previousObject.getOrigin().getY()+previousObject.getSize().getHeight());

            origin = new Point(previousPosition.getX()-(drawable.getSize().getWidth()/2), previousPosition.getY()+Box.DEFAULT_MARGIN);
        }
        
        drawable.setOrigin(origin);
    }
    this.drawables.add(drawable);
    redraw(); //call this.draw()
}

void addStep(String name){
    this.addDrawable(new Step(name));
}
//Box (for other elements or juste draw a box(rect))
class Box implements Drawable{
    final static int DEFAULT_MARGIN = 50;

    Point origin;
    boolean fixed;
    Dimension size;
    
    Box(Point origin, Dimension size){
        this.origin = origin;
        this.size = size;
        this.fixed = true;
    }
    
    void draw(){
        stroke(0,0,0);
        fill(255,255,255);
        rect(this.origin.getX(), this.origin.getY(), this.size.getWidth(), this.size.getHeight());
    }
    
    boolean isFixed(){
        return this.fixed;
    }
    
    Dimension getSize(){
        return this.size;
    }
    
    Point getOrigin(){
        return this.origin;
    }
    
    Box getBox(){
        return this;
    }
}
//All elements need to draw
interface Drawable{
    void setOrigin(Point point); //set origin (and fixed to true)
    void draw(); //draw element
    boolean isFixed(); //return true if the origin is setted
    Box getBox(); //return the (outer)box of the element
}
//Draw a step
class Step implements Drawable{
    final int FONT_SIZE = 20;
    final int DEFAULT_PADDING = 10;
  
    String name;
    Point origin;
    boolean fixed;
    Box box;
    
    Step(String name, Point origin){
        this.name = name;
        textSize(this.FONT_SIZE);
        this.origin = origin;
        this.fixed = true;
        this.initBox();
    }
    
    Step(String name){
        this.name = name;
        textSize(this.FONT_SIZE);
        this.origin = new Point(10,(this.DEFAULT_PADDING + textAscent()));
        this.fixed = false;
        this.initBox();
    }
    
    void initBox(){
        int boxHeight;

        boxHeight = textAscent() + textDescent() + (this.DEFAULT_PADDING*2);
        this.box = new Box(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())), new Dimension(textWidth(this.name)+ (this.DEFAULT_PADDING*2), boxHeight));
    }
    
    void setOrigin(Point origin){
        this.origin = origin;
        this.initBox();
        this.fixed = true;
    }
    
    boolean isFixed(){
        return this.fixed;
    }
    
    String getName(){
        return this.name;
    }
    
    Dimension getSize(){
        return new Dimension(textWidth(this.name),(textAscent() + textDescent()));
    }
    
    Point getOrigin(){
        return this.origin;
    }
    
    Box getBox(){
        return this.box;
    }
    
    void draw(){
        this.box.draw();

        fill(0, 0, 0);
        text(this.name, this.origin.getX(), this.origin.getY());
    }
}
//x,y coordinate structure
class Point{
    int x, y;
    
    Point(int x, int y){
        this.x=x;
        this.y=y;
    }
    
    int getX(){
      return this.x;
    }
    
    int getY(){
        return this.y;
    }
    
    void setCoordinates(int x, int y){
        this.x = x;
        this.y = y;
    }
}

//width, height size structure
class Dimension{
    int w, h;
    
    Dimension(int w, int h){
        this.w = w;
        this.h = h;
    }
    
    int getWidth(){
        return this.w;
    }
    
    int getHeight(){
        return this.h;
    }
}

