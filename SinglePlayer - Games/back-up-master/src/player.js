var Player = function(px, py) {
	
	// position
	this.x = px;
	this.y = py;

	// size
	this.w = this.h = 0;

	// offset / anchor
	this.ox = this.oy = 0;
	
	// scale
	this.sx = this.sy = 1;
	
	this.img = im["a/p2.png"];
	
	this.isAlive = true;
	this.v = true;

	// movement speed
	this.dx = this.dy = 0;

	// anim direction
	this.aDir = 1;
	this.hop = 0;
	
	// when jumping
	this.isJump = false;
	
	// when falling
	this.isFall = false;
	
	// platform currently on
	this.currPlatform = null;
	
	target = this;
}

Player.prototype = {
	
	getX : function() {
		
		return this.x + this.ox;
	},
	
	getY : function() {
		
		return this.y + this.oy;
	},
	
	setScale : function(sx, sy) {
		
		this.sx = sx;
		this.sy = sy;
		
		this.w = this.img.width * this.sx;
		this.h = this.img.height * this.sy;

		this.ox = this.w * -0.5;
		this.oy = this.h * -1;
	},

	jump : function(pow) {
			
		if (!this.isJump) {
			
			this.dy = -18 * pow;
			this.isJump = true;
			
			// jump anim
			this.setScale(0.95, 1.1);
			this.hop = 0;

			this.currPlatform = null;
		}
	},
	
	land : function() {
		
		this.isJump = false;
		this.dy = 0;

		this.setScale(1.05, 0.9);
		this.aDir = 1;
		this.hop = 0;
	},

	walk : function() {
			
		if (this.aDir > 0) {
			
			if (this.sy < 1.1) {
				
				this.sy += 0.01;
				this.sx -= 0.005;

				this.hop -= 0.5;
			}
			else {
				
				this.sx = 0.95;
				this.sy = 1.1;
				this.aDir = -1;
			}
		}
		else {
			
			if (this.sy > 0.9) {
				
				this.sy -= 0.01;
				this.sx += 0.005;

				this.hop += 0.5;
			}
			else {
				
				this.sx = 1.05;
				this.sy = 0.9;
				this.aDir = 1;

				this.hop = 0;
			}
		}

		this.setScale(this.sx, this.sy);
	},

	update : function(mx, my) {
		
		// 'walk' animation
		if (!this.isJump) this.walk();

		if (this.v) {
			
			// draw the player in 2 halves
			ctx.drawImage(this.img, (this.x + this.ox - (this.img.width * 0.5 * this.sx)) * scale, (this.y + this.oy + this.hop) * scale, this.img.width * this.sx * scale, this.img.height * this.sy * scale);
			
			// flip 2nd half
			ctx.scale(-1, 1);
			ctx.drawImage(this.img, (this.x + this.ox + (this.img.width * 0.5 * this.sx)) * -scale, (this.y + this.oy + this.hop) * scale, -this.img.width * this.sx * scale, this.img.height * this.sy * scale);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
}