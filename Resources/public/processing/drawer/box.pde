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

