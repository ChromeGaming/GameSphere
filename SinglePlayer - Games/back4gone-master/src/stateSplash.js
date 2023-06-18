// stateSplash.js


let playerStats = null;

function savePlayerStats()
{
    window.localStorage.setItem('back4goneStats', JSON.stringify(playerStats));
}

function newPlayerStats()
{
    return [
        {
            longestHr: 0,
            mostHr: 0,
        },
        {
            longestHr: 0,
            mostHr: 0,
        },
        {
            longestHr: 0,
            mostHr: 0,
        },
    ];
}

class splashState
{
    constructor()
    {
        this.splashInitialized = false;
        this.loadingShown = false;

        kBrushes.grassBrush = makeBrush(greenColors);
        kBrushes.dirtBrush = makeBrush(dirtColors);
        kBrushes.chalkBrush = makeBrush(chalkColors);
    }
    enter()
    {
        aw.clearAllEntities();   
        aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.splashInitialized = true; 

        let json = window.localStorage.getItem('back4goneStats');
        if(json)
        {
            playerStats = JSON.parse(json);
        }
        else
        {
            playerStats = newPlayerStats();
        }
    }
    exit()
    {

    }
    preRender()
    {
        aw.ctx.fillStyle = kBrushes.grassBrush;
        aw.ctx.fillRect(0, 0, screenWidth, screenHeight);

        aw.ctx.fillStyle = kBrushes.dirtBrush;
        aw.ctx.beginPath();
        aw.ctx.moveTo(0, 0);
        aw.ctx.lineTo(screenWidth / 2, 0);
        aw.ctx.lineTo(screenWidth, screenWidth / 2);
        aw.ctx.lineTo(screenWidth, 3 * screenWidth / 2);
        aw.ctx.lineTo(0, screenWidth / 2);
        aw.ctx.fill();

        aw.ctx.fillStyle = kBrushes.chalkBrush;
        aw.ctx.beginPath();
        aw.ctx.moveTo(0, 0);
        aw.ctx.lineTo(screenWidth, screenWidth);
        aw.ctx.lineTo(screenWidth, screenWidth * 1.10);
        aw.ctx.lineTo(0, screenWidth /10);
        aw.ctx.fill();



        let start = screenWidth / 10;
        let spacing = start;

        for(let i = 0; i < 4; i++)
        {
            aw.drawText({
                x: start + i*spacing, y: start + i * spacing, 
                text: 'BACK...', 
                color: '#000', 
                fontSize: spacing, fontStyle: 'bold', textAlign: 'left', textBaseline: 'bottom'
            });
        }

        aw.drawText({
            x: start + 4 * spacing, y: start + 4 * spacing, 
            text: 'GONE!', 
            color: '#000', 
            fontSize: spacing, fontStyle: 'bold', textAlign: 'left', textBaseline: 'bottom'
        });
        aw.drawText({
            x: screenWidth / 2, y: start + 4 * spacing + 5, 
            text: 'HOME RUN DERBY', 
            color: '#000', 
            fontSize: spacing/2, fontStyle: 'bold', textAlign: 'center', textBaseline: 'top'
        });

        aw.drawText({
            x: screenWidth/2, y: screenHeight - 5, 
            text: 'Tap to start', 
            color: '#d00', 
            fontSize: screenHeight / 20, fontStyle: 'bold', textAlign: 'center', textBaseline: 'bottom'
        });

        aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    postRender()
    {
    }
    preUpdate(deltaTime)
    {
        if(aw.mouseButtonsJustPressed[0] || aw.keysJustPressed[' '])
        {
            aw.switchState(new menuState());
        }
    }
    postUpdate(deltaTime)
    {
    }
}
