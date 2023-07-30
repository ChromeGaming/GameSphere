THREE.PlayerMesh = function (geometry, material) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'PlayerMesh';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.MeshNormalMaterial();

	this.size = geometry.boundingSphere.radius;

	this.clock = new THREE.Clock(true);

	this.velocity = new THREE.Vector3(0,0,0);

	this.maxJumps = 2;		// number of jumps allowed
	this.jumpCounter = 0;	// current number of jumps
	this.jumpV = 350;		// jump velocity
	this.gravity = -600;	// acceleration downwards
	this.maxV = 800		// max velocity in any direction

	this.floorHeight = this.size*2-1.1;
	this.platformHeight = this.floorHeight;

	// flags for collision in each direction. 0 = no collision, -1 and 1 = collision on one of the sides
	// ie: (0,-1,0) means collision with floor
	this.collisions = new THREE.Vector3(0,0,0);

	// Set the rays : one vector for every potential direction
    var dirs = [[-1, -1, -1], [-1, -1, 0], [-1, -1, 1], [-1, 0, -1], [-1, 0, 0], [-1, 0, 1], [-1, 1, -1], [-1, 1, 0], [-1, 1, 1], [0, -1, -1], [0, -1, 0], [0, -1, 1], [0, 0, -1], [0, 0, 0], [0, 0, 1], [0, 1, -1], [0, 1, 0], [0, 1, 1], [1, -1, -1], [1, -1, 0], [1, -1, 1], [1, 0, -1], [1, 0, 0], [1, 0, 1], [1, 1, -1], [1, 1, 0], [1, 1, 1]];
    this.rays = [];
    for (var i = 0; i < dirs.length; i++) {
        this.rays.push(new THREE.Vector3(dirs[i][0],dirs[i][1],dirs[i][2]));
    }

	// And the "RayCaster", able to test for intersections
    this.caster = new THREE.Raycaster();

	this.drawMode = THREE.TrianglesDrawMode;
	this.updateMorphTargets();

	this.score = 0;
};

THREE.PlayerMesh.prototype = Object.create( THREE.Mesh.prototype);
THREE.PlayerMesh.prototype.constructor = THREE.PlayerMesh;

THREE.PlayerMesh.prototype.jump = function () {
	var Vy = this.velocity.y
	if (this.jumpCounter < this.maxJumps) {
		this.velocity.setY(this.jumpV);
		this.jumpCounter += 1;
	}	
}

THREE.PlayerMesh.prototype.updateVelocity = function (dT) {
	var Vy;

	if (this.velocity.y > 0) {
		var Vy = Math.min(this.velocity.y + this.gravity*dT, this.maxV);
	} else {
		var Vy = Math.max(this.velocity.y + this.gravity*dT, -this.maxV);
	}
	var Cy = this.collisions.y;

	// change velocities to 0 when object hits obstacle
	if (Cy == -1 && Vy <= 0) {			// collision with floor
		this.velocity.setY(0);
		this.jumpCounter = 0;
	} else if (Cy == 1 && Vy >= 0) {	// collision with ceiling
		this.velocity.setY(0);
	} else {							// no collision
		this.velocity.setY(Vy);
	}
}

THREE.PlayerMesh.prototype.updatePosition = function () {
	this.CollisionCheck();

	dT = this.clock.getDelta();
	this.updateVelocity(dT);
	
	var Py = this.position.y + this.velocity.y*dT;

	if (Py < this.platformHeight) {
		this.position.setY(this.platformHeight);
	} else {
		this.position.setY(Py);
	}
	if ( (Math.abs(this.position.x)>500) || (Math.abs(this.position.z)>500) ) {
		this.floorHeight = - 50000;
		if (this.position < -500) {
			this.maxV = -10000;
		}
	} else if (this.position.y >= 0) {
		this.floorHeight = this.size*2-1.1;
	}
}

THREE.PlayerMesh.prototype.CollisionCheck = function () {
	this.collisions.set(0,0,0);

	for (i = 0; i < this.rays.length; i += 1) {
	  // We reset the raycaster to this direction
	  this.caster.set(this.position, this.rays[i]);
	  // Test if we intersect with any obstacle mesh
	  collisions = this.caster.intersectObjects(allObstacles);
	  // And flag for collision if we do
	  if (collisions.length > 0 && collisions[0].distance <= this.size) {	
	  	var distanceMoved = this.size-collisions[0].distance;
	  	var angleRotated = -2*distanceMoved/player.size;
	    if ([0, 1, 2, 9, 10, 11, 18, 19, 20].indexOf(i) != -1) {			//collision in -y
	    	this.collisions.setY(-1);
	    	this.platformHeight = collisions[0].point.y; //set height of current platform
	    	this.translateY(distanceMoved);		//shift player so it's just touching the edge

	    } else if ([6, 7, 8, 15, 16, 17, 24, 25, 26].indexOf(i) != -1) {	//collision in y
	    	this.collisions.setY(1);
	    	this.translateY(-distanceMoved);	//shift player so it's just touching the edge 
	    }

	    if ([0, 1, 2, 3, 4, 5, 6, 7, 8].indexOf(i) != -1) {	    			//collision in -x
	    	this.collisions.setX(-1);
	    	this.translateX(distanceMoved);		//shift player so it's just touching the edge
    	    ball.rotateZ(-angleRotated);	 
	    } else if ([18, 19, 20, 21, 22, 23, 24, 25, 26].indexOf(i) != -1) {	//collision in z
	    	this.collisions.setX(1);
	    	this.translateX(-distanceMoved);	//shift player so it's just touching the edge
    	    ball.rotateZ(angleRotated);	 
	    }

	    if ([0, 3, 6, 9, 12, 15, 18, 21, 24].indexOf(i) != -1) {			//collision in -z
	    	this.collisions.setZ(-1);
	    	this.translateZ(distanceMoved);		//shift player so it's just touching the edge
	    	ball.rotateX(angleRotated);	 
	    } else if ([2, 5, 8, 11, 14, 17, 20, 23, 26].indexOf(i) != -1) {	//collision in z
	    	this.collisions.setZ(1);
	    	this.translateZ(-distanceMoved);	//shift player so it's just touching the edge
    	    ball.rotateX(angleRotated);	 
	    }

	  } else { // no collisions so the ball is allowed to fall
	  	this.platformHeight = this.floorHeight;
	  }
	}
}