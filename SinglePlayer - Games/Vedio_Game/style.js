

//js game code
var screen = document.querySelector('.screen');
var level = document.querySelector('.level');
var sun = document.querySelector('.sun');
var jumpBtn = document.querySelector('.jumpBtn');

var hero = document.querySelector('.hero');
var villain = document.querySelector('.villain');
var scoreis = document.querySelector('#score');
var on = document.querySelector('.on');
var gameOver = document.querySelector('.game-over');


//sounds
var jumpSound = document.querySelector('#jump-sound');
var backgroundSound = document.querySelector('#background-sound');
var levelUpSound = document.querySelector('#level-up-sound');
var gameSound = document.querySelector('#game-sound');
var switchSound = document.querySelector('#switch-sound');



//hero change

function changeHero(img){
  switchSound.play();
  hero.style.backgroundImage =`url('${img}')`;
}

//score
let score = 0;
//window 
window.addEventListener("keypress",(e)=>{

  if(e.keyCode == "32"){
     jump();
  }
})


jumpBtn.addEventListener('click',jump);


function jump(){
  
  if(hero.classList != 'animate'){
  jumpSound.play();
  hero.classList.add('animate');
  }
  
  setTimeout(function(){
    hero.classList.remove('animate');
    score++;
    if(score < 10){
      score = "0" + score;
    }
    
    scoreis.innerText = score;
    
    if(score == 5){
      screen.style.background = "#87CEEB";
      sun.style.bottom = "-100px";
    }
    
    if(score == 15){
      screen.style.background = "#5c54a4";
      sun.style.bottom = "-140px";
      level.style.display = "block";
      levelUpSound.play();
      level.innerText = "level : 2";
    }
    
    if(score == 30){
      screen.style.background = "#38285c";
      sun.style.bottom = "-180px";
      level.style.display = "block";
      levelUpSound.play();
      level.innerText = "level : 3";
    }
    
    if(score == 45){
      screen.style.background = "#4c408e";
      sun.style.bottom = "-200px";
      level.style.display = "block";
      levelUpSound.play();
      level.innerText = "level : 4";
    }
    
   if(score == 60){
      screen.style.background = "#0c1445";
      sun.style.background = "#F6F1D5";
      sun.style.bottom = "140px";
      level.style.display = "block";
      levelUpSound.play();
      level.innerText = "level : 5";
    }
    
    
   if(score == 75){
      screen.style.background = "#000";
      sun.style.bottom = "-100px";
      level.style.display = "block";
      levelUpSound.play();
      level.innerText = "level : 6";
    }
    
  },500);
}


//check dead

var checkDead = setInterval(function(){
  
  var heroTop = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));
  var villainLeft = parseInt(window.getComputedStyle(villain).getPropertyValue("left"));
  
  
  if(villainLeft < 30 && villainLeft > 0 && heroTop >= 130){
    gameSound.play();
    villain.style.animation = "none";
    villain.style.display = "none";
    gameOver.style.display = "block";
    on.style.background = "#000000";
    on.style.boxShadow = "0 0 8px #000000";
    level.style.display = "none";
    sun.style.bottom = "160px";
    backgroundSound.pause();
    levelUpSound.pause();
  }
  
},10);


function start(){
  on.style.background = "#FF0000";
  on.style.boxShadow = "0 0 8px #FF0000";
  gameOver.style.display = "none";
  villain.style.animation = "villainMove 1.2s linear infinite";
  villain.style.display = "block";
   score = 0;
   scoreis.innerText = "0" + score;
  backgroundSound.play();
  backgroundSound.volume = 0.2;
}