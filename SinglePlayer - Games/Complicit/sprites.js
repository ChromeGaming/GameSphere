
var OGO={
 line: function(x,y,x2,y2) { this.ctx.beginPath(); this.ctx.moveTo(x,y); this.ctx.lineTo(x2,y2); this.ctx.stroke(); return this;},
 circle: function(x,y,r) { this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, 2 * Math.PI, false); this.ctx.stroke(); return this;},
 lineStyle: function(s) { this.ctx.strokeStyle=s;  return this;},
 fillStyle: function(s) { this.ctx.fillStyle=s;  return this;},
 lineGrad: function(c1,c2) { this.ctx.strokeStyle=cgrad(this.ctx,.5,c1,c2);  return this;},
 fillGrad: function(c1,c2) { this.ctx.fillStyle=cgrad(this.ctx,15,c1,c2);  return this;},
 lineWidth: function(w) { this.ctx.lineWidth=w/100;  return this;},
 text: function(t,x,y,h,fill) { 
   this.ctx.save();
   this.ctx.lineWidth=h/5;
   this.ctx.translate(-x,-y);
   this.ctx.scale(.01*h,.01*h);
   this.ctx.font='10px sans-serif'; 
   if (fill)
	  this.ctx.fillText(t,0,0); 
   else
      this.ctx.strokeText(t,0,0); 
   this.ctx.restore();
   return this;},
 
 
 setBackground: function(elid) {
	var el=document.getElementById(elid); 
	var data=this.canvas.toDataURL();
	el.style.backgroundImage = 'url('+data+')';
	return this;
 },
 setElementBackground: function(el) {
	var data=this.canvas.toDataURL();
	el.style.backgroundImage = 'url('+data+')';
	return this;
 },
 
 echo: function(frames,xs,ys,xe,ye,rots,rote,ss,se,alphas,alphae) {
	var nogo=createOGO(this.res);    
	for (var i=0;i<frames;i+=1) {
	  var re=i/frames;
	  var rs=1-re;
	  nogo.ctx.save();
	  nogo.ctx.rotate((rots*rs+rote*re)*Math.PI/180);
	  nogo.ctx.translate((xs*rs+xe*re),(ys*rs+ye*re));			  
	  nogo.ctx.scale(ss*rs+se*re,ss*rs+se*re);
	  nogo.ctx.globalAlpha=alphas*rs+alphae*re;
	  
	  nogo.ctx.drawImage(this.canvas,-.5,-.5,1,1);
	  nogo.ctx.restore();
	}
	return nogo;
 },
 rotSym:function(num) 
 {
	return this.echo(num,0,0,0,0,0,360,1,1,1,1);
 },
 mirror: function(x,y) {
	var nogo=createOGO(this.res);    
	nogo.ctx.drawImage(this.canvas,-.5,-.5,1,1);			
	nogo.ctx.scale(x?-1:1,y?-1:1);
	nogo.ctx.drawImage(this.canvas,-.5,-.5,1,1);						  
	return nogo;
 },
 addDivSample: function(cls)
 {
	var d=document.createElement('div');
	d.classList.add(cls);
	d.classList.add('ttype');
	this.setElementBackground(d);
	document.body.appendChild(d);
	return this;
 },
 
 makeSprite:function(cls,size,type,hits) {
	this.addDivSample(cls);
	if (!hits) hits=0;
	return {
		size: size,
		coltype: type,
		health: hits,
		displayCls: cls,
		imgData: this.canvas.toDataURL()				
	}
 } 
};

function cgrad(ctx,s,c1,c2) {
	var grd=ctx.createRadialGradient(0,0,0,0,0,s);
	grd.addColorStop(0,c1);
	grd.addColorStop(1,c2);
	return grd;
}

