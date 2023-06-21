// consts.js

let foot = 0.3048;
let MPH_TO_MPS = 0.447;
let sqrt2 = Math.sqrt(2);
let footSqrt2 = foot / sqrt2;
let plateWidth = 17 * foot/12;
let halfPlateWidth = plateWidth/2;
let TAU = Math.PI*2;
let QTAU = TAU/4;
let HTAU = TAU/2;
let kDegToRad = TAU/360;
let kRadToDeg = 360/TAU;
let levelText = ['Rookie', 'Minors', 'Majors'];

let screenWidth = self.innerWidth; // 450;
let screenHeight = self.innerHeight; // 800;
let screenScale = 1.0;

if(screenWidth * screenHeight > 640000)
{
    screenWidth /= 2;
    screenHeight /= 2;
    screenScale *= 2;
}

let screenHalfWidth = screenWidth/2;
let screenHalfHeight = screenHeight/2;

let dirtColor = '#7F3300';
let greenColors = ['#59A044', '#71BB42', '#71BA44', '#59A040', '#90C63D', '#599F47'];
let dirtColors = ['#7F3300', '#694000', '#714B00', '#903600', '#553320'];
let chalkColors = ['white', '#f0f8e8', '#e8f0f8'];
let brickColors = ['#88514C', '#884C51', '#80403F', '#64433C', '#49312C', '#88514C'];
let sandColors = ['#C8BE8D', '#E3D9A8', '#E2D8A7', '#DBD49D', '#E7DDAC', '#DAD39C'];


