

function makeAir()
{
	var fc=document.getElementById('air');
	fc.width = 100; fc.height = 100;
	var f_ctx = fc.getContext('2d');
	
	f_ctx.fillStyle="#444466"
	f_ctx.fillRect(0,0,100,100);
	
	
	fc.step=function(count) {

	  if ((count%10)==0){
	    f_ctx.globalAlpha=.1;
	    f_ctx.fillStyle="#444466"
	    f_ctx.fillRect(0,0,100,100);	
	  }
	  f_ctx.strokeStyle='rgb(128,128,'+Math.round(Math.random()*127+128)+')';
	  f_ctx.globalAlpha=1;
	  f_ctx.lineWidth=1;	  
	  var x=Math.random()*100;
	  var y=Math.random()*100;
	  f_ctx.beginPath();	
	  f_ctx.arc(x,y,Math.random()*40,Math.random()*2*Math.PI,Math.random()*2*Math.PI);	  
	  f_ctx.stroke();
	  f_ctx.beginPath();	
	  f_ctx.arc(x,y,Math.random()*40,Math.random()*2*Math.PI,Math.random()*2*Math.PI);	  
	  f_ctx.stroke();
	  f_ctx.beginPath();	
	  f_ctx.arc(x,y,Math.random()*40,Math.random()*2*Math.PI,Math.random()*2*Math.PI);	  
	  f_ctx.stroke();
	}
	fc.xflow=0;
	fc.yflow=-.8;
	fc.response_transform=[-1,0,0,0];
	fc.response_addlayer=[-1,-1,-1,-1];
	
	return fc;
}

function makeFire()
{
	var fc=document.getElementById('fire');
	fc.width = 100; fc.height = 100;
	var f_ctx = fc.getContext('2d');
	
	f_ctx.fillStyle="#FFCC55"
	f_ctx.fillRect(0,0,100,100);
	
	
	fc.step=function() {
	  f_ctx.beginPath();
	  f_ctx.moveTo(f_pos,0);
	  f_ctx.strokeStyle='rgb(255,'+Math.round(Math.random()*192+64).toString()+','+Math.round(Math.random()*64).toString()+')';
	  f_ctx.globalAlpha=Math.random()*.5+.1;
	  f_ctx.lineWidth=Math.random()*5+5;
	  
	  var r=Math.random()*50;
	  var f_pos = Math.random()*100;
      f_ctx.moveTo(f_pos,0);
	  f_ctx.quadraticCurveTo(f_pos+r,50,f_pos,100);
	  f_ctx.quadraticCurveTo(f_pos-r,50,f_pos,0);
	  f_ctx.moveTo(100-f_pos,0);
	  f_ctx.quadraticCurveTo(100-f_pos+r,50,100-f_pos,100);
	  f_ctx.quadraticCurveTo(100-f_pos-r,50,100-f_pos,0);
	  f_ctx.stroke();
	}
	fc.xflow=0;
	fc.yflow=-2.5;
	fc.response_transform=[1,1,1,7];
	fc.response_addlayer=[1,-1,5,-1];
	
	return fc;
}

function makeEarth()
{
	var fc=document.getElementById('earth');
	fc.width = 100; fc.height = 100;
	var f_ctx = fc.getContext('2d');
	
	f_ctx.fillStyle="#FFCC55"
	f_ctx.fillRect(0,0,100,100);
	
	
	fc.step=function() {
	  f_ctx.beginPath();
	  var p=Math.random()*100;
	  f_ctx.globalAlpha=Math.random()*.5+.1;
	  f_ctx.strokeStyle='rgb(128,'+Math.round(Math.random()*50+50).toString()+',0)';
	  f_ctx.lineWidth=Math.random()*15+2;
	  f_ctx.moveTo(0,p);
	  f_ctx.lineTo(100,p);
	  f_ctx.stroke();
	}
	
	fc.xflow=0;
	fc.yflow=-.5;	
	fc.response_transform=[3,7,6,3];
	fc.response_addlayer=[-1,-1,-1,3];
	return fc;
}


function makeWater()
{
	var c=document.getElementById('water');
	c.width = 100; c.height = 100;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#0000DD"
	ctx.fillRect(0,0,500,500);	
	
	c.step=function() {
	  var r=Math.random()*10+5;
	  var x=Math.random()*(100-r);
	  var y=Math.random()*(100-r);
	  ctx.fillStyle='rgb(0,0,'+Math.round(Math.random()*192+64).toString()+')';
	  ctx.globalAlpha=Math.random()*.5+.1;
	  
	  ctx.beginPath();
	  ctx.arc(x,y,r,0,2*Math.PI);
	  ctx.fill();	  
	  
	  if ((x-r)<0) {
	    ctx.beginPath();
	    ctx.arc(x+100,y,r,0,2*Math.PI);
	    ctx.fill();	  
	  }
	  
	  if ((y-r)<0) {
	    ctx.beginPath();
	    ctx.arc(x,y+100,r,0,2*Math.PI);
	    ctx.fill();	  
	  }
	  	  
	  
	}
	c.xflow=1;
	c.yflow=-.7;	
	c.response_transform=[4,-1,2,3];
	c.response_addlayer=[-1,-1,-1,2];
	return c;
}


