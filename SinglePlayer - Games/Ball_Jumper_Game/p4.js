// CPSC 314 Final project: 
// Game name: BallJumper

var scene = new THREE.Scene();

// setting up renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xBBBBBBB);
document.body.appendChild(renderer.domElement);

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

var container = document.getElementById('maincontent');
container.appendChild(renderer.domElement);


function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
}
//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }


// SKYBOX/BACKGROUND
// tutorial and code from http://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs
var prefix = 'images/skybox/'
var urls = [
  // Images from http://opengameart.org/content/forest-skyboxes
  prefix +'px.jpg',
  prefix +'nx.jpg',
  prefix +'py.jpg',
  prefix +'ny.jpg',
  prefix +'pz.jpg',
  prefix +'nz.jpg'
  ];

var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
cubemap.format = THREE.RGBFormat;

var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
shader.uniforms['tCube'].value = cubemap; // apply textures to shader

// create shader material
var skyBoxMaterial = new THREE.ShaderMaterial( {
  fragmentShader: shader.fragmentShader,
  vertexShader: shader.vertexShader,
  uniforms: shader.uniforms,
  depthWrite: false,
  side: THREE.BackSide
});

// create skybox mesh
var skybox = new THREE.Mesh(
  new THREE.CubeGeometry(5000, 5000, 5000),
  skyBoxMaterial
);
skybox.rotation.x = Math.PI / 2;


// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

// arrays to track allObstacles and allParticles
var allObstacles = [];
var allParticles = [];

// floor from p3 used
var floorTexture = new THREE.ImageUtils.loadTexture( 'images/grass2.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set(8,8);
var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
var playerSize = 10;      //the size of the ball we're going to play
floor.position.y = -1 + playerSize;
floor.rotation.x = Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
floor.receiveShadow = true;
allObstacles.push(floor);


//bounding fence/box
var text = THREE.ImageUtils.loadTexture('images/flower2.jpg');
text.wrapS = text.wrapT = THREE.RepeatWrapping;
text.repeat.set( 40,1 );
var material = new THREE.MeshPhongMaterial( { map: text} );

var geometry = new THREE.BoxGeometry( 1000, 15, 10 );
var fence = new THREE.Mesh( geometry, material );
fence.position.set(0,10,-500);
fence.castShadow = true;
fence.receiveShadow = true;
allObstacles.push(fence);
scene.add(fence)

var geometry = new THREE.BoxGeometry( 1000, 15, 10 );
var fence = new THREE.Mesh( geometry, material );
fence.position.set(0,10,500);
fence.castShadow = true;
fence.receiveShadow = true;
allObstacles.push(fence);
scene.add(fence)

var geometry = new THREE.BoxGeometry( 10, 15, 1000 );
var fence = new THREE.Mesh( geometry, material );
fence.position.set(-500,10,0);
fence.castShadow = true;
fence.receiveShadow = true;
allObstacles.push(fence);
scene.add(fence)

var geometry = new THREE.BoxGeometry( 10, 15, 1000 );
var fence = new THREE.Mesh( geometry, material );
fence.position.set(500,10,0);
fence.castShadow = true;
fence.receiveShadow = true;
allObstacles.push(fence);
scene.add(fence)


//starting platforms
var cube = makePlatform();
cube.position.set(100,30,0);
scene.add(cube);
allObstacles.push(cube);

var cube = makePlatform();
cube.position.set(-100,30,0);
scene.add(cube);
allObstacles.push(cube);

var cube = makePlatform();
cube.position.set(0,150,0);
scene.add(cube);
allObstacles.push(cube);

makeManyParticles(10,5);


// add player (this is invisible)
var geometry = new THREE.SphereGeometry(playerSize, 32, 32);
var material = new THREE.MeshBasicMaterial( {wireframe: true, opacity: 0.0, transparent: true})
var player = new THREE.PlayerMesh(geometry, material);
player.position.set(0,400,200);
scene.add(player);
player.add(skybox);

// add ball (the actual ball you can see)
var ballSize = 10;
var geometry = new THREE.SphereGeometry(ballSize, 32, 32);
var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/ballTexture.jpg') } );
var ball = new THREE.Mesh(geometry, material);
ball.position.set(0,0,0);
ball.castShadow = true;
ball.receiveShadow = true;
player.add(ball);


// setting up the camera:
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 20000);
camera.position.set(150,200,500);
camera.lookAt(scene.position); 
player.add(camera);

  // setting controls
 var controls = new THREE.OrbitControls(camera);
 controls.enableDamping = true;
 controls.dampingFactor = 0.25;
 controls.enableZoom = false;


