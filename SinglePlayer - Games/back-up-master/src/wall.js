var Wall = function(shade) {
	
	this.x = this.y = 0;

	// base vertical position
	this.by = 0;
	
	// offset
	this.ox = this.oy = 0;
	
	// scale
    this.sx = this.sy = 1;

	this.init(shade);
	
	this.isFront = true;
	this.v = true;
	this.sv = false;

	// randomize asset used
	this.as = 1;
	if (rnd() < 0.3) this.as = 0;

	this.ft = im["https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/5d12b590-9b9f-4452-9f1a-0493c6db485a"];
	this.sd = im["https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/b4bb1ccd-18b9-4b2e-99cd-649b1d0da9d2"];
}

Wall.prototype = {
	
	init : function(shade) {
		
		this.sv = false;
		if (shade) {

			this.sv = true;
		}
	},
	
	getX : function() {
		
		return this.x + this.ox;
	},
	
	getY : function() {
		
		return this.y + this.oy;
	},
	
	setScale : function(s) {
		
		this.sx = s;
		
		this.ox = ((this.ft.width * 0.48) * this.sx) * -0.5;
	},
	
	draw : function() {
		
		if (this.v) {
		
			if (this.isFront) {

				ctx.drawImage(this.ft, 0, 100 * this.as, 100, 100, (this.x + this.ox) * scale, (this.y + this.oy) * scale, 100 * this.sx * scale * 0.48, 100 * this.sy * scale * 0.48);
				
				// shadow (for under platforms)
				if (this.sv) {

					ctx.drawImage(this.sd, (this.x + this.ox) * scale, (this.y + this.oy) * scale, this.sd.width * this.sx * scale * 0.48, this.sd.height * this.sy * scale * 0.48);
				}
			}
		}
	}
}