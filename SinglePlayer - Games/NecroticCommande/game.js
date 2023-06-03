/*
    NecroticCommander

    TODO:
    Easier touch controls
    Fight sounds
    Refill graves after 10 waves
    WAve count
*/

'use strict';

// popup errors if there are any (help diagnose issues on mobile devices)
// onerror = (...parameters)=> alert(parameters);

showWatermark = 0;

let levelSize, tileLayer, cursor, necromancer;
let summonButton, explosionButton, netherBoltButton, drainSoulButton;
let tutorialModeButton, endlessModeButton, certainDeathMode;
let summons, enemies, graves;
let hudHeight, endTime, screenShake;
let enemyWave, spawnTimer;
let tutMode, noHopeMode;

const crush = new Sound([,0,400,,,,4,,,,,,,,,.2]);
const digCrush = new Sound([,0,400,,.05,,4,,,,,,,,,.2]);
const digSound = new Sound([,0,400,,,,,,,,,,,1]);
const castBolt = new Sound([,0,400,,.05,,2,,.2,,,,,,,.2]);
const crumble = new Sound([,0,400,,.3,,4,,,,,,,1,.5,.3]);
const explode = new Sound([,0,400,,.3,,4,,,,,,,1,.5]);
const curse = new Sound([,0,400,,,,2,,,,20,.1,,,1,.2]);
const death = new Sound([,0,400,,,,4,,,,20,.1,,,1,.2]);

const Scene = {
    Intro: 0,
    Game: 1
}

let currentScreen = Scene.Intro;

function startGame() {
    tutorialModeButton.destroy();
    endlessModeButton.destroy();
    certainDeathMode.destroy();

    necromancer = new Necromancer(vec2(levelSize.x / 2, 22));
    cursor = new Cursor(vec2(levelSize.x / 2, levelSize.y / 2));

    hudHeight = 15;
    endTime = 1;
    screenShake = 0;

    netherBoltButton = new NetherBoltButton(vec2(levelSize.x - 19.5, 10));
    drainSoulButton = new DrainSoulButton(vec2(levelSize.x - 7.5, 10));
    summonButton = new RaiseDeadButton(vec2(levelSize.x - 19.5, 4));
    explosionButton = new CorpseBombButton(vec2(levelSize.x - 7.5, 4));

    graves = [];
    enemies = [];
    summons = [];

    enemyWave = 0;
    spawnTimer = new Timer();

    for(let i = -18; i < 20; i += 6) {
        for(let j = -18; j < 20; j += 6) {
            if (i === 0) continue;
            graves.push(new Grave(vec2(cameraPos.x + i, cameraPos.y + j + 8)))
        }
    }
}

function makeTileLayers(size) {
    initTileCollision(size)

    tileLayer = new TileLayer(vec2(0, 0), size, vec2(16), vec2(4));
    tileLayer.renderOrder = 10;

    for(let pos = vec2(5, hudHeight); pos.y < size.y; pos.y++) {
        tileLayer.setData(pos, new TileLayerData(12));
    }

    tileLayer.redraw();
}

function tearDown() {
    graves.forEach((g) => g.destroy());
    enemies.forEach((e) => e.destroy());
    summons.forEach((s) => s.destroy());
}

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    canvasFixedSize = vec2(720, 1280); // 720p
    levelSize = vec2(44, 80);
    cameraPos = levelSize.scale(0.5);
    cameraScale = 16;
    cursor = new Cursor(vec2(levelSize.x / 2, levelSize.y / 2));

    tutorialModeButton = new TutorialButton(vec2(cameraPos.x, cameraPos.y + 3));
    endlessModeButton = new EndlessMode(vec2(cameraPos.x, cameraPos.y - 12));
    certainDeathMode = new CertainDeathMode(vec2(cameraPos.x, cameraPos.y - 27))
}

