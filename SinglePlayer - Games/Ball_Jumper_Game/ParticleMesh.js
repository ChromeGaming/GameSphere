THREE.ParticleMesh = function (geometry, material,velocity) {

	THREE.Mesh.call( this, geometry, material);

	this.type = 'ParticleMesh';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.MeshNormalMaterial();

	this.size = geometry.boundingSphere.radius;

	this.clock = new THREE.Clock(true);

	this.velocity = velocity;
    this.gravity = -400;    // acceleration downwards
    this.maxV = 500         // max velocity in any direction

    this.bounceFactor = 0.5;
    this.slowFactor = 0.99;

    this.floorHeight = this.size*4;
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
};

THREE.ParticleMesh.prototype = Object.create( THREE.Mesh.prototype);
THREE.ParticleMesh.prototype.constructor = THREE.ParticleMesh;

THREE.ParticleMesh.prototype.updateVelocity = function (dT) {
    var Vy;
    if (this.velocity.y > 0) {
        var Vy = Math.min(this.velocity.y + this.gravity*dT, this.maxV);
    } else {
        var Vy = Math.max(this.velocity.y + this.gravity*dT, -this.maxV);
    }
    var Cy = this.collisions.y;

    // change velocities to 0 when object hits obstacle
    if (Cy == -1 && Vy <= 0) {          // collision with floor
        this.velocity.setY(-this.bounceFactor*Vy);
    } else if (Cy == 1 && Vy >= 0) {    // collision with ceiling
        this.velocity.setY(0);
    } else {                            // no collision
        this.velocity.setY(Vy);
    }

    var Vx = this.velocity.x*this.slowFactor;
    var Cx = this.collisions.x;
    if ( (Cx == -1 && Vx <= 0) || (Cx == 1 && Vx >= 0) ){
        this.velocity.setX(-this.bounceFactor*Vx);
    } else {
        this.velocity.setX(Vx);
    }

    var Vz = this.velocity.z*this.slowFactor;
    var Cz = this.collisions.z;
    if ( (Cz == -1 && Vz <= 0) || (Cz == 1 && Vz >= 0) ) {
        this.velocity.setZ(-this.bounceFactor*Vz);
    } else {
        this.velocity.setZ(Vz);
    }
}

THREE.ParticleMesh.prototype.updatePosition = function () {
    this.CollisionCheck();

    dT = this.clock.getDelta();
    this.updateVelocity(dT);
    
    var Py = this.position.y + this.velocity.y*dT;

    if (Py < this.platformHeight) {
        this.position.setY(this.platformHeight);
    } else {
        this.position.setY(Py);
    }

    var Px = this.position.x + this.velocity.x*dT;
    this.position.setX(Px);

    var Pz = this.position.z + this.velocity.z*dT;
    this.position.setZ(Pz);

    if ( (Math.abs(this.position.x)>500) || (Math.abs(this.position.z)>500) ) {
        this.floorHeight = - 10000;
    }

    if (this.position.y <= -1000){
        removeParticle(this);
    }


}

THREE.ParticleMesh.prototype.CollisionCheck = function () {
    this.collisions.set(0,0,0);

    for (i = 0; i < this.rays.length; i += 1) {
      // We reset the raycaster to this direction
      this.caster.set(this.position, this.rays[i]);
      // Test if we intersect with any obstacle mesh
      collisions = this.caster.intersectObjects(allObstacles.concat([player],allParticles));
      // And flag for collision if we do
      if (collisions.length > 0 && collisions[0].distance <= this.size) {

        // change velocity as result of impact
        if (collisions[0].object.type == "PlayerMesh" || collisions[0].object.type == "ParticleMesh") {

            var colObj = collisions[0].object;
            var BF = this.bounceFactor;
            var size1 = Math.pow(this.size,3);
            var size2 = Math.pow(colObj.size,3);
            var BF = Math.min(BF * size2/size1, 3);

            var collisionSpeed = colObj.velocity.length();
            var normal = collisions[0].face.normal;
            this.velocity.setX(normal.x*collisionSpeed*BF);
            this.velocity.setY(normal.y*collisionSpeed*BF);
            this.velocity.setZ(normal.z*collisionSpeed*BF);
        }  

        if ([0, 1, 2, 9, 10, 11, 18, 19, 20].indexOf(i) != -1) {            //collision in -y
            this.collisions.setY(-1);
            this.platformHeight = collisions[0].point.y; //set height of current platform
            this.translateY(this.size-collisions[0].distance);      //shift player so it's just touching the edge 
        } else if ([6, 7, 8, 15, 16, 17, 24, 25, 26].indexOf(i) != -1) {    //collision in y
            this.collisions.setY(1);
            this.translateY(-(this.size-collisions[0].distance));   //shift player so it's just touching the edge 
        }

        if ([0, 1, 2, 3, 4, 5, 6, 7, 8].indexOf(i) != -1) {                //collision in -x
            this.collisions.setX(-1);
            this.translateX(this.size-collisions[0].distance);      //shift player so it's just touching the edge 
        } else if ([18, 19, 20, 21, 22, 23, 24, 25, 26].indexOf(i) != -1) { //collision in x
            this.collisions.setX(1);
            this.translateX(-(this.size-collisions[0].distance));   //shift player so it's just touching the edge 
        }

        if ([0, 3, 6, 9, 12, 15, 18, 21, 24].indexOf(i) != -1) {            //collision in -z
            this.collisions.setZ(-1);
            this.translateZ(this.size-collisions[0].distance);      //shift player so it's just touching the edge 
        } else if ([2, 5, 8, 11, 14, 17, 20, 23, 26].indexOf(i) != -1) {    //collision in z
            this.collisions.setZ(1);
            this.translateZ(-(this.size-collisions[0].distance));   //shift player so it's just touching the edge 
        }      

      } else { // no collisions so the ball is allowed to fall
        this.platformHeight = this.floorHeight;
      }
    }
}

function genVelocity() {
    var v = Math.random()*75 + 75;
    var angle1 = Math.random()*2*Math.PI;
    var angle2 = Math.random()*Math.PI/2;

    var Vx = v* Math.sin(angle2)*Math.cos(angle1);
    var Vz = v* Math.sin(angle2)*Math.sin(angle1);
    var Vy = v* Math.cos(angle2);

    return new THREE.Vector3(Vx,Vy,Vz);
}


function makeManyParticles(numberOfParticles, size) {

    for (i = 0; i < numberOfParticles; i++) {
        var geometry = new THREE.SphereGeometry(size, 16, 16);
        var material = new THREE.MeshNormalMaterial();
        var particle = new THREE.ParticleMesh(geometry, material, genVelocity());
        particle.position.set(Math.random()*50,Math.random()*50+300,Math.random()*50);
        allParticles.push(particle);
        scene.add(particle);
    }
}

function updateAllParticles() {
    for (var i = 0; i < allParticles.length; i++) {
        allParticles[i].updatePosition();
    }
}

function removeParticle(toBeRemoved) {
    var index = allParticles.indexOf(toBeRemoved);
    if (index > -1) {
      scene.remove(allParticles[index]);
      allParticles.splice(index, 1);
    }
}