//directional light
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-5000, 5000, 5000);
directionalLight.target = player;
directionalLight.lookAt(player.position); 

directionalLight.castShadow = true;
directionalLight.shadowCameraVisible = true;

directionalLight.shadowCameraNear = 5000;
directionalLight.shadowCameraFar = 10000;

directionalLight.shadowCameraLeft = -500;
directionalLight.shadowCameraRight = 500;
directionalLight.shadowCameraTop = 500;
directionalLight.shadowCameraBottom = -500;

directionalLight.shadowDarkness = 0.75;
  
player.add(directionalLight);


// spotlight
var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;

spotLight.shadowCameraNear = 500;
spotLight.shadowCameraFar = 4000;
spotLight.shadowCameraFov = 30;

spotLight.intensity = 0.25;
spotLight.shadowDarkness = 0.5;

player.add( spotLight );


// ambient light
var ambLight = new THREE.AmbientLight(0xBBBBBB);
ambLight.visible = false;
player.add( ambLight );

// adding an object
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock(true);


function keyboardCallBack() {
	 var delta = clock.getDelta();
	 var distanceMoved = 100 * delta;
   var angleRotated = distanceMoved/player.size;

	 if(keyboard.pressed("W")  && player.collisions.z != -1){
    player.translateZ(-distanceMoved);
    player.velocity.setZ(-100);
    ball.rotateX(-angleRotated);
	 }
	 if(keyboard.pressed("A") && player.collisions.x != -1){
	 	player.translateX(-distanceMoved);
    player.velocity.setX(-100);
    ball.rotateZ(angleRotated);
   }
   if(keyboard.pressed("S")  && player.collisions.z != 1){
      player.translateZ (distanceMoved);
      player.velocity.setZ(100);
      ball.rotateX(angleRotated);
	 }
   if(keyboard.pressed("D") && player.collisions.x != 1){
   	player.translateX(distanceMoved);
    player.velocity.setX(100);
    ball.rotateZ(-angleRotated);	 
  }

  if(!keyboard.pressed("W") && !keyboard.pressed("A") && !keyboard.pressed("S") && !keyboard.pressed("D")) {
    player.velocity.setX(0);
    player.velocity.setZ(0);
  }
}

var lightMode = 0;
function onKeyDown(event) {
  if(keyboard.eventMatches(event,"space")){
    player.jump();
  }
}
keyboard.domElement.addEventListener('keydown', onKeyDown );



// Picking Functionality
var mouseVector = new THREE.Vector3();
var rayCaster = new THREE.Raycaster();
var intersects, particleToRemove;

window.addEventListener('click', onDocumentMouseDown);

function onDocumentMouseDown(e) {

  mouseVector.setX(  2 * (e.clientX / container.clientWidth) - 1  );
  mouseVector.setY(  1 - 2 * (e.clientY / container.clientHeight)  );

  rayCaster.setFromCamera( mouseVector.clone(), camera );
  intersects = rayCaster.intersectObjects(allParticles, recursive=false);
  // console.log(mouseVector);

  if (intersects.length > 0) {
    particleToRemove = intersects[0].object;    
    removeParticle(particleToRemove);
  }
}



// Picking Functionality
var mouseVector = new THREE.Vector3();
var rayCaster = new THREE.Raycaster();
var intersects, particleToRemove;

window.addEventListener('click', mouseClicked);

function mouseClicked(e) {
  mouseVector.x = 2 * (e.clientX / container.clientWidth) - 1;
  mouseVector.y = 1 - 2 * (e.clientY / container.clientHeight);
  
  rayCaster.setFromCamera( mouseVector.clone(), camera);
  intersects = rayCaster.intersectObjects(allParticles, recursive=true);
  if (intersects.length > 0) {
    particleToRemove = intersects[0].object;    
    var index = allParticles.indexOf(particleToRemove);
    if (index > -1) {
      scene.remove(allParticles[i]);
      allParticles.splice(index, 1);
    }
  }
}



var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
var highestScore = 0;