/// ////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    if (currentScreen === Scene.Intro) {
        if (tutorialModeButton.selected) {
            noHopeMode = false;
            tutMode = true;
            currentScreen = Scene.Game;
            makeTileLayers(levelSize);
            startGame();
        } else if (endlessModeButton.selected) {
            tutMode = false;
            noHopeMode = false;
            currentScreen = Scene.Game;
            makeTileLayers(levelSize);
            startGame();
        }  else if (certainDeathMode.selected) {
            noHopeMode = true;
            tutMode = false;
            currentScreen = Scene.Game;
            makeTileLayers(levelSize);
            startGame();
        }

    } else if (currentScreen === Scene.Game) {
        if (keyIsDown(49)) {
            netherBoltButton.doSelect();
        } else if (keyIsDown(50))  {
            drainSoulButton.doSelect();
        } else if (keyIsDown(51))  {
            summonButton.doSelect();
        } else if (keyIsDown(52))  {
            explosionButton.doSelect();
        }

        if (!enemies.length && spawnTimer.elapsed()) {
            enemyWave++;
            for (let e = 0; e < enemyWave; e++) {
                enemies.push(new Peasant(vec2(rand(cameraPos.x - 15, cameraPos.x + 15), cameraPos.y + 42)))
            }

            if (!noHopeMode && !(enemyWave % 10)) {
                graves.forEach(g => {
                    if (!g.full) g.refill()
                });
            }

            if (tutMode && (enemyWave === 1 || enemyWave === 3 || enemyWave === 5 || enemyWave === 10)) {
                paused = true;
            }

        } else if (!spawnTimer.active()) {
            spawnTimer.set(2);
        }
    }
}

/// ////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
    if (currentScreen !== Scene.Game) {
        return;
    }

    graves = graves.filter((g) => !g.destroyed);
    enemies = enemies.filter((e) => !e.destroyed);
    summons = summons.filter((s) => !s.destroyed);

    if (screenShake > 0) {
        cameraPos.x += rand(-1, 1);
        screenShake -= timeDelta;
    } else {
        cameraPos = levelSize.scale(0.5);
    }

    if (necromancer.health <= 0) {
        endTime -= timeDelta;
        necromancer.health = 0;

        if (!necromancer.destroyed) {
            particleExplode(new Color(1, 0, 0), new Color(0, 0, 0), necromancer.pos, necromancer.size);
            particleExplode(new Color(.4, .4, .4), new Color(0, 0, 0), necromancer.pos, necromancer.size);
            crumble.play(necromancer.pos);
        }

        necromancer.destroy();
        cursor.destroy();

        if (endTime <= 0 && (mouseIsDown(0))) {
            tearDown();
            gameInit();
            startGame();
        }
    }
}

/// ////////////////////////////////////////////////////////////////////////////
function gameRender() {

    const font = new FontImage();

    if (currentScreen === Scene.Intro) {
        drawRect( cameraPos, levelSize, new Color(0, 0, 0), 0, false);
        font.drawText("Necrotic\nCommander", vec2(cameraPos.x, cameraPos.y + 36), 0.6, true);
        drawTile(vec2(cameraPos.x, cameraPos.y + 16 + Math.sin(timeReal)), vec2(12), 1, tileSizeDefault, new Color(1,1,1), 0, 0, new Color(0,0,0,0), true);
        font.drawText("Learn how to play.", vec2(cameraPos.x, cameraPos.y - 2), 0.18, true);
        font.drawText("No Instructions.\n", vec2(cameraPos.x, cameraPos.y - 17), 0.18, true);
        font.drawText("No Hope.", vec2(cameraPos.x, cameraPos.y - 32), 0.18, true);

        return;
    }

    font.drawText(`Peasant wave ${enemyWave}`, vec2(2, 78), 0.18, false);

    drawRect( cameraPos,  levelSize, new Color(0, .1, .1), 0, false);

    drawRect(vec2(22, 7), vec2(levelSize.x, 15), new Color(.4, .4, .4), 0, false);
    drawRect(vec2(22, 7), vec2(levelSize.x - 3, 12), 2, new Color(1, 1, 1), false);

    const healthY = 9;
    const healthX = necromancer.health * 0.14;

    font.drawText(`Health (${necromancer.health})`, vec2(10, 12), 0.18, true);
    drawLine(vec2(2, healthY), vec2(18, healthY), 2, new Color(0.5, 0.5, 0.5))
    if (necromancer.health > 0) {
        drawLine(vec2(3, healthY), vec2( 3 + healthX, healthY), 1, new Color(1, 0, 0))
    }

    const manaY = 3;
    const manaX = Math.floor(necromancer.mana * 0.14);

    font.drawText(`Mana (${Math.floor(necromancer.mana)})`, vec2(10, 6), 0.18, true);
    drawLine(vec2(2, manaY), vec2(18, manaY), 2, new Color(0.5, 0.5, 0.5))
    if (necromancer.mana > 0) {
        drawLine(vec2(3, manaY), vec2(3 + manaX, manaY), 1, new Color(0, 0, 1))
    }
}

