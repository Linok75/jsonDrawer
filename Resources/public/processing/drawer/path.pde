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

