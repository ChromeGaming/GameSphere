(function() {
    var highscore = 0;
    var STEPS_PER_SECOND = 180;

    // Creates a matrix with the given number of columns and rows, 
    // and initializes each element using a given function.
    function createMatrix(cols, rows, init) {
        var matrix = new Array(cols);
        for (var i = 0; i < cols; i++) {
            matrix[i] = new Array(rows);
            for (var j = 0; j < rows; j++) {
                matrix[i][j] = init(i, j);
            }
        }
        return matrix;
    }

    var canvas = document.getElementById("GameView");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    var startLevel = 0;

    var Game = function() {
        var score = 0;
        var money = 200 + startLevel * 150;
        var lives = 100;
        var frameController = new FrameController(canvas, STEPS_PER_SECOND, 60);
        var FieldSize = {
            width : 35,
            height : 23
        };
        var BLOCK_SIZE = 25;
        var CREEP_RADIUS = 0.09;
        var fieldOffset = { x: -BLOCK_SIZE, y: 40 };
        var overListeners = [];
        var game = this;
        var mousePosition = null;

        // Represents the field where the game happens.
        var Field = function(width, height) {
            var cells = createMatrix(width, height, function(i, j) {
                if (j == 0 || j == height - 1)
                    return 1;
                if (i > 1 && i < width - 3)
                    return 0;
                if (j == (height / 2 | 0))
                    return 0;
                return 1;
            });

            // Implements the Dijkstra algorithm, used to find the shortest path
            // between any square in the field and the creeps goal.
            var dijkstra = function(source) {
                var unvisited = [];
                var unvisitedMap = createMatrix(width, height, function(i, j) {
                    unvisited.push({
                        x : i,
                        y : j
                    });
                    return true;
                });
                var dist = createMatrix(width, height, function() {
                    return undefined;
                });
                var previous = createMatrix(width, height, function() {
                    return undefined;
                });
                dist[source.x][source.y] = 0;
                while (unvisited.length) {
                    var minDist = undefined;
                    var minIndex = undefined;
                    for ( var i in unvisited) {
                        var v = unvisited[i];
                        if (dist[v.x][v.y] !== undefined
                                && (minDist === undefined || dist[v.x][v.y] < dist[minDist.x][minDist.y])) {
                            minDist = v;
                            minIndex = i;
                        }
                    }
                    if (!minDist)
                        break;
                    unvisited.splice(minIndex, 1);
                    unvisitedMap[minDist.x][minDist.y] = undefined;
                    var neighbors = [];
                    if (minDist.x > 0)
                        neighbors.push({
                            x : minDist.x - 1,
                            y : minDist.y
                        });

                    if (minDist.x < width - 1)
                        neighbors.push({
                            x : minDist.x + 1,
                            y : minDist.y
                        });

                    if (minDist.y > 0)
                        neighbors.push({
                            x : minDist.x,
                            y : minDist.y - 1
                        });

                    if (minDist.y < height - 1)
                        neighbors.push({
                            x : minDist.x,
                            y : minDist.y + 1
                        });

                    neighbors.forEach(function(v) {
                        if (!unvisitedMap[v.x][v.y])
                            return;
                        var alt = dist[minDist.x][minDist.y] + 1;
                        if (dist[v.x][v.y] === undefined
                                || alt < dist[v.x][v.y]) {
                            if (!cells[v.x][v.y])
                                dist[v.x][v.y] = alt;
                            previous[v.x][v.y] = minDist;
                        }
                    });
                }
                var optmized = createMatrix(width, height, function(i, j) {
                    var p = previous[i][j];
                    if (!p)
                        return;
                    var d = Vector.subFrom(p, {
                        x : i,
                        y : j
                    });
                    while (previous[p.x][p.y]
                            && Vector.equals(d, Vector.subFrom(
                                    previous[p.x][p.y], Vector.copy(p)))) {
                        p = previous[p.x][p.y];
                    }
                    return p;
                });
                return optmized;
            };

            // Renders the field in a background canvas and returns the resulting image.
            var renderBackground = function() {
                var image = document.createElement("canvas");
                image.width = BLOCK_SIZE * width;
                image.height = BLOCK_SIZE * height;
                var gc = image.getContext("2d");
                for (var i = 0; i < width; i++) {
                    for (var j = 0; j < height; j++) {
                        var c = cells[i][j];
                        if (c instanceof Tower) c = 2;
                        gc.fillStyle = [ "green", "brown", "gray" ][c];
                        gc.fillRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE,
                                BLOCK_SIZE);
                    }
                }
                return gc.getImageData(0, 0, image.width, image.height);
            };

            var backgroundImage = renderBackground();

            // Draws the pre-rendered field.
            this.render = function(gc) {
                gc.putImageData(backgroundImage, fieldOffset.x, fieldOffset.y);
            };

            this.origin = {
                x : 0,
                y : height / 2 | 0
            };

            this.goal = {
                x : width - 1,
                y : height / 2 | 0
            };

            function reduceNeighbors(x, y, f) {
                var r;
                for (var i = 0; i < 2; i++) {
                    for (var j = 0; j < 2; j++) {
                        r = f(x + i, y + j);
                        if (r && r.end) return r.value;
                    }
                }
                return r && r.value;
            }
            
            // Checks if the position can be occupied.
            this.canPutTower = function(x, y) {
                if (x <= 0 || y <= 0 || x >= width - 2 || y >= height - 2)
                    return false;
                
                var someCellOccupied = reduceNeighbors(x, y, function (i, j) {
                    var cellOccupied = cells[i][j];
                    return { end: cellOccupied, value: cellOccupied };
                });
                if (someCellOccupied)
                    return;
                reduceNeighbors(x, y, function (i, j) {
                    cells[i][j] = 2;
                });
                
                var previous = dijkstra(this.goal);
                reduceNeighbors(x, y, function (i, j) {
                    cells[i][j] = 0;
                });
                if (previous[this.origin.x][this.origin.y]) {
                    return true;
                } else {
                    return false;
                }
            };
            
            // Put a tower in the position x, y.
            this.putTower = function (tower, x, y) {
                reduceNeighbors(x, y, function (i, j) {
                    cells[i][j] = 2;
                });
                cells[x][y] = tower;
                this.previous = dijkstra(this.goal);
                backgroundImage = renderBackground();
            };
            
            this.hasTower = function (p) {
                return cells[p.x][p.y] instanceof Tower && cells[p.x][p.y]; 
            };
            
            this.map = function (p) {
                return {
                    x: Math.round((p.x - fieldOffset.x) / BLOCK_SIZE - 1),
                    y: Math.round((p.y - fieldOffset.y) / BLOCK_SIZE - 1)
                };
            };
            
            this.unmap = function (p) {
                return {
                    x: (p.x + 1) * BLOCK_SIZE + fieldOffset.x,
                    y: (p.y + 1) * BLOCK_SIZE + fieldOffset.y
                };
            };

            // Returns true if a creep should be able to walk in the given position.
            this.creepCanWalk = function(p) {
                if (p.x < 0 || p.y < 0 || p.x >= width || p.y >= height)
                    return 0;
                return !cells[p.x][p.y];
            };

            this.previous = dijkstra(this.goal);
        };
        
        // Represents a tower.
        var Tower = function(position, createBullet) {
            var bulletRange = 3;
            var BULLET_SPEED = 7 / STEPS_PER_SECOND;
            var bulletDuration = bulletRange / BULLET_SPEED | 0;
            var fireDelay = 1 * STEPS_PER_SECOND;
            var fireCounter = 0;

            // Tries to find a target, aim and shoot.
            this.step = function() {
                if (!fireCounter) {
                    var target = creepsManager.getCreepAtDistance(position, bulletRange);
                    if (!target)
                        return;
                    var distance = Vector.subFrom(position, Vector.copy(target.getPosition()));
                    var offset = Vector.scale(Vector.copy(target.getSpeed()), Vector.norm(distance) / BULLET_SPEED);
                    Vector.addTo(offset, distance);
                    Vector.scale(distance, BULLET_SPEED / Vector.norm(distance));
                    createBullet(Vector.copy(position), distance, bulletDuration, 1 + this.level);
                    fireCounter = fireDelay;
                } else {
                    fireCounter--;
                }
            };
            
            this.render = function (gc) {
                gc.fillStyle = "yellow";
                gc.fillRect(position.x - 1, position.y - 1, this.level * 0.4, 3 / BLOCK_SIZE);
            };
            
            this.level = 1;
            
            this.upgrade = function () {
                fireDelay = fireDelay * 0.7 | 0;
                bulletRange += 0.8;
                bulletDuration = bulletRange / BULLET_SPEED | 0;
                this.level++;
            };
        };

        var field = new Field(FieldSize.width, FieldSize.height);

        // This class is used to control (and render) all the creeps.
        var CreepsManager = function(origin) {
            var creeps = [];
            var summoning = false;
            var level = startLevel;
            var creepsToSummon = 30;
            var summonCounter = 0;
            var summonDelay = STEPS_PER_SECOND / 2;

            // Returns the first creep that is no more than 
            // the given distance away from the given point.
            this.getCreepAtDistance = function(point, distance) {
                var found = null;
                creeps.some(function(creep) {
                    var d = Vector.subFrom(point, Vector.copy(creep
                            .getPosition()));
                    if (Vector.norm2(d) <= distance * distance)
                        return found = creep;
                });
                return found;
            };

            // Checks if it is time to summon a creep, detect colisions between creeps,
            // and verifies if the creeps should be removed.
            this.step = function() {
                if (summoning) {
                    if (summonCounter) {
                        summonCounter--;
                    } else {
                        this.summon();
                        creepsToSummon--;
                        if (!creepsToSummon) {
                            summoning = false;
                        } else {
                            summonCounter = summonDelay;
                        }
                    }
                }
                ;
                creeps.forEach(function(creep) {
                    creep.decelerate();
                });
                creeps.forEach(function(creep) {
                    creep.step();
                });
                for (var i = 0; i < creeps.length; i++) {
                    var pi = creeps[i].getPosition();

                    for (var j = i + 1; j < creeps.length; j++) {
                        var pj = creeps[j].getPosition();
                        if (pi.x - CREEP_RADIUS * 2 > pj.x)
                            continue;
                        if (pi.y - CREEP_RADIUS * 2 > pj.y)
                            continue;
                        if (pj.x - CREEP_RADIUS * 2 > pi.x)
                            continue;
                        if (pj.y - CREEP_RADIUS * 2 > pi.y)
                            continue;
                        var dp = Vector.subFrom(pj, Vector.copy(pi));
                        if (Vector.norm2(dp) > CREEP_RADIUS * 2 * CREEP_RADIUS
                                * 2)
                            continue;
                        var si = creeps[i].getSpeed();
                        var sj = creeps[j].getSpeed();
                        var ds = Vector.subFrom(sj, Vector.copy(si));
                        if (Vector.scalarProduct(ds, dp) > 0)
                            continue;
                        var projj = Vector.project(sj, Vector.copy(dp));
                        var proji = Vector.project(si, dp);
                        Vector.subFrom(proji, si);
                        Vector.subFrom(projj, sj);
                        Vector.addTo(projj, si);
                        Vector.addTo(proji, sj);
                    }
                }
                for (var i = creeps.length - 1; i >= 0; i--) {
                    creeps[i].move();
                    if (creeps[i].foundGoal()) {
                        lives -= 1;
                        creeps.splice(i, 1);
                        if (!lives) {
                            game.over();
                        }
                    } else if (creeps[i].isDead()) {
                        money += 5;
                        score += 5;
                        creeps.splice(i, 1);
                    }
                }
            };

            // Starts summoning the creeps.
            this.startSummoning = function() {
                if (summoning) return;
                summoning = true;
                creepsToSummon = 30;
                level++;
            };

            // Summons one creep;
            this.summon = function() {
                var creep = new Creep(
                    origin, 
                    {
                        x : 1 / STEPS_PER_SECOND,
                        y : (0.5 - Math.random() * 1) / STEPS_PER_SECOND
                    },
                    level);
                creeps.push(creep);
            };

            // Renders all the creeps at once.
            this.render = function(gc) {
                gc.fillStyle = "#0F0";
                creeps.forEach(function(creep) {
                    creep.render(gc);
                });
            };
        };

        // Represents one creep.
        var Creep = function(p, s, level) {
            var creepAcceleration = 0.01 / STEPS_PER_SECOND;
            var deceleration = creepAcceleration * 0.2;
            var maxSpeed = 0.8 / STEPS_PER_SECOND;
            var position = Vector.copy(p);
            var speed = s;
            var currentCell = Vector.round(Vector.copy(position));
            var life = 5 + 1 * level * level;

            // Renders the creep.
            this.render = function(gc) {
                gc.beginPath();
                gc.arc(position.x, position.y, CREEP_RADIUS, 0, Math.PI * 2);
                gc.fill();
            };

            // Deacelerate the creep.
            this.decelerate = function() {
                var speedNorm = Vector.norm(speed);
                if (speedNorm < deceleration) {
                    speed = {
                        x : 0,
                        y : 0
                    };
                } else {
                    Vector.scale(speed, (speedNorm - deceleration) / speedNorm);
                }
            };

            // Finds the path to the goal, and tries to drive the creep.
            this.step = function() {
                if (currentCell.x < 0 || currentCell.x >= FieldSize.width || currentCell.y < 0 && currentCell.y >= FieldSize.height)
                    return;
                
                var next = field.previous[currentCell.x][currentCell.y];
                var speedNorm2 = Vector.norm2(speed);
                if (!next || speedNorm2 >= maxSpeed * maxSpeed)
                    return;
                
                var d = Vector.copy(next);
                Vector.subFrom(position, d);
                Vector.scale(d, creepAcceleration / Vector.norm(d));
                Vector.addTo(d, speed);
            };

            // Checks if the creep can move to the current direction (if not it bounces),
            // and then move.
            this.move = function() {
                var speedNorm = Vector.norm(speed);
                if (!speedNorm)
                    return;
                var nextCell = Vector.round(
                    Vector.addTo(
                        position, 
                        Vector.scale(Vector.copy(speed), (speedNorm + CREEP_RADIUS) / speedNorm)
                    )
                );
                var nextCellCopy = Vector.copy(nextCell);
                if (!Vector.equals(nextCell, currentCell) && !field.creepCanWalk(nextCell)) {
                    Vector.subFrom(currentCell, nextCell);
                    if (nextCell.x)
                        speed.x = -speed.x;
                    if (nextCell.y)
                        speed.y = -speed.y;
                }
                currentCell = nextCellCopy;
                Vector.addTo(speed, position);
            };

            // Returns true if the creep reached the goal.
            this.foundGoal = function() {
                return Vector.equals(currentCell, field.goal);
            };

            // Returns the creep position.
            this.getPosition = function() {
                return position;
            };

            // Returns the creep speed.
            this.getSpeed = function() {
                return speed;
            };

            // Reduces the creep life with the given damage.
            this.inflictDamage = function(damage) {
                life -= damage;
            };

            // Returns true if the creep is dead.
            this.isDead = function() {
                return life <= 0;
            };
        };

        // This class is used to control (and render) all the bullets.
        var BulletsManager = function() {
            var bullets = [];

            // Adds a new bullet.
            this.createBullet = function(position, speed, duration, damage) {
                bullets.push({
                    position : position,
                    speed : speed,
                    duration : duration,
                    damage: damage
                });
            };

            // Checks if the bullets hit a creep and move the bullets.
            this.step = function() {
                for (var i = bullets.length - 1; i >= 0; i--) {
                    var bullet = bullets[i];
                    var creep = creepsManager.getCreepAtDistance(
                            bullet.position, CREEP_RADIUS);
                    if (creep)
                        creep.inflictDamage(bullet.damage);
                    if (!bullet.duration-- || creep)
                        bullets.splice(i, 1);
                    else
                        Vector.addTo(bullet.speed, bullet.position);
                }
            };

            // Renders all the bullets at once.
            this.render = function(gc) {
                gc.fillStyle = "white";
                bullets.forEach(function(bullet) {
                    gc.fillRect(bullet.position.x, bullet.position.y, 1 / BLOCK_SIZE, 1 / BLOCK_SIZE);
                });
            };
        };
        
        var Button = function (rect, label, visible, onClick, onRender) {
            var clickCount = 0;
            
            this.rect = rect;
            
            this.render = function (gc) {
                var bright = 192 * clickCount / STEPS_PER_SECOND | 0;
                gc.fillStyle = "rgb(255, " + bright + ", " + bright + ")";
                gc.save();
                gc.translate(rect.x, rect.y);
                gc.fillRect(0, 0, rect.width, rect.height);
                gc.translate(rect.width / 2, rect.height-5);
                gc.textAlign = "center";
                gc.textBaseline = "bottom";
                gc.fillStyle = "white";
                gc.fillText(label, 0, 0);
                gc.translate(-rect.width / 2, rect.height);
                gc.scale(rect.width, rect.height);
                onRender(gc);
                gc.restore();
            };

            this.click = function () {
                clickCount = STEPS_PER_SECOND;
                onClick();
            };
            
            this.step = function () {
                if (clickCount) clickCount--;
            };
            
            this.visible = visible;
        };
        
        var buttonsManager = new function () {
            var buttons = [];
            
            this.addButton = function (button) {
                buttons.push(button);
            };
            
            this.render = function (gc) {
                buttons.forEach(function (b) {
                    if (b.visible) b.render(gc);
                });
            };
            
            this.step = function () {
                buttons.forEach(function (b) {
                    if (!b.visible)
                        return;
                    var click = frameController.readMouseClick(b.rect);
                    if (click) {
                        b.click();
                    };
                    b.step();
                });
            };
        };
        
        var btnSendCreeps = new Button({ x: 10, y: 5, width: 120, height: BLOCK_SIZE }, "Send creeps!", true, 
            function () {
                game.creepsManager.startSummoning();
            }, 
            function () {});

        var btnUpgrade = new Button({ x: 0, y: 0, width: BLOCK_SIZE * 2, height: BLOCK_SIZE }, "Upgr. $50", false, 
            function () {
                if (money < 50)
                    return;
                money -= 50;
                btnUpgrade.tower.upgrade();
            }, function () {
                
            });
        
        var towers = [];
        var btnCreateTower = new Button({ x: 0, y: 0, width: BLOCK_SIZE * 2, height: BLOCK_SIZE }, "Tower $45", false, 
            function () {
                if (money < 45)
                    return;
                var tower = new Tower(Vector.addTo(btnCreateTower.p, { x: 0.5, y: 0.5 }), bulletsManager.createBullet);
                towers.push(tower);
                field.putTower(tower, btnCreateTower.p.x, btnCreateTower.p.y);
                frameController.addActionObject(tower);
                money -= 45;
                btnCreateTower.visible = false;
            }, function () {
                
            });

        buttonsManager.addButton(btnSendCreeps);
        buttonsManager.addButton(btnUpgrade);
        buttonsManager.addButton(btnCreateTower);

        var creepsManager = new CreepsManager(field.origin);
        var bulletsManager = new BulletsManager();
        
        frameController.addActionObject(creepsManager);
        frameController.addActionObject(bulletsManager);
        frameController.addActionObject(buttonsManager);
        frameController.addActionObject(new function() {
            this.step = function() {
                var click;
                while (click = frameController.readMouseClick()) {
                    var p = field.map(click);
                    var m = p;
                    m.x = Math.max(2, Math.min(m.x, FieldSize.width - 5));
                    m.y = Math.max(1, Math.min(m.y, FieldSize.height - 3));
                    btnCreateTower.visible = false;
                    btnUpgrade.visible = false;
                    if (mousePosition && Vector.equals(m, mousePosition)) {
                        mousePosition = null;
                    } else {
                        mousePosition = m;
                        var tower;
                        if (tower = field.hasTower(p)) {
                            if (tower.level < 5) {
                                btnUpgrade.visible = true;
                                btnUpgrade.rect.x = field.unmap(m).x - BLOCK_SIZE;
                                btnUpgrade.rect.y = field.unmap(m).y + BLOCK_SIZE;
                                btnUpgrade.tower = tower;
                            }
                        } else if (field.canPutTower(p.x, p.y)) {
                            btnCreateTower.visible = true;
                            btnCreateTower.rect.x = field.unmap(m).x - BLOCK_SIZE;
                            btnCreateTower.rect.y = field.unmap(m).y + BLOCK_SIZE;
                            btnCreateTower.p = p;
                        }
                    }
                }
            };
        });

        frameController.addRenderObject(field);
        frameController.addRenderObject({
            render: function (gc) {
                gc.clearRect(0, 0, canvas.width, 40);
                gc.save();
                gc.translate(fieldOffset.x, fieldOffset.y);
                gc.scale(BLOCK_SIZE, BLOCK_SIZE);
                if (mousePosition) {
                    gc.fillStyle = "rgba(129, 255, 129, 0.2)";
                    gc.fillRect(mousePosition.x, mousePosition.y, 2, 2);
                }
                gc.translate(0.5, 0.5);
            }
        });
        frameController.addRenderObject(creepsManager);
        frameController.addRenderObject(bulletsManager);
        frameController.addRenderObject({
            render: function (gc) {
                towers.forEach(function (t) {
                    t.render(gc);
                });
            }
        });
        frameController.addRenderObject({
            render: function (gc) {
                gc.restore();
            }
        });
        frameController.addRenderObject(buttonsManager);
        
        frameController.addRenderObject(new function() {
            this.render = function(gc) {
                gc.save();
                gc.fillStyle = "white";
                gc.translate(790, 15);
                gc.textAlign = "right";
                gc.scale(1, 1);
                gc.fillText("Score: " + score, 0, 0);
                gc.fillText("Money: " + money, 0, 10);
                gc.fillText("Lives: " + lives, 0, 20);
                gc.restore();
            };
        });
        
        this.over = function () {
            frameController.stop();
            overListeners.forEach(function (listener) {
                listener(score);
            });
        };
        
        this.addOverListener = function (listener) {
            overListeners.push(listener);
        };

        frameController.start();
        this.creepsManager = creepsManager;
    };
    
    var game = null;
    
    document.getElementById("btnNewGame").addEventListener("click", function (e) {
        var gameMenu = document.getElementById("GameMenu");
        e.preventDefault();
        gameMenu.classList.toggle("transparent");
        setTimeout(function () {
            gameMenu.style.zIndex = -2;
        }, 2000);
        game = new Game();
        game.addOverListener(function (score) {
            if (highscore < score) {
                highscore = score;
                document.getElementById("Highscore").innerHTML = score;
            }
            document.getElementById("Score").innerHTML = score;
            document.getElementById("Scores").style.opacity = "";
            gameMenu.style.zIndex = "";
            gameMenu.classList.toggle("transparent");
        });
        return false;
    });
})();