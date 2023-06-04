/////////////////////////////////////////////////////////////////
///////////////////Declare Global Variables//////////////////////
/////////////////////////////////////////////////////////////////

//declare canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

//creat grid array
var grid;

//map size (in tiles) && tile size (in pixels)
var mapSize;
var cellSize;

//map origin (should rename)
var x,y;

//creates hero object
let hero;
let time = 0;

//array for npcs
let npcArray;
let bullets = [];
let bulletTypes = [
  //lightsaber 1%
  {svg:`c red 1 0 1, s 10, g 0.8, r 0 0 5 125 1, s 0, c silver 1, r -1 125 7 35 1, c black 1, r -1 125 7 4 1, r -1 133 7 7 1, r -1 142 7 16 1,`,dmg:99,w:5,h:160,s:1,vel:12.5,p:.01},
  // headphones 7%
  {svg:`w 6, c #1b88f5 1 1, p m 57 2.5 l 57 32.5 0 1, p m 23 2.5 l 23 32.5 0 1, c #000 1 1, p m 10 0 l 10 -27 l 70 -27 l 70 0 m 10 0 l 10 1 0 1, r 0 0 20 35 1, r 60 0 20 35 1,`,dmg:5,w:80,h:8,s:0.5,vel:6,p:.07},
  //cleaver 5%
  {svg:"c silver 1, r 0 2 65 35 1, <c black 1, r 62 0 40 10 1, c white 0 1, r 1 35 63 1 0 1,> a 71 5 3 0 360 1, a 83.5 5 3 0 360 1, a 95 5 3 0 360 1,",dmg:20,w:102,h:40,s:0.65,vel:8,p:0.05,},
  //apple 10 %
  {svg:"c #c7372f 1, r 0 15 40 40 1, c #ffb8b8 1, r 27.5 25 5 7 1, < q 15, c #964B00 1, r 22 0 4 15 1, c lightgreen 1, r 26 2 10 4 1, r 14 8 8 3 1,>",dmg:5,w:40,h:65,s:0.4,vel:10,p:0.1},
  //crt tv 4 %
  {svg:"c white 0 0 1, s 30, r 2 0 10 120 1, s 0, c #0f0f0f 1, p m 12 105 l 82 100 l 82 110 l 12 115 1, r 70 110 7 3 1, c black 0 0 1, c #171717 1, p m 80 25 l 110 30 l 110 80 l 90 90 l 90 105 l 20 115 l 20 118 l 10 119 l 10 30 1, < w .5, c black 0 1, p m 18 100 l 85 93 0 1, p m 18 105 l 85 96.5 0 1, p m 18 110 l 85 100 0 1,> s 30, p m 10 1 l 20 3 l 20 7 l 80 25 l 80 90 l 10 100 1, s 0, c #000 1, g 0.19, r 30 30 30 6 1, g 0.2, p m 30 36 l 60 36 l 30 50 1, g 1, c #535d61 1, r 0 0 12 120 1,",dmg:50,w:110,h:120,s:0.9,vel:4,p:.04},
  //cup 10 %
  {svg:"c #fff 1, p m 1 5 l 4 35 l 20 35 l 23 5 1, c black 1, r 2 0 20 2 1, c #0f0f0f 1, r 0 2 24 3 1, c #6f4e37 1, p m 1 11 l 2.5 27 l 21.5 27 l 23 11 1, c #000 1, r 5 17 5 1 1, r 11 17 3 1 1, r 10 19 7 1 1,",dmg:5,w:24,h:35,s:0.35,vel:7,p:.1},
  //frying pan // 5%
  {svg:"w 4, c #542d2d 1, r 30 0 30 10 1, c #693d3d 1, r 55 3 20 10 1, r c #666 1 1, p m 0 6 l 100 6 l 87.5 21 l 12.5 21 1, c silver 1 1, p m 100 8 l 150 3 l 152.5 8 l 91 15.5 1, p m 11 11 l 15.5 16 0 1,",dmg:10,w:152.5,h:30,s:0.8,vel:6.5,p:.05},
  //cooking pot // 5%
  {svg:"c silver 1, r 6 3 38 40 1, c gray 1, r 0 12 7 3 1, r 43 12 7 3 1, r 4 0 42 4 1, c #fff 1, g 0.2, r 35 7 3 30 1,",dmg:15,w:50,h:43,s:0.5,vel:6,p:.05},
  //clock 7%
  {svg:`w 3, c white 1, r 0 20 30 30 1, c silver 0 1, p m 10 20 l 6 12.5 m 20 20 l 24 12.5 m 12.5 20 0 1, c gold 1 1, r 0 20 30 30 0 1, p m 12.5 50 l 0 57.5 m 17.5 50 l 30 57.5 m 12.5 50 0 1, p m 2.5 14 l 12 10 l 9 6 l 0 9 1, p m 27.5 14 l 18 10 l 21 6 l 30 9 1, c black 1, <t 15 35, q ${RandomRange(0,360)}, r 0 0 1 12.5 1,> <t 15 35, q ${RandomRange(0,360)}, r 0 0 10 1 1,> <t 15 35, q ${RandomRange(0,360)}, r 0 0 1 -5 1,>`,dmg:(RandomRange(1,3,1)*5),w:30,h:51.5,s:0.4,vel:RandomRange(3,11),p:0.07},
  //lamp 5%
  {svg:"c grey 1, r 22.5 25 5 28.5 1, c #9bb2ba 1 1, r 17.5 53.5 15 10 1, r 15.5 92 19 5 1, c #AEC6CF 1, r 10.5 60 30 32.5 1, c yellow 0 0 1, s 30, g 0.8, c white 1 1, p m 0 45 l 50 45 l 40 0 l 10 0 1,",dmg:10,w:50,h:97,s:0.8,vel:6.5,p:.05},
  //fourchette 10% 
  {svg:"w 3, c silver 1 1, p m 0 0 l 0 12.5 l 5 12.5 l 5 0 l 5 12.5 l 10 12.5 l 10 0 m 0 0 l 0 0 0 1, r 3 12.5 4 25 1,",dmg:5,w:10,h:37.5,s:0.25,vel:9,p:.1},
  //cuillerre 10%
  {svg:"c silver 1, r 0 0 15 20 1, r 5.5 20 4 35 1,",dmg:5,w:15,h:55,s:0.35,vel:9,p:.1},
  //lightbulbasaur 12%
  {svg:"c grey 1, r 6.5 37 7 3.5 1, c silver 1, r 5 25 10 12.5 1, g 0.8, c yellow 0 0 1, c yellow 1, s 30, r 0 0 20 25 1,",dmg:5,w:20,h:40.5,s:0.4,vel:8,p:.12},
  //telephonetric 9%
  {svg:"c red 1, r 0 5 12.5 70 1, r 12 5 10 15 1, r 12 60 10 15 1,c darkred 1, r 22 1 10 22.5 1, r 22 56 10 22.5 1,",dmg:5,w:44.5,h:79.5,s:0.45,vel:8,p:.09}
]

