function weaveBlock(sprite,rows,cols,xstart,xthrow,ystart,ythrow,fireCycle,time)
{
	for (var i=0;i<rows;i+=1)
	  for (var j=0;j<cols;j+=1)
	      addOb(sprite,weaveAction(i*100,xstart+sprite.size*j,-ystart-sprite.size*i,xthrow,ythrow,time),regularFireAction(i+j,fireCycle,sprites.greenBullet,50));		
}

function wiggleBlock(sprite,rows,cols,xstart,xthrow,ystart,ythrow,fireCycle,time)
{
	for (var i=0;i<rows;i+=1)
	  for (var j=0;j<cols;j+=1)
	      addOb(sprite,wiggleAction(i*100,xstart+sprite.size*j,-ystart-sprite.size*i,xthrow,ythrow,time),regularFireAction(i+j,fireCycle,sprites.greenBullet,70));		
}

function weaveTrail(sprite,length,xstart,xthrow,ystart,ythrow,fireCycle,timedrop,time)
{
	for (var i=0;i<length;i+=1)
	  addOb(sprite,weaveAction(i*timedrop,xstart,-ystart,xthrow,ythrow,time),regularFireAction(i,fireCycle,sprites.greenBullet,50));
		
}

function wiggleTrail(sprite,length,xstart,xthrow,ystart,ythrow,fireCycle,timedrop,time)
{
	for (var i=0;i<length;i+=1)
	  addOb(sprite,wiggleAction(i*timedrop,xstart,-ystart,xthrow,ythrow,time),regularFireAction(i,fireCycle,sprites.greenBullet,70));		
}

function finalSection(sprite)
{
	for (i=0;i<10;i+=1)
	  addOb(sprite,bulletAction(30+Math.random()*40,-Math.random()*40,3.14/2,20+Math.random()*40));
    addOb(sprites.levcomplete,bulletAction(50,-50,3.14/2,30));
}

function incoming()
{
	for (i=0;i<5;i+=1)
	  addOb(sprites.incoming,bulletAction(30+Math.random()*40,-Math.random()*40,3.14/2,50+Math.random()*40));    
}

var zoneA=[
 function() { addOb(sprites.tuttouch,bulletAction(50,0,3.14/2,20)); },//tutorial text		

 function() {  incoming();
			  
               weaveBlock(sprites.grunt1,4,4,10,30,0,15,70,1000);},//intro mini block of slow invaders
 
 function() { weaveTrail(sprites.grunt2,15,5,90,0,10,40,150,2000);   //two slow windoing snakes behind each other in time -easy
	          weaveTrail(sprites.grunt2,15,95,-90,40,10,40,150,2000); },
 
 function() { weaveBlock(sprites.grunt1,4,8,1,30,0,10,50,1500); },//wide and quiet slow invaders
 
 function() {  //throbbers - x-motion rows - easy
      wiggleBlock(sprites.flow1,1,5,40,-30,0,30,40,2000);
      wiggleBlock(sprites.flow1,1,5,10,+30,15,30,40,2000);
	  wiggleBlock(sprites.flow1,1,5,40,-30,30,30,40,2000);              
	  wiggleBlock(sprites.flow1,1,5,10,+30,45,30,40,2000);			  
 },

 function() { weaveTrail(sprites.grunt2,20,20,20,0,10,60,250,800);   //medium - two snakes
	          weaveTrail(sprites.grunt2,20,60,20,20,10,60,250,800);},
			  
 function() {  //sexy twirl curves - easy
      wiggleTrail(sprites.flow2,20,10,80,0,30,50,400,2000);              			  
 },
 
 function() { weaveTrail(sprites.grunt2,20,5,55,10,30,50,300,3000); weaveTrail(sprites.grunt2,20,95,-55,20,30,50,300,3000);},//medium cross over flowers
 
 function() { weaveTrail(sprites.grunt2,10,5,40,10,20,60,250,2000); //lots of action flowy, hard - two beats
	          weaveTrail(sprites.grunt2,10,95,-40,30,20,60,250,2000);
 -             weaveTrail(sprites.grunt2,30,10,80,60,20,60,250,1800);},

 function() { wiggleBlock(sprites.flow1,8,1,10,50,0,30,100,800); //slow flowing mutli-beat - medium
              wiggleBlock(sprites.flow1,8,1,70,-50,50,30,100,1500);
			  wiggleBlock(sprites.flow1,8,2,20,60,100,30,100,1000);              
 },
 function() { //shorter snake - medium
      wiggleTrail(sprites.flow2,20,10,80,0,30,60,100,2000);              			  
 }, 
 function() { //double flows three beats - hard
              wiggleBlock(sprites.flow1,5,2,10,50,0,40,100,1000);
              wiggleBlock(sprites.flow1,5,2,60,-50,0,40,100,1000);
			  wiggleBlock(sprites.flow1,5,2,30,60,50,45,100,1000);			  
 },
 function() { //2 x 2 sync'ed formation of grunt1's - hard
   for (var i=0;i<6;i+=1)
	  weaveBlock(sprites.grunt1,2,2,(i%3)*25+5,30,i*20,20,50,1000);
 },
 function() { //crossing twirls - medium
      wiggleTrail(sprites.flow2,20,90,-80,0,30,50,400,2000);              			  
	  wiggleTrail(sprites.flow2,20,10,80,0,30,50,400,2000);              			  
 },
 function() { //long snake - hard
      wiggleTrail(sprites.flow2,50,10,80,0,30,60,100,2000);              			  
 },
 function() { //tight crossing twirls - very dangerous Hard
      wiggleTrail(sprites.flow2,20,90,-80,0,30,30,200,2000);              			  
	  wiggleTrail(sprites.flow2,20,10,80,0,30,30,200,2000);              			  
 },
 function() { //green boss
 	  addOb(sprites.boss1,wiggleAction(0,10,10,80,10,3000),xZoneFireAction(20,0,1,sprites.bigGreenBullet,40));		
	  wiggleTrail(sprites.flow2,20,10,30,100,30,100,200,2000);     
      weaveBlock(sprites.grunt1,3,3,45,30,50,20,50,1000);	  	  
 },
 function() { finalSection(sprites.zone0); }//victory  
];

