THREE.PlatformMesh = function (geometry, material) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'PlatformMesh';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.MeshNormalMaterial();

	this.clock = new THREE.Clock(true);

	//determine velocity
	if (allObstacles.length <= 5) {
		this.velocity = 0.35;
	} else if (allObstacles.length <= 10) {
		this.velocity = (Math.random() * 0.25) + 0.25;
	} else if (allObstacles.length <= 15) {
		this.velocity = (Math.random() * 0.35) + 0.35;
	} else if (allObstacles.length <= 20) {
		this.velocity = (Math.random() * 0.5) + 0.5;
	} else {
		this.velocity = (Math.random() * 0.75) + 0.5;
	}

	this.moveDirection = Math.floor(Math.random() * 5); // 0,1 = stationary, 2 = move X, 3 = move Y, 4 = move Z

	
	this.drawMode = THREE.TrianglesDrawMode;
	this.updateMorphTargets();
};

THREE.PlatformMesh.prototype = Object.create( THREE.Mesh.prototype);
THREE.PlatformMesh.prototype.constructor = THREE.PlatformMesh;

THREE.PlatformMesh.prototype.movePlatform = function () {
	var t = this.clock.getElapsedTime();

	var V;
	if (Math.cos(t) >= 0) {
		var V = this.velocity;
	} else {
		var V = -this.velocity;
	}

	var type = this.moveDirection;

	if (type == 2) {
		this.translateX(V);
	} else if (type == 3) {
		this.translateY(V);
	} else if (type == 4) {
		this.translateZ(V);
	}

}




// FUNCTIONS

function moveAllPlatforms() {
  for (i = 0; i <= allObstacles.length -1; i++) {
  	if (allObstacles[i].type == "PlatformMesh") {
  		allObstacles[i].movePlatform();
  	}    
  }
}

// generates position of the new platform using the current highest platform
function newPlatformPosition() {
  //position of the highest platform
  var platPos = allObstacles[allObstacles.length-1].position;

  var radius = Math.random()*100 + 50;
  var angle1 = Math.random()*2*Math.PI;

  var x = radius * Math.cos(angle1);
  var z = radius * Math.sin(angle1);

  var y;
  if (radius > 160) {
    y = Math.random()* 50 + 75 + platPos.y;
  } else if (radius > 120){
    y = Math.random()* 40 + 100 + platPos.y;
  } else if (radius > 75) {
    y = Math.random()* 60 + 100 + platPos.y;
  } else {
    y = Math.random()* 45 + 125 + platPos.y; 
  }

  return new THREE.Vector3(x,y,z);
}

//add new platform when player reaches the highest platform
function addNewPlatform() {
  
  var platPos = allObstacles[allObstacles.length-1].position
  var platSize = 40;

  //only add new platform if player lands on the highest playform
  if ( (Math.abs(player.position.y - platPos.y - platSize + player.size) <= 0.001) &&
    (Math.abs(player.position.x - platPos.x) <= platSize) && 
    (Math.abs(player.position.z - platPos.z) <= platSize) &&
    (player.velocity.y == 0) ) {

    var cube = makePlatform();

    var newPos = newPlatformPosition();
    cube.position.set(newPos.x,newPos.y,newPos.z);
    allObstacles.push(cube);
    scene.add(cube);
  }
}

function makePlatform() {
    var geometry = new THREE.BoxGeometry( 100, 40, 100 );
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/crate.jpg') } );
    var cube = new THREE.PlatformMesh( geometry, material );
    cube.castShadow = true;
    cube.receiveShadow = true;

    return cube;
}