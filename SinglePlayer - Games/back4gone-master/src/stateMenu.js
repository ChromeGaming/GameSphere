// stateMenu.js
function roundedRect(x, y, width, height, radius, color)
{
    aw.ctx.save();
    aw.ctx.fillStyle = color;
    aw.ctx.strokeStyle = color;
    aw.ctx.lineJoin = 'round';
    aw.ctx.lineWidth = radius;
    aw.ctx.strokeRect(x + radius/2 - width/2, y + radius/2 - height/2, width-radius, height-radius);
    aw.ctx.fillRect(x + radius/2 - width/2, y + radius/2 - height/2, width-radius, height-radius);
    aw.ctx.restore();
}

class menuState extends baseState
{
    constructor()
    {
        super();

        kBrushes.brickBrush = makeBrush(brickColors);
        kBrushes.sandBrush = makeBrush(sandColors);
        kBrushes.crowdBrush = makeCrowdBrush();


        kStadiumViews.leftFieldLineView = new StadiumView(kViewTypes.leftFieldLine);
        // kStadiumViews.homePlateView = new StadiumView(kViewTypes.homePlate);
        kStadiumViews.rightFieldLineView = new StadiumView(kViewTypes.rightFieldLine);
        kStadiumViews.battingView = new StadiumView(kViewTypes.batting);

        this.views = [
            kStadiumViews.leftFieldLineView,
            // kStadiumViews.homePlateView,
            kStadiumViews.rightFieldLineView,
            //kStadiumViews.battingView,
        ];
        this.currentViewIdx = 0;
        this.timeToNextView = 0;
        this.cx = 0;
        this.cy = 0;

        // buttons
        let buttonHeight = screenHeight / 10;
        let textHeight = buttonHeight / 2;
        this.rookieBtn = {
            x: screenHalfWidth, y: screenHeight / 4, 
            text: 'Rookie',
            fontSize: textHeight,
            textAlign: 'center', textBaseline: 'middle',
            bgColor: '#b00', color: '#fff',
            width: screenHalfWidth, height: buttonHeight,
        }
        this.minorsBtn = {
            x: screenHalfWidth, y: screenHeight / 2, 
            text: 'Minors',
            fontSize: textHeight,
            textAlign: 'center', textBaseline: 'middle',
            bgColor: '#b00', color: '#fff',
            width: screenHalfWidth, height: buttonHeight,
        }
        this.majorsBtn = {
            x: screenHalfWidth, y: 3*screenHeight / 4, 
            text: 'Majors',
            fontSize: textHeight,
            textAlign: 'center', textBaseline: 'middle',
            bgColor: '#b00', color: '#fff',
            width: screenHalfWidth, height: buttonHeight,
        }

        // create a new Web Audio API context
        let ac = aw.createAudioContext();
        if(ac)
        {
            // set the playback tempo (120 beats per minute)
            let melody = [
                // Take me out to the ball game
                'G3 h',
                'G4 q',
                'E4 q',
                'D4 q',
                'B3 q',
                'D4 hq',
                'A3 hq',

                // Take me out with the crowd
                'G3 h',
                'G4 q',
                'E4 q',
                'D4 q',
                'B3 q',
                'D4 hhq',
                
                // Buy me some peanuts and Cracker Jack
                'E4 q',
                'D#4 q',
                'E4 q',
                'B3 q',
                'C4 q',
                'D4 q',
                'E4 h',
                'C4 q',
                'A3 hq',

                // I don't care if I ever get back
                'E4 h',
                'E4 q',
                'E4 q',
                'F#4 q',
                'G4 q',
                'A4 q',
                'F#4 q',
                'E4 q',
                'D4 q',

                // Let me root root root for the home team
                'B3 q',
                'A3 q',
                'G3 h',
                'G4 q',
                'E4 q',
                'D4 q',
                'B3 q',
                'D4 hq',
                'A3 h',

                // if they don't win it's a shame
                'A3 q',
                'G3 h',
                'A3 q',
                'B3 q',
                'C4 q',
                'D4 q',
                'E4 hq',
                '- q',

                // For it's one, two, three strikes you're out
                'E4 q',
                'F#4 q',
                'G4 he',
                'G4 he',
                'G4 q',
                'F#4 q',
                'E4 q',
                'D4 q',

                // at the old ball game
                'C#4 q',
                'D4 q',
                'E4 hq',
                'F#4 hq',
                'G4 wh',

                '- wwww',
            ];

            // create a new sequence
            this.sequence = new Sequence( ac, melody);

            this.sequence.createCustomWave([-0.8, 1, 0.8, 0.8, -0.8, -0.8, -1]);
            this.sequence.staccato = 0.5;
            // disable looping
            this.sequence.loop = false;
        }
    }