function sqBlock(sprite,rows,cols,xstart,xthrow,ystart,ythrow,ytravel,fireCycle,time,lag)
{
	if (!lag) lag=0;
	for (var i=0;i<rows;i+=1)
	  for (var j=0;j<cols;j+=1)
	      addOb(sprite,sqAction((i+j)*lag,xstart+sprite.size*j,-ystart-sprite.size*i,xthrow,ythrow,ytravel,time),regularFireAngleAction(i+j,fireCycle,sprites.bbullet,50,20));		
}

function sqTrail(sprite,num,xstart,xthrow,ystart,ythrow,ytravel,fireCycle,timegap,time)
{
	for (var i=0;i<num;i+=1)	  
	      addOb(sprite,sqAction(timegap*i,xstart,-ystart,xthrow,ythrow,ytravel,time),regularFireAngleAction(i,fireCycle,sprites.bbullet,50,20));		
}

function sqDBlock(sprite,rows,cols,xstart,xthrow,ystart,ythrow,ytravel,fireCycle,time,lag)
{
	if (!lag) lag=0;
	for (var i=0;i<rows;i+=1)
	  for (var j=0;j<cols;j+=1)
	      addOb(sprite,sqAction((i+j)*lag,xstart+sprite.size*j,-ystart-sprite.size*i,xthrow,ythrow,ytravel,time),diveBombAction(i+j,fireCycle,90));		
}

function blueBossLine(len,fireCycle,yoff) {
	for (var i=0;i<len;i+=1)
		addOb(sprites.blueBoss,wiggleAction(i*500,10,10-yoff,80,10,2000),xZoneFireAction(20,0,fireCycle,sprites.bbullet,40));
}


function dropReleaseFireAction(fireCycle)
{

  return function(gameTime,fireCount) {
	  if (!(fireCount%fireCycle)) {
		sqDBlock(sprites.geo4,2,2,this.x-10,10,-this.y-10,10,10,5,500);
	    
	  }
  }
}

