  
  var board=document.getElementById('board');
  var meta=document.getElementById('levsel');
  board.lastZoneIndex=-1;
     	
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
	 };
	 
	 board.keyList=[];
	 
	 function keyEvent(keyCode,keyDown) {
	    board.keyList[keyCode]=keyDown;
	 }

	 
	 function handleStart(e) {
	    board.control_active=true;
		setTarget(e);					 
        e.preventDefault();				
	 } 
	 
	 function handleEnd(e) {	    
	    board.control_active=false;
		e.preventDefault();		
		
	 } 
	 
	 function handleCancel(e) {
	    board.control_active=false;
		e.preventDefault();		
	 } 
	 
	 function handleMove(e) {
	    if (board.control_active) setTarget(e);		
		e.preventDefault();		
		
	 } 	 
	 	
	board.addEventListener("touchstart", handleStart, false);
    board.addEventListener("touchend", handleEnd, false);
    board.addEventListener("touchcancel", handleCancel, false);
    board.addEventListener("touchmove", handleMove, false);
	
	board.addEventListener("mousedown", handleStart, false);
    board.addEventListener("mouseup", handleEnd, false);
    board.addEventListener("mouseout", handleCancel, false);
    board.addEventListener("mousemove", handleMove, false);	
	
	board.onkeydown=function(evt) { keyEvent(evt.keyCode,1); evt.preventDefault(); return false; };
    board.onkeyup=function(evt) { keyEvent(evt.keyCode,0); evt.preventDefault(); return false; };
    
  }
  
  function position(ob)
  {
	if (ob.x!==undefined)
	  ob.style.transform='translate3D('+(ob.x*board.fx)+'px,'+(ob.y*board.fx)+'px,0)';    
  }
  
  function avatarKilled()
  {
	  board.glitch=true;
	  board.classList.add('glitch');
	  setTimeout(function(){
		  var nd=document.createElement('div');
		  nd.classList.add('glitchtext');
		  nd.innerHTML='[[[[Invalid System State]]]]';
		  board.appendChild(nd);		  	     
	  },500);
	  setTimeout(function(){
		  var nd=document.createElement('div');
		  nd.classList.add('glitchtext');
		  nd.innerHTML='...game loop failed....';
		  board.appendChild(nd);		  	     
	  },1000);
	  setTimeout(function(){
		  var nd=document.createElement('div');
		  nd.classList.add('glitchtext');
		  nd.innerHTML='---- Restoring last Stable State ----';
		  board.appendChild(nd);		  	     
	  },1500);
	  setTimeout(function(){
		  board.shadows.push(board.shadowRec);
		  board.glitch=false;
		  board.classList.remove('glitch');
	      resetSection();
	  },2500);	  	  
  }
  
  function resetSection()
  {
	board.innerHTML="";
    board.gameTime=board.sectionStartTime;
    board.focus();		
	//add the avatar
	addOb(sprites.avatar,followControllerAction(),avatarFireAction());

	//add the shadows		
	for (var i=0;i<board.shadows.length;i+=1)
		addOb(sprites.ghost,ghostFollowAction(board.shadows[i]),ghostFireAction(board.shadows[i]));	
	
	//create the section
	initSection();		
  }
  
  function initSection()
  {
	 board.shadowRec=[];	  
     //add the rest
	 board.levelContent[board.levelPos]();	
	 board.sectionStartTime=board.gameTime;
  }
  
  function startZone(zoneindex)  
  {	
	board.classList.toggle('active',true);
	meta.classList.toggle('hide',true);
	board.timer.classList.toggle('active',true);
	board.levelContent=zones[zoneindex];
	board.zoneID=zoneindex;
	board.levelPos=0;	
	board.scoreTime=0;
	board.sectionStartTime=0;
	board.shadows=[];
	board.active=true;
	board.lastZoneIndex=zoneindex;
	 
	resetSection();	 
  }
  
  function endZone()
  {
	 board.active=false;
	 //save last and maybe best time
	 //hide board
	 board.classList.toggle('active',false);
	 board.timer.classList.toggle('active',false);
	 meta.classList.toggle('hide',false);
	 localStorage.setItem('last_z'+board.zoneID,board.scoreTime);
	 var best=Number(localStorage.getItem('best_z'+board.zoneID));
	 if ((!best)||(best>board.scoreTime))
	    localStorage.setItem('best_z'+board.zoneID,board.scoreTime);
     updateLevSel();	
  }
  
  function updateLSZone(i) {
	var zn=document.getElementById('z'+i);
	zn.style.backgroundImage = 'url('+sprites['zone'+i].imgData+')';
	if (i==board.lastZoneIndex) {
		zn.classList.toggle('sel',true);
		zn.onclick=function() {  };  
    } else {
		zn.classList.toggle('sel',false);		
		zn.onclick=function() { board.lastZoneIndex=i; updateLevSel();  };  
	}	
	document.getElementById('zgo'+i).onclick=function(e) { startZone(i); return false; };  
    document.getElementById('zex'+i).onclick=function(e) { e.stopPropagation(); board.lastZoneIndex=-1; updateLevSel(); return false;};  
    
	var last=localStorage.getItem('last_z'+i);
	last=last?(last/1000).toFixed(1):' - ';
	document.getElementById('zlt'+i).innerHTML=last;
	var best=localStorage.getItem('best_z'+i);
	best=best?(best/1000).toFixed(1):' - ';
	document.getElementById('zbt'+i).innerHTML=best;      
 }
  
  function updateLevSel()
  {
     updateLSZone(0);	
	 updateLSZone(1);	
	 updateLSZone(2);	
  }
  
  function setUp() {
	prepSprites();
	updateLevSel()
	
	document.getElementById('logo').style.backgroundImage = 'url('+sprites.logo.imgData+')';
	board.timer=document.getElementById('timer')
	
	positionBoard();
	attachBoardHandlers();
    window.onresize=positionBoard;
		
	game();
  }
  
  function programOb(el,action,fireAction)
  {
      el.eachFrame=action;
	  el.fire=fireAction;
	  el.createTime=board.gameTime;	  
  }
  
  function addOb(sprite,action,fireAction)
  {
      var el=document.createElement('div');
	  
	  el.classList.add('boardobject');
	  el.rad=sprite.size/2;
	  el.coltype=sprite.coltype;
	  el.health=sprite.health;
	  el.style.width=(el.rad*2*board.fx)+'px';
	  el.style.height=(el.rad*2*board.fx)+'px';
	  el.style.left=(-el.rad*board.fx)+'px';
	  el.style.top=(-el.rad*board.fx)+'px';
	  
      programOb(el,action,fireAction);	  
   	  el.x=el.y=-10000;
	  el.display=document.createElement('div');
	  el.display.classList.add(sprite.displayCls);
	  el.display.style.backgroundImage = 'url('+sprite.imgData+')';
	  el.appendChild(el.display);
	  board.appendChild(el);
	  return el;
  }
  
  function testCollision(o1,o2)
  {
	  var distlimit=Math.pow(o1.rad+o2.rad,2)*.9;
	  var dist=Math.pow(o1.x-o2.x,2)+Math.pow(o1.y-o2.y,2);
	  return dist<distlimit;
  }
  
  function checkKills(o)
  {
	  var killList=[];
	  var l=board.children;
	  for (var i=0;i<l.length;i+=1) {
		  //if a good guy is above -10
		  if ((l[i].coltype==1)&&(l[i].y<10)&&(l[i].y>-10000)) killList.push(l[i]);
		  else if ((l[i].coltype!=1)&&(l[i].y>180)) killList.push(l[i]);
		  else if ((l[i].isDead)&&(l[i].removeTime<board.gameTime)) killList.push(l[i]);		  
	  }
	  for (var i=0;i<killList.length;i+=1) { 
	      board.removeChild(killList[i]);
		  if (killList[i]===board.avatar) { 
		      //avatar dead
			  avatarKilled();
			  break; 
		  }
	  }
	  
  }
  
  function hitOb(o)
  {
	  if (o.health) {
		 o.health-=1;
	  } else
	    killOb(o);
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
		  if (l[i].coltype>=2) board.enemyCount+=1;
		  if (l[i].coltype!=1) continue; //only do check for friendlys
		  if (l[i].isDead) continue;
		  for (var j=0;j<l.length;j+=1) {
			if (l[j].coltype!=2) continue; //we only care about enemy encounters		    
			if (l[j].isDead) continue; //already dying away
		    if (testCollision(l[i],l[j])) { //okay so good hits bad destroy both
			   hitOb(l[i]);
			   hitOb(l[j]);
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
		  window.requestAnimationFrame(gameLoop);
          var frameTime=10;	 
	      if (lastTime) {
		    frameTime=timestamp-lastTime;
		  } 
		  if (frameTime>100) frameTime=100;
		  lastTime=timestamp;
		  if (!board.active) return;
		  board.gameTime+=frameTime;
		  board.scoreTime+=frameTime;
		  if (board.glitch) //we're glitch just fuck with time as you see fit!
			board.gameTime+=frameTime*(Math.random()*10-7);
		    
		  for (var i=0;i<board.children.length;i+=1) {
		    var ob=board.children[i];
			if (ob.eachFrame) ob.eachFrame(board.gameTime-ob.createTime,frameTime);
			position(ob);
		  }
		  testCollisions();
		  
		  if (board.gameTime>=fireTime) {//time for a fire cycle
			for (var i=0;i<board.children.length;i+=1) {
		       var ob=board.children[i];
			   if (ob.isDead) continue;
			   if (ob.fire) ob.fire(board.gameTime-ob.createTime,fireCount);
               fireCount+=1;			   
		    }			
			if (board.enemyCount==0) {
				board.levelPos+=1;
				if (board.levelPos>=board.levelContent.length) {
					endZone();
					return;
				}
				board.shadows=[];
				initSection();
			}            
		  }
		  
		  checkKills();		  
		  
		  //calc next fire time
		  fireTime=step(board.gameTime,fireCycleLength)+fireCycleLength;						
		  		  
		  board.timer.innerHTML=(board.scoreTime/1000).toFixed(1)+'s';		  
		  
     }
	 window.requestAnimationFrame(gameLoop);
  }  
  
 
  setUp();
