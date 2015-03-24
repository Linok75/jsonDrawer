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

