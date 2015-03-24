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

