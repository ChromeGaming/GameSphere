var Preloader = function(root, w, h) {
	
	this.root = root;
	
	this.w = w; 
	this.h = h;
	
	// progress
	this.p = 0;
	
	this.total = 0;
	this.loaded = 0;
	
	this.isReady = true;
	this.isComplete = false;
	
	target = this;
};

Preloader.prototype = {
	
	draw : function() {
		
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect((Constants.w / 2) - (this.w / 2), (Constants.h / 2) - (this.h / 2), this.w * this.p, this.h);
	},
	
	update : function(loaded, total) {
		
		this.loaded = loaded;
		this.total = total;
		
		this.p = this.loaded / this.total;
		
		if (this.total > 0 && this.p == 1) {
			
			this.isComplete = true;
		}
	}
}