let map = 0;
let mapButton;

let click = 0;

let menu;

let maxTime = 100;

let pause = 0;

//50x50
let font = {
  "a":"p m 25 0 l 0 50 l 50 50 1 1,",
  "b":"c #fff 1 1, r 0 0 34 50 1 1, a 35 10 10 0 360 1 1, a 35 35 15 0 360 1 1,",
  "c":"a 25 25 25 90 270 1 1, p m 25 0 l 50 0 l 30 25 l 50 50 l 25 50 1 1,",
  "d":"r 0 0 25 50 1 1, a 25 25 25 0 360 1 1,",
  "e":"p m 0 0 l 50 0 l 30 17 l 50 25 l 30 33 l 50 50 l 0 50 1 1,",
  "f":"p m 0 0 l 50 0 l 30 17 l 50 34 l 20 34 l 20 50 l 0 50 1 1,",
  "g":"r 0 0 50 15 1 1, r 0 0 15 50 1 1, r 0 35 50 15 1 1, r 35 23 15 12 1 1,",
  "h":"r 0 0 22 50 1 1, r 28 0 22 50 1 1, r 22 22 5 5 1 1,",
  "i":"r 15 0 20 50 1 1,",
  "j":"r 0 25 17 10 1 1, r 0 35 50 15 1 1, r 30 0 20 35 1 1,",
  "k":"r 0 0 18 50 1 1, p m 17 20 l 30.5 0 l 50 0 l 30.5 25 l 50 50 l 30.5 50 l 17 35 1 1,",
  "l":"r 0 0 25 50 1 1, r 19 32.5 31 17.5 1 1,",
  "m":"p m 0 0 l 0 50 l 50 50 l 50 0 l 25 25 1 1,",
  "n":"r 0 0 15 50 1 1, r 35 0 15 50 1 1, p m 14.8 0 l 36 20 l 35.8 50 l 14 30 1 1,",
  "o":"a 25 25 25 0 360 1 1,",
  "p":"r 0 0 15 50 1 1, a 32 17.5 17.5 0 360 1 1, r 14 0 18 35 1 1,",
  "q":"a 25 25 25 0 360 1 1, r 30 40 20 10 1 1,",
  "r":"r 0 0 20 50 1 1, a 32.5 12.5 12.5 0 360 1 1, r 19 0 12.5 25 1 1, p m 20 24 l 32 50 l 50 50 l 39 23 1 1,",
  "s":"p m 0 0 l 50 0 l 50 16 l 0 16 l 30 16 l 50 34 l 50 50 l 0 50 l 0 34 l 20 34 l 0 16 1,",
  "t":"r 0 0 50 20 1 1, r 15 17 20 33 1 1,",
  "u":"a 25 25 25 0 360 1 1, r 0 0 50 25 1 1,",
  "v":"p m 25 50 l 0 0 l 50 0 1 1,",
  "w":"p m 0 0 l 0 50 l 17 50 l 25 39 l 33 50 l 50 50 l 50 0 l 33 15 l 25 4 l 17 15 l 0 0 1 1,",
  "x":"p m 0 0 l 12 25 l 0 50 l 20 50 l 25 41 l 30 50 l 50 50 l 38 25 l 50 0 l 30 0 l 25 9 l 20 0 1 1,",
  "y":"p m 0 0 l 18 0 l 25 10 l 32 0 l 50 0 l 32.5 30 l 17.5 30 1, r 17.5 30 15 20 1 1,",
  "z":"p m 0 0 l 50 0 l 28 35 l 50 35 l 50 50 l 0 50 l 23 15 l 0 15 1 1,",
  "!":"r 15 0 20 30 1 1, r 15 40 20 10 1 1,",
  " ":""
}

