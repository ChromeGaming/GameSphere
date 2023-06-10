/*global game*/

(function () {
    
    "use strict";
    
    game.currentLevel = 0;

    var CELL_SIZE = 22,
        TIME = 90,
        FPS = 50,
    
        currentLevel,
        longestPath = 0,
        gameOver = false,
        timeRemaining = TIME,
        score = 0,
        currentSpeedBoosts = 0,
        performanceTimings = [],

        move,
        locationsMatch,
        updateTime,
        updateScore;
    
    
    // used for level buttons in menu
    game.renderPaths = function (svg, levelIndex) {
        // create new paths
        game.LEVELS[levelIndex].paths.forEach(function (path, pathIndex) {
            var newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newPath.setAttribute("style", "fill:none;stroke:url(#path-gradient" + levelIndex + ");stroke-linecap:butt;stroke-linejoin:miter");
            newPath.setAttribute("d", path.data);
            svg.appendChild(newPath);
        });
    };


    game.initLevel = function (levelIndex) {
        
        var newPath,
            svg = document.querySelector(".game .svg-elements");

        // reset score and time
        updateScore(0, true);
        timeRemaining = TIME;
        updateTime(TIME, true);
        gameOver = false;
        
        // show/hide UI elements
        game.showMessage("hide");
        document.querySelector(".main-menu").style.display = "none";
        document.querySelector(".levels").style.display = "none";
        document.querySelector(".score").style.display = "block";
        document.querySelector(".timer").style.display = "block";
        document.querySelector(".game svg").style.display = "block";
        
        game.currentLevel = levelIndex;
        // Make a copy of the level, so we have a clean copy to start the level again if required
        currentLevel = JSON.parse(JSON.stringify(game.LEVELS[levelIndex]));
        
        // remove existing elements (from any previous levels)
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
        
        // create new paths
        currentLevel.paths.forEach(function (path, pathIndex) {
            var newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newPath.setAttribute("style", "fill:none;stroke:url(#path-gradient);stroke-linecap:butt;stroke-linejoin:miter");
            newPath.setAttribute("d", path.data);
            svg.appendChild(newPath);
            path.el = newPath;
            path.length = newPath.getTotalLength();
        });
        
        // add scorers
        currentLevel.scorers.forEach(function (scorer, scorerIndex) {
            var el1 = document.createElementNS("http://www.w3.org/2000/svg", "text"),
                el2 = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
                point = currentLevel.paths[scorer.location.path].el.getPointAtLength((currentLevel.paths[scorer.location.path].length / 1000) * scorer.location.pos);
            el1.innerHTML = "+" + scorer.points + " PTS";
            el1.setAttribute("x", point.x);
            el1.setAttribute("y", point.y + 2);
            el1.setAttribute("style", "font-size:20px;font-family:sans-serif;fill:#bbb;fill-opacity:1;stroke:none;");
            el1.setAttribute("alignment-baseline", "middle");
            el1.setAttribute("text-anchor", "middle");
            el2.setAttribute("x", point.x - 45);
            el2.setAttribute("y", point.y - 15);
            el2.setAttribute("style", "fill:#111;stroke:none");
            el2.setAttribute("width", "90");
            el2.setAttribute("height", "30");
            svg.appendChild(el2);
            svg.appendChild(el1);
            
            // Record these for collision detection
            scorer.x = point.x;
            scorer.y = point.y;
            scorer.id = "scorer" + scorerIndex;
        });
        
        // create cells
        currentLevel.cells.forEach(function (cell) {
            cell.el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            cell.el.setAttribute("style", "opacity:1;fill:url(#radial-" + cell.colour + ");fill-opacity:1;stroke:none");
            cell.el.setAttribute("r", CELL_SIZE);
            cell.el.setAttribute("class", "cell");
            svg.appendChild(cell.el);
            cell.id = "cell_" + cell.colour; // for collision detection
        });
        
        // add controllers
        currentLevel.controllers.forEach(function (controller, controllerIndex) {
            
            var el1 = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
                el2 = document.createElementNS("http://www.w3.org/2000/svg", "text"),
                point = currentLevel.paths[controller.location.path].el.getPointAtLength((currentLevel.paths[controller.location.path].length / 1000) * controller.location.pos);

            el2.setAttribute("x", point.x);
            el2.setAttribute("y", point.y);
            
            el2.setAttribute("alignment-baseline", "middle");
            el2.setAttribute("text-anchor", "middle");
            
            if (controller.type === "teleporter") {
                
                el1.setAttribute("width", "70");
                el1.setAttribute("height", "70");
                el1.setAttribute("x", point.x - 35);
                el1.setAttribute("y", point.y - 35);
                
                el2.innerHTML = "Teleporter";
                el1.setAttribute("style", "fill-opacity:0;stroke:hotpink;stroke-width:4px;");
                el2.setAttribute("style", "font-size:15px;font-family:sans-serif;fill:#bbb;fill-opacity:1;stroke:none;");
                
            } else { // "wait" or "switch"
                
                el1.setAttribute("width", "100");
                el1.setAttribute("height", "100");
                el1.setAttribute("x", point.x - 50);
                el1.setAttribute("y", point.y - 50);

                el1.setAttribute("style", "fill-opacity:0;stroke:#bbb;stroke-width:8px;");
                el2.setAttribute("style", "font-size:25px;font-family:sans-serif;fill:#bbb;fill-opacity:1;stroke:none;");
            
                if (controller.type === "wait") {

                    el1.setAttribute("cursor", "pointer");

                    el2.innerHTML = "Wait";

                    el1.onclick = function () {
                        controller.paused = !controller.paused;
                        game.playSound("control");
                        if (controller.paused) {
                            el1.setAttribute("style", "fill-opacity:0;stroke:orange;stroke-width:8px;");
                        } else {
                            el1.setAttribute("style", "fill-opacity:0;stroke:#bbb;stroke-width:8px;");
                        }
                    };

                } else if (controller.type === "switch") {

                    el1.setAttribute("cursor", "pointer");

                    el2.innerHTML = "Switch";

                    el1.onclick = function () {
                        controller.switched = !controller.switched;
                        game.playSound("control");
                        if (controller.switched) {
                            el1.setAttribute("style", "fill-opacity:0;stroke:purple;stroke-width:8px;");
                        } else {
                            el1.setAttribute("style", "fill-opacity:0;stroke:#bbb;stroke-width:8px;");
                        }
                    };

                }

            }
            
            svg.appendChild(el2);
            svg.appendChild(el1);
            
            // Record these for collision detection
            controller.x = point.x;
            controller.y = point.y;
            controller.id = "controller" + controllerIndex + "_" + controller.type;

        });
        
        (function () {
            var timer = window.setInterval(function () {
                timeRemaining = timeRemaining - 1;
                updateTime(timeRemaining);
                if (gameOver || timeRemaining === 0) {
                    window.clearInterval(timer);
                }
            }, 1000);
        }());
        
        game.playSound("start");
        move();

    };

    
    // Collision Detection
    (function () {

        var lastCollided = []; // to ensure collision detection doesn't fire multiple times for the same collision

        locationsMatch = function (cell1, cell2) {
            
            var tollerance = CELL_SIZE / 2,
                lastCollidedIndex = lastCollided.indexOf(cell1.id + "-" + cell2.id),
                isCollision = false;

            // check all x and y values (may not be there on very first check)
            if (cell1.location.path === cell2.location.path && cell1.x && cell2.x && cell1.y && cell2.y) {
                
                if ((cell1.x > cell2.x - tollerance && cell1.x < cell2.x + tollerance) && (cell1.y > cell2.y - tollerance && cell1.y < cell2.y + tollerance)) {
                    
                    if (lastCollidedIndex === -1) {
                        if (cell1.id.indexOf("wait") === -1 && cell2.id.indexOf("wait") === -1) { // we need collision detection to fire multiple times of wait controllers, so we ignore it in that case
                            lastCollided.push(cell1.id + "-" + cell2.id);
                        }
                        isCollision = true;
                    }

                } else if (lastCollidedIndex !== -1) {
                    lastCollided.splice(lastCollidedIndex, 1);
                }
    
            } else if (lastCollidedIndex !== -1) {
                lastCollided.splice(lastCollidedIndex, 1);
            }
            
            return isCollision;

        };

    }());


    move = function () {
        
        var startTime = Date.now(),
            point,
            isCollision = false;
        
        currentLevel.cells.forEach(function (cell, cellIndex) {
            
            point = currentLevel.paths[cell.location.path].el.getPointAtLength((currentLevel.paths[cell.location.path].length / 1000) * cell.location.pos);
            cell.el.setAttribute("cx", point.x);
            cell.el.setAttribute("cy", point.y);
            // Save these for quicker collision detection:
            cell.x = point.x;
            cell.y = point.y;
            
            if ((cell.location.pos >= 1000 && cell.speed > 0) || (cell.location.pos <= 0 && cell.speed < 0)) { // end of path
                
                if (cell.speed > 0) {
                    if (currentLevel.paths[cell.location.path].atEnd.reverse) {
                        cell.speed = -cell.speed;
                    }
                    cell.location.pos = currentLevel.paths[cell.location.path].atEnd.pos;
                    cell.location.path = currentLevel.paths[cell.location.path].atEnd.path;
                } else {
                    if (currentLevel.paths[cell.location.path].atStart.reverse) {
                        cell.speed = -cell.speed;
                    }
                    cell.location.pos = currentLevel.paths[cell.location.path].atStart.pos;
                    cell.location.path = currentLevel.paths[cell.location.path].atStart.path;
                }
                
            } else {

                (function () {
                    var paused = false;
                    
                    // check if cell is at a controller
                    currentLevel.controllers.forEach(function (controller) {
                    
                        // is the cell at a switch?
                        // we check pos and actual location otherwise reverse loops throw a false positive
                        if (controller.type === "switch" && controller.switched && (cell.location.pos > controller.location.pos - CELL_SIZE && cell.location.pos < controller.location.pos + CELL_SIZE) && locationsMatch(cell, controller)) {
                            cell.location.path = controller.leadsTo.path;
                            cell.location.pos = controller.leadsTo.pos || 0;
                            if (controller.leadsTo.reverse) { // if reverse-loop, change cell direction
                                cell.speed = -cell.speed;
                            }

                        }

                        // is the cell at a wait controller?
                        if (controller.type === "wait" && controller.paused && locationsMatch(cell, controller)) {
                            paused = true;
                        }

                    });
                    
                    // check if cell is at an active break in the line
                    currentLevel.breaks.forEach(function (lineBreak) {
                        if (lineBreak.stage === 2 && locationsMatch(cell, lineBreak)) {
                            isCollision = true;
                        }
                    });
                    
                    // move the cell forwards, unless it is at a on paused "wait controller"
                    if (!paused) {
                        // position to move should be relative to path length to ensure constant speed
                        cell.location.pos = cell.location.pos + (cell.speed * (2500 / currentLevel.paths[cell.location.path].length));
                    }

                }());

            }

            // check for collision
            currentLevel.cells.forEach(function (collisionCell, collisionCellIndex) {
                if (collisionCellIndex > cellIndex) { // to ensure we're only checking each collision once
                    if (locationsMatch(cell, collisionCell)) {
                        isCollision = true;
                    }
                }
            });
            
            // check if score needs updating
            currentLevel.scorers.forEach(function (scorer) {
                
                var MAX_SPEED_BOOSTS = 100;

                if (locationsMatch(cell, scorer)) {

                    game.playSound("point");
                    updateScore(scorer.points);

                    // increase cell speed
                    currentLevel.cells.forEach(function (cell) {
                        if (currentSpeedBoosts < MAX_SPEED_BOOSTS) { // this enforces a speed limit
                            cell.speed = cell.speed * 1.01;
                            currentSpeedBoosts = currentSpeedBoosts + 1;
                        }
                    });

                }

            });

        });
        
        if (isCollision) {

            gameOver = true;
            
            game.playSound("lose");
            
            // Monitoring game loop performance
            /*
            (function () {
                var min,
                    max,
                    total = 0;
                performanceTimings.forEach(function (time) {
                    if (!min || min > time) {
                        min = time;
                    }
                    if (!max || max < time) {
                        max = time;
                    }
                    total = total + time;
                });
                window.console.log("Min game loop time: " + min + "ms");
                window.console.log("Max game loop time: " + max + "ms");
                window.console.log("Average game loop time: " + (total / performanceTimings.length) + "ms");
                window.console.log("FPS: " + Math.floor(1000 / max));
                performanceTimings = [];

            }());
            */

            // animate
            (function () {
                var i;
                for (i = 0; i < 180; i = i + 1) {
                    (function () {
                        var ii = i;
                        window.setTimeout(function () {
                            currentLevel.cells.forEach(function (cell) {
                                var x = parseFloat(cell.el.getAttribute("cx"), 10),
                                    y = parseFloat(cell.el.getAttribute("cy"), 10);
                                cell.el.setAttribute("r", CELL_SIZE - (ii / 15));
                                cell.el.setAttribute("cx", x > 960 ? x - (Math.random() * 5) : x + (Math.random() * 5));
                                cell.el.setAttribute("cy", y > 540 ? y - (Math.random() * 5) : y + (Math.random() * 5));
                            });
                        }, ii * 17);
                    }());
                }
            }());
            
            window.setTimeout(function () {
                game.showMessage("collision", score);
            }, 3000);

        } else if (timeRemaining === 0) {
            
            game.playSound("out-of-time");
            game.showMessage("out-of-time", score);
        
        } else {
            
            // add breaks in line at random points in time
            // TO DO: don't add break with 10 seconds of game starting
            (function () {
                var CHANCE = 0.0005,
                    newBreakAdded = false;
                if (currentLevel.breaks.length && Math.random() < CHANCE) {
                    currentLevel.breaks.forEach(function (lineBreak, lineBreakIndex) {
                        var newEl1,
                            newEl2,
                            point,
                            svg = document.querySelector(".game .svg-elements");
                        
                        if (!newBreakAdded && lineBreak.stage === 0) {

                            newBreakAdded = true;
                            lineBreak.stage = 1;
                            
                            point = currentLevel.paths[lineBreak.location.path].el.getPointAtLength((currentLevel.paths[lineBreak.location.path].length / 1000) * lineBreak.location.pos);
                            // For collision detection:
                            lineBreak.x = point.x;
                            lineBreak.y = point.y;
                            lineBreak.id = "lineBreak-" + lineBreakIndex;
                            
                            // update SVG
                            newEl1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                            newEl1.setAttribute("style", "opacity:1;fill:black;fill-opacity:0;stroke:red;stroke-width:2px;");
                            newEl1.setAttribute("r", "50");
                            newEl1.setAttribute("cx", point.x);
                            newEl1.setAttribute("cy", point.y);
                            newEl1.setAttribute("class", "stage1");
                            svg.insertBefore(newEl1, svg.querySelector("rect:first-of-type")); // insert just after paths, for correct z-index ordering
                            newEl2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
                            newEl2.setAttribute("x", point.x);
                            newEl2.setAttribute("y", point.y + 70);
                            newEl2.setAttribute("style", "font-size:16px;font-family:sans-serif;fill:red;fill-opacity:1;stroke:none;");
                            newEl2.setAttribute("alignment-baseline", "middle");
                            newEl2.setAttribute("text-anchor", "middle");
                            newEl2.innerHTML = "LINE FAULT DETECTED";
                            svg.appendChild(newEl2);
 
                            // progress to stage 2 once warning has been displayed for appropriate time
                            window.setTimeout(function () {
                                newEl2.innerHTML = "";
                                newEl1.setAttribute("class", "stage2");
                                newEl1.setAttribute("style", "opacity:1;fill:#111;fill-opacity:1;stroke:none");
                                lineBreak.stage = 2;
                            }, 4000);
                            
                            game.playSound("warning");

                        }
                    });
                }
            }());

            //performanceTimings.push(Date.now() - startTime);
            window.setTimeout(move, 1000 / FPS);

        }
        
    };
    
    (function () {
        var scoreDisplay = document.querySelector(".score strong");
        updateScore = function (amount, reset) {
            if (reset) {
                score = 0;
            } else {
                score = score + amount;
            }
            scoreDisplay.style.color = score < 20 ? "red" : "green";
            scoreDisplay.innerHTML = score;
        };
    }());
    
    (function () {
        var timeDisplay = document.querySelector(".timer strong");
        updateTime = function (time) {
            var colour = "green";
            if (timeRemaining < TIME * 0.67) {
                colour = "orange";
            }
            if (timeRemaining < TIME * 0.33) {
                colour = "red";
            }
            timeDisplay.style.color = colour;
            timeDisplay.innerHTML = time;
        };
    }());
    
}());