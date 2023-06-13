

function makeBackdrop()
{
	var c=document.getElementById('backdrop');
	var main=document.getElementById('main');
	c.width = main.offsetWidth; c.height = main.offsetHeight;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#222255"
	ctx.fillRect(0,0,c.width,c.height);	
	var pipeHeight=c.height*.2;
	
	c.step=function(count) {
	  ctx.fillStyle="#222255"
	  ctx.globalAlpha=.05;
	  ctx.fillRect(0,0,c.width,c.height);	
	  var xstep=c.width*.6/50.0;
	  var ystep=pipeHeight/50.0;
	  
	
	  ctx.beginPath();	  	  
	  var p=(count%100);
	  if (p>50) p=100-p;
	  
	  ctx.moveTo(p*xstep,0);
	  ctx.lineTo(c.width*.55,p*ystep);	  
	  ctx.moveTo(c.width*.45,p*ystep);
	  ctx.lineTo(c.width-p*xstep,0);
      ctx.strokeStyle='rgb(200,200,'+200+p+')';
	  ctx.globalAlpha=.7;
	  ctx.lineWidth=3;
	  ctx.stroke();
	  
	  ctx.beginPath();
	  ctx.arc(Math.random()*c.width,Math.random()*c.height,Math.random()*3+2,0,2*Math.PI);	  
	  ctx.stroke();
	  
	}
    	
	return c;
}

var Backdrop=makeBackdrop();