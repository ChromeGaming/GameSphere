var path1 = new Path();
var path2 = new Path();
var walls1 = new Walls();
var walls2 = new Walls();

var trains = new Array();
var coins = new Array();
var coins2 = new Array();
var barriers1 = new Array();
var rumblers = new Array();
var jetpacks = new Array();
var jumpers = new Array();
var back = new Back();
var surfer = new Surfer();
var police = new Police();

var speed = 0;
var acc = 0.001;
var top_speed = 0.3;
var score = 0
var ncoins = 30;
var lives = 5

var grayScala = false;
var flashScala = false;

var target = [0,0,-100];
var eye = [0, 0.5, 5];
var up = [0, 1, 0];

var train_tracker = 0;
var flag =0

var MAX_JUMP=0;
var gameover = false;
var overstring = "";
var distance = 0;
var paused = false;
main();

var myElement = document.getElementById("game");
var mc = new Hammer(myElement);

//enable all directions
mc.get('swipe').set({
  direction: Hammer.DIRECTION_ALL,
  threshold: 1,
  velocity:0.1
});

// listen to events...
mc.on("swiperight", function(ev) {
  if(surfer.pos[0]<2.5)
    surfer.pos[0]+=2.5;
});
mc.on("swipeleft", function(ev) {
  if(surfer.pos[0]>-2.5)
    surfer.pos[0]-=2.5;
});
mc.on("swipeup", function(ev) {
  // W or space
  if(surfer.jumping == 0){
    surfer.jumping = 1;
  }
});







Mousetrap.bind('space', function () {

  console.log('fuck this shit');
})

Mousetrap.bind(['a','left'], function () {
		// A or Left Key
    if(surfer.pos[0]>-2.5)
		  surfer.pos[0]-=2.5;
	})

Mousetrap.bind(['d','right'], function () {
		// D or Right Key
		if(surfer.pos[0]<2.5)
			surfer.pos[0]+=2.5;
  })

Mousetrap.bind(['up','w','space'], function () {
		// W or space
		if(surfer.jumping == 0){
			surfer.jumping = 1;
		}
	})

Mousetrap.bind('b', function () {
  grayScala = !grayScala
  // console.log(grayScala)
})
Mousetrap.bind('p', function () {
  paused = !paused
  // console.log(grayScala)
})

Mousetrap.bind('f', function () {
  flashScala = !flashScala

})


