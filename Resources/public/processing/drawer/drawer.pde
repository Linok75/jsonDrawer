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