/// ////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
    if (currentScreen !== Scene.Game) {
        return;
    }
    const font = new FontImage();
    const continueText = "Click to Continue"
    if (paused) {
        switch (enemyWave) {
            case 1:
                drawRect(cameraPos, vec2(40, 35), new Color(0,0,0), 0, true)
                drawTile(vec2(cameraPos.x, cameraPos.y + 8 + Math.sin(timeReal)), vec2(8), 1, tileSizeDefault, new Color(1,1,1), 0, 0, new Color(0,0,0,0), true);
                font.drawText("Look at that that fool!\nI'll destroy him with\nmy Nether Bolt!\n\nClick to fire!", cameraPos, 0.2, true)
                font.drawText(continueText, vec2(cameraPos.x, cameraPos.y - 12), 0.2, true)
                netherBoltButton.doSelect();
                break;
            case 3:
                drawRect(cameraPos, vec2(40, 35), new Color(0,0,0), 0, true)
                drawTile(vec2(cameraPos.x, cameraPos.y + 8 + Math.sin(timeReal)), vec2(8), 1, tileSizeDefault, new Color(1,1,1), 0, 0, new Color(0,0,0,0), true);
                font.drawText("I can use Drain Soul\nto replenish my mana by\ntargeting a peasant.\n\nClick to curse\none of them.", cameraPos, 0.2, true)
                font.drawText(continueText, vec2(cameraPos.x, cameraPos.y - 12), 0.2, true)
                drainSoulButton.doSelect();
                break;
            case 5:
                drawRect(cameraPos, vec2(40, 35), new Color(0,0,0), 0, true)
                drawTile(vec2(cameraPos.x, cameraPos.y + 10 + Math.sin(timeReal)), vec2(8), 1, tileSizeDefault, new Color(1,1,1), 0, 0, new Color(0,0,0,0), true);
                font.drawText("I can Raise the Dead\nby clicking on their\ngrave stones.\n\nUse Corpse Bomb on\nthem to blow them up!", vec2(cameraPos.x, cameraPos.y + 2), 0.2, true)
                font.drawText(continueText, vec2(cameraPos.x, cameraPos.y - 12), 0.2, true);
                summonButton.doSelect();
                break;
            case 10:
                drawRect(cameraPos, vec2(40, 35), new Color(0,0,0), 0, true)
                drawTile(vec2(cameraPos.x, cameraPos.y + 8 + Math.sin(timeReal)), vec2(8), 1, tileSizeDefault, new Color(1,1,1), 0, 0, new Color(0,0,0,0), true);
                font.drawText("We have enough\nbodies to bury,\nbolstering our numbers.\n\nMuhahaha!", cameraPos, 0.2, true)
                font.drawText(continueText, vec2(cameraPos.x, cameraPos.y - 12), 0.2, true)
                break;
        }

        if (isDown()) {
            paused = false
        }
    }

    if (necromancer.health === 0 && endTime <= 0) {
        drawRect(vec2(cameraPos.x, cameraPos.y + 10), vec2(40, 25), new Color(0, 0, 0), 0, true);
        font.drawText(`You survived\nto wave ${enemyWave}!\n\nClick to\nplay again`, vec2(cameraPos.x, cameraPos.y + 18), 0.4, true);
    }
}

