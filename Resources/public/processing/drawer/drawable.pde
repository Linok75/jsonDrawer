//All elements need to draw
interface Drawable{
    void setOrigin(Point point); //set origin (and fixed to true)
    void draw(); //draw element
    boolean isFixed(); //return true if the origin is setted
    Box getBox(); //return the (outer)box of the element
}
