/*global game*/

(function () {
    
    "use strict";

    var topScores,
        updateLevelsMenu;
    

    // create level buttons
    (function () {
        
        var html = "<h2>LEVELS</h2><ul>";
        game.LEVELS.forEach(function (level, levelIndex) {
            html = html + '<li><button onclick="game.initLevel(' + levelIndex + ')" class="level-button">LEVEL ' + (levelIndex + 1) + '<p class="top-score">Top Score: <strong>0</strong></p><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 1920 1080"><defs><lineargradient id="path-gradient' + levelIndex + '"><stop offset="0%" stop-color="#f00"><animate attributename="stop-color" values="orange; red; blue; purple;" dur="10s" repeatcount="indefinite"></animate></stop><stop offset="50%" stop-color="#f0f"><animate attributename="stop-color" values="blue; purple; orange; red; " dur="10s" repeatcount="indefinite"></animate></stop><stop offset="100%" stop-color="#00f"><animate attributename="stop-color" values="red; blue; purple; orange;" dur="10s" repeatcount="indefinite"></animate></stop></lineargradient></defs><g class="svg-elements"></g></svg></button></li>';
        });
        html = html + '</ul><button onclick="document.querySelector(\'.levels\').style.display = \'none\'">Main Menu</button>';
        document.querySelector(".levels").innerHTML = html;

    }());
    
    // add svg preview to each level button
    (function () {
        
        var levelButtonSVGs = document.querySelectorAll(".level-button .svg-elements"),
            i;
        
        for (i = 0; i < levelButtonSVGs.length; i = i + 1) {
            game.renderPaths(levelButtonSVGs[i], i);
        }
        
    }());


    // get top scores from localStorage, or create array with 0 for each level
    topScores = JSON.parse(window.localStorage.getItem("topScores") || (function () {
        var i,
            scores = [];
        for (i = 0; i < game.LEVELS.length; i = i + 1) {
            scores.push(0);
        }
        return JSON.stringify(scores);
    }()));

    // This updates the UI with the top scores
    updateLevelsMenu = function () {
        var levels = document.querySelectorAll(".level-button strong");
        topScores.forEach(function (score, levelIndex) {
            levels[levelIndex].innerHTML = score;
        });
    };
    updateLevelsMenu();

    
    // Title effect
    (function () {
        var titleLetters = document.querySelectorAll("h1 span"),
            resize = function () {
                var i;
                for (i = 0; i < titleLetters.length; i = i + 1) {
                    titleLetters[i].style.fontSize = (Math.ceil(Math.random() * 2) * 4) + "vw";
                }
            };
        resize();
        window.setTimeout(resize, 1);
        window.setInterval(resize, 2000);
    }());


    game.showMessage = function (gameEvent, score) {
        
        var popup = document.querySelector(".popup");

        if (gameEvent === "hide") {
            
            document.querySelector(".popup").style.display = "none";
            
        } else if (gameEvent === "collision" || gameEvent === "out-of-time") {
            
            popup.innerHTML = gameEvent === "collision" ? '<h2>Collision!</h2>' : '<h2>Out of Time!</h2>';
                
            popup.innerHTML = popup.innerHTML + '<p>You scored ' + score + ' point' + (score !== 1 ? 's' : '') + '</p>';

            if (score > topScores[game.currentLevel]) { // If this is your highest score for this level
                
                popup.innerHTML = popup.innerHTML + '<p>This is your best score for this level</p>';
                
                // Save top score
                topScores[game.currentLevel] = score;
                window.localStorage.setItem("topScores", JSON.stringify(topScores));
                updateLevelsMenu();
                
            }
            
            if (score >= 20) {
                if (game.currentLevel === game.LEVELS.length - 1) {
                    popup.innerHTML = popup.innerHTML + '<p>This is the final level!</p>';
                } else {
                    popup.innerHTML = popup.innerHTML + '<button onclick="game.initLevel(' + (game.currentLevel + 1)  + ')">Next level</button>';
                }
            } else {
                popup.innerHTML = popup.innerHTML + '<p>You must score 20 or more points to get to the next level</p>';
            }
            
            popup.innerHTML = popup.innerHTML + '<button onclick="game.initLevel(' + game.currentLevel + ')">Play this level again</button><button onclick="window.location.reload()">Main menu</button>';
            
            popup.style.display = "block";

        }
    };
    
    
    game.start = function () { // game started from level 1
        
        var msg = document.querySelector(".plus20");
        
        document.querySelector(".main-menu").style.display = "none";
        
        // show plus20 message
        msg.style.display = "block";
        msg.style.opacity = "1";
        
        window.setTimeout(function () {
            msg.style.opacity = "0";
            game.initLevel(0);
            window.setTimeout(function () {
                msg.style.display = "none";
            }, 1000);
        }, 1000);
        
    };


}());