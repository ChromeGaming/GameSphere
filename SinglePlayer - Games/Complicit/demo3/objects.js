  
  function r_cycle(count,time) { return (count%time)/time; }
  function r_pingpong(count,time) { a=r_cycle(count,time*2); return (a<.5)?a*2:2-a*2; }
  function r_limit(r,s,e) { return (r<s)?0:((r>e)?1:(r-s)/(e-s));}
  function r_siso(r) { return 3*r*r-2*r*r*r;}
  
  function r_i(r,s,e) { return s*(1-r)+e*r; }
  function idiv(n,d) { return Math.floor(n/d);}
  
  function step(x,step) {return Math.floor(x/step)*step;}
  
  function adjustTowards(source, target, change)
    {
        var diff = target - source;
        if (Math.abs(diff) < change)
            return target;
        if (diff > 0)
            return source + change;
        else
            return source - change;
    }
  
  function weaveAction(timestart,xstart,ystart,xthrow,yhop,len)
  {
     return function(gameTime,frameTime) {	
	   gameTime-=timestart;
	   this.x=xstart+r_i(r_siso(r_pingpong(gameTime,len)),0,xthrow);	  
	   this.y=ystart+r_i((r_limit(r_cycle(gameTime,len),.8,1)),0,yhop)+	       
		    idiv(gameTime,len)*yhop;	  
	}
  }
  
  function slideAction(timestart,xstart,ystart,xthrow,ythrow,len)
  {
     return function(gameTime,frameTime) {	
	   gameTime-=timestart;
	   this.x=xstart+r_i(r_siso(r_pingpong(gameTime,len)),0,xthrow);	  
	   this.y=ystart+r_i(r_cycle(gameTime,len),0,ythrow)+	       
		        idiv(gameTime,len)*ythrow;	  
	}
  }
  
  function followControllerAction()
  {
	  return function(gameTime,frameTime){
		  if (this.a===undefined) {
			  this.a=0;
			  this.x=50;
			  this.y=130;
			  board.avatar=this;          
		  }
		  if (board.control_active) {
			//preprocess the co-ordinates
			var x=(board.control_x-50)/100;
			var a=(board.control_y<100)?1:(150-board.control_y)/50;
		    this.x=adjustTowards(this.x,50+x*100,.1*frameTime);
		    //if (!this.a) this.a=0;			
			this.a=adjustTowards(this.a,a,frameTime/1000);
			x=(this.x-50)/100; //go back with our actual point
			var y=this.a*x*x+this.a; //basic space mapping y=ax^2+a from a-space to y-space
			this.y=135-y*50;
			this.pointAng=-Math.atan(2*this.a*x)-Math.PI/2; //gets the angle of the tangent from  dy/dx=2ax
			this.display.style.transform='rotate('+(this.pointAng+Math.PI/2)+'rad)';
			
		  }
	  }
  }
  
  function avatarFireAction()
  {
	  return function(gameTime,fireCount){
          if (board.control_active) 
			addOb(sprites.aBullet,bulletAction(this.x,this.y,this.pointAng,100),null);			
		  //record the action
	      board.shadowRec.push({x:this.x, y: this.y, pAng: this.pointAng, fire: board.control_active });
	  }
  }
  
  function regularFireAction(fireOff,fireCycle,bullet,speed)
  {
	  return function(gameTime,fireCount) {
          if (!((fireCount+fireOff)%fireCycle)) 
            addOb(bullet,bulletAction(this.x,this.y,3.14/2,speed),null);					  
		  
	  }
  }

  function bulletAction(xstart,ystart,angle,speed)
  {
	 var xs=Math.cos(angle)*speed;
	 var ys=Math.sin(angle)*speed;
	 
	 return function(gameTime,frameTime) {	
	   this.x=xstart+xs*gameTime/1000;
	   this.y=ystart+ys*gameTime/1000;
	 } 
  }