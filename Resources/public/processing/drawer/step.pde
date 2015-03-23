//Draw a step
class Step implements Drawable {
  private final int FONT_SIZE = 20;
  private final int DEFAULT_PADDING = 10;

  private String name;
  private Point origin;
  private boolean fixed;
  private Box box;

  public Step(String name, Point origin) {
    this.name = name;
    textSize(this.FONT_SIZE);
    this.origin = origin;
    this.fixed = true;
    this.initBox();
  }

  public Step(String name) {
    this.name = name;
    textSize(this.FONT_SIZE);
    this.origin = new Point(10, (this.DEFAULT_PADDING + textAscent()));
    this.fixed = false;
    this.initBox();
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

