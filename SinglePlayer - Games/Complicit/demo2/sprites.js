
var OGO={
 line: function(x,y,x2,y2) { this.ctx.beginPath(); this.ctx.moveTo(x,y); this.ctx.lineTo(x2,y2); this.ctx.stroke(); return this;},
 circle: function(x,y,r) { this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, 2 * Math.PI, false); this.ctx.stroke(); return this;},
 lineStyle: function(s) { this.ctx.strokeStyle=s;  return this;},
 lineWidth: function(w) { this.ctx.lineWidth=w/100;  return this;},
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
 makeSprite:function(cls,size,type) {
	this.addDivSample(cls);
	return {
		size: size,
		coltype: type,
		displayCls: cls,
		imgData: this.canvas.toDataURL()				
	}
 }
 
 
 
};

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

return ogo;
}

var sprites={};


function prepSprites() {
sprites.avatar=createOGO(200).lineWidth(2)
	  .lineStyle('#FFAA00').line(.2,.35,.25,.5)
	  .lineStyle('#FF0000').line(.1,.4,.2,.5)
	  .echo(5,-.5,0,0,0,0,0,1,1,1,1)
	  .echo(3,0,-.3,0,0,0,0,1,1,0,1)
	  .lineWidth(3).lineStyle('#FFFF99')
	  .line(.4,.4,0,-.4).line(.4,.4,0,.2).circle(0,0,.1)
	  .mirror(true,false)
	  .echo(10,0,0,0,0,0,0,.1,1,0.1,1)
	  .makeSprite('normal',15,1);
sprites.aBullet=createOGO(50)
	   .lineStyle('#ffffff').lineWidth(2).line(0,0,.3,-.3)
	  .lineStyle('#aaaa00').lineWidth(2).line(0,0,0,-.4)
	  .echo(10,0,0,0,0,0,90,1,.6,.3,1)
	  .rotSym(5)
	  .makeSprite('bullet',5,1);
sprites.grunt1=createOGO(150)
	.lineStyle('#55AA00').lineWidth(2).circle(.1,.1,.1)
	.lineStyle('#00FF00').circle(.3,0,.1)
	.echo(80,0,0,0,0,0,360,1,1,0,.5)
	.rotSym(2)
	.makeSprite('roll',10,2);
sprites.grunt2=createOGO(150)
	.lineStyle('#99AA00').lineWidth(2).circle(.1,.1,.05)
	.lineStyle('#00FF00').circle(.3,.2,.05)
	.echo(80,0,0,0,0,0,120,1,1,0,.5)
	.rotSym(3)
	.makeSprite('rock',20,2);
sprites.greenBullet=createOGO(50)
	.lineStyle('#00ff00').lineWidth(3).line(0,.4,0,-.4)
	.echo(20,0,0,0.4,0,0,0,1,.1,.8,0)
	.rotSym(2)
	.makeSprite('bullet',4,2);

}