//janky

let dmg = zzfxG(...[.5,,341,,,.24,,1.96,,,,,,.9,,.3,,.51,.09,.15]);
let npcD = zzfxG(...[,,537,.02,.02,.22,1,1.59,-6.98,4.97])
let clickFX = zzfxG(...[2,,877,.11,,.09,4,2.88,,4.2,,,,,-0.6,,.16,.63,,.17]);
let lostFX = zzfxG(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17])
let winFX = zzfxG(...[,,20,.04,,.6,,1.31,,,-990,.06,.17,,,.04,.07])
let bulletFX = zzfxG(...[,,224,.02,.02,.08,1,1.7,-13.9,,,,,,6.7])

let song;

let d = [];
let songCount = 0;
let songDelay;
//janky

let mute = 0;
let muteButton = new button(50,50,45,40,9);


//janky
function playSong(i){
    song = zzfxP(...d[i])
    /* if(i==d.length){
      i=d.length-1;
    } */

    songCount++;

    if(songCount > 2 && i < d.length-1){
      i++
      songCount = 0;
    }

    songDelay = setTimeout(()=>{playSong(i);},(song.buffer.duration-0.1)*1000)
}


//types of tiles
var TYPES = {
  NONE: 0,
  HOSPITAL: 1,
  PARK: 2,
  LAKE: 3,
  ROAD: 4
}

//pallet for buildings
let buildingPallet = [
  ["#417bb2","#306ba3","#204774","#143255"], //top left right outline
  ["#3a94a7","#2c8796","#246f83","#246077"],
  ["#f49885","#d68675","#c66c5c","#a25749"],
  ["#dbcfd3","#cfc9d0","#b2adb3","#948b94"]
]

let garments = [
    ["#B96493","#9B4674"],
    ["#357DED","#1462E1"],
    ["#D5D508","#9A981D"],
    ["#C05746","#984134"],
    ["#BC5F04","#1b306b"],
    ["#636B61","#454B44"]
]
let hair = ["#9a3300","#4f1a00","#241c11","#F0E2B6"]
let skin = ["#a1665e","#ecbcb4","#503335","tan"]

//playing game?
let game = 0;



/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

//Math.floor
function floor(num){
  return Math.floor(num)
}

//rng
function RandomRange(min=0, max=1, f = 0) {
  let r = Math.random() * (max - min) + min
  return f ? floor(r) : r
}

//check if tile is in bounds
function IsInBounds(i, j) {
  return !(i < 0 || i >= mapSize || j < 0 || j >= mapSize);
}


