var HUD = function() {
	
	this.score = 0;
	
	// quit button
	this.btn = new Button(Constants.W - 74, 10, "<");
	
	// charge bar
	this.bar = im["a/bar.png"];
	this.bBs = im["a/bar_base.png"];
	this.bS = 0;

	this.help = true;
	
	if (!isFT) {
		
		this.help = false;
	}

	target = this;
}

HUD.prototype = {
	
	setScore : function(val) {
		
		this.score = val;
	},
	
	click : function(mx, my) {
		
		if (this.btn.click(mx, my)) {
			
			game.music.stop();
			quitGame();
		}
	},
	
	draw : function() {
		
		if (this.help) {
		
			if (isTouch) print(240, 315, "TOUCH SCREEN TO CHARGE", true, 0.8);
			else print(240, 315, "HOLD ANY KEY TO CHARGE", true, 0.8);

			print(240, 350, "THEN RELEASE TO JUMP", true, 0.8);
		}
		
		this.btn.draw();
		
		print(240, 64, "" + this.score, true, 1.5);

		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(26 * scale, (577 * scale) + (114 * (1 - this.bS) * scale), 36 * scale, 114 * this.bS * scale);
		
		ctx.drawImage(this.bBs, 20 * scale, 570 * scale, this.bBs.width * scale, this.bBs.height * scale);
	},
	
	update : function(mx, my) {
		
		this.btn.update(mx, my);
	}
}