function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform bool flashScala;


    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);
      if (flashScala) {
        directionalLightColor = vec3(1.5, 1.5, 1.5);
      }

      highp vec3 ambientLight = vec3(0.8, 0.8, 0.8);
      highp vec3 directionalVector = normalize(vec3(10, 10, 0));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;
  const fsSource = `

    precision mediump float;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;
    uniform float now;
    uniform bool grayScala;

    vec4 toGrayscale(in vec4 color) {
      float average = (color.r + color.g + color.b) / 3.0;
      return vec4(average, average, average, 1.0);
    }

    vec4 colorize(in vec4 grayscale, in vec4 color) {
      return (grayscale * color);
    }

    float modI(float a,float b) {
      float m=a-floor((a+0.5)/b)*b;
        return floor(m+0.5);
    }

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      if (grayScala)
      {
				gl_FragColor = toGrayscale(vec4(texelColor.rgb * vLighting, texelColor.a));

			}
			else {
				gl_FragColor = vec4(texelColor.rgb *vLighting, texelColor.a);
			}
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
    textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
    uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    grayScala: gl.getUniformLocation(shaderProgram, 'grayScala'),
    flashScala: gl.getUniformLocation(shaderProgram, 'flashScala'),

  },
};

  path1.init(gl,[0,0,0]);
  path2.init(gl,[0,0,-100]);
  walls1.init(gl,[0,0,0]);
  walls2.init(gl,[0,0,-120]);
  back.init(gl,[0,0,0]);
  surfer.init(gl,[0,-1.5,-2]);
  police.init(gl,[0,-1.7,-0.8]);


  for(i=0;i<ncoins;++i){

    x = track();
    c = new Coin();
    c.init(gl, [x[0], -1+2*x[1], -5*i-5*x[1]]);
    coins.push(c);
  }
  for(i=0;i<ncoins;++i){

    x = track();
    c = new Coin();
    c.init(gl, [-x[0],1,-10*i+3*x[1]]);
    coins2.push(c);
  }

  for(i=0;i<4;++i){
    x = track();
    c = new Train();
    c.init(gl, [x[0], -1.4, -30*i-30*x[1]]);
    trains.push(c);
  }

    q = Math.random();

    if(q<0.33)
        x=-2.5;
    else if(q>=0.33 && q<0.67)
        x=0;
    else
        x= 2.5;

    j = new Jetpack();
    g = new Jumper();

    j.init(gl,[-x,-1,-80+80*q])
    g.init(gl,[-x,-1,-40+40*q])

    jetpacks.push(j);
    jumpers.push(g);

  for(i=0;i<10;++i){

    q = Math.random();

    if(q<0.33)
        x=-2.5;
    else if(q>=0.33 && q<0.67)
        x=0;
    else
        x= 2.5;

    b = new Barrier1();
    r = new Rumbler();

    r.init(gl,[x, -1.9,-20*i+5*q]);
    b.init(gl, [x, -1.6, -30*i-30*q]);

    rumblers.push(r);
    barriers1.push(b);
  }

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    if(distance>1000){
      gameover=true;
      paused = true
      overstring = "GAME OVER ,YOU SCORE IS "+score;
    }
    if(gameover==true){
        document.getElementById("life").innerHTML = overstring;
      }
    if (paused == false){
    gl.uniform1i(programInfo.uniformLocations.flashScala, flashScala);
    gl.uniform1i(programInfo.uniformLocations.grayScala, grayScala);
    // console.log(now%20);
    if (now%10 >= 9)
      flashScala = false;
    else if(now%10 >= 8.7 )
      flashScala = true;
    else if(now%10 >= 8.4)
      flashScala = false;
    else if(now%10 >= 8 )
      flashScala = true;
    else if(now%10 >= 7.7 )
      flashScala = false;
    else if(now%10 >=7.5)
      flashScala = true;
    else
      flashScala = false;
    score++;
    document.getElementById("score").innerHTML = score;

    document.getElementById("speed").innerHTML = Math.floor(speed*1000)  ;

    drawScene(gl, deltaTime, programInfo);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
//135-206-250

function drawScene(gl, deltaTime, programInfo) {
  // gl.clearColor(135.0/255.0, 206.0/255.0, 255.0/255.0, 1.0);  // Clear to black, fully opaque
  gl.clearColor(0,0,0, 1.0);  // Clear to black, fully opaque

  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 121.0;
  var projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  var modelViewMatrix = mat4.create();



  mat4.lookAt(modelViewMatrix, eye, target, up);

  if(MAX_JUMP>0){
    MAX_JUMP--;
  }
  if(MAX_JUMP<=0){
     surfer.max_jump = 1.3;
  }


  if(speed<top_speed)
    speed+=acc;
  distance+=speed;
  gl = surfer.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  police.pos[0] = surfer.pos[0]
  if(speed<top_speed/2){
  gl = police.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  }
  // back.pos[2] -= speed;
  path1.pos[2] += speed;
  path2.pos[2] += speed;
  walls1.pos[2] += speed;
  walls2.pos[2] += speed;
  // train.pos[2] += speed;

  gl = back.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = path1.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = path2.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = walls1.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = walls2.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  // gl = train.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);


    for(i=0;i<barriers1.length;i++){
      // console.log(barriers1.length);
      if(barriers1[i].pos[2]>=5){
        barriers1.splice(i, 1);
        i--;
        j = new Barrier1();
        x = track();
        j.init(gl,[x[0],-1.6,-80])
        barriers1.push(j);
      }
      else if(detect_collision(surfer.pos,barriers1[i].pos)==1){
        // console.log("dead")////////////////////////DEATH
        // barriers1.splice(i, 1);
        // i--;
        paused = true;
        gameover = true;
        overstring = "YOU COLLIDED WITH A ROADBLOCK";
      }
      else{
      barriers1[i].pos[2]+=speed;
      gl = barriers1[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
      }
    }

  /////////////////////////jetpacks
      for(i=0;i<jetpacks.length;i++){
        // console.log(jetpacks.length);
        if(jetpacks[i].pos[2]>=5){
          jetpacks.splice(i, 1);
          i--;
          j = new Jetpack();
          x = track();
          j.init(gl,[x[0],-1,-80])
          jetpacks.push(j);
        }
        else if(detect_collision(surfer.pos,jetpacks[i].pos)==1){
          jetpacks.splice(i, 1);
          i--;
          surfer.flying =1;
          eye[1]+=2;
          setTimeout(function(){
            surfer.flying=0;
            eye[1]-=2;
          },10000);
          j = new Jetpack();
          x = track();
          j.init(gl,[x[0],-1,-80])
          jetpacks.push(j);
        }
        else{
          jetpacks[i].pos[2]+=speed;
          gl = jetpacks[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
        }
      }

  ///////////////////////////////jumpers
    for(i=0;i<jumpers.length;i++){
      // console.log(jumpers.length);
      if(jumpers[i].pos[2]>=5){
        jumpers.splice(i, 1);
        i--;
        j = new Jumper();
        x = track();
        j.init(gl,[x[0],-1,-80])
        jumpers.push(j);
      }
      else if(detect_collision(surfer.pos,jumpers[i].pos)==1){
        jumpers.splice(i, 1);
        i--;
        j = new Jumper();
        x = track();
        j.init(gl,[x[0],-1,-80])
        jumpers.push(j);
        surfer.max_jump = 1.7;
        surfer.jump = 0.1;
        MAX_JUMP = 300;
      }
      else{
      jumpers[i].pos[2]+=speed;
      gl = jumpers[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
      }
    }
  /////////////////////rumblers
    for(i=0;i<rumblers.length;i++){
      // console.log(rumblers.length);
      if(rumblers[i].pos[2]>=5){
        rumblers.splice(i, 1);
        i--;
        j = new Rumbler();
        x = track();
        j.init(gl,[x[0],-1.9,-200])
        rumblers.push(j);
      }
      else if(detect_collision(surfer.pos,rumblers[i].pos)==1 ){
        console.log("slowed")//////////////////////SLOWED DOWN
        rumblers.splice(i, 1);
        if(speed>top_speed/2)
          speed -= 0.17;
        else {
          paused = true;
          gameover = true;
          overstring = "YOU GOT CAUGHT";
        }
        i--;
        j = new Rumbler();
        x = track();
        j.init(gl,[x[0],-1.9,-200])
        rumblers.push(j);
      }
      else{
        rumblers[i].pos[2]+=speed;
        gl = rumblers[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
      }
    }

  //////////////////////////coins
  for(i=0;i<coins.length;i++){
    // console.log(coins.length);
    if(coins[i].pos[2]>=5){
      coins.splice(i, 1);
      i--;
      j = new Coin();
      x = track();
      j.init(gl,[x[0],-1+x[1],-100+20*x[1]])
      coins.push(j);
    }
    else if(detect_collision(surfer.pos,coins[i].pos)==1){
      // console.log("yaay")
      score+=1234;
      coins.splice(i, 1);
      i--;
      j = new Coin();
      x = track();
      j.init(gl,[x[0],-1+x[1],-100+20*x[1]])
      coins.push(j);
    }
    else{
      coins[i].pos[2]+=speed*1.2;
      gl = coins[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
    }
  }
  for(i=0;i<coins2.length;i++){
    // console.log(coins2.length);
    if(coins2[i].pos[2]>=5){
      coins2.splice(i, 1);
      i--;
      score+=1234;
      j = new Coin();
      x = track();
      j.init(gl,[x[0],1,-100+20*x[1]])
      coins2.push(j);
    }
    else if(detect_collision(surfer.pos,coins2[i].pos)==1){
      console.log("yaay")
      coins2.splice(i, 1);
      i--;
      j = new Coin();
      x = track();
      j.init(gl,[x[0],1,-100+20*x[1]])
      coins2.push(j);
    }
    else{
      coins2[i].pos[2]+=speed*1.4;
      gl = coins2[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
    }
  }
  ///////////////////////
  var flagg = 0
  for(i=0;i<trains.length;i++){
    // console.log(trains.length);
    detect_collision_train(surfer.pos,trains[i].pos)
    if(trains[i].pos[2]>=20){
      trains.splice(i, 1);
      i--;
      j = new Train();
      x = track();
      j.init(gl,[x[0],-1.4,-120])
      trains.push(j);
      continue;
    }
    // else if(detect_collision_train(surfer.pos,trains[i].pos)==1){
    else if(train_tracker==1){
      gameover = true;
      paused = true;
      overstring = "COLLIDED WITH TRAIN. OUCH."
    }
    // else if(detect_collision_train(surfer.pos,trains[i].pos)==2){
    else if(train_tracker==2){
      // console.log("on train")
      // surfer.base = -0.1;
      flagg = 1
      // break;
    }
    // else{
      trains[i].pos[2]+=speed*2;
      gl = trains[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
      // this.base = -1.5;
    // }
  }

  if(flagg == 1 && flag == 0){
    surfer.base = -0.1;
    flag =1;
  }
  else if(flagg ==0 && flag ==1){
    surfer.base = -1.5;
    surfer.jumping =-1;
    flag =0;
  }



  if(path1.pos[2]>=120){
    path1.pos[2] = -100;
  }
  if(path2.pos[2]>=120){
    path2.pos[2] = -100;
  }
  if(walls1.pos[2]>=120){
    walls1.pos[2]=-120;
  }
  if(walls2.pos[2]>=120){
    walls2.pos[2]=-120;
  }

}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.crossOrigin = "Anonymous";

  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function detect_collision(spos,bpos){
    if( (Math.pow((spos[0]-bpos[0]),2) + Math.pow((spos[1]-bpos[1]),2) + Math.pow((spos[2]-bpos[2]),2))<=Math.pow(0.8,2) ){
      // console.log("hit")
      return 1;
    }
    else{
      // console.log("-")
      return 0;
    }
}
function detect_collision_train(spos,bpos){
    // if( ((spos[2] <= (bpos[2]+3.0)) && (spos[2] >= bpos[2]-15.0) && (spos[0] == bpos[0]) && (spos[1]<bpos[1]+0.7) )                                  {
    if(  (spos[2] <= (bpos[2]+1.0))&& (spos[2] >= bpos[2]-10.0)
     && (spos[0] == bpos[0]) && (spos[1]<bpos[1]+0.7) )   {
      console.log("hit by train")
      // return 1;
      train_tracker=1;
    }
    else if( ((spos[2] <= bpos[2]+3.0) && (spos[2] >= bpos[2]-15.0)) && (spos[0] == bpos[0]) && spos[1]>bpos[1]+0.7){
      console.log("on train");
      train_tracker = 2;
    }
    else{
      // console.log("-")
      // return 0;
      train_tracker =0;
    }
}

function track(){
  q = Math.random();

  if(q<0.33)
      x=-2.5;
  else if(q>=0.33 && q<0.67)
      x=0;
  else
      x= 2.5;

   return [x,q];
}