//resize the canvas
window.onresize = () => {
  canvas.width = canvas.height = (window.innerHeight < window.innerWidth) ? window.innerHeight : window.innerWidth;
}

canvas.addEventListener("touchstart",inputStart)
canvas.addEventListener("touchend",inputEnd)

canvas.addEventListener("mousedown",inputStart)
canvas.addEventListener("mouseup",inputEnd)

function inputEnd(){
  click = 0;
  if(game){
    hero.m = [0,0,0,0]
  }
}

function inputStart(e){
  e.preventDefault()
  if(e.which == 1 || e.which == 0){
    click = {
      x:e.clientX-canvas.getBoundingClientRect().left || e.touches[0].clientX-canvas.getBoundingClientRect().left,
      y:e.clientY-canvas.getBoundingClientRect().top || e.touches[0].clientY-canvas.getBoundingClientRect().top
    };
  }

  if(menu.state == "ss"){
    click = 0;
    playSong(0)
    menu.main()
    gameLoop()
  }
}


//detects key strokes
document.onkeydown = (evt) => {
  evt.preventDefault()
  if(evt.key == "ArrowLeft" || evt.key == "a" || evt.key == "q"){
    hero.m[0] = 1;
  }

  if(evt.key == "ArrowRight" || evt.key == "d"){
    hero.m[1] = 1;
  }

  if(evt.key == "ArrowUp" || evt.key == "w" || evt.key == "z"){
    hero.m[2] = 1;
  }

  if(evt.key == "ArrowDown" || evt.key == "s"){
    hero.m[3] = 1;
  }

  if(evt.key == "m" && !pause){
    map = !map;
  }

  if(evt.key == "p" && !map){
    pause = !pause;
  }

  if(evt.key == "Escape"){
    menu.main()
  }
}

document.onkeyup = (evt) => {
  evt.preventDefault()
  if(evt.key == "ArrowLeft" || evt.key == "a" || evt.key == "q"){
    hero.m[0] = 0;
  }

  if(evt.key == "ArrowRight" || evt.key == "d"){
    hero.m[1] = 0;
  }

  if(evt.key == "ArrowUp" || evt.key == "w" || evt.key == "z"){
    hero.m[2] = 0;
  }

  if(evt.key == "ArrowDown" || evt.key == "s"){
    hero.m[3] = 0;
  }
}


//Shake screen
function shakeScreen(r){
  ctx.putImageData(ctx.getImageData(0,0, canvas.width, canvas.height), r*(RandomRange(0,1) > 0.5 ? 1:-1), r*(RandomRange(0,1) > 0.5 ? 1:-1));
}


//gets hero's position
function getHeroPos(i){
  return i ? (hero.pos.y - y) / cellSize + (hero.pos.x - x) / (cellSize*2) : (hero.pos.y - y) / cellSize - (hero.pos.x - x) / (cellSize*2)
}

//finds full cells
function findCells(type){
  let a = []
  for(let i=0;i<mapSize;i++){
    for(let j=0;j<mapSize;j++){
      if(grid[i][j].type == type){
       a.push(grid[i][j])
      }
    }
  }
  return a
}

//animates charcter & npcs
function animate(a,m){
  if(m && !map && !pause){
    //tilt body
    a[2] > -3 ? a[2] -= 0.5 : a[2] = -3;
    //move legs & arm
    if(a[3] > 50 || a[3] < -80) a[4] = -a[4]
    a[3] += a[4];
  }else{
    //if not moving
    //untilt body
    a[2] < 0 ? a[2] += 0.125 : a[2] = 0;
    //reset arm & legs
    a[4] = Math.abs(a[4])
    if(a[3] > 0)a[3] -= a[4]
    if(a[3] < 0)a[3] += a[4]
  }

  //bob character
  if(a[0] > Math.abs(a[1]*20) || a[0] < 0) a[1] = -a[1]
  a[0] += a[1];

  return a
}

