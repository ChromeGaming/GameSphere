var ParticleSys = function() {

	this.x = this.y = 0;
	this.v = true;
	
	this.isRun = false;
	
	this.p = [];
	
	// number of particles
	this.num = 0;
	
	// life span and life randomness
	this.ls = this.lr = 0;
	
	// basic speed
	this.dx = this.dy = 0;
	
	// random speed element
	this.dxR = this.dyR = 0;
	
	this.scaling = 1;
	
	// gravity etc
	this.fX = this.fY = 0;
	
	// spawn interval
	this.spI = 1;

	// next spawn at
	this.spN = 0;
	
	// spawn area
	this.spW = this.spH = 0;
	
	// frame offset allows us to start a particle system a number
	// of frames in (so we don't have to wait for a stream to get going)
	this.fo = 0;
	
	// for set duration bursts
	this.dur = 0;
	
	// will complete / is complete
	this.wc = this.ic = false;

	// 'root'
	this.rt = 0;
}

ParticleSys.prototype = {
	
	init : function(img, n, life, dx, dy, dxR, dyR, fX, fY, spW, spH, sc) {
		
		this.num = n;
		this.ls = life;
		
		// base speed
		this.dx = dx || 0;
		this.dy = dy || 0;

		// speed randomness
		this.dxR = dxR || 0;
		this.dyR = dyR || 0;

		// forces
		this.fX = fX || 0;
		this.fY = fY || 0;

		this.spW = spW || 0;
		this.spH = spH || 0;		
		
		this.scaling = sc || 0;

		// create all particles and put in list
		var i = this.num;
		while (i-- > 0) this.p.push(new Particle(img));
	},
	
	start : function(d) {
		
		this.dur = d || 0;
		this.isRun = true;
		
		if (this.dur > 0) this.wc = true;
		else this.wc = false;
		
		this.ic = false;
		
		// do any frame offsetting
		var i = this.fo;
		
		while (i-- > 0)	this.update();
	},
	
	stop : function() {
		
		this.isRun = false;
	},
	
	burst : function(num, rt) {
		
		var i = num;
		while (i-- > 0) this.add(this.rSpd(this.dx, this.dxR), this.rSpd(this.dy, this.dyR), this.rLf(this.ls));
		
		this.rt = rt || 0;
		
		this.wc = true;
		this.ic = false;
	},
	
	add : function (dx, dy, life) {
		
			// find next free particle
			var i = this.num;
			while (i-- > 0) {
				
				var p = this.p[i];
				
				// unused particles are hidden
				if (!p.v) break;
			}
			
			// set start position
			p.x = this.x;
			p.y = this.y;
			
			// spawn area
			if (this.spW != 0) p.x += (rnd() * this.spW) - (this.spW * 0.5);
			if (this.spH != 0) p.y += (rnd() * this.spH) - (this.spH * 0.5);
			
			p.setScale(1);
			
			p.maxLife = life;
			p.life = life;
			p.fade = 1 / life;
			
			p.dx = dx;
			p.dy = dy;
			
			p.scaling = this.scaling;
			
			// show particle
			p.v = true;
	},
	
	rSpd : function(d, r) {
		
		// deviation can be positive or negative
		var r = (((d + 1) * r) * rnd()) - (((d + 1) * r) * 0.5);
		d += r;
		
		return d;
	},
	
	rLf : function(life) {
		
		// deviation may ONLY be negative (so we always know the maximum value)
		var r = ((life + 1) * this.lr) * rnd();
		life -= r;
		
		return life;
	},
	
	setLfR : function(random) {
		
		this.lr = random;
	},

	setSpawnInt : function(interval) {
		
		this.spI = interval;
	},
	
	update : function(ex, ey) {
		
		if (this.dur > 0) {
		
			if (--this.dur == 0) this.stop();
		}
		
		if (this.isRun) {
			
			if (this.spN >= this.spI) {
				
				// add a particle every frame while the system is running
				this.add(this.rSpd(this.dx, this.dxR), this.rSpd(this.dy, this.dyR), this.rLf(this.ls));
				this.spN = 0;
			}
			
			this.spN++;
		}
		
		var i = this.num;
		
		while (i-- > 0) {
			
			var p = this.p[i];
			
			if (p.v) {
				
				// reduce life
				p.life--;
				
				if (p.life <= 0) {
					
					// remove the particle when dead
					p.v = false;
				}
				else {
					
					// is there any gravity/forces
					if (p.dy < 8) {

						p.dy += this.fY;
					}
					
					p.dx += this.fX;

					// update position
					p.x += p.dx;						
					p.y += p.dy;

					p.x += ex;
					p.y += ey;
					
					// update size
					p.setScale(p.scale * p.scaling);
				}
			}
		}
		
		// check for completion
		if (this.wc && !this.ic) {
			
			var complete = true;
			i = this.num;
			
			while (i-- > 0) {
				
				// all particles hidden
				if (this.p[i].v) {
					
					complete = false;
					break;
				}
			}
			
			if (complete) this.ic = true;
		}

		// draw
		i = this.num;
		while (i-- > 0)	this.p[i].draw();
	},
	
	cleanUp : function() {
		
		this.p = null;
	},
	
	reset : function() {
		
		var i = this.num;
		
		while (i-- > 0) this.p[i].v = false;
	}
}