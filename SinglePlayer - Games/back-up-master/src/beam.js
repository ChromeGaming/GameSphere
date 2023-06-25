var Beam = function(x, y, w, r) {
	
	this.x = x;
    this.y = y;
	
    this.img = im["https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/7ea18bd4-e80c-45ba-9d11-bc8692bd5db5"];

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