function isInside(circle_x, circle_y, rad, x, y) {
    return ((x - circle_x) * (x - circle_x) +
        (y - circle_y) * (y - circle_y) <= rad * rad)
}

function doExplosion(bomb) {
    [...enemies, ...summons].filter((e) => {
        if (isInside(bomb.pos.x, bomb.pos.y, 8, e.pos.x, e.pos.y)) {
            e.health -= 75;
            const angle = e.pos.subtract(bomb.pos);
            e.applyForce(angle.normalize().scale(10));
        }
        if (isInside(bomb.pos.x, bomb.pos.y, 4, e.pos.x, e.pos.y)) {
            e.health -= 100;
            const angle = e.pos.subtract(bomb.pos);
            e.applyForce(angle.normalize().scale(20));
        }
    });
    particleExplode(new Color(1, 0, 0), new Color(0, 0, 0), bomb.pos, bomb.size.scale(2));
    particleExplode(new Color(0, 1, 0), new Color(0, 0, 0), bomb.pos, bomb.size.scale(2));
    explode.play(bomb.pos);
    screenShake = 0.1;
}

const manaPool = 100;
const netherBoltCost = 10;
const summonCost = 10;
const explosionCost = 20;

function isDown() {
    return mouseIsDown(0)
}

function isClicked(o) {
    return (o === cursor && mouseIsDown(0))
}

// Particles
function particleExplode(color1, color2, pos, size) {
    // Particle explosion
    return new ParticleEmitter(
        pos, 0, size, .1, 200, PI,  // pos, angle, emitSize, emitTime, emitRate, emiteCone
        0, vec2(16),                          // tileIndex, tileSize
        color1, color2,                       // colorStartA, colorStartB
        color1.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
        .2, 1, 1, .1, .05,    // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .99, .95, .4, PI, .1, // damping, angleDamping, gravityScale, particleCone, fadeRate,
        1, 0, 1               // randomness, collide, additive, randomColorLinear, renderOrder
    );
}

function getParticleDrain(pos) {
    return new ParticleEmitter(
        vec2(pos), 0, objectDefaultSize, 0, 4, 0,  // pos, angle, emitSize, emitTime, emitRate, emiteCone
        0, tileSizeDefault,                              // tileIndex, tileSize
        new Color(0, 1, 1), new Color(0, 0, 0),   // colorStartA, colorStartB
        new Color(0, 1, 1, 0), new Color(0, 0, 0, 0), // colorEndA, colorEndB
        2, 0.5, .2, .1, .05,  // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .99, 1, 1, PI, .05,  // damping, angleDamping, gravityScale, particleCone, fadeRate,
        .5, 0                // randomness, collide, additive, randomColorLinear, renderOrder
    );
}

// Player
class Necromancer extends EngineObject {
    constructor(pos) {
        super(pos, vec2(4), 10);
        this.setCollision(1, 1)
        this.renderOrder = 5
        this.health = 100;
        this.mana = manaPool;
        this.generationTime = 0;
        this.boltThrowTime = 0;

        const castle = new EngineObject(this.pos, vec2(5), 13, tileSizeDefault, 0, new Color, 15);
        this.addChild(castle, vec2(0, -3))
    }

