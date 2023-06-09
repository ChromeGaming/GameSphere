  
  var board=document.getElementById('board');
  	
  function positionBoard() {
    var w=window.innerWidth;
	var h=window.innerHeight;
	if (w*1.5>h) { //the height is the problem
	  w=h/1.5;
	} else {
	  h=w*1.5;
	}
	board.fx=w/100;	
	board.style.left=((window.innerWidth-w)/2)+'px';
	board.style.top=((window.innerHeight-h)/2)+'px';
	board.style.width=w+'px';
	board.style.height=h+'px';	
  }
  
  function attachBoardHandlers() 
  {
	 function setTarget(e)
	 {
		var x;
		var y;
		//get the point in page space
		if (e.touches) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		} else if (e.pageX || e.pageY) {
			x = e.pageX;
			y = e.pageY;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x-=board.offsetLeft;
		y-=board.offsetTop;
		board.control_x=x/board.fx;
		board.control_y=y/board.fx;				
	 }
	 
	 function handleStart(e) {
	    board.control_active=true;
		setTarget(e);					    
	 } 
	 
	 function handleEnd(e) {
	    setTarget(e);				
	    board.control_active=false;
	 } 
	 
	 function handleCancel(e) {
	    board.control_active=false;
	 } 
	 
	 function handleMove(e) {
	    if (board.control_active) setTarget(e);		
	 } 	 
	 	
	board.addEventListener("touchstart", handleStart, false);
    board.addEventListener("touchend", handleEnd, false);
    board.addEventListener("touchcancel", handleCancel, false);
    board.addEventListener("touchmove", handleMove, false);
	
	board.addEventListener("mousedown", handleStart, false);
    board.addEventListener("mouseup", handleEnd, false);
    board.addEventListener("mouseout", handleCancel, false);
    board.addEventListener("mousemove", handleMove, false);	
  }
  
  function position(ob)
  {
	ob.style.transform='translate3D('+(ob.x*board.fx)+'px,'+(ob.y*board.fx)+'px,0)';    
  }
  
  function resetSection()
  {
	board.innerHTML="";
    board.gameTime=board.sectionStartTime;
    		
	//add the avatar
	addOb(sprites.avatar,followControllerAction(),avatarFireAction());

	//add the shadows	
	
	
	
	//create the section
	initSection()		
  }
  
  function initSection()
  {
	 board.shadows=[];
     board.shadowRec=[];	  
     //add the rest
	 board.levelContent[board.levelPos]();	
	 board.sectionStartTime=board.gameTime;
  }
  
  function setUp() {
	prepSprites();
	positionBoard();
	attachBoardHandlers();
    window.onresize=positionBoard;
	
	
	board.levelContent=zoneA;
	board.levelPos=0;	
	board.sectionStartTime=0;
	resetSection();
	
	game();
  }
  
  function addOb(sprite,action,fireAction)
  {
      var el=document.createElement('div');
	  
	  el.classList.add('boardobject');
	  el.rad=sprite.size/2;
	  el.coltype=sprite.coltype;
	  el.style.width=(el.rad*2*board.fx)+'px';
	  el.style.height=(el.rad*2*board.fx)+'px';
	  el.style.left=(-el.rad*board.fx)+'px';
	  el.style.top=(-el.rad*board.fx)+'px';
	  
      el.eachFrame=action;
	  el.fire=fireAction;
	  el.x=el.y=-10;
	  el.createTime=board.gameTime;
	  el.display=document.createElement('div');
	  el.display.classList.add(sprite.displayCls);
	  el.display.style.backgroundImage = 'url('+sprite.imgData+')';
	  el.appendChild(el.display);
	  board.appendChild(el);
	  return el;
  }
  
  function testCollision(o1,o2)
  {
	  var distlimit=Math.pow(o1.rad+o2.rad,2);
	  var dist=Math.pow(o1.x-o2.x,2)+Math.pow(o1.y-o2.y,2);
	  return dist<distlimit;
  }
  
  function checkKills(o)
  {
	  var killList=[];
	  var l=board.children;
	  for (var i=0;i<l.length;i+=1) {
		  //if a good guy is above -10
		  if ((l[i].coltype==1)&&(l[i].y<-10)) killList.push(l[i]);
		  else if ((l[i].coltype!=1)&&(l[i].y>180)) killList.push(l[i]);
		  else if ((l[i].isDead)&&(l[i].removeTime<board.gameTime)) killList.push(l[i]);		  
	  }
	  for (var i=0;i<killList.length;i+=1) { 
	      board.removeChild(killList[i]);
		  if (killList[i]===board.avatar) { //reset the whole mf system
			  resetSection();
			  break; 
		  }
	  }
	  
  }
  
  function killOb(o)
  {
	  o.isDead=true;
	  o.classList.add('die');
	  o.removeTime=board.gameTime+500;	  
  }
  
  function testCollisions()
  {
	  var l=board.children;
	  board.enemyCount=0;
	  for (var i=0;i<l.length;i+=1) {
		  if (l[i].coltype==2) board.enemyCount+=1;
		  if (l[i].coltype!=1) continue; //only do check for friendlys
		  if (l[i].isDead) continue;
		  for (var j=0;j<l.length;j+=1) {
			if (l[j].coltype!=2) continue; //we only care about enemy encounters		    
			if (l[j].isDead) continue; //already dying away
		    if (testCollision(l[i],l[j])) { //okay so good hits bad destroy both
			   killOb(l[i]);
			   killOb(l[j]);
			   break;
		    }			   			  
		  }
	  }
	  
  }
  
  function game()
  {     
     var lastTime=0;
	 var firstTime=0;
	 var fireCount=0;
	 var fireCycleLength=250;
	 var fireTime=250;
	 var gameLoop=function(timestamp)
     {
          var frameTime=10;	 
	      if (lastTime) {
		    frameTime=timestamp-lastTime;
		  } 
		  if (frameTime>100) frameTime=100;
		  lastTime=timestamp;
		  board.gameTime+=frameTime;
		  for (var i=0;i<board.children.length;i+=1) {
		    var ob=board.children[i];
			if (ob.eachFrame) ob.eachFrame(board.gameTime-ob.createTime,frameTime);
			position(ob);
		  }
		  testCollisions();
		  
		  if (board.gameTime>=fireTime) {//time for a fire cycle
			for (var i=0;i<board.children.length;i+=1) {
		       var ob=board.children[i];
			   if (ob.fire) ob.fire(board.gameTime-ob.createTime,fireCount);
               fireCount+=1;			   
		    }			
			if (board.enemyCount==0) {
				board.levelPos+=1;
				initSection();
			}            
		  }
		  
		  checkKills();		  
		  
		  //calc next fire time
		  fireTime=step(board.gameTime,fireCycleLength)+fireCycleLength;						
		  
		  window.requestAnimationFrame(gameLoop);
     }
	 window.requestAnimationFrame(gameLoop);
  }  
  
 
  setUp();
