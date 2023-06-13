  
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
  
  function wiggleAction(timestart,xstart,ystart,xthrow,yhop,len)
  {
     return function(gameTime,frameTime) {	
	   gameTime-=timestart;
	   this.x=xstart+r_i(r_siso(r_pingpong(gameTime,len)),0,xthrow);	  
	   this.y=ystart+(gameTime/len)*yhop;	  
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
		  this.fireNow=false;
		  if (board.control_active) {
			//preprocess the co-ordinates
			var x=(board.control_x-50)/100;
			if (x<-.45) x=-.45;
			if (x>.45) x=.45;						
			var a=(board.control_y<100)?1:(150-board.control_y)/50;
		    this.x=adjustTowards(this.x,50+x*100,.05*frameTime);
		    this.a=adjustTowards(this.a,a,frameTime/1000);			
			this.fireNow=true;
		  }
		  if (board.keyList[68]||board.keyList[39]) {
			 this.x=adjustTowards(this.x,97,.05*frameTime);		     
			 this.fireNow=true;
		  }
		  if (board.keyList[65]||board.keyList[37]) {
			 this.x=adjustTowards(this.x,3,.05*frameTime);		     
			 this.fireNow=true;
		  }
		  if (board.keyList[87]||board.keyList[38]) {
			 this.a=adjustTowards(this.a,1,frameTime/1000);		     
			 this.fireNow=true;
		  }
		  if (board.keyList[83]||board.keyList[40]) {
			 this.a=adjustTowards(this.a,0,frameTime/1000);		     
			 this.fireNow=true;
		  }
		  if (board.keyList[32]||board.keyList[13]) {
			 this.fireNow=true;
		  }
		  if (this.fireNow) { //we are active
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
          if (this.fireNow) 
			addOb(sprites.aBullet,bulletAction(this.x,this.y,this.pointAng,100),null);			
		  //record the action
	      board.shadowRec.push({x:this.x, y: this.y, pAng: this.pointAng, fire: this.fireNow });
	  }
  }
  
  
  function ghostFollowAction(followArray)
  {
	  return function(gameTime,frameTime) {	
	     var f=idiv(gameTime,250);  //frame number in the array
		 var r=(gameTime%250)/250;
		 if (this.isDead) return;
		 if (f+1>=followArray.length) {
			 //we've run out of life so kill us
			 killOb(this);
			 return;
		 }			 					 		 		 	  
	     this.x=r_i(r,followArray[f].x,followArray[f+1].x);
	     this.y=r_i(r,followArray[f].y,followArray[f+1].y);
		 this.pointAng=r_i(r,followArray[f].pAng,followArray[f+1].pAng);
		 if (!isNaN(this.pointAng))
		   this.display.style.transform='rotate('+(this.pointAng+Math.PI/2)+'rad)';			
	 }  
  }
  
  function ghostFireAction(followArray)
  {
	  return function(gameTime,fireCount){
		 if (this.isDead) return;
		 var f=idiv(gameTime,250);  //frame number in the array		 
         if (followArray[f].fire) 
		   addOb(sprites.gBullet,bulletAction(this.x,this.y,this.pointAng,100),null);			
		  
	  }
  }
  
  
  function regularFireAction(fireOff,fireCycle,bullet,speed)
  {
	  return function(gameTime,fireCount) {
          if (!((fireCount+fireOff)%fireCycle)) 
            addOb(bullet,bulletAction(this.x,this.y,3.14/2,speed),null);					  
		  
	  }
  }

  function diveBombAction(fireOff,fireCycle,speed)
  {
	  return function(gameTime,fireCount) {
          if (!((fireCount+fireOff)%fireCycle)) {
			if (this.y>-50) //only start the dive if you are low enough
               programOb(this,diveAction(this.x,this.y,speed),null);					  		  
		  }
	  }
  }

  function diveAction(xstart,ystart,speed)
  {  var xs=-xstart+board.avatar.x;
     var ys=speed;
	 return function(gameTime,frameTime) {	
	   this.x=xstart+xs*gameTime/1000;
	   this.y=ystart+ys*gameTime/1000;
	 } 
  }
  
  function regularFireAngleAction(fireOff,fireCycle,bullet,speed,angle)
  {
	  return function(gameTime,fireCount) {
          if (!((fireCount+fireOff)%fireCycle)) {
			var ang=angle*Math.random();
			if (board.avatar.x>this.x)  
                  ang*=-1;				
            addOb(bullet,bulletAction(this.x,this.y,3.14/2+ang/180*3.14,speed),null);					  
		  }
		  
	  }
  }
  
  function dualFireAngleAction(fireOff,fireCycle,bullet,speed,angle)
  {
	  return function(gameTime,fireCount) {
          if (!((fireCount+fireOff)%fireCycle)) {
			var ang=angle*Math.random();
			if (board.avatar.x>this.x)  
                  ang*=-1;				
            addOb(bullet,bulletAction(this.x,this.y,3.14/2+ang/180*3.14,speed),null);					 
            addOb(bullet,bulletAction(this.x,this.y,3.14/2+ang/180*3.14/2,speed*.9),null);					  			
		  }
		  
	  }
  }

  
  function xZoneFireAction(zone,fireOff,fireCycle,bullet,speed)
  {
	  return function(gameTime,fireCount) {
		  if (Math.abs(board.avatar.x-this.x)>zone) return;
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
  
  function sqAction(timestart,xstart,ystart,xthrow,ythrow,ytravel,len)
  {
     return function(gameTime,frameTime) {	
	   gameTime-=timestart;
	   this.x=xstart
	          +r_i(r_siso(r_limit(r_cycle(gameTime,len),0,.25)),0,xthrow)
			  -r_i(r_siso(r_limit(r_cycle(gameTime,len),.5,.75)),0,xthrow);	  
	   this.y=ystart
	          +r_i(r_siso(r_limit(r_cycle(gameTime,len),.25,.5)),0,ythrow)
			  -r_i(r_siso(r_limit(r_cycle(gameTime,len),.75,1)),0,ythrow)	  
	          +(gameTime/len)*ytravel;	  
	}
  }