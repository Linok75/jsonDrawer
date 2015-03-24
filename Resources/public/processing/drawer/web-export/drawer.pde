private float framerate = 24;
private int minY = 50; //Top of ordinate axe
private ArrayList drawables; //Elements to draw
private Point topPosition; //Default position of the first element
private Step stepFocused = null;

//Init drawer
public void setup() {
  size(500, 500);
  frameRate(framerate);
  noLoop();
  stroke(#000000);
  fill(#ffffff);
  background(#ffffff);

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
    this.stepFocused.setOrigin(new Point(mouseX,mouseY));
    this.stepFocused.notifyPaths();
    redraw();
  }
}

public void mouseReleased(){
  this.stepFocused = null;
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

public void addPath(String name, String srcName, String destName) {
  Step source, destination, tmp;

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

  this.drawables.add(new Path(name, source, destination));
  this.redraw();
}

//Box (for other elements or juste draw a box(rect))
class Box implements Drawable {
  public final static int DEFAULT_MARGIN = 50;

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
    rect(this.origin.getX(), this.origin.getY(), this.size.getWidth(), this.size.getHeight());
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
class Path implements Drawable {
  private final int FONT_SIZE = 13;
  private final int DEFAULT_PADDING = 10;
  private final int ARROW_SIZE = 10;

  private String name;
  private ArrayList points;
  private Step source;
  private Step destination;
  private Point origin;
  private boolean fixed;
  private Box box;
  private Point[] arrow;

  public Path(String name, Step source, Step destination) {
    this.name = name;
    textSize(this.FONT_SIZE);
    this.source = source;
    this.destination = destination;
    this.source.addPath(this);
    this.destination.addPath(this);
    this.fixed = true;
    this.generatePoints();
    this.initBox();
  }

  private void generatePoints() {
    this.points = new ArrayList();
    this.arrow = new Point[3];


    //Source on the right of destination
    if (this.source.getBox().getOrigin().getX() > this.destination.getBox().getOrigin().getX()) {
      //Source on the left of destination
      if ( (this.source.getBox().getOrigin().getX() + this.source.getBox().getSize().getWidth()) < (this.destination.getBox().getOrigin().getX() + this.destination.getBox().getSize().getWidth()) ) {
        //Source box above destination boxs
        if (this.source.getBox().getOrigin().getY() > this.destination.getBox().getOrigin().getY()) {
          //TOP_BOT_ARROW
          this.topSideArrow();
        } else {
          //BOT_TOP_ARROW
          this.botSideArrow();
        }
      } else {
        //RIGHT_RIGHT_ARROW
        this.rightSideArrow();
      }
    }else{
      //LEFT_LEFT_ARROW
      this.leftSideArrow();
    }
  }
  
  private void topSideArrow(){
    Point previousPoint, point;

    point = new Point(this.source.getBox().getOrigin().getX() + this.source.getBox().getSize().getWidth()/2, this.source.getBox().getOrigin().getY());
    this.points.add(point);

    previousPoint = point;
    point = new Point(previousPoint.getX(), previousPoint.getY() - (previousPoint.getY() - (this.destination.getBox().getOrigin().getY()+this.destination.getBox().getSize().getHeight()))/2);
    this.points.add(point);

    previousPoint = point;
    point = new Point(this.destination.getBox().getOrigin().getX() + this.destination.getBox().getSize().getWidth()/2, previousPoint.getY());
    this.points.add(point);

    this.origin = new Point(point.getX() - (this.getSize().getWidth() + this.DEFAULT_PADDING), (point.getY() - previousPoint.getY())/2 + previousPoint.getY() + this.getSize().getHeight()/2);

    previousPoint = point;
    point = new Point(previousPoint.getX(), this.destination.getBox().getOrigin().getY()+this.destination.getBox().getSize().getHeight());
    this.points.add(point);
    
    this.arrow[0] = point;
    this.arrow[1] = new Point(point.getX()+this.ARROW_SIZE/2, point.getY()+this.ARROW_SIZE);
    this.arrow[2] = new Point(point.getX()-this.ARROW_SIZE/2, point.getY()+this.ARROW_SIZE);
  }
  
  private void botSideArrow(){
    Point previousPoint, point;

    point = new Point(this.source.getBox().getOrigin().getX() + this.source.getBox().getSize().getWidth()/2, this.source.getBox().getOrigin().getY() + this.source.getBox().getSize().getHeight());
    this.points.add(point);

    previousPoint = point;
    point = new Point(previousPoint.getX(), previousPoint.getY() + (this.destination.getBox().getOrigin().getY()-previousPoint.getY())/2);
    this.points.add(point);

    previousPoint = point;
    point = new Point(this.destination.getBox().getOrigin().getX() + this.destination.getBox().getSize().getWidth()/2,  previousPoint.getY());
    this.points.add(point);

    this.origin = new Point(point.getX() - (this.getSize().getWidth() + this.DEFAULT_PADDING), (point.getY() - previousPoint.getY())/2 + previousPoint.getY() + this.getSize().getHeight()/2);

    previousPoint = point;
    point = new Point(previousPoint.getX(), this.destination.getBox().getOrigin().getY());
    this.points.add(point);
    
    this.arrow[0] = point;
    this.arrow[1] = new Point(point.getX()+this.ARROW_SIZE/2, point.getY()-this.ARROW_SIZE);
    this.arrow[2] = new Point(point.getX()-this.ARROW_SIZE/2, point.getY()-this.ARROW_SIZE);
  }

  private void leftSideArrow() {
    Point previousPoint, point;

    point = new Point(this.source.getBox().getOrigin().getX(), this.source.getBox().getOrigin().getY() + this.source.getBox().getSize().getHeight()/2);
    this.points.add(point);

    previousPoint = point;
    point = new Point(previousPoint.getX() - (abs(this.source.getBox().getSize().getWidth() - this.destination.getBox().getSize().getWidth())/2 + this.DEFAULT_PADDING + this.ARROW_SIZE), previousPoint.getY());
    this.points.add(point);

    previousPoint = point;
    point = new Point(previousPoint.getX(), this.destination.getBox().getOrigin().getY() + this.destination.getBox().getSize().getHeight()/2);
    this.points.add(point);

    this.origin = new Point(point.getX() - (this.getSize().getWidth() + this.DEFAULT_PADDING), (point.getY() - previousPoint.getY())/2 + previousPoint.getY() + this.getSize().getHeight()/2);

    previousPoint = point;
    point = new Point(this.destination.getBox().getOrigin().getX(), previousPoint.getY());
    this.points.add(point);
    
    this.arrow[0] = point;
    this.arrow[1] = new Point(point.getX()-this.ARROW_SIZE, point.getY()-this.ARROW_SIZE/2);
    this.arrow[2] = new Point(point.getX()-this.ARROW_SIZE, point.getY() + this.ARROW_SIZE/2);
  }

  private void rightSideArrow() {
    Point previousPoint, point;

    point = new Point(this.source.getBox().getOrigin().getX() + this.source.getBox().getSize().getWidth(), this.source.getBox().getOrigin().getY() + this.source.getBox().getSize().getHeight()/2);
    this.points.add(point);

    previousPoint = point;
    point = new Point(previousPoint.getX() + (abs(this.source.getBox().getSize().getWidth() - this.destination.getBox().getSize().getWidth())/2 + this.DEFAULT_PADDING + this.ARROW_SIZE), previousPoint.getY());
    this.points.add(point);

    previousPoint = point;
    point = new Point(previousPoint.getX(), this.destination.getBox().getOrigin().getY() + this.destination.getBox().getSize().getHeight()/2);
    this.points.add(point);

    this.origin = new Point(point.getX() + this.DEFAULT_PADDING, (point.getY() - previousPoint.getY())/2 + previousPoint.getY() + this.getSize().getHeight()/2);

    previousPoint = point;
    point = new Point(this.destination.getBox().getOrigin().getX() + this.destination.getBox().getSize().getWidth(), previousPoint.getY());
    this.points.add(point);
    
    this.arrow[0] = point;
    this.arrow[1] = new Point(point.getX()+this.ARROW_SIZE, point.getY()-this.ARROW_SIZE/2);
    this.arrow[2] = new Point(point.getX()+this.ARROW_SIZE, point.getY() + this.ARROW_SIZE/2);
  }

  private void initBox() {
    int boxHeight;

    boxHeight = this.getSize().getHeight() + (this.DEFAULT_PADDING*2);
    this.box = new Box(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())), new Dimension(this.getSize().getWidth() + (this.DEFAULT_PADDING*2), boxHeight));
  }

  public void update() {
    this.generatePoints();
    this.initBox();
  }

  public void setOrigin(Point origin) {
    this.origin = origin;
    this.initBox();
  }

  public boolean isFixed() {
    return this.fixed;
  }

  public String getName() {
    return this.name;
  }

  public Dimension getSize() {
    return new Dimension(textWidth(this.name), (textAscent() + textDescent()));
  }

  public Point getOrigin() {
    return this.origin;
  }

  public Box getBox() {
    return this.box;
  }

  public void draw() {
    for (int i = 1; i<this.points.size (); i++) {
      line(this.points.get(i-1).getX(), this.points.get(i-1).getY(), this.points.get(i).getX(), this.points.get(i).getY());
      stroke(0);
    }

    triangle(this.arrow[0].getX(),this.arrow[0].getY(),this.arrow[1].getX(),this.arrow[1].getY(),this.arrow[2].getX(),this.arrow[2].getY());
  }
}

//Draw a step
class Step implements Drawable {
  private final int FONT_SIZE = 20;
  private final int DEFAULT_PADDING = 10;

  private String name;
  private Point origin;
  private boolean fixed;
  private Box box;
  private ArrayList paths;

  public Step(String name, Point origin) {
    this.paths = new ArrayList();
    this.name = name;
    textSize(this.FONT_SIZE);
    this.origin = origin;
    this.fixed = true;
    this.initBox();
  }

  public Step(String name) {
    this.paths = new ArrayList();
    this.name = name;
    textSize(this.FONT_SIZE);
    this.origin = new Point(10, (this.DEFAULT_PADDING + textAscent()));
    this.fixed = false;
    this.initBox();
  }

  public void addPath(Path path){
    this.paths.add(path);
  }
  
  public void notifyPaths(){
    for(int i=0;i<this.paths.size();i++){
      this.paths.get(i).update();
    }
  }

  private void initBox() {
    int boxHeight;

    boxHeight = this.getSize().getHeight() + (this.DEFAULT_PADDING*2);
    this.box = new Box(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())), new Dimension(this.getSize().getWidth() + (this.DEFAULT_PADDING*2), boxHeight));
  }

  public void setOrigin(Point origin) {
    this.origin = origin;
    this.box.setOrigin(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())));
    this.fixed = true;
  }

  public boolean isFixed() {
    return this.fixed;
  }

  public String getName() {
    return this.name;
  }

  public Dimension getSize() {
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

    fill(0, 0, 0);
    textSize(this.FONT_SIZE);
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

