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
