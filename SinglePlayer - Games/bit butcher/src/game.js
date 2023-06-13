import { World } from './world.js';
import { loadTileImageSource } from './tiles.js';
import { achievements } from './achievements.js';

// popup errors if there are any (help diagnose issues on mobile devices)
//onerror = (...parameters)=> alert(parameters);

// game variables
// let particleEmiter;
const win = window;
let gameState = 0; // 0 = not begun, 1 = alive & running, 2 = dead, 3 = win
const TILE_SIZE = win.TILE_SIZE = 24; // was 16 in demo
const WIN_MEAT = 13;
let w;
let font;

// medals
// const medal_example = new Medal(0, 'Example Medal', 'Medal description goes here.');
// medalsInit('Hello World');

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    w = win.w = win.world = new World();
    w.init();
    font = new FontImage;

    // move camera to center of collision
    cameraPos = tileCollisionSize.scale(.5);
    cameraScale = 42;

    // enable gravity
    gravity = 0; // -.01;

    // create particle emitter
    // const emPos = vec2(10, 12);
    // particleEmiter = new ParticleEmitter(
    //     emPos, 0, 1, 0, 200, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
    //     0, vec2(TILE_SIZE),                            // tileIndex, tileSize
    //     new Color(1,1,1),   new Color(0,0,0),   // colorStartA, colorStartB
    //     new Color(1,1,1,0), new Color(0,0,0,0), // colorEndA, colorEndB
    //     2, .2, .2, .1, .05,     // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
    //     .99, 1, .5, PI, .05,     // damping, angleDamping, gravityScale, particleCone, fadeRate, 
    //     .5, 1, 1                // randomness, collide, additive, randomColorLinear, renderOrder
    // );
    // particleEmiter.elasticity = .3; // bounce when it collides
    // particleEmiter.trailScale = 2;  // stretch in direction of motion


    // console.log(tileImage.src);
    // mainContext.drawImage(tileImage, 1000, 1000);
    // mainContext.fillStyle = 'green';
    // mainContext.fillRect(0, 0, 100, 100);
    // // tileImage = new Image();
    // tileImage.src = mainCanvas.toDataURL();
    
    // console.log(tileImage.src);
    // mainContext.drawImage(tileImage, 1000, 1000);
    // glInit();
    // glTileTexture = glCreateTexture(tileImage);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    const { pc } = w;
    if (pc !== win.pc) win.pc = pc; // Just for easy debugging
    // if (mouseWasPressed(0)) {
        // achievements.award(0);
        // if (pc) pc.damage(1, pc);
        // play sound when mouse is pressed
        // sounds.click.play(mousePos);

        // change particle color and set to fade out
        // particleEmiter.colorStartA = new Color;
        // particleEmiter.colorStartB = randColor();
        // particleEmiter.colorEndA = particleEmiter.colorStartA.scale(1,0);
        // particleEmiter.colorEndB = particleEmiter.colorStartB.scale(1,0);

        // unlock medals
        // medal_example.unlock();
        // console.log(mousePos);
    // }

    if (keyWasReleased(13)) {
        if (gameState === 2 || gameState === 3) {
            win.location.reload();
        } else if (gameState === 0 || gameState === 2) {
            gameState = 1;
            w.makePc();
        }
    }
    if (pc) {
        win.achievements = achievements;
        cameraPos =  cameraPos.lerp(pc.pos, 0.1);
        // cameraPos =  cameraPos.lerp(w.spirits[0].pos, 0.1);
        if (pc.isDead()) gameState = 2;
        else {
            const meat = pc.findInventoryItem('Meat');
            const meatQuantity = meat ? meat.quantity : 0;
            if (meatQuantity >= WIN_MEAT) achievements.award(5);
            if (achievements.count() === achievements.length) gameState = 3;
        }
    }

    // move particles to mouse location if on screen
    // if (mousePosScreen.x) {
        // particleEmiter.pos = mousePos;
        // pc.pos = mousePos;
        // particleEmiter.pos = pc.pos;
    // }as

    cameraScale = clamp(cameraScale*(1-mouseWheel/10), 3, 700);
    
    if (w) w.update();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // draw a grey square in the background without using webgl
    // drawRect(cameraPos, tileCollisionSize.add(vec2(5)), new Color(.2,.2,.2), 0, 0);
}

