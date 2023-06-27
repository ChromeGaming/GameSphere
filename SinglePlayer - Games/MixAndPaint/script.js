const images = [
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/33835ab0-18f1-44e0-871d-43ed87e3f1ea", //0  rgb(183, 174, 237)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/a48180dd-3ed0-4a18-99f1-a534b630f5cb", //1  rgb(216, 34, 59)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/5669e871-5dce-49df-957e-771936615c1d", //2   rgb(254, 213, 0)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/1b2d6414-4b3d-4671-928a-cf943507e9fe", //3  rgb(101, 86, 81)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/55214360-1bdb-4611-875e-4d0b13004521", //4  rgb(175, 124, 80)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/d9aa68a7-f0cb-4bf4-8d9b-999ed907b6d5g", //5   rgb(241, 183, 145)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/b310e0e7-da37-4135-b582-f74dc6d7e9ea", //6   rgb(120, 224, 241)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/54c1e636-4f56-4659-9b44-b69960571af0", //7   rgb(233, 84, 168)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/f00d3b66-d292-4625-9c50-5dc18efee552", //8   rgb(77, 128, 39)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/7a06447f-be80-43e6-9ba0-147432bd7d11",//9  rgb(255,255,71)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/a78cb438-e0f4-482d-aca9-1b9e8423e282", //10   rgb(248,179,12 )
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/2a67950b-d590-4e04-be2e-3bc58e9580dd", //11  rgb(15,26, 44)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/985246c0-2ec7-46ce-8597-b4b932b8b093", //12  rgb(131, 167, 179)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/15a58602-8c6e-4035-a63f-7a6aaaf74587", //13   rgb(235, 210, 209)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/ad6b8ec7-5ec4-43c2-8bf6-305a3b761d77", //14   rgb(162, 222, 132)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/16f3d6d8-8b59-40a6-bd9a-de3b86b11ab3", //15  rgb( 224, 58, 107)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/f0fe838d-b8f7-4ec8-8f3e-41e2ba200032", //16    rgb(240, 101,36)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/88525af1-0196-4a3d-8e53-5b941bcc7857", //17  rgb(106, 73, 128)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/511356df-39f8-4aad-8964-f3aa50ec7079", //18  rgb(170, 122, 99)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/5bc69166-c799-44d1-808a-941f185ea391", //19   rgb(255, 166, 210)
  "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/2339a801-6026-413a-9c95-94d24c30353a" //20   rgb(253, 173, 172)
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

var colour;

function myColour() {
  var red = document.getElementById('red').value;
  var green = document.getElementById('green').value;
  var blue = document.getElementById('blue').value;
  colour = 'rgb(' + red + ',' + green + ',' + blue + ')';
  document.body.style.backgroundColor = colour;
  document.getElementById('box').value = colour;

  let foundMatch = false;

  const image = images[i];
  const colorCode = colorCodes[i] || 'rgb(0, 0, 0)'; // Default to black if color code not provided
  imageColorCodes[image] = colorCode;

  // Compare the color with the respective image's color code
  const isMatch = compareColors(colorCode, colour, 5);

  if (isMatch) {
    foundMatch = true;
    document.getElementById("response").innerHTML = "Correct Answer";
  } else {
    foundMatch = false;
    document.getElementById("response").innerHTML = "Wrong Answer";
  }

  if (!foundMatch) {
    console.log('No match found.');
  }
}

document.getElementById('red').addEventListener('input', myColour);
document.getElementById('green').addEventListener('input', myColour);
document.getElementById('blue').addEventListener('input', myColour);


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