    update() {
        this.boltThrowTime += timeDelta;
        if (netherBoltButton.selected &&
            isClicked(cursor) &&
            cursor.pos.y > hudHeight &&
            this.mana >= netherBoltCost &&
            this.boltThrowTime > 0.5) {
            castBolt.play(this.pos);
            const angle = cursor.pos.subtract(this.pos);
            const bolt = new Bolt(this.pos, angle.angle());
            bolt.applyForce(angle.normalize());
            this.mana -= netherBoltCost;
            this.boltThrowTime = 0;
        }

        if (this.generationTime > 2 && this.mana < manaPool) {
            this.mana += 5;
            this.generationTime = 0;
        }

        if (this.mana > manaPool) {
            this.mana = manaPool;
        }

        this.generationTime += timeDelta;
    }
}

class Grave extends EngineObject {
    constructor(pos) {
        super(pos, vec2(3), 6);
        this.setCollision(1);
        this.full = true;
    }

    refill() {
        this.full = true;
        this.tileIndex = 6;
        const color1 = new Color(0.70, 0.44, 0.44);
        const color2 = color1.lerp(new Color, .5);
        particleExplode(color1, color2, this.pos, this.size);
        digSound.play(this.pos);
    }

    update() {
        super.update();
        this.color = new Color(1,1,1);
        if (summonButton.selected && tutMode) {
            const flashColor = abs(Math.cos(timeReal));
            this.color = new Color(flashColor, flashColor, flashColor);
        }
    }

    collideWithObject(o) {
        if (!this.full) {
            return;
        }

        if (summonButton.selected && necromancer.mana - summonCost >= 0) {
            if (isClicked(o)) {
                summons.push(new Summon(this.pos));
                this.full = false;
                this.tileIndex = 7
                necromancer.mana -= summonCost;

                // Particle explosion
                const color1 = new Color(0.70, 0.44, 0.44);
                const color2 = color1.lerp(new Color, .5);
                particleExplode(color1, color2, this.pos, this.size);
                digCrush.play(o.pos)
            }
        }
        return false;
    }
}

class Unit extends EngineObject {
    constructor(pos, tileIndex) {
        super(pos, vec2(3), tileIndex)
        this.setCollision(1, 1)
        this.friction = 0.9;
        this.mass = 10;
        this.elasticity = 0.5;
        this.maxVelocity = rand(0.08, 0.1);

        this.target = undefined;
        this.health = 100;

        this.renderOrder = 10;
    }

    update() {
        super.update();
        if (this.health <= 0) {
            particleExplode(new Color(1, 0, 0), new Color(0, 0, 0), this.pos, this.size);
            this.destroy();
            death.play(this.pos);
        }
    }

    wander() {
        if (this.target === undefined) {
            const t = randInCircle(1);
            this.target = vec2(this.pos.x + t.x, this.pos.y + t.y);
        }

        this.moveTowardsTarget();
    }

    moveTowardsTarget() {

        if (abs(this.pos.x - this.target.x) < 0.1 &&
            abs(this.pos.y - this.target.y) < 0.1) {
            this.target = undefined;
            // this.moveTime = 0;
            this.velocity = vec2(0, 0);
            return;
        } else {
            const angle = this.target.subtract(this.pos);
            this.applyForce(angle.scale(0.01));
        }

        this.velocity.x = clamp(this.velocity.x, -this.maxVelocity, this.maxVelocity);
        this.velocity.y = clamp(this.velocity.y, -this.maxVelocity, this.maxVelocity);

        // Clamp to screen size
        this.pos.x = clamp(this.pos.x, this.size.x / 2, levelSize.x - this.size.x / 2);
        this.pos.y = clamp(this.pos.y, this.size.y / 2 + 14, levelSize.y - this.size.y / 2);

        this.target.x = clamp(this.target.x, this.size.x / 2, levelSize.x - this.size.x / 2);
        this.target.y = clamp(this.target.y, this.size.y / 2 + 14, levelSize.y - this.size.y / 2);
    }

    attack(o, dmg) {
        o.health -= dmg;
    }
}

