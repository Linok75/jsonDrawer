/* @pjs transparent="true"; */

private float framerate = 10;
private int minY = 50; //Top of ordinate axe
private ArrayList drawables; //Elements to draw
private Point topPosition; //Default position of the first element
private Step stepFocused = null;
private Drawable elementOverDrawed = null;

//Init drawer
public void setup() {
  size(500, 500);
  frameRate(framerate);
  noLoop();

  this.drawables = new ArrayList();
  this.topPosition = new Point(width/2, minY);
}

//Draw on canvas
public void draw() {
  background(204);
  for (int i=0; i<this.drawables.size (); i++) {
    this.drawables.get(i).draw();
  }
}

public void mousePressed() {
  Step tmp;
  for (int i=0; i<this.drawables.size (); i++) {
    if ((this.drawables.get(i)) instanceof Step) {
      tmp = this.drawables.get(i);
      if (tmp.getBox().contain(new Point(mouseX, mouseY))) {
        this.stepFocused = tmp;
      }
    }
  }
}

public void mouseDragged() {
  if (this.stepFocused != null) {
    this.stepFocused.setOrigin(new Point(mouseX, mouseY));
    this.stepFocused.refreshPaths();
    redraw();
  }
}

public void mouseReleased() {
  this.stepFocused = null;
}

public void mouseMoved() {
  boolean overred = false;
  
  for (int i=0; i<this.drawables.size (); i++) {
    if (this.drawables.get(i).getBox().contain(new Point(mouseX, mouseY))) {
      overred = true;
      if(elementOverDrawed != this.drawables.get(i)){
        elementOverDrawed = this.drawables.get(i);
        redraw();
        this.drawables.get(i).overDraw();
      }
      break;
    }
  }
  
  if(!overred){
    elementOverDrawed = null;
    redraw();
  }
}

//Set canvas size
public void canvasSize(int w, int h) {
  size(w, h);
  this.setTopPosition(w/2, minY);
}

//Set first element position
private void setTopPosition(int x, int y) {
  this.topPosition.setCoordinates(x, y);
}