    containsMouse(rect, pos)
    {
        let left = rect.x - rect.width/2;
        let top = rect.y - rect.height/2;
        return (pos.x >= left && pos.x < left + rect.width 
            && pos.y >= top && pos.y < top + rect.height);
    }

    enter()
    {
        // play it
        if(this.sequence)
        {
            this.sequence.play();
        }
        this.minorsBtn.bgColor = playerStats[0].mostHr > 0 ? '#b00' : '#666';
        this.majorsBtn.bgColor = playerStats[1].mostHr > 0 ? '#b00' : '#666';
    }

    exit()
    {
        if(this.sequence)
        {
            this.sequence.stop();
        }
    }

    drawButton(btn)
    {
        roundedRect(btn.x, btn.y, btn.width, btn.height, 20, btn.bgColor);
        aw.drawText(btn);
    }

    preRender()
    {
        aw.ctx.setTransform(1, 0, 0, 1, -this.cx, -this.cy);
        aw.ctx.filter = 'blur(4px)';
        this.views[this.currentViewIdx].MakeCanvas();
        aw.ctx.drawImage(this.views[this.currentViewIdx].canvasInfo.canvas, 0, 0);
        aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
        aw.ctx.filter = 'none';
        this.drawButton(this.rookieBtn);
        let text = (playerStats[0].mostHr > 0) ? `MOST HR: ${playerStats[0].mostHr}   LONGEST HR: ${playerStats[0].longestHr.toFixed(0)}` : 'START HERE'
        aw.drawText({
            x: screenHalfWidth, y: this.rookieBtn.y + 2*this.rookieBtn.height/5,
            text: text,
            textAlign: 'center', textBaseline: 'middle',
            fontSize: screenHeight/80,
            color: '#fff',
        })

        this.drawButton(this.minorsBtn);
        text = (playerStats[0].mostHr > 0) ? `MOST HR: ${playerStats[1].mostHr}   LONGEST HR: ${playerStats[1].longestHr.toFixed(0)}` : 'HIT A HR IN ROOKIE TO UNLOCK'
        aw.drawText({
            x: screenHalfWidth, y: this.minorsBtn.y + 2*this.minorsBtn.height/5,
            text: text,
            textAlign: 'center', textBaseline: 'middle',
            fontSize: screenHeight/80,
            color: '#fff',
        })

        this.drawButton(this.majorsBtn);
        text = (playerStats[1].mostHr > 0) ? `MOST HR: ${playerStats[2].mostHr}   LONGEST HR: ${playerStats[2].longestHr.toFixed(0)}` : 'HIT A HR IN MINORS TO UNLOCK'
        aw.drawText({
            x: screenHalfWidth, y: this.majorsBtn.y + 2*this.majorsBtn.height/5,
            text: text,
            textAlign: 'center', textBaseline: 'middle',
            fontSize: screenHeight/80,
            color: '#fff',
        })


    }


    nextView()
    {
        this.currentViewIdx = ~~(Math.random() * this.views.length);
        let view = this.views[this.currentViewIdx];

        this.timeToNextView = 5;
        let rx = (view.canvasWidth - screenWidth);
        let ry = (view.canvasHeight - screenHeight);
        this.bounds = {x: 0, y: 0, maxx: rx, maxy: ry};

        if(rx < 0)
        {
            this.bounds.x = rx;
            this.bounds.maxx = 0;
            this.cx = Math.random() * rx;
        }
        else
        {
            this.cx = 25 + Math.random() * (rx - 50);
        }
        if(ry < 0)
        {
            this.bounds.y = ry;
            this.bounds.maxy = 0;
            this.cy = Math.random() * ry;
        }
        else
        {
            this.cy = 25 + Math.random() * (ry - 50);
        }

        this.dx = -25 + ~~(Math.random() * 2) * 50;
        this.dy = -25 + ~~(Math.random() * 2) * 50;
    }

    preUpdate(deltaTime)
    {
        this.timeToNextView -= deltaTime;
        if(this.timeToNextView <= 0)
        {
            this.nextView();
        }

        this.cx += this.dx * deltaTime;
        this.cy += this.dy * deltaTime;
        if(this.cx < this.bounds.x || this.cx >= this.bounds.maxx)
        {
            this.dx *= -1;
        }
        if(this.cy < this.bounds.y || this.cy >= this.bounds.maxy)
        {
            this.dy *= -1;
        }

        if(aw.mouseButtonsJustPressed[0])
        {
            let skill = undefined;
            if(this.containsMouse(this.rookieBtn, aw.mousePos))
            {
                skill = 0;
            }
            if(this.containsMouse(this.minorsBtn, aw.mousePos) && playerStats[0].mostHr > 0)
            {
                skill = 1;
            }
            if(this.containsMouse(this.majorsBtn, aw.mousePos) && playerStats[1].mostHr > 0)
            {
                skill = 2;
            }
            if(skill !== undefined)
            {
                aw.switchState(new gameState(skill));
            }
        }
    }

}

