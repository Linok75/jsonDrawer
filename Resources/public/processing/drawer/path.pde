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
  private String side; //RIGHT, LEFT

  public Path(String name, Step source, Step destination, String side) {
    this.name = name;
    this.side = side;
    textSize(this.FONT_SIZE);
    this.source = source;
    this.destination = destination;
    this.fixed = true;
    this.generatePoints();
    this.initBox();
  }

  private void generatePoints() {
    this.points = new ArrayList();

    switch (this.side) {
    case "RIGHT" :
      this.rightSideConf();
      break;

    case "LEFT" : 
      this.leftSideConf();
      break;

    default :
      throw new Error("Unknow side configuration !");
    }
  }

  private void leftSideConf() {
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
  }

  private void rightSideConf() {
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
  }
  
  private void initBox() {
    int boxHeight;

    boxHeight = this.getSize().getHeight() + (this.DEFAULT_PADDING*2);
    this.box = new Box(new Point(this.origin.getX() - this.DEFAULT_PADDING, this.origin.getY()-(this.DEFAULT_PADDING + textAscent())), new Dimension(this.getSize().getWidth() + (this.DEFAULT_PADDING*2), boxHeight));
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

    this.drawArrow(this.points.get(this.points.size()-1));
  }

  private void drawArrow(Point origin) {
    switch (this.side) {
    case "RIGHT" :
      triangle(origin.getX(), origin.getY(), origin.getX()+this.ARROW_SIZE, origin.getY()-this.ARROW_SIZE/2, origin.getX()+this.ARROW_SIZE, origin.getY() + this.ARROW_SIZE/2);
      break;

    case "LEFT" : 
      triangle(origin.getX(), origin.getY(), origin.getX()-this.ARROW_SIZE, origin.getY()-this.ARROW_SIZE/2, origin.getX() - this.ARROW_SIZE, origin.getY() + this.ARROW_SIZE/2);
      break;

    default :
      throw new Error("Unknow side configuration !");
    }
  }
}