function makeMist()
{
	var c=document.getElementById('mist');
	c.width = 100; c.height = 100;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#DDDDFF"
	ctx.fillRect(0,0,500,500);	
	
	c.step=function() {
	  var r=Math.random()*10+5;
	  var x=Math.random()*(100-r);
	  var y=Math.random()*(100-r);
	  ctx.fillStyle='rgb(192,192,'+Math.round(Math.random()*192+64).toString()+')';
	  ctx.globalAlpha=Math.random()*.5+.1;
	  
	  ctx.beginPath();
	  ctx.arc(x,y,r,0,2*Math.PI);
	  ctx.fill();	  
	  
	  if ((x-r)<0) {
	    ctx.beginPath();
	    ctx.arc(x+100,y,r,0,2*Math.PI);
	    ctx.fill();	  
	  }
	  
	  if ((y-r)<0) {
	    ctx.beginPath();
	    ctx.arc(x,y+100,r,0,2*Math.PI);
	    ctx.fill();	  
	  }
	  	  
	  
	}
	c.xflow=-4.2;
	c.yflow=-2;	
	c.response_transform=[-1,5,2,6];
	c.response_addlayer=[-1,5,-1,-1];
	return c;
}


function makeSand()
{
	var c=document.getElementById('sand');
	c.width = 100; c.height = 100;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#BBAA66"
	ctx.fillRect(0,0,100,100);	
	
	c.step=function() {
	  var r=Math.random()*2+1;
	  var x=Math.random()*(100-r);
	  var y=Math.random()*(100-r);
	  var c=Math.random();
	  if (c<.33)
	     ctx.fillStyle="#FFDD88";
	  else if (c<.66)
	     ctx.fillStyle="#BBAA66";
	  else
    	  ctx.fillStyle="#887755";
		
	  ctx.globalAlpha=Math.random()*.8+.1;
	  
	  ctx.beginPath();
	  ctx.arc(x,y,r,0,2*Math.PI);
	  ctx.fill();	  
	}
	c.xflow=0;
	c.yflow=-.75;
	
	c.response_transform=[5,6,2,6];
	c.response_addlayer=[-1,-1,-1,3];
	
	return c;
}



function makeIce()
{
	var c=document.getElementById('ice');
	c.width = 100; c.height = 100;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#AAAAFF"
	ctx.fillRect(0,0,500,500);
	
	
	c.step=function() {
	  
	  var xpos=Math.random()*100+50;
	  var ypos=Math.random()*100+50;
	  var size=Math.random()*25+12;
	  var width=Math.random()*150-75;	  
	  if (Math.random()>.5)
	    ctx.fillStyle='rgb(200,200,'+Math.round(Math.random()*55+200).toString()+')';
	  else
	    ctx.fillStyle='rgb(64,64,'+Math.round(Math.random()*55+200).toString()+')';
	  	  
	  ctx.globalAlpha=.3+Math.random()*.4;
	  ctx.beginPath();
	  ctx.moveTo(xpos,ypos-size);
	  ctx.lineTo(xpos+width,ypos);
	  ctx.lineTo(xpos,ypos+size);
	  ctx.lineTo(xpos,ypos-size);	  
	  ctx.fill();
	  
	  ctx.beginPath();
	  ctx.moveTo(xpos-100,ypos-size);
	  ctx.lineTo(xpos+width-100,ypos);
	  ctx.lineTo(xpos-100,ypos+size);
	  ctx.lineTo(xpos-100,ypos-size);
	  ctx.fill();
	  
	  ctx.beginPath();
	  ctx.moveTo(xpos,ypos-size-100);
	  ctx.lineTo(xpos+width,ypos-100);
	  ctx.lineTo(xpos,ypos+size-100);
	  ctx.lineTo(xpos,ypos-size-100);
	  ctx.fill();
	  
	  
	  ctx.beginPath();
	  ctx.moveTo(xpos-100,ypos-size-100);
	  ctx.lineTo(xpos+width-100,ypos-100);
	  ctx.lineTo(xpos-100,ypos+size-100);
	  ctx.lineTo(xpos-100,ypos-size-100);
	  ctx.fill();
	   
	}
    c.xflow=0;
	c.yflow=-.5;
		
	c.response_transform=[4,2,4,4];
	c.response_addlayer=[-1,-1,2,3];
	
	return c;
}

function makeLava()
{
	var c=document.getElementById('lava');
	c.width = 100; c.height = 100;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#330000"
	ctx.fillRect(0,0,500,500);
	var x=0,y=0;
	
	c.step=function(count) {
	  
	  if ((count%10)==0) {
	    ctx.fillStyle="#330000"
	    ctx.globalAlpha=.1;
	    ctx.fillRect(0,0,500,500);
		x=Math.random()*100;
		y=Math.random()*100;
	  }
	  
	  ctx.beginPath();
	  ctx.moveTo(x,y);
	  x+=Math.random()*5-2;
	  y+=Math.random()*10+10;
	  ctx.lineTo(x,y);
	  x+=Math.random()*30-15;
	  y+=Math.random()*5-2;
	  ctx.lineTo(x,y);	  
	  ctx.strokeStyle='rgb(255,0,0)';
	  ctx.globalAlpha=1;
	  ctx.lineWidth=1+Math.random()*3;
	  ctx.stroke();
	  if (x>100) x=0;
	  if (x<0) x=100;
	  if (y>100) y=0;
	  	  
	  
	}
    c.xflow=0;
	c.yflow=-.5;
		
	c.response_transform=[3,1,3,6];
	c.response_addlayer=[-1,-1,5,5];
	
	return c;
}

var Elements=[makeAir(),makeFire(),makeWater(),makeEarth(),makeIce(),makeMist(),makeSand(),makeLava()];
var ElDrawCount=0;
  

function drawAll()
{
  for (var i=0;i<Elements.length;i+=1) {
     Elements[i].step(ElDrawCount);
	 Elements[i].pattern=null;	 
  }
  Backdrop.step(ElDrawCount);
  ElDrawCount+=1;
  setTimeout(drawAll,100);
}

drawAll();