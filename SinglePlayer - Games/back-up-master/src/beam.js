var Beam = function(x, y, w, r) {
	
	this.x = x;
    this.y = y;
	
    this.img = im["a/ray.png"];

    // scale
    this.sx = w / this.img.width;
    this.sy = 1;

    this.r = r;

    // visible
    this.v = true;
}

Beam.prototype = {
	
	draw : function() {
		
		if (this.v) {
        
            ctx.translate(this.x * scale, this.y * scale);
            ctx.rotate(this.r);
            ctx.drawImage(this.img, this.x * scale, this.y * scale, this.img.width * this.sx * scale, this.img.height * this.sy * scale);
            ctx.rotate(-this.r);
            ctx.translate(-this.x * scale, -this.y * scale);
		}
	}
}