//draws map
function drawMap(){
  let s = map ? (canvas.width-20)/(mapSize+4) : 3;
  ctx.save()
  if(!map){
    mapButton = new button(10,canvas.height-mapSize*s-4*s-10,(mapSize+4)*s,(mapSize+4)*s,1)
    ctx.translate(10,canvas.height-mapSize*s-4*s-10)
  }else{
    mapButton = new button(10,10,(mapSize+4)*s,(mapSize+4)*s,1)
    ctx.translate(10,10)
  }
  ctx.translate((mapSize+4)*s,0)
  ctx.rotate(90*Math.PI/180)
  ctx.scale(s,s)
  ctx.fillStyle= "#000000a1"
  ctx.fillRect(0,0,mapSize+4,mapSize+4)
  for (var i = 0; i < mapSize; i++){
    for (var j = 0; j < mapSize; j++) {
      svg(`w ${1/s}, c ${grid[i][j].type == TYPES.ROAD ? "#fff" : "transparent"} 1 1, r ${i} ${j} 1 1 1 ${map ? "1":""}, c #ffc001 1, r ${map ? getHeroPos(1) : floor(getHeroPos(1))-0.25} ${map ? getHeroPos(0) : floor(getHeroPos(0))-0.25} ${map ? 10/s : 1.5} ${map ? 10/s : 1.5} 1,`,[2,2,1,1])
    }
  }
  ctx.restore()
}


function draw(){

  for (var i = 0; i < mapSize; i++) {
    for (var j = 0; j < mapSize; j++) {
      grid[i][j].draw()
    }
  }

  for (var i = 0; i < mapSize; i++) {
    for (var j = 0; j < mapSize; j++) {
      grid[i][j].buildings()
    }
  }

  let s = 0.8;
  let d = 50*0.8;
  let hx = canvas.width-200

  hero.drawHealth(hx+d*2,20,s*10,10)

  svg("w 4, c black 0 1, c #ffc001 1, r -5 -5 110 110 1 1, c black 1, a 50 50 50 0 360 1, c #ffc001 1 1, p m 50 50 l 0 50 l 0 88 l 22.5 97.5 1, p m 50 50 l 100 50 l 100 88 l 77.5 97.5 1, p m 50 50 l 25 0 l 75 0 1, a 50 50 14 0 360 0 1, c black 1 1, a 50 50 12 0 360 1,",[hx-d,20,s,s])

  if (time <= maxTime && !pause) {
    time += 0.1;
  }else if(!pause){
    hero.removeHealth()
  }

  ctx.fillStyle = "#39ff19e6"
  ctx.fillRect(hx-d-5,20-5,90,90*(time/maxTime))

  drawMap()

  if(pause){
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(0,0,canvas.width,canvas.width)
    let t = new text("Paused",canvas.width/20,"#fff",0.5,0.4,1)
    let t1 = new text("Press esc to return to main menu",canvas.width/50,"#fff",0.5,0.5,1)
    t.draw()
    t1.draw()
  }
}


function update(){
  hero.move()

  for (let i=0;i<npcArray.length;i++) {
    npcArray[i].addBullet()
    npcArray[i].move()
    npcArray[i].die();
  }

  for (let i=0;i<bullets.length;i++) {
    bullets[i].move(i)
  }
}



/////janky

let previousTimeStamp = 0;
function gameLoop(timestamp){
  if (timestamp - previousTimeStamp < 1000/60) {
    window.requestAnimationFrame(gameLoop);
    return;
  }

  //console.log(timestamp - previousTimeStamp)
  previousTimeStamp = timestamp;

  canvas.width ^= 0;
  ctx.fillStyle = "#ffffffE6"

  for(let i =0; i < menu.stars.length; i ++){
      ctx.beginPath()
      ctx.arc(menu.stars[i].x,menu.stars[i].y,menu.stars[i].r,0,Math.PI*2)
      ctx.fill()
  }

  if(game){

    if(!map && document.hasFocus() && !pause){
      update()

      if(hero.detectIfDead()){
        menu.lose()
      }
    }else{
      hero.m = [0,0,0,0]
    }

    draw()
    mapButton.update()
  }else{
    menu.draw()
    menu.update()
  }
  if(!game || pause){
    muteButton.update()
    svg(mute ? "c silver 1 1, w 3, p m 0 12 l 10 12 l 25 0 l 25 40 l 10 28 l 0 28 1, a 23 20 10 -50 50 0 1, a 23 20 20 -60 60 0 1, c red 0 1, p m 0 0 l 45 40 0 1," : "c #fff 1 1, w 3, p m 0 12 l 10 12 l 25 0 l 25 40 l 10 28 l 0 28 1, a 23 20 10 -50 50 0 1, a 23 20 20 -60 60 0 1,",[50,50,1,1])
  }
  window.requestAnimationFrame(gameLoop)
}




