var colour;
function myColour() {
  var red = document.getElementById('red').value;
  var green = document.getElementById('green').value;
  var blue = document.getElementById('blue').value;
  colour = 'rgb(' + red + ',' + green + ',' + blue + ')';
  document.body.style.backgroundColor = colour;
  document.getElementById('box').value = colour;

  // Compare the color with color codes
  let foundMatch = false;
  for (const image in imageColorCodes) {
    const colorCode = imageColorCodes[image];
    const isMatch = compareColors(colorCode, colour, 5);

    if (isMatch) {
      foundMatch = true;
      document.getElementById("response").innerHTML = "Correct Answer"
      break; // Exit the loop if a match is found
    }
    else{
      foundMatch = false;
      document.getElementById("response").innerHTML = "Wrong Answer"
    }
  }

  if (!foundMatch) {
    console.log('No match found.');
  }
}

document.getElementById('red').addEventListener('input', myColour);
document.getElementById('green').addEventListener('input', myColour);
document.getElementById('blue').addEventListener('input', myColour);

const images = [
  "images/unocard.png", //0  rgb(183, 174, 237)
  "images/cocacola.png", //1  rgb(216, 34, 59)
  "images/smily.png", //2   rgb(254, 213, 0)
  "images/icecream.png", //3  rgb(101, 86, 81)
  "images/bear.png", //4  rgb(175, 124, 80)
  "images/cap.png", //5   rgb(241, 183, 145)
  "images/alien.png", //6   rgb(120, 224, 241)
  "images/amongus.png", //7   rgb(233, 84, 168)
  "images/cucumber.png", //8   rgb(77, 128, 39)
  "images/harrystyles.png",//9  rgb(255,255,71)
  "images/macd.png", //10   rgb(248,179,12 )
  "images/sweater.png", //11  rgb(15,26, 44)
  "images/car.png", //12  rgb(131, 167, 179)
  "images/gloss.png", //13   rgb(235, 210, 209)
  "images/cactus.png", //14   rgb(162, 222, 132)
  "images/lolipop.png", //15  rgb( 224, 58, 107)
  "images/flower.png", //16    rgb(240, 101,36)
  "images/shoes.png", //17  rgb(106, 73, 128)
  "images/milk.png", //18  rgb(170, 122, 99)
  "images/lightbolt.png", //19   rgb(255, 166, 210)
  "images/saturn.png" //20   rgb(253, 173, 172)
];

const colorCodes = [
  'rgb(182,174,237)',
  'rgb(216,34,59)',
  'rgb(254, 213, 0),',
  'rgb(101, 86, 81),',
  'rgb(175, 124, 80),',
  'rgb(241, 183, 145),',
  'rgb(120, 224, 241),',
  'rgb(233, 84, 168),',
  'rgb(77, 128, 39),',
  'rgb(255,255,71),',
  'rgb(248, 179,12),',
  'rgb(15, 26, 44),',
  'rgb(131, 167, 179),',
  'rgb(235, 210, 209),',
  'rgb(162, 222, 132),',
  'rgb(224, 58, 107),',
  'rgb(240, 101,36),',
  'rgb(106, 73, 128),',
  'rgb(170, 122, 99),',
  'rgb(255, 166, 210),',
  'rgb(253, 173, 172)'
];

// Function to compare two colors with a margin of error
function compareColors(color1, color2, allowedErrorPercentage) {
  const color1Components = color1.match(/\d+/g).map(Number);
  const color2Components = color2.match(/\d+/g).map(Number);

  for (let i = 0; i < color1Components.length; i++) {
    const component1 = color1Components[i];
    const component2 = color2Components[i];

    const maxDifference = (255 * allowedErrorPercentage) / 100;
    const difference = Math.abs(component1 - component2);

    if (difference > maxDifference) {
      return false;
    }
  }

  return true;
}

// Object to store color codes
const imageColorCodes = {};

for (let i = 0; i < images.length; i++) {
  const image = images[i];
  const colorCode = colorCodes[i] || 'rgb(0, 0, 0)'; // Default to black if color code not provided
  imageColorCodes[image] = colorCode;
}

let slide = document.getElementById("slide");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

let i = 0;
slide.src = images[i];

btn2.onclick = () => {
  i++;
  if(i > images.length - 1) i = 0;
  slide.src = images[i];
};

btn1.onclick = () => {
  i--;
  if (i < 0) {
    i = images.length - 1;
  }
  slide.src = images[i];
};

btn1.addEventListener("click", () => {
  slide.classList.add("transition");
});
btn1.addEventListener("mouseup", () => {
  slide.classList.remove("transition");
});
btn2.addEventListener("click", () => {
  slide.classList.add("transition");
});
btn2.addEventListener("mouseup", () => {
  slide.classList.remove("transition");
});

