var Platform = function(img) {
	
	this.x = this.y = 0;

	this.by = 0;
	
	this.scale = 1;

	this.ox = 0;
	
	this.drop = 0;

	this.img = im[img];
	
	this.spr = im["a/spr2.png"];
    
    this.v = true;

    // size
	this.w = this.img.width;
    this.h = this.img.height;
		
	this.type = "basic";
		
	// inactive
	this.isOff = false;
	
	// not being used
	this.isUsed = true;

	// add a spring
	this.isSpr = false;
	this.sw = this.spr.width;
	this.sh = this.spr.height;

	this.sox = this.sw * -0.5;
	this.soy = this.sh * -0.65;
}

Platform.prototype = {
	
	getX : function() {
		
		return this.x + this.ox;
	},
	
	getY : function() {
		
		return this.y;
	},
	
	setScale : function(s) {
		
		this.scale = s;
		
		this.w = this.img.width * this.scale;
		this.h = this.img.height * this.scale;

		this.ox = (this.w * 0.72) * -0.5;
	},

	draw : function() {
		
		if (this.v && this.isUsed) {
		
			ctx.drawImage(this.img, (this.x + this.ox) * scale, (this.y + this.drop) * scale, this.img.width * this.scale * scale * 0.72, this.img.height * this.scale * scale * 0.72);

			if (this.isSpr) {

				// draw in 2 halves
				//ctx.drawImage(this.spr, (this.x + this.sox) * scale, (this.y + this.drop + this.soy) * scale, this.spr.width * scale, this.spr.height * scale);
				ctx.drawImage(this.spr, (this.x + this.sox - (this.spr.width * 0.5)) * scale, (this.y + this.drop + this.soy) * scale, this.spr.width * scale, this.spr.height * scale);
				
				ctx.scale(-1, 1);
				ctx.drawImage(this.spr, (this.x + this.sox + (this.spr.width * 0.5)) * -scale, (this.y + this.drop + this.soy) * scale, -this.spr.width * scale, this.spr.height * scale);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			}
		}
	}
}