var Transition = function() {
	
	this.v = false;
	this.w = false;
	
	// position - start at the bottom
	this.p = Constants.H;
	
	this.speed = 60;
	this.isTop = true;
	
	target = this;
}

Transition.prototype = {
	
	start : function() {
		
		this.p = Constants.H;
		this.v = true;
		this.w = false;
		this.isTop = true;
	},
	
	onComplete : function() {
		
		this.v = false;
	},
	
	onHidden : function() {
		
		this.w = true;
		var scope = this;

		setTimeout(function() {scope.w = false; transFunc();}, 100);
	},
	
	update : function() {
		
		if (this.v) {

			if (!this.w) {
			
				this.p -= this.speed;
				
				if (this.p <= 0 && this.isTop) {
					
					this.onHidden();
					this.isTop = false;
				}
				else if (this.p <= (Constants.H) * -1) {
					
					this.onComplete();
				}
			}	

			// clear between
			var px = 0, py = 0;
			if (this.p > 0) py = (this.p) * scale;
			
			ctx.clearRect(px, py, cv.width, (this.p + Constants.H) * scale);
		}
	}
}