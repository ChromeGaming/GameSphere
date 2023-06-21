var Tree = function(x, w) {
	
	this.x = x;
	this.y = 0;	
	
    // scale
    this.sx = w / 64;
    this.sy = 720;

    // visible
    this.v = true;
}

Tree.prototype = {
	
	draw : function() {
		
		if (this.v) {
		
			ctx.fillStyle = "#3D81C2";
			ctx.fillRect(this.x * scale, this.y * scale, this.sx * 64 * scale, this.sy * scale);
		}
	}
}