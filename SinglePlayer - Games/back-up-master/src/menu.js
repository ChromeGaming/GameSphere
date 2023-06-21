var Menu = function() {

	// tower elements
	this.lev = [];
	this.walls = [];

	// center of tower
	this.cx = 240;
	this.cy = 730;

	// tower info
	this.rad = 120;
	this.circ = Math.PI * this.rad * 2;
	this.ang = 0;

	this.layouts = ["0000000011110000",
				 	"0000111000111100",
				 	"0001111111100000"];
	
	this.nextLayout = 0;

	this.buildLevel();

	this.p = new Player(240, /*650*/0);
	this.p.setScale(1, 1);
	this.p.jump(0);

	var a = Math.PI / 8;
	this.trees = [new Tree(50, 32), new Tree(400, 48)];
	this.beams = [new Beam(100, -100, 60, a), new Beam(120, -120, 100, a), new Beam(200, -100, 60, a)];

	target = this;

	// flash CTA
	this.int = null;
	this.flashOn = true;
}

Menu.prototype = {

	click : function(mx, my) {
		
		if (audioCtx) {

			// Create empty buffer
			var b = audioCtx.createBuffer(1, 1, 22050);
			var s = audioCtx.createBufferSource();
			
			s.buffer = b;
			s.connect(audioCtx.destination);

			// Play sound
			if (s.start) {

				s.start(0);
			}
		}

		clearInterval(this.int);
		this.int = null;

		startGame();
	},

	flash : function() {

		this.flashOn = !this.flashOn;
	},

	buildLevel :function() {

		var map = [];
		var i;

		// height
		for (i = 0; i < 18; i++) {

			map[i] = [];
			
			if (i == 7 || i == 10 || i == 13) this.fillRow(map[i], 1);
			else this.fillRow(map[i], 0);
		}

		// build level
		for (i = 0; i < map.length; i++) {
			
			for (var j = 0; j < 16; j++) {
			
				var a = ((Math.PI * 2) / 16) * j;
				
				var w = new Wall();
				this.walls.push(w);
				
				w.a = a;
				w.y = this.cy - (48 * i);
				w.by = 48 * (i + 2);
				
				if (map[i][j] == 1 || map[i][j] == 3) {
					
					var p = new Platform("a/plat.png");
					this.lev.push(p);
					
					p.a = a;	
					p.setScale(1 + (rnd() * 0.5));
					p.y = this.cy - (48 * (i + 1));
					p.by = (48 * (i + 1));
	
					p.wall = w;
				}
			}
			
			if (i == 7 || i == 10 || i == 13) this.setRow(48 * (i + 1));
		}

		// update all parts
		for (i = 0; i < this.lev.length; i++) {
		
			// offset
			var o = 64;
			var lev = this.lev[i];

			if (lev.type == 'branch') o = 24;

			lev.d = (Math.cos(lev.a) * (this.rad + o)) + lev.y;
			lev.x = this.cx + Math.sin(lev.a) * (this.rad + o);
		}
		
		for (i = 0; i < this.walls.length; i++) {
			
			var w = this.walls[i];

			w.d = (Math.cos(w.a) * (this.rad)) + w.y;
			w.x = this.cx + Math.sin(w.a) * (this.rad);
		
			w.setScale((Math.cos(w.a) * (this.rad)) / (this.rad));

			if ((Math.cos(w.a) * (this.rad)) < 0) w.isFront = true;
			else w.isFront = false;
		}

		var u = this;
		this.int = setInterval(function(){u.flash();}, 800);
	},

	fillRow : function(row, fill) {

		// fill a whole row with 'fill' value
		for (var i = 0; i < 16; i++) row[i] = fill;
	},

	setRow : function(row) {

		var layout = this.layouts[this.nextLayout].split('');

		var p = 0;
		
		for (var i = 0; i < this.lev.length; i++) {

			var lv = this.lev[i];

			// all pieces on the same row
			if (lv.by == row) { 
			
				lv.isUsed = false;

				if (parseInt(layout[p]) == 1) {

					lv.isUsed = true;
					lv.setScale(1 + (rnd() * 0.5));

					// set shadow on the wall
					lv.wall.init(true);
				}

				// next layout
				p++;
			}
		}

		this.nextLayout++;
	},

	drawLevel : function() {
			
		var sprites = [];			
		var i;

		for (i = 0; i < this.lev.length; i++) sprites.push(this.lev[i]);
		for (i = 0; i < this.walls.length; i++) sprites.push(this.walls[i]);
		
		// start sort
		sprites.sort(function(a, b) {
			
			return a.d - b.d;
		});

		i = sprites.length - 1;

		while (--i > 0) sprites[i].draw();
	},
	
	update : function(mx, my) {
		
		// background
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, 480 * scale, 720 * scale);

		var i;

		// background trees
		for (i = 0; i < this.trees.length; i++) this.trees[i].draw();
		
		this.drawLevel();

		ctx.fillStyle = "#3FAB92";
		ctx.fillRect(0, (650 * scale), 480 * scale, 70 * scale);


		// player egg
		var pBase = this.p.y;

		if (this.p.isJump) {

			this.p.y += this.p.dy;
			this.p.dy += 0.5;
				
			// cap falling speed
			if (this.p.dy > 16) this.p.dy = 16;

			if (this.p.y > 650) {

				this.p.land();
			}
		}


		this.p.update();

		// light rays
		for (i = 0; i < this.beams.length; i++) this.beams[i].draw();
		
		// title / logo made of text
		print(235, 163, "GET", true, 1.8);
		print(235, 220, "BACK", true, 1.3);
		print(230, 260, "UP ", true, 1.6);
		print(272, 262, ":", true, 1.3);
		print(273, 301, ";", true, 1.3);

		if (this.flashOn) {
		
			if (isTouch) print(235, 500, "TAP TO PLAY", true, 1);
			else print(235, 500, "PRESS ANY KEY", true, 1);
		}
	},
	
	cleanUp : function() {
		
	}
}