function getHighestScore() {
  var newHigh = localStorage.getItem("highest score");
  highestScore = newHigh >= 0? newHigh:0;
}
getHighestScore();


/* Toggle Lights */
var lightMode = 0
document.getElementById("light").onclick = function() {
  lightMode += 1;
  lightMode %= 4;
  if (lightMode == 0) {               // dir + spot
    directionalLight.intensity = 1;
    ambLight.visible = false;
    spotLight.intensity = .25;
    spotLight.shadowDarkness = .5;
  } else if (lightMode == 1) {        // dir
    directionalLight.intensity = 1;
    ambLight.visible = false;
    spotLight.intensity = 0;
    spotLight.shadowDarkness = 0;
  } else if (lightMode == 2) {        // ambient
    directionalLight.intensity = 0;
    ambLight.visible = true;
    spotLight.intensity = 0;
    spotLight.shadowDarkness = 0;
  } else if (lightMode == 3) {        //only spot
    directionalLight.intensity = 0;
    ambLight.visible = false;
    spotLight.intensity = 1;
    spotLight.shadowDarkness = .75;
  }
}

/* Snow */
var pMaterial = new THREE.PointCloudMaterial({
  color: 0xFFFFFF,
  size: 10,
  map: THREE.ImageUtils.loadTexture(
     'images/snow.png'
   ),
   blending: THREE.AdditiveBlending,
   depthTest: false,
   transparent: true
});

var snowCount = 10;

var snows = new THREE.Geometry();

function populate() {

  for (var i = 0; i < snowCount; i++) {
      var pX = Math.random()*1000,
      pY = Math.random()*1000,
      pZ = Math.random()*1000,
      snow = new THREE.Vector3(pX, pY, pZ);
      snow.velocity = {};
      snow.velocity.y = 0;
      snows.vertices.push(snow);
  }
}

populate();

var snowSystem = new THREE.PointCloud(snows, pMaterial);
scene.add(snowSystem);

var simulateSnow = function(){
  var pCount = snowCount;
  while (pCount--) {
    var snow = snows.vertices[pCount];
    if (snow.y < -400) {
      snow.y = 600;
      snow.velocity.y = 0;
    }

    snow.velocity.y -= Math.random() * .02;

    snow.y += snow.velocity.y;
  }

  snows.verticesNeedUpdate = true;
};

document.getElementById("snow").onclick = function() {
  snowSystem.visible = false;
  scene.remove(snowSystem);
  if (snowCount < 10000) {
    snowCount = snowCount*5;
  }
  else {
    snowCount = 100;
  }
  snows = new THREE.Geometry();
  populate();
  snowSystem = new THREE.PointCloud(snows, pMaterial);
  player.add(snowSystem);
}

/*//////////////////////////*/

var render = function() {
  player.updatePosition();
  keyboardCallBack();
  updateAllParticles();
  addNewPlatform();
  moveAllPlatforms()
  requestAnimationFrame(render);

  snowSystem.rotation.y += 0.01;
  simulateSnow();

  renderer.render(scene, camera);

  var thisFrameTime = (thisLoop=new Date) - lastLoop;
  frameTime+= (thisFrameTime - frameTime) / filterStrength;
  lastLoop = thisLoop;

  if (allParticles.length == 0) {
    player.gravity = -450;
    player.jumpV = 450;
    player.maxJumps = 3;
    document.getElementById('cheats').style.visibility = "visible";
  }
};

(function(window, document, undefined){
window.onload = init;

function init(){
    var fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut.innerHTML = (1000/frameTime).toFixed(1) + " fps";
  document.getElementById('fps').innerHTML = "Frame Rate: " + (1000/frameTime).toFixed(1) + " fps";

	highestScore = Math.max(highestScore, player.position.y); 
  document.getElementById('highest').innerHTML = "Best Height: " + highestScore.toFixed(1);

  document.getElementById('current').innerHTML = "Current Height: " + player.position.y.toFixed(1);
},100);
  }
     
})(window, document, undefined);

function restartGame() {
  localStorage.setItem("highest score", highestScore);
  window.location.reload();
}

document.getElementById("restart").onclick = function() {
  restartGame()
}

document.getElementById("resetHS").onclick = function() {
  localStorage.setItem("highest score", 0);
  window.location.reload();
}

render();