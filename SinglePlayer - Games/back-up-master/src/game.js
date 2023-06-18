var Game = function() {

	this.isCharge = false;
	this.pow = 0;

	this.score = 0;
	
	this.p = null;
	
	// center of tower
	this.cx = 240;
	this.cy = -144;
	this.co = 0;

	// tower info
	this.rad = 120;
	this.circ = Math.PI * this.rad * 2;
	this.ang = 0;
		
	// tower elements
	this.lev = [], this.walls = [], this.plats = [];
	
	this.sets = [["1110011100111100",
					 "1100111001110011",
					 "1001110011111001",
					 "1111001111001111",
					 "1100111111001100"]];
					 
					/*
					["1100011100111100",
					 "1100111001100011",
					 "1001110001111001",
					 "1110001110001111",
					 "1100011111001100"]];
					 */
	
	this.nxSet = 0;
	this.currLev = 0;

	// player speed
	this.sp = 0.01;

	var a = Math.PI / 8;

	this.trees = [new Tree(50, 32), new Tree(150, 48), new Tree(280, 64), new Tree(400, 32), new Tree(550, 64)];
	this.beams = [new Beam(100, -100, 40, a), new Beam(150, -100, 60, a), new Beam(170, -120, 100, a), new Beam(250, -100, 60, a), new Beam(350, -80, 100, a), new Beam(390, -120, 60, a), new Beam(500, -80, 100, a)];

	this.hud = new HUD();
	this.lf = new ParticleSys();

	this.lf2 = new ParticleSys();

	this.music = new Music();
	
	target = this;
}