function createOGO(res)
{
	var ogo=Object.create(OGO);
	if (!res) res=100;
	ogo.res=res;
	ogo.canvas = document.createElement("canvas");
	ogo.canvas.width=res;
	ogo.canvas.height=res;
	ogo.ctx = ogo.canvas.getContext('2d');
	ogo.ctx.translate(+ogo.canvas.width/2,+ogo.canvas.height/2);
	ogo.ctx.scale(ogo.canvas.width,ogo.canvas.height);      
	ogo.ctx.lineCap='round';
    ogo.ctx.textAlign='center'; 
    ogo.ctx.textBaseline = 'middle';
   
	return ogo;
}


var sprites={};


function prepSprites() {
sprites.avatar=createOGO(200)
	      .lineWidth(5).lineGrad('#FA0','#F00')
		  .line(0,.2,0,.3)
		  .echo(5,0,0,.3,.2,0,0,1,.5,1,1)			
		  .lineWidth(3).lineGrad('#FFA','#FF0')
	      .line(.4,.4,0,-.4)
		  .line(0,-.2,.2,.2)
		  .circle(.1,.1,.03)
		  .lineWidth(6).line(.3,.4,.3,0)
		  .mirror(true,false)
	      .echo(5,0,0,0,.2,0,0,1,1,1,0)
          .makeSprite('normal',15,1);

sprites.ghost=createOGO(200)
	      .lineWidth(5).lineGrad('#FA0','rgba(255,0,0,0)')
		  .line(0,.2,0,.3)
		  .echo(5,0,0,.3,.2,0,0,1,.5,1,1)			
		  .lineWidth(3).lineGrad('#FFF','#FF8')
	      .line(.4,.4,0,-.4)
		  .line(0,-.2,.2,.2)
		  .circle(.1,.1,.03)
		  .lineWidth(6).line(.3,.4,.3,0)
		  .mirror(true,false)
	      .echo(3,0,0,0,.2,0,0,1,1,.3,0)
	  .makeSprite('normal',15,1);
sprites.aBullet=createOGO(50)
	   .lineStyle('#ffffff').lineWidth(2).line(0,0,.3,-.3)
	  .lineStyle('#aaaa00').lineWidth(2).line(0,0,0,-.4)
	  .echo(10,0,0,0,0,0,90,1,.6,.3,1)
	  .rotSym(5)
	  .makeSprite('bullet',5,1);
sprites.gBullet=createOGO(50)
	   .lineStyle('#AAAAAA').lineWidth(2).line(0,0,.3,-.3)
	  .lineStyle('#AAAA00').lineWidth(2).line(0,0,0,-.4)
	  .echo(10,0,0,0,0,0,90,1,.6,.3,.8)
	  .rotSym(5)
	  .makeSprite('bullet',5,1);
sprites.grunt1=createOGO(150)
	.lineStyle('#5F0').lineWidth(2).circle(.1,.1,.1)
	.lineGrad('#000','#0F0').circle(.3,0,.1)
	.echo(80,0,0,0,0,0,360,1,1,0,.5)
	.rotSym(2)
	.makeSprite('roll',10,2);
sprites.grunt2=createOGO(150)
	.lineStyle('#AAFF00').lineWidth(1).circle(.1,.1,.05)
	.lineStyle('#00FF00').circle(.3,.2,.05)
	.echo(80,0,0,0,0,0,120,1,1,0,.5)
	.rotSym(3)
	.makeSprite('rock',10,2);
sprites.greenBullet=createOGO(50)
	.lineStyle('#00ff00').lineWidth(3).line(0,.4,0,-.4)
	.echo(20,0,0,0.4,0,0,0,1,.1,.8,0)
	.rotSym(2)
	.makeSprite('bullet',4,2);
sprites.bigGreenBullet=createOGO(50)
	.lineStyle('#00AA00').lineWidth(3).line(0,.4,0,-.4).lineStyle('#88AA00').line(.15,.3,.15,-.3).line(.3,.2,.3,-.2)
	.echo(20,0,0,0.4,0,0,0,1,.1,.8,0)
	.rotSym(2)
	.makeSprite('bullet',5,2,1);
sprites.flow1=createOGO(100).lineStyle('#00FF00').lineWidth(2)
	        .circle(.1,0,.2)
	        .echo(10,0,-.1,0,-.15,0,180,.2,1,.5,1)
			.rotSym(3)
			.makeSprite('throb',13,2);
sprites.flow2=createOGO(100)
            .lineStyle('#008800').lineWidth(2).circle(.1,0,.2)
	        .lineStyle('#00FF00').lineWidth(5).circle(.1,0,.1)
	        .echo(10,0,-.1,0,-.15,0,180,.2,1,.5,1)
			.rotSym(2)
			.makeSprite('roll',18,2);
sprites.boss1=createOGO(200).lineStyle('#AAFFAA').lineWidth(3)
	        .circle(.3,.1,.1).lineStyle('#008800').lineWidth(3)
	        .circle(.3,.1,.05).lineStyle('#00FF00').line(0,.1,.3,.2)
	        .rotSym(6)
	        .echo(15,0,0,0,0,45,0,1,1,0,.4)
			.makeSprite('roll',25,2,10);
sprites.logo=createOGO(400).fillStyle('#999900')
	        .text("Complicit",0,0,1.5,true)
	        .echo(20,0,0,0,-.05,0,20,1,.8,.3,0)
			.fillStyle('#FFFF44')
	        .text("Complicit",0,0,1.5,true)
	        .echo(10,0,0,0,.02,-90,-90,1,1,.3,0)
		    .makeSprite('none',25,0);
sprites.zone0=createOGO(400)
            .lineStyle('#00FF00').text("\u03B1-Zone",0,.2,2)
	        .echo(10,0,0,0,.9,0,60,1,.1,.5,0)
			.lineStyle('#00FF00').text("\u03B1-Zone",0,.2,2)
	        .makeSprite('lev',40,0);
sprites.zone1=createOGO(400).fillStyle('#4444FF')
	        .text("\u03B2-Zone",0,.25,2,true)
	        .echo(20,0,0,.2,.2,0,-20,1,1,.4,0)
			.fillStyle('#99F').text("\u03B2-Zone",0,.25,2,true)
			.makeSprite('lev',40,0);
sprites.zone2=createOGO(400)
	      .fillGrad('#500','#F08').text("\u03A9",-.2,.2,3,true)	       
		  .echo(40,0,0,0,0,90,0,.5,1,.1,.4)			
		  .rotSym(4)
	      .lineStyle('#D00').text("\u03A9",-.2,.2,3.2)	       
		  .fillStyle('#F00').text("zone",0.1,0.25,1.5,true)	       
		  .makeSprite('lev',40,0);
var t1="The avatar moves"; var t2="with your touch";
var t3="OR use <arrows>"; var t4="and hold <space>";
sprites.tuttouch=createOGO(400).lineStyle('#A40').lineWidth(5).circle(0,0,0.45)
	        .fillStyle('#AA4')
	        .text(t1,0,.2,.9,true)
	        .text(t2,0,.1,.9,true)
	        .text(t3,0,-.1,.9,true)
	        .text(t4,0,-.2,.9,true)
	        .echo(80,0,0,0.4,0,0,90,1,.1,.2,0)		
   	        .fillStyle('#FFA')
	        .text(t1,0,.2,.9,true)
	        .text(t2,0,.1,.9,true)
	        .text(t3,0,-.1,.9,true)
	        .text(t4,0,-.2,.9,true)
	        .makeSprite('tutorial',60,3);	        				
sprites.levcomplete=createOGO(400).lineStyle('#FFAA00').lineWidth(3)
	        .text("Zone Complete",0,0.1,1)
			.lineStyle('#CCAA00').line(0,.03,.4,.03)
	        .echo(40,0,0,0,-.1,0,0,1,.3,.3,0)
			.fillStyle('#FFAA00')
			.text("Zone Complete",0,0.1,1,true)
			.mirror(true,true)
	  		.makeSprite('tutorial',60,3);
sprites.incoming=createOGO(500)
	        .lineStyle('#FF3300').lineWidth(3).text("INCOMING",0,0,1.8)
			.echo(40,0,0,0,0,0,180,1,1,.2,0)
			.fillStyle('#FA0')
			.text("INCOMING",0,0,1.8,true)
			.makeSprite('roll',60,0);
sprites.geo1=createOGO(100).lineStyle('#9900FF').lineWidth(3)
	        .line(.4,0,0,.4)
	        .echo(5,0,-.4,0,0,0,0,.2,1,.5,1)
			.rotSym(3)
	        .echo(5,0,0,0,0,0,0,2,1,0,1)			
			.makeSprite('roll',10,2);
sprites.geo2=createOGO(100).lineStyle('#DD00DD').lineWidth(3)
	        .line(.4,0,0,.4)
	        .echo(5,0,-.4,0,0,0,0,.2,1,.5,1)
			.rotSym(6)
	        .echo(5,0,0,0,0,0,0,2,1,0,1)
			.makeSprite('rock',12,2,1);
sprites.geo3=createOGO(200).lineGrad('#00F','#F0F').lineWidth(2)
	           		       .line(0,0,.15,.3).line(0,0,.3,.3).line(0,0,.3,.15)
	  				       .line(.15,.3,.3,.3).line(.3,.3,.3,.15)	  
						   .rotSym(6)
		                   .echo(8,0,0,0,0,0,-45,.8,1.2,1,0)
		                   .makeSprite('roll120',15,2);
sprites.geo4=createOGO(200).lineStyle('#5555FF').lineWidth(2)
	        .line(.2,0,0,.4)
	        .mirror(true,false)
	        .echo(10,0,-.4,0,0,0,0,.2,1,.5,1)
			.echo(5,0,0,0,0,0,0,2,1,.1,1)
			.makeSprite('throb2',15,2);
			
sprites.bbullet=createOGO(100).lineStyle('#AAF').lineWidth(2)
	        .circle(.1,0,.2)
	        .echo(10,0,-.1,0,-.15,0,45,.2,1,.5,1)
			.rotSym(3)
			.makeSprite('roll',8,2);
sprites.blueBoss=createOGO(200).lineStyle('#0000ff').lineWidth(2).lineGrad('#FFF','#00F')
	        .line(0,0,.15,.3).line(0,0,.3,.3).line(0,0,.3,.15)
	  		.line(.15,.3,.3,.3).line(.3,.3,.3,.15)
	        .echo(20,-0.2,-0.2,0,0,0,-70,1,1,0,.5)						 
		    .rotSym(3)		
	        .makeSprite('roll120',25,2,8);
sprites.blueboss2=createOGO(300).lineGrad('#00F','#F08').lineWidth(3)
	        .line(.2,0,0,.4)
	        .mirror(true,false)
	        .echo(10,0,-.4,0,0,0,0,.2,1,.5,1)
			.echo(5,0,-.1,0,0,0,0,2,1,.1,1)
			.makeSprite('throb',80,2,40);
			
sprites.red1=createOGO(200).lineGrad('#F00','#505').lineWidth(3)
					   .line(0,0,.15,.3).line(0,0,.3,.15)
					   .line(.15,.3,.3,.3).line(.3,.3,.3,.15)
	       .echo(10,-.4,.2,-.4,-.5,0,0,1.2,1,0,.8)						 
		   .rotSym(4)
		   .makeSprite('roll90',9,2);
sprites.red2=createOGO(200).lineGrad('#F88','#F00').lineWidth(2)
	           		       .line(0,0,.15,.3).line(0,0,.3,.15)
	  				       .line(.15,.3,.3,.3).line(.3,.3,.3,.15)
						   .echo(30,-0.2,-0.2,0,0,0,25,1,1,0,.2)						 
		   .rotSym(3)
		   .mirror(false,true)		   
		   .makeSprite('rock',15,2);
sprites.rbullet=createOGO(50).lineStyle('#F00').lineWidth(10)
	        .circle(.3,0,.05).lineStyle('#F8A').circle(.1,0,.01)
	        .echo(10,0,0,0,0,90,0,.5,1,.1,.5)
			.rotSym(3)
			.makeSprite('roll',6,2);
	        
		   	  			
}

