class Maze{
   
  build(sz)
  {
    this.sz = sz;
    this.maze = this._create2DArray(sz);
    this._carvePassagesTo(0, 0, "N");
    this.maze[sz-1][sz-1] = this.maze[sz-1][sz-1] & ~cmp.south;//make exit
  }

  _carvePassagesTo(x, y, fromDirection){

    //intilize cell to mark as visited
    this.maze[x][y] = cmp.none;
  
    const directions = [{name:"N",opposite:"S",x:0,y:-1,wall: cmp.north},{name:"S",opposite:"N",x:0,y:1,wall: cmp.south}, {name:"E",opposite:"W",x:1,y:0, wall: cmp.east}, {name:"W",opposite:"E",x:-1,y:0,wall: cmp.west}];
    const randomDirections = this._shuffleArray(directions);

    randomDirections.forEach((headingDirection)=>{

        if(this._canVisit(x,y,x+headingDirection.x, y+headingDirection.y))
        {
          this._carvePassagesTo(x+headingDirection.x, y+headingDirection.y, headingDirection.opposite); 
        }else if(fromDirection != headingDirection.name) {
          this.maze[x][y] = this.maze[x][y] | headingDirection.wall;//build wall
        }
        
      })

  }
            
  _canVisit(x,y,targetX, targetY)
  {
    return !((targetX < 0 || targetX >= this.sz) || (targetY < 0 || targetY >= this.sz)||(this.maze[targetX][targetY] != null))
  }

  _create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
      arr[i] = [];
      for (var j=0;j<rows;j++) {
          arr[i].push(null);
      }
      
    }

    return arr;
  }
  
  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   * see http://stackoverflow.com/a/12646864/33
   */
  _shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }
    
  render(c)
  {

  c.save();
 
  c.strokeStyle = "#6f6"; 
  c.shadowColor = "#c2ffc2";
  c.shadowOffsetX = 1;
  c.shadowOffsetY = 1;
  c.shadowBlur = 2;

  c.beginPath(); 

    for (let x = 0; x < this.sz; x ++) {
      for (let y = 0; y < this.sz; y ++) {
        
        if(this.maze[x][y] & cmp.north){
          c.moveTo((x*40), 0.5 + (y*40));
          c.lineTo(((x+1)*40), 0.5 + (y*40));
        }
        
        if(this.maze[x][y] & cmp.east){
          c.moveTo(0.5 + ((x+1)*40), (y*40));
          c.lineTo(0.5 + ((x+1)*40),  ((y+1)*40));
        }
          
        if(this.maze[x][y] & cmp.west){
          c.moveTo(0.5 + (x*40), (y*40));
          c.lineTo(0.5 + (x*40),  ((y+1)*40));
        }
        
          if(this.maze[x][y] & cmp.south){
            c.moveTo((x*40), 0.5 + ((y+1)*40));
            c.lineTo(((x+1)*40), 0.5 + ((y+1)*40));
          }
 
      }
    }

    c.closePath();	
    c.stroke();
    c.restore();
    
  }
}
     