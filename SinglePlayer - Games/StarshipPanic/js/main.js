(() => {
    console.log('JS Loaded');

    const gameWidth = 768;
    const gameHeight = 512;
    var gameLive = true;
    var level = 1;
    var life = 5;
    var map = {
        cols: 12,
        rows: 12,
        tsize: 64,
        tiles: [
         8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9,
         3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 4,
         3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4,
         3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4,
         3, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 4,
         3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 4,
         3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 4,
         7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10
        ],
        getTile: function (col, row) {
          return this.tiles[row * map.cols + col];
        }
    };
    var rightKey = false;
    var leftKey = false;
    var upKey = false;
    var downKey = false;
    var spacePressed = false;
    var isMoving = false;
    var spriteWidth = 108;
    var bugStartUp = 0;
    var bugStartDown = 94;
    var bugSpriteWidth = 267;
    var startButton = document.querySelector('.startGame');
    var startScreen = document.querySelector('.startScreen');
    var howToButton = document.querySelector('.howTo')
    var infoScreen = document.querySelector('.infoScreen');
    var backButton = document.querySelector('.backButton');
    var mainAudio = document.querySelector('.soundtrack');
    var deathAudio = document.querySelector('.death');
    var gameoverAudio = document.querySelector('.gameover');
    var winAudio = document.querySelector('.success');
    var clickAudio = document.querySelector('.select');
    var volume = document.querySelector('.volume');
    var overScreen = document.querySelector('.gameoverScreen');
    var nextScreen = document.querySelector('.nextlevelScreen');
    var nextButton = document.querySelector('.nextLevel');
    var restartButton = document.querySelector('.restart');
    var frameCount = 0;

    //Map image
    var tileSheet = new Image();
    tileSheet.src = 'images/newtileset3.png';

    //Bugs
    var bugs = [
        {
            x: 200, //x coordinate
            y: 100, //y coordinate
            speedY: 2, //speed in Y
            width: 89, //width
            height: 94, //height
            w: 50, //Collision width
            h: 53, //Collision height
            srcX: 0, //Initial Sprite x Source
            srcY: 0 //Initial Sprite y Source
        },
        {
            x: 300,
            y: 0,
            speedY: 2,
            width: 89,
            height: 94,
            w: 50,
            h: 53,
            srcX: 0,
            srcY: 0
        },
        {
            x: 430,
            y: 100,
            speedY: 3,
            width: 89,
            height: 94,
            w: 50,
            h: 53,
            srcX: 0,
            srcY: 0
        },
        {
            x: 550,
            y: 200,
            speedY: -3,
            width: 89,
            height: 94,
            w: 50,
            h: 53,
            srcX: 0,
            srcY: 94
        }
    ];

    //Bugs Images
    var bugImage = new Image();
    bugImage.src = "images/bug_sprite.png";

    //Hero
    var hero = {
        x: 70,
        y: 230,
        speed: 12,
        w: 30,
        h: 54,
        width: 36,
        height: 54,
        srcX: 36,
        srcY: 54,
        up: 0,
        right: 54,
        down: 108,
        left: 162
    };

    //Hero Image
    var heroImage = new Image();
    heroImage.src = "images/heroset.png";

    //Ship
    var ship = {
        x: 675,
        y: 180,
        w: 60,
        h: 148
    }

    //Ship Image
    var shipImage = new Image();
    shipImage.src = "images/ship.png";

    //Returns the drawing context on the canvas
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    // Keyboard Functions
    function keyDownHandler(event) {
        if(event.keyCode == 39) {
            rightKey = true;
            isMoving = true;
        }
        else if(event.keyCode == 37) {
            leftKey = true;
            isMoving = true;
        }
        if(event.keyCode == 40) {
        	downKey = true;
            isMoving = true;
        }
        else if(event.keyCode == 38) {
        	upKey = true;
            isMoving = true;
        }
        if(event.keyCode == 32) {
            spacePressed = true;
        }
    }

    function keyUpHandler(event) {
        if(event.keyCode == 39) {
            rightKey = false;
            isMoving = false;
        }
        else if(event.keyCode == 37) {
            leftKey = false;
            isMoving = false;
        }
        if(event.keyCode == 40) {
        	downKey = false;
            isMoving = false;
        }
        else if(event.keyCode == 38) {
        	upKey = false;
            isMoving = false;
        }
        if(event.keyCode == 32) {
            spacePressed = false;
        }
    }

    // Start Button Click === Start Game
    function startGame() {
        clickAudio.play();
        init();
    }

    // Hide Start Screen after Click Start Button
    function hidestartScreen() {
        startScreen.style.display = 'none';
    }

    //Click How to Play Button show Info Screen
    function showInfoScreen() {
        clickAudio.play();
        infoScreen.style.display = 'block';
        startScreen.style.display = 'none';
    }

    //Click Back Button on Info Screen Return to Main Screen
    function showsStartScreen() {
        clickAudio.play();
        infoScreen.style.display = 'none';
        startScreen.style.display = 'block';
    }

    //Next Level Screen
    function showNextScreen() {
        nextScreen.style.display = 'block';
    }

    //Next Level Hide
    function hideNextScreen() {
        nextScreen.style.display = 'none';
    }

    //Next Level Screen
    function showOverScreen() {
        overScreen.style.display = 'block';
    }

    //Next Level Hide
    function hideOverScreen() {
        overScreen.style.display = 'none';
    }
    

    //Updated the Game
    var update = function() {
        //Level Won - Define Game Parameters at new level
        //Check Collision with Ship
        if (hero.x < ship.x + ship.w &&
            hero.x + hero.w > ship.x &&
            hero.y < ship.y + ship.h &&
            hero.h + hero.y > ship.y) {
            winAudio.play();
            showNextScreen();
            level += 1;
            hero.speed += 3;
            hero.x = 70;
            hero.y = 230;
            hero.srcX = 36;
            hero.srcY = 54;

            // Increases Bug Speed at each level
            for(var ab = 0; ab<bugs.length; ab++){
                if(bugs[ab].speedY > 1){
                bugs[ab].speedY += 1 ;
                }
                else{
                    bugs[ab].speedY -= 1 ;
                }
            }
        }

        //Keyboard Move Hero and Define Sprite Sheet
        if (isMoving) {
            if(rightKey == true) {
                hero.x += hero.speed,
                hero.srcY = hero.right
            }
            else if(leftKey == true) {
                hero.x -= hero.speed,
                hero.srcY = hero.left
            }
            else if(downKey == true) {
                hero.y += hero.speed,
                hero.srcY = hero.down
            }
            else if(upKey == true) {
                hero.y -= hero.speed,
                hero.srcY = hero.up
            }
            // Defines Hero Movement with Sprite
            hero.srcX += hero.width;

            // If hero sprite reaches end, return to 0
            if (hero.srcX >= spriteWidth) {
            hero.srcX = 0;
            }
        }

        // Bugs Var for Speed Increase
        var i = 0;
        var n = bugs.length;

        // Bugs Functions (Move, Collision)
        bugs.forEach(function(bug, index) {
          //Check Collision with Bug
          if (hero.x < bug.x + bug.w &&
            hero.x + hero.w > bug.x &&
            hero.y < bug.y + bug.h &&
            hero.h + hero.y > bug.y) {
                //Stop the Game and Reduce Life
                if(life === 0) {
                    gameoverAudio.play(); 
                    showOverScreen();
                    for(var ab = 0; ab < bugs.length; ab++){
                        if(bugs[ab].speedY > 1){
                            bugs[ab].speedY -= (level - 1) ;
                        }
                        else {
                            bugs[ab].speedY += (level - 1) ;
                        }
                    }
                    //Set level parameters if Game Over
                    level = 1;
                    life = 6;
                    hero.speed = 12;
                }
                //If Collision, reduces one live
                deathAudio.play(); 
                if(life > 0) {
                    life -= 1 ;
                }
                //Define Position of Hero at Game Over
                hero.x = 70;
                hero.y = 230;
                hero.srcX = 36;
                hero.srcY = 54;
            }

            //Move the Bugs
            bug.y += bug.speedY;

            //Define Borders for Bugs
            if(bug.y <= 40) {
                bug.y = 40;
                bug.speedY *= -1;
                bug.srcY = 0;
            }
            else if(bug.y >= gameHeight - 70) {
                bug.y = gameHeight - 70;
                bug.speedY *= -1;
                bug.srcY = 94;
            }
            if (level <= 5 && (frameCount % 5 == 0)) {
                bug.srcX += bug.width;
            } else if (level > 5 && (frameCount % 3 == 0)) {
                bug.srcX += bug.width;
            }

            //If Reaches Final of Sprite, Return to 0
            if (bug.srcX >= bugSpriteWidth) {
            bug.srcX = 0;
            }
        });

        //Define Map Borders for Hero
        if(hero.y <= 20) {
            hero.y = 20;
        }
        else if(hero.y >= gameHeight - 70) {
            hero.y = gameHeight - 70;
        }
        if(hero.x <= 30) {
            hero.x = 30;
        }
        else if(hero.x >= gameWidth - 50) {
            hero.x = gameWidth - 50;
        }
        
    };


    //Play Audio
    function playAudio() {
        mainAudio.volume = 0.2; 
        deathAudio.volume = 0.2;
        gameoverAudio.volume = 0.2;
        winAudio.volume = 0.2;
        clickAudio.volume = 0.2;
        mainAudio.loop = true;
        mainAudio.volume = 0.2;
      };

      // Mute and Unmute
      function toggleMute() {
        var volumeIcon = document.querySelector('.volume [data-fa-i2svg]')

        if (mainAudio.muted == false) {
            // Mute the video
            mainAudio.muted = true;

            // Update the button text
            volumeIcon.classList.toggle('fa-volume-off');
        } else {
            // Unmute the video
            mainAudio.muted = false;

            // Update the button text
            volumeIcon.classList.toggle('fa-volume-up');
        }
    };


    //Draw the map
    function drawMap() {
        for (var c = 0; c < map.cols; c++) {
            for (var r = 0; r < map.rows; r++) {
                var tile = map.getTile(c, r);
                if (tile !== 0) { // 0 => empty tile
                    ctx.drawImage(
                        tileSheet, // image
                        (tile - 1) * map.tsize, // source x
                        0, // source y
                        map.tsize, // source width
                        map.tsize, // source height
                        c * map.tsize,  // target x
                        r * map.tsize, // target y
                        map.tsize, // target width
                        map.tsize // target height
                    );
                }
            }
        }
    }

    //Draw the Game
    var draw = function() {

        //Draw Canvas
        drawMap();
        document.querySelector('#level').textContent = + level;
        document.querySelector('#lifes').textContent = + life;

        //Draw Hero
        ctx.drawImage(heroImage, hero.srcX, hero.srcY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);

        //Draw Bugs
        bugs.forEach(function(bug, index){
                ctx.drawImage(bugImage, bug.srcX, bug.srcY, bug.width, bug.height, bug.x, bug.y, 50, 53);
        });

        //Draw Ship
        ctx.drawImage(shipImage, 0, 0, ship.w, ship.h, ship.x, ship.y, ship.w, ship.h);
    };

    //Game Loop
    var init = function() {
        update();
        draw();
        if(gameLive) {
            window.requestAnimationFrame(init);
        isMoving = false;
        }
        frameCount += 1;
    };

    //Event Listeners
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    startButton.addEventListener('click', startGame);
    startButton.addEventListener('mouseup', hidestartScreen);
    howToButton.addEventListener('click', showInfoScreen);
    backButton.addEventListener('click', showsStartScreen);
    window.addEventListener('load', playAudio)
    volume.addEventListener('click', toggleMute);
    nextButton.addEventListener('click', hideNextScreen);
    restartButton.addEventListener('click', hideOverScreen, startGame);



})();
