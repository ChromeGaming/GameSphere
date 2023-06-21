var Button = function(x, y, t) {

	this.x = x || 0;
	this.y = y || 0;
	
	this.w = 64;
	this.h = 64;
	
	this.v = true;
	this.isOver = false;
	
	this.t = t || '';

	// full circle
	this.c = 2 * Math.PI;

	target = this;
}

Button.prototype = {
	
	click : function(mx, my) {
		
		if (mx > this.getX() && mx < this.getX() + this.getW() && my > this.getY() && my < this.getY() + this.getH()) {
			
			return true;
		}
		
		return false;
	},
	
	getX : function() {
		
		return this.x * scale;
	},
	
	getY : function() {
		
		return this.y * scale;
	},
	
	getW : function() {
		
		return this.w * scale;
	},
	
	getH : function() {
		
		return this.h * scale;
	},
	
	update : function(mx, my) {
		
		if (!this.isOver) {
			
			// rolling over?
			if (mx > this.getX() && mx < this.getX() + this.getW() && my > this.getY() && my < this.getY() + this.getH()) {
				
				this.isOver = true;
			}
		}
		else {
			
			// rolled out?
			if (mx < this.getX() || mx > this.getX() + this.getW() || my < this.getY() || my > this.getY() + this.getH()) {
			
				this.isOver = false;
			}
		}
	},
	
	draw : function() {
		
		if (this.v) {
			
			var oy = 0;

			if (this.isOver) {
				
				oy = 4;
			}
			else {

				// shadow
				ctx.globalAlpha = 0.25;
				ctx.beginPath();
				ctx.arc((this.x + 32) * scale, (this.y + 36) * scale, 32 * scale, 0, this.c);
				ctx.fillStyle = "#000000";
				ctx.fill();
				ctx.globalAlpha = 1;
			}
			
			ctx.beginPath();
			ctx.arc((this.x + 32) * scale, (this.y + 32 + oy) * scale, 32 * scale, 0, this.c);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();

			ctx.beginPath();
			ctx.arc((this.x + 32) * scale, (this.y + 32 + oy) * scale, 27 * scale, 0, this.c);
			ctx.fillStyle = "#EA1C5A";
			ctx.fill();

			print(this.x + 26, (this.y + oy + 15), this.t, true, 1.2);
		}
	}
}