class Summon extends Unit {
    constructor(pos) {
        super(pos, Math.round(rand(3, 5)));
        this.health = 150;
    }

    update() {
        super.update();
        this.color = new Color(1,1,1);

        if (explosionButton.selected && tutMode) {
            const flashColor = abs(Math.cos(timeReal));
            this.color = new Color(flashColor, flashColor, flashColor);
        }

        if (enemies.length) {
            let closest = undefined;
            enemies.forEach((e) => {
                if (closest === undefined) {
                    closest = e.pos;
                }
                if (this.pos.distance(e.pos) < this.pos.distance(closest)) {
                    closest = e.pos;
                }
            })

            this.target = closest;

            this.moveTowardsTarget();
        } else {
            super.wander();
        }
    }

    collideWithObject(o) {
        if (o instanceof Enemy) {
            this.attack(o, 1)
            return true;
        } else if (o instanceof Unit || o instanceof Necromancer) {
            this.target = undefined;
            return true;
        } else if (isClicked(o) &&
            explosionButton.selected &&
            necromancer.mana - explosionCost > 0) {
            necromancer.mana -= explosionCost;
            doExplosion(this);
            this.destroy();
            return false;
        }
        return false;
    }
}

class Enemy extends Unit {
    constructor(pos, tile) {
        super(pos, tile);
        this.beingDrained = false;
    }

    update() {
        super.update();

        this.color = new Color(1, 1, 1)

        if (this.beingDrained) {
            this.health -= 12 * timeDelta;
            this.color = new Color(0, 1, 1);

            if (necromancer.mana < 100) {
                necromancer.mana += 10 * timeDelta;
            }
            return false;
        } else {
            if ((drainSoulButton.selected || netherBoltButton.selected ) && tutMode) {
                const flashColor = abs(Math.cos(timeReal));
                this.color = new Color(flashColor, flashColor, flashColor);
            }
        }
    }

    collideWithObject(o) {
        if (o instanceof Enemy) {
            this.target = undefined;
            return true;
        } else if (o instanceof Summon || o instanceof Necromancer) {
            this.attack(o, 1)
            return true;
        } else if (isClicked(o) &&
            drainSoulButton.selected) {
            enemies.forEach((e) => {
                e.beingDrained = false
                e.color = new Color(1, 1, 1);
                while (e.children.length > 0) {
                    const child = e.children[0];
                    e.removeChild(child);
                    child.destroy();
                    e.maxVelocity = rand(0.08, 0.1);
                }
            });

            this.beingDrained = true;
            this.maxVelocity = 0.05;

            this.addChild(getParticleDrain(this.pos), vec2(), 0);
            curse.play(this.pos);
            return false;
        }

        return false;
    }
}

class Peasant extends Enemy {
    constructor(pos) {
        super(pos, Math.round(rand(8, 9)));
    }

    // TODO: Flee mechanic
    update() {
        super.update();

        // Huddle
        if (summons.length > enemies.length) {
            //Huddle
            this.target = enemies.reduce((t, e) => {
                return t.add(e.pos);
            }, vec2(0, 0)).scale(1 / enemies.length);
        } else if (summons.length > 0) {
            // Attack
            let closest = undefined;
            summons.forEach((e) => {
                if (closest === undefined) {
                    closest = e.pos;
                }
                if (this.pos.distance(e.pos) < this.pos.distance(closest)) {
                    closest = e.pos;
                }
            })

            this.target = closest;
        } else if (necromancer.health > 0) {
            this.target = necromancer.pos;
        } else {
            this.target = undefined;
        }

        if (this.target) {
            this.moveTowardsTarget();
        } else {
            this.wander();
        }
    }
}

class Bolt extends EngineObject {
    constructor(pos, angle) {
        super(pos, vec2(2), 11, vec2(16), angle);
        this.setCollision(1, 1);
        this.renderOrder = 50;
    }