var zoneB=[

 
 function() {  incoming();
			  
               sqBlock(sprites.geo1,4,8,10,10,0,10,10,50,1500);},  //intro mini block of slow sq invaders

function() {  sqTrail(sprites.geo3,60,5,90,0,30,20,100,100,6000);},  //rolling of geo3 invaders -easy
 
			   
function() {  sqBlock(sprites.geo2,3,3,5,60,20,30,20,20,2000); },  //some small but fast and aggressive geo2 invaders -medium

function() {  sqTrail(sprites.geo3,15,5,40,0,20,40,100,250,2000);
              sqTrail(sprites.geo3,15,95,-40,0,20,40,80,250,2000); },  //2 lines folding of geo3 invaders -easyish

 function() {  sqTrail(sprites.geo3,30,5,90,0,30,20,20,50,5000);},  //serious rolling of geo3 invaders -medium
 function() {  sqDBlock(sprites.geo4,6,4,5,40,0,40,20,50,5000,100);
               sqDBlock(sprites.geo4,6,4,5,40,0,40,20,50,4000,100);},  //falling blue -medium
 function() {  sqBlock(sprites.geo2,6,4,5,60,0,40,40,50,5000);},  //serious block of geo2 invaders -medium
 function() {  sqBlock(sprites.geo2,2,5,5,40,0,40,40,50,5000);
               sqBlock(sprites.geo1,2,5,5,55,25,40,40,50,5000);
               sqBlock(sprites.geo2,2,5,5,40,50,40,40,50,5000);
               },  //mixed geo type - hard
 function() {  sqBlock(sprites.geo2,6,4,5,60,0,40,40,50,5000);},  //serious block of geo2 invaders -medium
 function() {  sqDBlock(sprites.geo4,4,4,5,40,0,40,20,20,2000,120); },  //super fast bombers falling blue -medium
 function() {  sqBlock(sprites.geo2,2,2,5,25,0,30,30,20,3000);
               sqBlock(sprites.geo2,2,2,80,-25,0,30,30,20,3000); 
			   sqBlock(sprites.geo2,2,2,30,35,60,30,30,20,1500); 
			   },  //three 2 x 2 group of geo2 - one out of sync - medium
 function() {  wiggleBlock(sprites.flow1,8,1,10,50,50,30,100,800);
               wiggleBlock(sprites.flow1,8,2,30,50,150,30,100,800);
               blueBossLine(2,2,0); }, //medium - first boss encounter
 function() { //green bosses and some blue fluff - very hard
 	  addOb(sprites.boss1,wiggleAction(0,10,10,80,5,3000),xZoneFireAction(20,0,2,sprites.bigGreenBullet,40));		
	  addOb(sprites.boss1,wiggleAction(1500,10,10,80,5,3000),xZoneFireAction(20,1,2,sprites.bigGreenBullet,40));		
	  sqBlock(sprites.geo1,3,4,5,25,50,10,20,50,2000,50);             
	  sqTrail(sprites.geo3,15,55,20,0,30,20,60,50,1500);
 },
 function() {  
              wiggleTrail(sprites.flow2,15,10,80,30,30,200,100,3000);
			  wiggleTrail(sprites.flow2,15,90,-80,60,30,200,100,3000);              
			  sqBlock(sprites.geo1,3,4,5,25,0,10,20,50,2000,50);
              sqBlock(sprites.geo1,3,4,60,-25,15,10,20,50,2000,50);			  
           },  //two blocks of geo1's throbbing plus two bright snakes - hard		   
		   
 function() {  //hard going level with lots of slow blue bosses and rains of blue divers
   blueBossLine(5,5,0); 	 		
   sqDBlock(sprites.geo4,6,6,5,40,50,40,20,80,4000,100);
   blueBossLine(5,5,50); 	 		   
 },

 function() { //the lone big blue boss 2
	 	addOb(sprites.blueboss2,wiggleAction(0,30,0,40,5,2000),dropReleaseFireAction(5));
 },

  
 function() { finalSection(sprites.zone1); }//victory  
 			   
]; 


function sqRedBlock(sprite,rows,cols,xstart,xthrow,ystart,ythrow,ytravel,fireCycle,time,lag)
{
	if (!lag) lag=0;
	for (var i=0;i<rows;i+=1)
	  for (var j=0;j<cols;j+=1)
	      addOb(sprite,sqAction((i+j)*lag,xstart+sprite.size*j,-ystart-sprite.size*i,xthrow,ythrow,ytravel,time),dualFireAngleAction(i+j,fireCycle,sprites.rbullet,50,30));		
}

function wiggleRedTrail(sprite,length,xstart,xthrow,ystart,ythrow,fireCycle,timedrop,time)
{
	for (var i=0;i<length;i+=1)
	  addOb(sprite,wiggleAction(i*timedrop,xstart,-ystart,xthrow,ythrow,time),dualFireAngleAction(i,fireCycle,sprites.rbullet,70,30));		
}


var zoneC=[
 function() {  incoming();			  
               sqRedBlock(sprites.red1,4,8,10,10,0,10,10,50,1000);} , //intro heavy block of red1
 
 function() {  wiggleRedTrail(sprites.red2,30,10,60,0,60,50,200,3000); } ,//first pink tri's agressive

 
 
 function() {  sqRedBlock(sprites.red1,2,2,5,25,0,30,30,30,3000,100);
               sqRedBlock(sprites.red1,2,2,80,-25,0,30,30,30,3000,100); 
			   sqRedBlock(sprites.red1,3,3,30,35,60,30,30,30,2000,100); 
			   sqTrail(sprites.geo3,30,20,60,0,30,40,50,100,5000);
 },  //three 2 x 2 group of red1 + long blue flowing snake - hard
 
 function() {  wiggleRedTrail(sprites.red2,10,10,60,0,60,50,300,3000); 
               wiggleRedTrail(sprites.red2,10,90,-60,0,60,50,300,4000);    
			   wiggleBlock(sprites.flow1,8,1,10,50,0,30,70,800); 
               wiggleBlock(sprites.flow1,8,1,70,-50,50,30,70,1000);}, //green and red flow mix - fun - 2 death
 
 function() {  sqRedBlock(sprites.red1,3,7,5,40,80,40,40,50,5000);
               sqBlock(sprites.geo2,2,5,5,40,50,40,40,50,5000);
			   sqDBlock(sprites.geo4,6,4,5,40,0,40,20,20,5000,100);
 }, //shielded shooters + falling blues 
 

 function() { //the climax in hell
	 addOb(sprites.blueboss2,wiggleAction(0,30,0,40,5,2000),dropReleaseFireAction(15));
	 blueBossLine(5,10,0); 	 		
     wiggleRedTrail(sprites.red2,10,90,-60,0,60,50,300,1000);      	
	 sqBlock(sprites.geo2,2,5,5,40,0,30,30,50,5000);			   
 },

 function() { finalSection(sprites.zone2); },//victory  
 	
 
			   
]

var zones=[zoneA,zoneB,zoneC];