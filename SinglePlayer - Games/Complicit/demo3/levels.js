function weaveBlock(sprite,rows,cols,xstart,xthrow,ystart,ythrow,fireCycle,time)
{
	for (var i=0;i<rows;i+=1)
	  for (var j=0;j<cols;j+=1)
	      addOb(sprite,weaveAction(i*100,xstart+sprite.size*j,-ystart-sprite.size*i,xthrow,ythrow,time),regularFireAction(i+j,fireCycle,sprites.greenBullet,50));		
}


function weaveTrail(sprite,length,xstart,xthrow,ystart,ythrow,fireCycle,timedrop,time)
{
	for (var i=0;i<length;i+=1)
	  addOb(sprite,weaveAction(i*timedrop,xstart,-ystart,xthrow,ythrow,time),regularFireAction(i,fireCycle,sprites.greenBullet,50));
		
}

var zoneA=[
 function() { weaveBlock(sprites.grunt1,4,4,10,30,0,15,50,1000);},
 function() { weaveBlock(sprites.grunt1,3,8,1,30,0,10,50,1500); },
 function() { weaveTrail(sprites.grunt2,30,5,90,0,20,20,200,2000); },
 function() { weaveBlock(sprites.grunt1,2,2,0,50,0,10,50,1000);
	          weaveBlock(sprites.grunt1,2,2,50,-30,30,10,50,1000);
	          weaveBlock(sprites.grunt1,2,2,0,50,60,10,50,1000); },
 function() { weaveTrail(sprites.grunt2,20,20,20,0,10,60,250,800);
	          weaveTrail(sprites.grunt2,20,60,20,20,10,60,250,800);},
 function() { weaveTrail(sprites.grunt2,15,5,90,0,10,20,150,2000);
	          weaveTrail(sprites.grunt2,15,95,-90,40,10,20,150,2000); },
 function() { weaveTrail(sprites.grunt2,10,5,40,10,20,60,250,2000);
	          weaveTrail(sprites.grunt2,10,95,-40,30,20,60,250,2000);
              weaveTrail(sprites.grunt2,30,10,80,60,20,60,250,1800);}
	
]