///////////////////////////////////////////////////////////////////////////////
function renderInventory(pc) {
    const midX = overlayCanvas.width/2;
    // const invText = pc.inventory
    //     .map((item) => item ? (item.name || ' ') + ' x' + item.quantity : ' ')
    //     .map((n, i) => i + ': ' + (pc.equipIndex === i ? `[ ${n.toUpperCase()} equipped ]` : `[ ${n} ]`))
    //     .concat(['0: [Hands]', 'E: Action'])
    //     .join('    ');
    // drawTextScreen(invText, vec2(midX, overlayCanvas.height - 40), 20, new Color, 4);

    const equipItem = pc.inventory[pc.equipIndex];
    const invTipText = `${equipItem ? equipItem.name : 'Nothing'} equipped, 1-9: Equip, E: Action, Q: Drop`;
    // drawTextScreen(invTipText, vec2(midX, overlayCanvas.height - 40), 20, new Color, 4);
    font.drawText(invTipText, screenToWorld(vec2(midX, overlayCanvas.height - 40)), 2/cameraScale, 1);

    for(let i = 1; i <= 10; i++) {
        const size = vec2(50, 70);
        const pos = vec2(
            midX - (5 * 60) + (i * 60),
            overlayCanvas.height - 100,
        );
        const itemIndex = i % 10;
        const color = (itemIndex === pc.equipIndex) ? new Color(.9,.9,.9,.3) : new Color(.1,.1,.1,.3);
        drawRectScreenSpace(pos, size, color);
        const item = pc.inventory[itemIndex];
        if (item) {
            // TODO: Switch to drawing pixelated tile
            drawTextScreen(item.emoji, pos.add(vec2(0, -6)), 28);
            font.drawText(''+item.quantity, screenToWorld(pos.add(vec2(5, 14))), 2/cameraScale, 1);
        }
    }
}

function gameRenderPost()
{
    const { pc } = w;
    const d = drawTextScreen;
    const white = new Color;
    // draw to overlay canvas for hud rendering
    // d('Hello World 🦀', vec2(overlayCanvas.width/2, 80), 80, new Color, 9);
    const midX = overlayCanvas.width/2;
    const midY = overlayCanvas.height/2;
    const pxFontSize = overlayCanvas.width / 8000;
    // const r = (n) => Math.round(pc.pos[n] * 10) / 10;
    // d(`x ${r('x')}, y ${r('y')}`, vec2(midX, 80), 20, new Color, 9);
    

    
    if (gameState === 2) {
        d('YOU DIED', vec2(midX, midY - 90), 90, new Color(1, 0, 0), 4);
        d('Press Enter to restart', vec2(midX, midY), 40, new Color(1, .5, .5), 4);
    } else if (gameState === 0) {
        // overlayCanvas.width
        font.drawText('BIT BUTCHER', cameraPos.add(vec2(0,6)), pxFontSize, 1);
        // d('BIT BUTCHER', vec2(midX, midY - 90), 90, white, 4);
        // d('Press Enter to start', vec2(midX, midY), 40, white, 4);
        font.drawText('Press Enter to start', cameraPos.add(vec2(0, .4)), pxFontSize / 2, 1);
    } else if (gameState === 1 || gameState === 3 && pc) {
        renderInventory(pc);

        achievements.forEach((a, i) => 
            d(
                `[${a[1] ? 'X' : ' '}] ` + a[0],
                vec2(overlayCanvas.width - 300, 100 + (i * 30)),
                18,
                a[1] ? new Color(.4,1,.4,.5) : white,
                4,
                new Color(0,0,0, a[1] ? .5 : 1),
                'left'
            )
        );

        const gb = (pc.age > 85) ? 0 : 1;
        const c = new Color(1,gb,gb,.8);
        const w = 500 * (Math.max(0, 100 - pc.age)/100);
        drawRectScreenSpace(vec2(midX, 40), vec2(w, 2), c);
        d(`Age: ${Math.ceil(pc.age)}`, vec2(midX, 40), 20, c, 4);
        if (gameState === 3) {
            font.drawText('YOU WIN', cameraPos.add(vec2(0,5)), .2, 1);
            d('Press Enter to play again', vec2(midX, midY - 80), 40, white, 4);
        }
    }
}



///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
(async () => {
    tileSizeDefault = vec2(TILE_SIZE);
    const tis = await loadTileImageSource();
    engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, tis);
})();