//d = difficulty
//difficulty can be:
//                    1 | 300 npcs | 30 x 30 mapSize |
//                    2 | 600 npcs | 40 x 40 mapSize |
//                    3 | 900 npcs | 50 x 50 mapSize |
// for coil subscribers: custom difficulty

//needs changing

function startGame(d){
  pause = 0;
  if(song){
    song.stop();
    songCount = 0;
    clearTimeout(songDelay)
  }

  setTimeout(() => {
    if(!mute)playSong(0)
  }, 100);

  grid = [];
  npcArray = [];
  bullets = [];
  
  mapSize = d*15;
  cellSize = floor(canvas.width/4);

  createMap()

  spawnHero()

  spawnHospital()

  spawnNPCs(d*50)

  game = true;

  maxTime = d*300

  time = 0;
}

function spawnHospital(){
  let buildings = shuffle(findCells(TYPES.NONE))
  for(let i = 0; i<buildings.length; i++){
    let l = buildings[i]
    let onRoad = 0;

    if(IsInBounds(l.i+1,l.j) && grid[l.i+1][l.j].type == TYPES.ROAD) onRoad = true
    if(IsInBounds(l.i,l.j+1) && grid[l.i][l.j+1].type == TYPES.ROAD) onRoad = true

    if(dist(l.i,l.j,hero.i,hero.j) > mapSize/2 && onRoad){
      grid[l.i][l.j].type = 1;
      return;
    }
  }
  //remove
  menu.options()
}

function generateSongs(amount){
  let songData = [
    [
      [,0,300,,.2,,1],
      [.9,0,440,,,.12,1,.9,,,,,,,,,.4,,.11]
    ],
    [
      [
        [,-.7,22,,25,,17,,25,,22,,25,,17,,25,,22,,25,,17,,25,,22,,25,,17,,25,,15,,18,,10,,18,,15,,18,,10,,18,,15,,18,,10,,18,,15,,18,,10,,18,,],
        [,-.7,,,29,,,,29,,,,29,,,,29,,,,29,,,,29,,,,29,,,,29,,,,22,,,,22,,,,22,,,,22,,,,22,,,,22,,,,22,,,,22,,],
        [,,10,,,,,,,,,,,,,,,,10,,,,,,,,,,,,,,,,3,,,,,,,,3,,,,,,,,3,,,,,,,,3,,,,,,,,],
        [1,.7,,,,,,27,27,27,29,27,30,29,27,,,,,,,,,18,18,18,20,18,21,20,18,,,,,,,,,17,17,17,18,17,20,18,17,,,,,,,,,15,15,15,17,15,18,17,15,,,,]
      ],
      [
        [,-.7,17,,20,,12,,20,,17,,20,,12,,20,,17,,20,,12,,20,,17,,20,,12,,20,,13,,16,,8,,16,,13,,16,,8,,16,,13,,16,,8,,16,,13,,16,,8,,16,,],
        [,-.7,,,24,,,,24,,,,24,,,,24,,,,24,,,,24,,,,24,,,,24,,1,,20,,,,20,,1,,20,,,,20,,1,,20,,,,20,,1,,20,,,,20,,],
        [,,5,,,,,,,,5,,,,,,,,5,,,,,,,,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
        [1,.7,,,,,,29,29,29,30,29,32,30,29,,,,,,,,,25,25,25,27,25,28,27,25,,,,,,,,,22,22,22,24,22,25,24,22,,,,,,,,,24,24,24,25,24,27,25,24,,,,]
      ]
    ],
    [0,1]
  ]

  for(let i = 0;i<amount;i++){
    d.push(zzfxM(...songData,60+i*10))
  }
}



window.onload = () => {

  menu = new Menu()
  window.onresize()

  //loading screen
  ctx.fillStyle = "white"
  ctx.font = "40px Georgia"

  ctx.fillText("Loading...",canvas.width/2-150,canvas.height/2-40)
  document.title = "Loading..."
  //


  setTimeout(() => {
    generateSongs(1)
    document.title = "Songs Loaded"

      setTimeout(() => {
        canvas.width ^= 0;
        document.title = "Keep Your Space!" // -> need better title
        menu.state = "ss" //(ss) => splash screen
        
        //splash screen
        ctx.fillStyle = "white"
        ctx.font = "40px Georgia"
        ctx.fillText("Click To Continue",canvas.width/2-200,canvas.height/2-40)
        //

      }, 1000);
    }, 10);
}
