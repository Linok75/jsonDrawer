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

