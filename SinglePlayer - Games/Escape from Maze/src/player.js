class Player
{
   constructor(c) {
      this.x = 0;
      this.y = -40;
      this.r = 0;
    }
 

hasWon(mz)
{
    let cellX = Math.trunc(this.x/40), cellY = Math.trunc(this.y/40), max = mz.length-1;
    return cellX == max && cellY == max;
}

//canvas, mouse x,y,offsetX,Y
aim(c,x,y,oX,oY){
 
    let r = canvas.getBoundingClientRect(),
     xDif = ((this.x-oX)+20)-(x - r.left),
     yDif = ((this.y-oY)+20)-(y - r.top);

    this.target = (Math.abs(yDif) > Math.abs(xDif)) ? Math.abs(yDif) == yDif ? cmp.north : cmp.south :  Math.abs(xDif) == xDif ? cmp.west : cmp.east;
    this.tx = oX + (x - (r.left));
    this.ty = oY + (y - (r.top));

}
 
  update(mz, keys)
  {
    this.r += this.r>360 ? -360 : 5;

    if(this.y < 0){
      this.y += 1;
      return;
    }

    let cellX = Math.trunc(this.x/40), cellY = Math.trunc(this.y/40), vx = 0, vy = 0, h = 0, w = 0, wall = 0, owall = 0,s = 3; 

    if(keys[37] || this.target == cmp.west){
        vx -=s;
        //Push player to top of the cell so we do not run over any lines
        vy = -(this.y%40);
        wall=cmp.west;
        owall=cmp.east;
        if(this.x+20 <= this.tx){this.target=cmp.none}
    }else if(keys[38] || this.target == cmp.north){
       vy -=s;
       vx = -(this.x%40);
       wall=cmp.north;
       owall=cmp.south;
       if(this.y+20 <= this.ty){this.target=cmp.none}
    }else if(keys[39] || this.target == cmp.east){
       vx = s;
       vy = -(this.y%40);
       w=40;
       wall=cmp.east;
       owall=cmp.west;
       if(this.x+20 >= this.tx){this.target=cmp.none}
    }else if(keys[40] || this.target == cmp.south){
       vy = s;
       vx = -(this.x%40);
       h=40;
       wall=cmp.south;
       owall=cmp.north;
       if(this.y+20 >= this.ty){this.target=cmp.none}
    }

    if(this.x+vx < 0 || this.y+vy < 0){
      return;
    }

    let newCellX = Math.trunc((this.x+w+vx)/40), newCellY = Math.trunc((this.y+h+vy)/40);

    //Collision Detection
    if(cellX!=newCellX || cellY!=newCellY)
    {
      if((mz[cellX][cellY] & wall) == wall || newCellX >= mz.length || newCellY >= mz.length || (mz[newCellX][newCellY] & owall) == owall)
      {  
       //If we hit the wall then place it to the edge of the cell
       if(wall==cmp.north){
          this.y = cellY * 40
       }
       if(wall==cmp.south){
          this.y = (newCellY-1) * 40
       }
       if(wall==cmp.east){
          this.x = (newCellX -1) * 40
       }
       if(wall==cmp.west){
          this.x = cellX * 40
       }

       this.target = cmp.none;
      Snd.hit();
       return;
      }
    } 

    this.x += vx;
    this.y += vy;          
  }

  render(c)
  {
    c.save();

    //player x & y are top left of each cell next line  
    //move to middle to of the cell to begin drawing
    c.translate(this.x+20, this.y+20); 
    c.rotate(this.r * Math.PI / 180);

      let radius = 10, startAngle = 1.25 * Math.PI,  endAngle = 1.85 * Math.PI, cc = false;
 			c.lineWidth = 5;
      c.beginPath();
      c.arc(0,0, radius, startAngle, endAngle, cc);
      c.strokeStyle = "#6f6";
      c.stroke();
      startAngle = 0.25 * Math.PI;
      endAngle = 0.85 * Math.PI;
      c.beginPath();
      c.arc(0, 0, radius, startAngle, endAngle, cc);
      c.strokeStyle = "#6f6";
      c.stroke();           
      radius = 3;
      startAngle = 0 * Math.PI;
      endAngle = 1 * Math.PI;
      c.beginPath();
      c.arc(0, 0, radius, 0, 2 * Math.PI, cc);
      c.fillStyle = "#6f6";
      c.fill();
    c.restore();

  }
}