//Add new element to draw
private void addDrawable(Drawable drawable) {
  //Set origin if origin is not set
  if (!drawable.isFixed()) {
    Point origin;
    if (this.drawables.size() == 0) {
      origin = new Point(this.topPosition.getX()-(drawable.getSize().getWidth()/2), this.topPosition.getY());
    } else {
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

public void addStep(String name) {
  this.addDrawable(new Step(name));
}

public void addPath(String name, String srcName, String destName, String type, Object events) {
  Step source, destination, tmp;

  console.log(events);
  for (int i=0; i<this.drawables.size (); i++) {
    if ((this.drawables.get(i)) instanceof Step) {
      tmp = (Step) this.drawables.get(i);
      if (tmp.getName() == srcName) {
        source = tmp;
      }
      if (tmp.getName() == destName) {
        destination = tmp;
      }
    }
  }

  if (type != "end") {
    this.drawables.add(new Path(name, source, destination, events));
  } else {
    //this.drawables.add(new EndPath(name, source, events));
  }
  this.redraw();
}

//Box (for other elements or juste draw a box(rect))
class Box implements Drawable {
  public final static int DEFAULT_MARGIN = 50;
  private final int DEFAULT_RADIUS = 3;

  private Point origin;
  private boolean fixed;
  private Dimension size;

  public Box(Point origin, Dimension size) {
    this.origin = origin;
    this.size = size;
    this.fixed = true;
  }

  public void draw() {
    stroke(0, 0, 0);
    fill(255, 255, 255);
    rect(this.origin.getX(), this.origin.getY(), this.size.getWidth(), this.size.getHeight(), this.DEFAULT_RADIUS);
  }

  public boolean isFixed() {
    return this.fixed;
  }

  public Dimension getSize() {
    return this.size;
  }

  public Point getOrigin() {
    return this.origin;
  }

  public Box getBox() {
    return this;
  }

  public void setOrigin(Point origin) {
    this.origin = origin;
  }

  public boolean contain(Point point) {
    if (point.getX() > this.origin.getX() 
      && point.getX() < (this.origin.getX()+this.getSize().getWidth())
      && point.getY() > this.origin.getY()
      && point.getY() < (this.origin.getY()+this.getSize().getHeight())) {
      return true;
    }
    return false;
  }
}

//All elements need to draw
interface Drawable{
    void setOrigin(Point point); //set origin (and fixed to true)
    void draw(); //draw element
    boolean isFixed(); //return true if the origin is setted
    Box getBox(); //return the (outer)box of the element
}
//Draw a path
class EndPath implements Drawable {
  private final int FONT_SIZE = 10;
  private final int DEFAULT_PADDING = 10;
  private final int ARROW_SIZE = 10;

  private String name;
  private ArrayList points;
  private Point origin;
  private Point end;
  private boolean fixed;
  private Box box;
  private Point[] arrow;
  private Point[] base;
  private Dimension size;

  public EndPath(String name, Step source, Step destination, Object events) {
    this.name = name;
    this.fixed = false;

    this.origin = null;
    this.end = null;

    source.addOut(this); //Add to the path list of the step (used to call update() when the step moved)
    destination.addIn(this);
  }

  private void generatePoints() {
    this.points = new ArrayList();
    this.arrow = new Point[3];
    this.base = new Point[3];

    this.base[0] = this.origin;
    this.base[1] = new Point(this.base[0].getX()+this.size.getWidth(), this.base[0].getY());
    this.base[2] = new Point(this.base[0].getX()+this.size.getWidth()/2, this.base[0].getY()+this.size.getHeight());

    this.arrow[0] = this.end;
    this.arrow[1] = new Point(this.arrow[0].getX()+this.ARROW_SIZE/2, this.arrow[0].getY()-this.ARROW_SIZE);
    this.arrow[2] = new Point(this.arrow[0].getX()-this.ARROW_SIZE/2, this.arrow[0].getY()-this.ARROW_SIZE);

    this.points.add(this.base[2]);
    this.points.add(new Point(this.base[2].getX(), this.base[2].getY() + (this.arrow[0].getY() - this.base[2].getY() - this.ARROW_SIZE - this.DEFAULT_PADDING)/2));
    this.points.add(new Point(this.arrow[0].getX(), this.points.get(1).getY()));
    this.points.add(new Point(this.arrow[0].getX(), this.arrow[1].getY()));
  }

  private void initBox() {
    this.box = new Box(this.origin, this.size);
  }

  //Refresh points and box (box unused actually)
  public void update() {
    if (this.isFixed()) {
      this.generatePoints();
      this.initBox();
    }
  }

  public void setOrigin(Point origin) {
    this.origin = origin;
    if(this.end != null){
      this.fixed = true;
    }
  }

  public void setEnd(Point end) {
    this.end = end;
    if(this.origin != null){
      this.fixed = true;
    }
  }

  public void setSize(Dimension size) {
    this.size = size;
  }

  public boolean isFixed() {
    return this.fixed;
  }

  public String getName() {
    return this.name;
  }

  public Dimension getSize() {
    return this.size;
  }

  public Point getOrigin() {
    return this.origin;
  }

  public Box getBox() {
    return this.box;
  }

  public void draw() {
    for (int i = 1; i<this.points.size (); i++) {
      triangle(this.base[0].getX(), this.base[0].getY(), this.base[1].getX(), this.base[1].getY(), this.base[2].getX(), this.base[2].getY());
      line(this.points.get(i-1).getX(), this.points.get(i-1).getY(), this.points.get(i).getX(), this.points.get(i).getY());
      stroke(0);
      fill(255);
    }

    triangle(this.arrow[0].getX(), this.arrow[0].getY(), this.arrow[1].getX(), this.arrow[1].getY(), this.arrow[2].getX(), this.arrow[2].getY());
  }
}

//Draw a path
class Path implements Drawable {
  private final int FONT_SIZE = 10;
  private final int DEFAULT_PADDING = 5;
  private final int ARROW_SIZE = 10;
  private final int INFO_BUTTON_SIZE = 15;

  private String name;
  private ArrayList points;
  private Point origin;
  private Point end;
  private boolean fixed;
  private Box box;
  private Point[] arrow;
  private Point[] base;
  private Dimension size;

  private Step source;
  private Step destination;

  public Path(String name, Step source, Step destination, Object events) {
    this.name = name;
    this.fixed = false;

    this.origin = null;
    this.end = null;

    this.source = source;
    this.destination = destination;

    source.addOut(this); //Add to the path list of the step (used to call update() when the step moved)
    destination.addIn(this);
  }

  private void generatePoints() {
    this.points = new ArrayList();
    this.arrow = new Point[3];
    this.base = new Point[3];

    this.base[0] = this.origin;
    this.base[1] = new Point(this.base[0].getX()+this.size.getWidth(), this.base[0].getY());
    this.base[2] = new Point(this.base[0].getX()+this.size.getWidth()/2, this.base[0].getY()+this.size.getHeight());

    this.arrow[0] = this.end;
    this.arrow[1] = new Point(this.arrow[0].getX()+this.ARROW_SIZE/2, this.arrow[0].getY()-this.ARROW_SIZE);
    this.arrow[2] = new Point(this.arrow[0].getX()-this.ARROW_SIZE/2, this.arrow[0].getY()-this.ARROW_SIZE);

    this.points.add(this.base[2]);
    if (this.end.getY()<this.origin.getY()) {
      if (this.origin.getX() >= this.source.getBox().getOrigin().getX()+this.source.getBox().getSize().getWidth()/2) {
        this.points.add(new Point(this.points.get(this.points.size()-1).getX()+this.source.getBox().getSize().getWidth(), this.points.get(this.points.size()-1).getY()));
      } else {
        this.points.add(new Point(this.points.get(this.points.size()-1).getX()-this.source.getBox().getSize().getWidth(), this.points.get(this.points.size()-1).getY()));
      }
      this.points.add(new Point(this.points.get(this.points.size()-1).getX(), this.end.getY()-this.ARROW_SIZE));
    } else {
      this.points.add(new Point(this.base[2].getX(), this.base[2].getY() + (this.arrow[0].getY() - this.base[2].getY() - this.ARROW_SIZE - this.DEFAULT_PADDING)/2));
      this.points.add(new Point(this.arrow[0].getX(), this.points.get(1).getY()));
    }
    this.points.add(new Point(this.arrow[0].getX(), this.arrow[1].getY()));
  }

  private void initBox() {
    this.box = new Box(this.origin, this.size);
  }

  //Refresh points and box (box unused actually)
  public void update() {
    if (this.isFixed()) {
      this.generatePoints();
      this.initBox();
    }
  }

  public void setOrigin(Point origin) {
    this.origin = origin;
    if (this.end != null) {
      this.fixed = true;
    }
  }

  public void setEnd(Point end) {
    this.end = end;
    if (this.origin != null) {
      this.fixed = true;
    }
  }

  public void setSize(Dimension size) {
    this.size = size;
  }

  public boolean isFixed() {
    return this.fixed;
  }

  public String getName() {
    return this.name;
  }

  public Dimension getSize() {
    return this.size;
  }

  public Point getOrigin() {
    return this.origin;
  }

  public Box getBox() {
    return this.box;
  }

  public void draw() {
    smooth();
    strokeJoin(ROUND);
    strokeCap(ROUND);
    strokeWeight(1);

    stroke(0);
    fill(255);
    for (int i = 1; i<this.points.size (); i++) {
      line(this.points.get(i-1).getX(), this.points.get(i-1).getY(), this.points.get(i).getX(), this.points.get(i).getY());
    }

    triangle(this.base[0].getX(), this.base[0].getY(), this.base[1].getX(), this.base[1].getY(), this.base[2].getX(), this.base[2].getY());


    fill(0);
    triangle(this.arrow[0].getX(), this.arrow[0].getY(), this.arrow[1].getX(), this.arrow[1].getY(), this.arrow[2].getX(), this.arrow[2].getY());
    /*   
     textSize(this.FONT_SIZE);
     textAlign(CENTER);
     text(this.name, this.base[2].getX(), this.origin.getY() + (textAscent()+textDescent()) + this.DEFAULT_PADDING, this.size.getWidth());
     */
  }
  
  public void overDraw(){
    fill(0,200);
    stroke(0,0);
    rect(0,0,width,height);
    
    this.draw();
    
    fill(0);
    ellipse(this.base[2].getX(), this.base[1].getY() + this.size.getHeight()/2, this.INFO_BUTTON_SIZE, this.INFO_BUTTON_SIZE);
    
    
    fill(255);
    textMode(CENTER);
    textSize(15);
    text("i", this.base[2].getX() - textWidth("i")/2, this.base[1].getY() + this.size.getHeight()/2 + 5);
  }
}

//Draw a step
class Step implements Drawable {
  private final int FONT_SIZE = 20;
  private final int DEFAULT_PADDING = 10;
  private final int PATH_HEIGHT = 20;

  private String name;
  private Point origin;
  private boolean fixed;
  private Box box;
  private ArrayList inPaths;
  private ArrayList outPaths;

  public Step(String name, Point origin) {
    this.inPaths = new ArrayList();
    this.outPaths = new ArrayList();
    
    this.name = name;
    textSize(this.FONT_SIZE);
    this.origin = origin;
    this.fixed = true;
    this.initBox();
  }

  public Step(String name) {
    this.inPaths = new ArrayList();
    this.outPaths = new ArrayList();
    
    this.name = name;
    textSize(this.FONT_SIZE);
    this.origin = new Point(10, (this.DEFAULT_PADDING + textAscent()));
    this.fixed = false;
    this.initBox();
  }

  public void addIn(Path path){
    this.inPaths.add(path);
    this.refreshPathsEnd();
  }
  
  public void addOut(Path path){
    this.outPaths.add(path);
    this.refreshPathsOrigin();
  }
  
  private void refreshPathsOrigin(){
    int pathWidth = this.box.getSize().getWidth()/this.outPaths.size();
    Point origin = new Point(this.box.getOrigin().getX(), this.box.getOrigin().getY()+this.box.getSize().getHeight());
    
    for(int i=0;i<this.outPaths.size();i++){
      this.outPaths.get(i).setOrigin(origin);
      this.outPaths.get(i).setSize(new Dimension(pathWidth,this.PATH_HEIGHT));
      this.outPaths.get(i).update();
      
      origin = new Point(origin.getX()+pathWidth,origin.getY());
    }
  }
  
  private void refreshPathsEnd(){
    Point end = new Point(this.box.getOrigin().getX()+(this.box.getSize().getWidth()/(this.outPaths.size()+1)), this.box.getOrigin().getY());
    
    for(int i=0;i<this.inPaths.size();i++){
      this.inPaths.get(i).setEnd(end);
      this.inPaths.get(i).update();
      
      end = new Point(end.getX()+(this.box.getSize().getWidth()/(this.outPaths.size()+1)),origin.getY());
    }
  }
  
  public void refreshPaths(){
    this.refreshPathsOrigin();
    this.refreshPathsEnd();
  }

  private void initBox() {
    int boxHeight;

    boxHeight = this.getSize().getHeight() + (this.DEFAULT_PADDING*2);
    this.box = new Box(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())), new Dimension(this.getSize().getWidth() + (this.DEFAULT_PADDING*2), boxHeight));
  }

  public void setOrigin(Point origin) {
    this.origin = origin;
    textSize(this.FONT_SIZE);
    //this.box.setOrigin(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())));
    this.initBox();
    this.fixed = true;
  }

  public boolean isFixed() {
    return this.fixed;
  }

  public String getName() {
    return this.name;
  }

  public Dimension getSize() {
    textSize(this.FONT_SIZE);
    return new Dimension(textWidth(this.name), (textAscent() + textDescent()));
  }

  public Point getOrigin() {
    return this.origin;
  }

  public Box getBox() {
    return this.box;
  }

  public void draw() {
    this.box.draw();

    fill(0);
    textSize(this.FONT_SIZE);
    textAlign(LEFT,BASELINE);
    text(this.name, this.origin.getX(), this.origin.getY());
  }
  
  public void overDraw(){
    fill(0,200);
    stroke(0,0);
    rect(0,0,width,height);
    
    this.draw();
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