Game.prototype = {
	
	init : function() {
		
		this.score = 0;
		this.hud.setScore(this.score);

		// leaves
		this.lf.init(im["a/leaf.png"], 15, 100, 0, -2, 2, 2, 0, 0.2, 50, 0, 0.98);

		this.lf2.init(im["a/leaf.png"], 20, 500, 0, 0, 2, 2, 0, 0.1, 720, 0, 0.995);
		this.lf2.x = 240;
		this.lf2.setSpawnInt(50);
		this.lf2.start();

		var i, map = [];

		// height
		for (i = 0; i < 18; i += 3) {

			map.push([], [], []);	
			
			this.fillRow(map[i], 0);
			this.fillRow(map[i + 1], 1);
			this.fillRow(map[i + 2], 0);
		}

		// build level
		for (i = 0; i < map.length; i++) {
			
			for (var j = 0; j < 16; j++) {
			
				var a = ((Math.PI * 2) / 16) * j,
					w = new Wall();

				this.walls.push(w);
				
				w.a = a;
				w.x = this.cx + Math.sin(a) * (this.rad);
				w.y = this.cy - (48 * i);
				w.by = 48 * (i + 2);
	
				if (map[i][j] == 1) {
					
					var p = new Platform("a/plat.png");
					this.lev.push(p);
					this.plats.push(p);
					
					p.a = a;	
					p.setScale(1 + (rnd() * 0.5));
					p.x = this.cx + Math.sin(a) * (this.rad + 64);
					p.y = this.cy - (48 * (i + 1));
					p.by = (48 * (i + 1));
	
					p.wall = w;
				}
			}
	
			// create the player at a set position
			this.p = new Player(240, 750);
			this.p.setScale(1, 1);

			this.p.jump(1);

			// harcoded rows to start
			if (i == 10 || i == 7 || i == 4 || i == 1) this.setRow(48 * (i + 1));
			else if (i == 16) this.setRow(48 * (i + 1), true);	
		}
	},
	
	onKeyDown : function(key) {
		
		if (key == 1) this.msDn();
	},
	
	onKeyUp : function(key) {
		
		if (key == 1) this.msUp();
	},
	
	msDn : function(player) {
	
		// check buttons first
		if (this.hud.btn.isOver) return;
		
		// start charge
		if (this.p.isAlive) this.isCharge = true;
	},
	
	msUp : function(player) {
			
		// check buttons first
		if (this.hud.btn.isOver) {
			
			this.hud.click(mPos.x, mPos.y);
			return;
		}
		
		if (this.p.isAlive) {
			
			this.isCharge = false;
			this.p.jump(this.pow);
			this.music.jump();
			this.pow = 0;

			this.hud.bS = 0;
			this.hud.help = false;
			isFT = false;
		}
	},

	fillRow : function(row, fill) {

		// fill a whole row with 'fill' value
		for (var i = 0; i < 16; i++) row[i] = fill;
	},

	setRow : function(row, blank) {

		var set = this.sets[this.currLev][this.nxSet].split(''),	p = 0;
		
		for (var j = 0; j < this.lev.length; j++) {

			var lv = this.lev[j];

			// all pieces on the same row
			if (lv.by == row) { 
			
				lv.isUsed = false;

				if (parseInt(set[p]) == 1 && !blank) {

					lv.isUsed = true;
					lv.setScale(1 + (rnd() * 0.5));

					// set shadow on the wall
					lv.wall.init(true);
				}

				p++;
			}
		}

		if (!blank) {
		
			this.nxSet++;
			if (this.nxSet > 4) this.nxSet = 0;
		}
	},

	updateLevel : function() {
		
		var i;

		for (i = 0; i < this.lev.length; i++) {
		
			// offset
			var o = 64, lev = this.lev[i];

			if (lev.type == 'branch') o = 24;

			lev.a += this.sp;
			lev.d = (Math.cos(lev.a) * (this.rad + o)) + lev.y;
			lev.x = this.cx + Math.sin(lev.a) * (this.rad + o);
			
			// back platforms aren't collidable
			if ((Math.cos(lev.a) * (this.rad + o)) > 0)	lev.isOff = true;
			else lev.isOff = false;
		}
		
		for (i = 0; i < this.walls.length; i++) {
			
			var w = this.walls[i];

			w.a += this.sp;
			w.d = (Math.cos(w.a) * (this.rad)) + w.y;
			w.x = this.cx + Math.sin(w.a) * (this.rad);
		
			w.setScale((Math.cos(w.a) * (this.rad)) / (this.rad));

			if ((Math.cos(w.a) * (this.rad)) < 0) w.isFront = true;
			else w.isFront = false;
		}

		// draw level			
		var i, sprites = [];

		for (i = 0; i < this.lev.length; i++) sprites.push(this.lev[i]);
		for (i = 0; i < this.walls.length; i++) sprites.push(this.walls[i]);
		
		// start sort
		sprites.sort(function(a, b) {
			
			return a.d - b.d;
		});
		
		i = sprites.length - 1;
		while (--i > 0) sprites[i].draw();
	},

	checkFall : function(p) {
			
		var pMid = this.p.x,
			pBase = this.p.y + this.p.h;
		
		// check if falling
		if (!this.colPtPlat(pMid, pBase + 1, p) || !p.isUsed || p.isOff) return true;
		
		this.p.currPlatform = p;
		return false;
	},
	
	colPtPlat : function(px, py, p) {
		
		// check collision point vs platform
		if (!p.v) return false;
		
		var pLeft = p.x - (p.w / 2), 
			pRight = p.x + (p.w / 2);
		
		// horizontally aligned?
		if (px > pLeft && px < pRight) {
			
			// hitting vertically
			if (py > p.y && py < p.y + p.h) {
				
				return true;
			}
		}
		
		return false;
	},

	update : function(mx, my) {

		// background
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, 480 * scale, 720 * scale);

		var i, cy1 = this.cy;

		for (i = 0; i < this.trees.length; i++) {

			this.trees[i].x += this.sp * 100;

			if (this.trees[i].x > (600)) this.trees[i].x -= (800); 
			this.trees[i].draw();
		}

		this.hud.update(mx, my);
			
		if (this.isCharge) {

			this.pow += 0.02

			if (this.pow > 1) this.pow = 0;

			this.hud.bS = this.pow;
		}
		
		if (this.p.isJump) {
		
			// going up and more than halfway up the screen - move the level 
			if (this.p.dy < 0 && this.p.y <= (Constants.H / 2)) {
				
				this.cy -= this.p.dy;
				this.co -=  this.p.dy;
			}
			// going down or lower than halfway up the screen - move the player
			else {

				this.p.y += this.p.dy;
			}

			this.p.dy += 0.5;
			
			// cap falling speed
			if (this.p.dy > 16) this.p.dy = 16;
		}

		// update vertical position of level
		for (i = 0; i < this.lev.length; i++) this.lev[i].y = this.lev[i].by + this.cy;			
		for (i = 0; i < this.walls.length; i++) this.walls[i].y = this.walls[i].by + this.cy;

		var pMid = this.p.x, pBase = this.p.y;
		
		if (this.p.isJump) {
			
			// landed on a platform?				
			for (i = 0; i < this.plats.length; i++) {
				
				var pl = this.plats[i];

				if (pl.v && !this.p.isFall && !pl.isOff && pl.isUsed) {
					
					// falling?
					if (this.p.dy > 0) {
						
						var pLeft = pl.x - (pl.w / 2), pRight = pl.x + (pl.w / 2);
						
						// player midpoint is within the platform dimensions horizontally?
						if (pMid > pLeft && pMid < pRight) {
							
							// vertically colliding
							if (pBase > pl.y && pBase < pl.y + pl.h) {
								
								// was above the platform last update?
								if (pBase - this.p.dy < pl.y) {

									var diff = this.p.y - pl.y;

									// going up and more than halfway up the screen - move the level 
									if (this.p.dy < 0 && this.p.y <= (Constants.H / 2)) {
										
										this.cy += diff;
										this.co += diff;
									}
									// going down or lower than halfway up the screen - move the player
									else {

										this.p.y -= diff;
									}

									this.p.land();
									this.lf.burst(5, this.cy);
									this.music.land();
									break;
								}
							}
						}

						// gameover when off the bottom of the screen
						if (this.p.y > Constants.H + 20) {

							if (this.p.isAlive) {
							
								this.p.isAlive = false;
								this.music.stop();
								quitGame();
							}
						}
					}
				}
			}
		}
		else {
			
			// not already falling?
			if (this.p.dy == 0) {
					
				// falling off a platform?
				for (i = 0; i < this.plats.length; i++) {
				
					if (this.checkFall(this.plats[i])) {
						
						// start falling
						this.p.isJump = true;
					}
					else {
						
						// not falling
						this.p.isJump = false;
						break;
					}
				}
			}
		}

		for (i = 0; i < this.walls.length; i++) {
		
			if (this.walls[i].y > Constants.H) {

				this.walls[i].by -= 864;
				this.walls[i].init(false);
			}
		}

		for (i = 0; i < this.lev.length; i++) {
		
			if (this.lev[i].y > Constants.H) {

				var row = this.lev[i].by,
					set = this.sets[this.currLev][this.nxSet].split(''),
					p = 0,
					spr = false;
				
				for (var j = 0; j < this.lev.length; j++) {

					var lv = this.lev[j];

					// all pieces on the same row
					if (lv.by == row) { 
					
						lv.by -= 864;
						lv.y = this.cy + lv.by;
						lv.isUsed = false;
						lv.isSpr = false;

						if (parseInt(set[p]) == 1) {

							lv.isUsed = true;
							lv.setScale(1 + (rnd() * 0.5));

							// 5% chance of a spring
							if (rnd() < 0.05 && !spr) {
				
								lv.isSpr = true;
								spr = true;
							}

							// set shadow on the wall
							lv.wall.init(true);
						}

						p++;
					}
				}

				this.nxSet++;
				if (this.nxSet > 4) this.nxSet = 0;
			}
		}

		// drop platform when being stood on
		for (i = 0; i < this.plats.length; i++) {

			var pl = this.plats[i];

			if (pl == this.p.currPlatform) {

				pl.drop = 0;

				// landed on a spring?
				if (pl.isSpr) this.p.jump(1.4);
			}
			else {
				
				pl.drop = -4;
			}
		}

		this.updateLevel();
		
		// update
		this.p.update();

		var cy1 = cy1 - this.cy;

		// particles
		this.lf.x = this.p.x;
		this.lf.y = this.p.y;
		this.lf.update(this.sp * -100, -cy1);

		this.lf2.update(this.sp * -100, -cy1);

		for (i = 0; i < this.beams.length; i++) {

			this.beams[i].x -= this.sp * 100;

			if (this.beams[i].x < -200) this.beams[i].x += 750; 

			this.beams[i].draw();
		}

		// score goes up every level climbed
		while (this.co > 48) {

			this.score++;
			this.hud.setScore(this.score);
			this.music.setLev(this.score);

			this.co -= 48;
		}

		if (this.score > hiscore) hiscore = this.score;
		
		this.hud.draw();
	},
	
	cleanUp : function() {
	
	}
}