    collideWithObject(o) {
        if (o instanceof Unit) {
            crush.play(o.pos);
            this.destroy();
            o.target = undefined;
            o.health -= 50;
            o.applyAcceleration(this.velocity)
            particleExplode(new Color(0, 1, 0), new Color(0, 0, 0), this.pos, this.size);
            return true;
        }
        return false;
    }
}

// Cursor
class Cursor extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1), -1, vec2(16), 0, new Color(0,0,0,0));
        this.setCollision(1, 1);

        this.renderOrder = 20
    }

    update() {
        this.pos.x = mousePos.x;
        this.pos.y = mousePos.y;

        this.pos.x = clamp(this.pos.x, this.size.x / 2, levelSize.x - this.size.x / 2);
        this.pos.y = clamp(this.pos.y, this.size.y / 2, levelSize.y - this.size.y / 2)
    }
}

// Buttons
class Button extends EngineObject {
    constructor(pos, size, text, number, color, backgroundColor) {
        super(pos, size);
        this.text = text;
        this.number = number;
        this.color = color;
        this.backgroundColor = backgroundColor;
        this.selected = false;
        this.font = new FontImage(undefined, vec2(8), vec2(0, 1), 0, mainContext);
        this.setCollision(1);
    }

    render() {
        if (this.selected) {
            this.color = new Color(1, 0, 1);
            this.backgroundColor = new Color(0.5, 0, 0.5)
        } else {
            this.color = new Color(1, 0, 0);
            this.backgroundColor = new Color(0.5, 0, 0);
        }

        drawRect(vec2(this.pos.x, this.pos.y), this.size, this.backgroundColor, 0, false);
        drawRect(vec2(this.pos.x, this.pos.y), vec2(this.size.x - 1, this.size.y - 1), this.color, 0, false);
        this.font.drawText(this.text, vec2(this.pos.x, this.pos.y + 1.5), 0.2, true);
        if (this.number > -1) {
            this.font.drawText(this.number.toString(), vec2(this.pos.x + 5, this.pos.y - 1), 0.2, true);
        }
    }

    collideWithObject(o) {
        if (isOverlapping(cursor.pos, cursor.size, this.pos, this.size) && isDown()) {
            this.doSelect();
        }
        return false;
    }

    doSelect() {
        engineObjects.forEach((obj) => {
            if (obj instanceof Button) {
                obj.selected = false;
            }
        })
        this.selected = true;
    }
}


class NetherBoltButton extends Button {
    constructor(pos) {
        super(pos, vec2(11, 5), "Nether\nBolt", 1, new Color(1, 0, 0), new Color(0.5, 0, 0));
        this.selected = true;
    }
}

class DrainSoulButton extends Button {
    constructor(pos) {
        super(pos, vec2(11, 5), "Drain\nSoul", 2, new Color(1, 0, 0), new Color(0.5, 0, 0));
    }
}

class RaiseDeadButton extends Button {
    constructor(pos) {
        super(pos, vec2(11, 5), "Raise\nDead", 3, new Color(1, 0, 0), new Color(0.5, 0, 0));
    }
}

class CorpseBombButton extends Button {
    constructor(pos) {
        super(pos, vec2(11, 5), "Corpse\nBomb", 4, new Color(1, 0, 0), new Color(0.5, 0, 0));
    }
}

class TutorialButton extends Button {
    constructor(pos) {
        super(pos, vec2(18, 8), "Guided\nMode", -1, new Color(1, 0, 0), new Color(0.5, 0, 0));
    }
}

class EndlessMode extends Button {
    constructor(pos) {
        super(pos, vec2(18, 8), "Endless\nMode", -1, new Color(1,0,0), new Color(0.5, 0, 0));
    }
}

class CertainDeathMode extends Button {
    constructor(pos) {
        super(pos, vec2(18, 8), "Certain\nDeath Mode", -1, new Color(1,0,0), new Color(0.5, 0, 0));
    }
}

/// ////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');
