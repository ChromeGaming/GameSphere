

class gameState extends baseState
{
    constructor(skill)
    {
        super();

        this.skill = skill;
        this.timeFactor = [0.25, 0.5, 1][skill];
        this.follow = true;
        this.scalex = 1;
        this.scaley = 1;
        this.center = {x: 0 * this.scalex + screenWidth / 2, y: 0 * this.scaley + screenHeight};
        this.currentView = kStadiumViews.battingView;
        this.viewMatrix = new Matrix4x4(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, 0));

        let aspectRatio = screenWidth / screenHeight;
        this.screenHalfWidthOverAspectRatio = screenHalfWidth / aspectRatio;
        this.viewPlaneHalfWidth = aspectRatio;
        this.viewPlaneHalfHeight = 1.0;

        this.ball = new Ball();
        this.ball.SetOnMound();
        this.autoPitch = true;

        this.wallSections = kStadiumViews.battingView.GetWallSections();

        this.currentView = kStadiumViews.battingView;
        this.changeViewTimer = 0;
        this.pitchTimer = 1;
        this.recordTimer = 0;
        this.recordText = [];

        this.instructions = [
            'Hit as many home runs as',
            'you can before making 3',
            'outs. Any missed strike',
            'or non-home run is an out.',
            "",
            'Tap...',

        ];

        this.SetCameraLookAt(
            new Vec3(0, 2, -5),
            new Vec3(0, 1, 0),
            new Vec3(0, 1, 0));

            
    }

    makeSoundSequence(ac, melody)
    {
        let seq = new Sequence(ac, melody);
        seq.loop = false;
        return seq;
    }

    initSounds()
    {
        let ac = aw.createAudioContext();
        this.backSounds = [
            this.makeSoundSequence(ac, ['D3 e']),
            this.makeSoundSequence(ac, ['E3 e']),
            this.makeSoundSequence(ac, ['F3 e']),
            this.makeSoundSequence(ac, ['G3 e']),
            this.makeSoundSequence(ac, ['A3 e']),
            this.makeSoundSequence(ac, ['B3 e']),
        ];

        this.hrSound = this.makeSoundSequence(ac, ['D4 s', 'F#4 q']);
        this.outSound = this.makeSoundSequence(ac, ['D4 s', 'D3 q']);
    }

    SetCameraLookAt(pos, target, up)
    {
        let zAxis = pos.Sub(target).Normalize();
        let xAxis = up.Cross(zAxis).Normalize();
        let yAxis = zAxis.Cross(xAxis).Normalize();

        this.cameraPos = pos;
        this.cameraDir = zAxis.Invert();

        // Invert = transpose for orthonormal matrices (basis vectors are normal and orthogonal).
        // We could multiply basis TM against -translation TM, but quicker to just calculate final column
        // since everything else will cancel in normal matrix multiply.
        this.viewMatrix.c0 = new Vec3(xAxis.x, yAxis.x, zAxis.x);
        this.viewMatrix.c1 = new Vec3(xAxis.y, yAxis.y, zAxis.y);
        this.viewMatrix.c2 = new Vec3(xAxis.z, yAxis.z, zAxis.z);
        this.viewMatrix.c3 = new Vec3(-pos.Dot(xAxis), -pos.Dot(yAxis), -pos.Dot(zAxis));
    }

    PerspectiveProjection(p)
    {
        let scale = 3.5;    // Focal length scaling
        return new Vec3(screenHalfWidth + (((p.x*scale) / -p.z) * this.screenHalfWidthOverAspectRatio),
                        screenHalfHeight - (((p.y*scale) / -p.z) * screenHalfHeight),
                        -p.z);
    }

    drawInstructions()
    {
        aw.ctx.fillStyle = 'rgba(0, 0, 0, 0.5';
        aw.ctx.fillRect(0, 0, screenWidth, screenHeight);

        let fontSize = Math.min(screenWidth / 12, screenHeight / 40);
        let y = screenHeight/3;
        let height = (this.instructions.length + 2) * fontSize;
        roundedRect(screenHalfWidth, y, fontSize * 13, height, fontSize, kBrushes.dirtBrush);
        y -= (this.instructions.length-1) * fontSize /2;
        for(let i = 0; i < this.instructions.length; i++)
        {
            aw.drawText({
                x: screenHalfWidth, y:y,
                text: this.instructions[i],
                textAlign: 'center', textBaseline: 'middle',
                color: '#fff', fontSize: fontSize,
            });
            y += fontSize;
        }
    }

    AddRecord(text)
    {
        this.recordText.push(text);
    }

    updateRecord(dt)
    {
        this.recordTimer -= dt;
        if(this.recordTimer <= 0 && this.recordText.length > 0)
        {
            this.currentRecordText = this.recordText.shift();   
            this.recordTimer = 3;
        }
    }

    drawRecord()
    {
        if(this.recordTimer < 0)
        {
            return;
        }
        let fontHeight = screenHeight / 40;
        let spacing = fontHeight * 1.02;
        let scale = (this.recordTimer > 2.75) ? (0.25 - this.recordTimer + 2.75)/0.25 : 1;
        let width = screenWidth * 0.8;
        aw.ctx.setTransform(scale, 0, 0, scale, screenHalfWidth, screenHalfHeight);
        roundedRect(0, 0, width, fontHeight * 4, fontHeight, '#d00');
        aw.drawText({
            x: 0, y: -spacing,    
            text: levelText[this.skill],
            fontSize: fontHeight, 
            textAlign: 'center', textBaseline: 'middle',
            color: '#fff'
        });

        aw.drawText({
            x: 0, y: 0,    
            text: `NEW RECORD!`,
            fontSize: fontHeight, 
            textAlign: 'center', textBaseline: 'middle',
            color: '#fff'
        });

        aw.drawText({
            x: 0, y: spacing,    
            text: this.currentRecordText,
            fontSize: fontHeight, 
            textAlign: 'center', textBaseline: 'middle',
            color: '#fff'
        });
    }

    enter()
    {
        this.pitches = 0;
        this.homeRuns = 0;
        this.farthest = 0;
        this.lives = 3;
        this.longest = 0;
        this.newMostHrRecord = false;
        this.newLongestRecord = false;
        this.showInstructions = true;
        this.initSounds();
    }

    WorldToScreen(p)
    {
        let pWorld = this.viewMatrix.TransformPoint(p);
        return this.PerspectiveProjection(pWorld);
    }

    drawObject(points, fillStyle, lineStyle)
    {
        this.hctx.save();
        this.hctx.fillStyle = fillStyle;
        this.hctx.beginPath();
        for(let i = 0; i < points.length; i++)
        {
            let v = this.WorldToScreen(points[i]);
            if(i == 0)
            {
                this.hctx.moveTo(v.x, v.y);
            }
            else
            {
                this.hctx.lineTo(v.x, v.y);
            }
        }
        this.hctx.fill();

        if(lineStyle !== undefined)
        {
            this.hctx.lineStyle = lineStyle;
            this.hctx.lineWidth = 2;
            this.hctx.beginPath();
            for(let i = 0; i < points.length; i++)
            {
                let v = this.WorldToScreen(points[i]);
                if(i == 0)
                {
                    this.hctx.moveTo(v.x, v.y);
                }
                else
                {
                    this.hctx.lineTo(v.x, v.y);
                }
            }
            this.hctx.stroke();
        }
        this.hctx.restore();
    }

    preRender()
    {
        kStadiumViews.battingView.MakeCanvas();
        kStadiumViews.leftFieldLineView.MakeCanvas();
        kStadiumViews.rightFieldLineView.MakeCanvas();
        // kStadiumViews.homePlateView.MakeCanvas();

        aw.ctx.fillStyle = '#888';
        aw.ctx.fillRect(0, 0, screenWidth, screenHeight);

        this.currentView.Render(aw.ctx, this.lives > 0 ? this.ball : null);
        this.drawBat();
        if(this.showInstructions)
        {
            this.drawInstructions();
        }

        // draw pitch timer
        if(this.currentView == kStadiumViews.battingView 
            && this.recordTimer <= 0
            && this.pitchTimer > 0
            && this.lives > 0
            && !this.showInstructions)
        {
            let rect = {x: screenWidth * .4, y: screenHeight / 4, width: screenWidth * 0.2, height: screenHeight/50};
            aw.ctx.fillStyle = '#000';
            aw.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            let width = (1 - this.pitchTimer) * screenWidth * 0.2;
            aw.ctx.fillStyle = '#f22';
            aw.ctx.fillRect(rect.x, rect.y, width, rect.height);
        }

        let statusHeight = screenHeight / 20;
        aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
        aw.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        aw.ctx.fillRect(0, 0, screenWidth, statusHeight);
        let h = this.ball.pos.y / foot;
        let feet = Math.floor(h);
        let inches = (h - feet) * 12;
        let v = this.ball.delta.Length() / MPH_TO_MPS;

        aw.drawText({
            x:10, y:statusHeight / 2, 
            text: `Outs: ${this.lives}`, 
            color:'#fff', fontSize:statusHeight * 0.4, 
            textAlign: 'left', textBaseline: 'middle'
        });
        aw.drawText({
            x:screenHalfWidth, y:statusHeight / 2, 
            text: `Homers: ${this.homeRuns}`, 
            color:'#fff', fontSize:statusHeight * 0.4, 
            textAlign: 'center', textBaseline: 'middle'
        });
        aw.drawText({
            x:screenWidth - 10, y:statusHeight / 2, 
            text: `Longest HR: ${this.longest.toFixed(0)}'`,
            color:'#fff', fontSize:statusHeight * 0.4, 
            textAlign: 'right', textBaseline: 'middle'
        });

        this.DrawBigText();
        this.drawRecord();
    }

    drawBat()
    {
        if(!this.batPos)
        {
            return;
        }
        let homePlatePos = kStadiumViews.battingView.WorldToScreen(new Vec3(0, 0, plateWidth));
        if(!this.platePPM)
        {
            let b = kStadiumViews.battingView.WorldToScreen(new Vec3(0, 1, plateWidth));
            let c = kStadiumViews.battingView.WorldToScreen(new Vec3(-1, 0, plateWidth));
    
            this.platePPM = {
                x: homePlatePos.x - c.x,
                y: homePlatePos.y - b.y,
            };
        }

        aw.ctx.fillStyle = '#00d';

        let minScreenX = screenWidth / 3;
        let maxScreenY = homePlatePos.y - this.platePPM.y * foot/2;

        let bdx = (Math.max(minScreenX, this.batPos.x) - homePlatePos.x);
        let bdy = -(Math.min(maxScreenY, this.batPos.y) - homePlatePos.y);
        let batTargetPos = new Vec3(bdx / this.platePPM.x, bdy / this.platePPM.y, plateWidth);


        let batTargetScreenPos = kStadiumViews.battingView.WorldToScreen(batTargetPos);
        let shoulders = new Vec3(1, 5 * foot, 0);
        let stb = batTargetPos.Sub(shoulders).Normalize();

        let batEndPos = batTargetPos.Add(stb.Scale(foot/2));
        let knobPos = batEndPos.Sub(stb.Scale(foot * 3));
        let theta = -QTAU - HTAU * this.batTime;
        let delta = new Vec3(Math.cos(theta), 0, Math.sin(theta));

        let curBatEnd = knobPos.Add(new Vec3(delta.x, delta.y, delta.z).Scale(foot * 3));
        let heightStart = knobPos.y;
        let heightProgress = Math.sin(this.batTime * Math.PI);
        let heightDelta = batEndPos.y - heightStart;
        curBatEnd.y = heightStart + heightProgress * heightDelta;

        let knobOnScreen = kStadiumViews.battingView.WorldToScreen(knobPos);
        let endOnScreen = kStadiumViews.battingView.WorldToScreen(curBatEnd);

        aw.ctx.beginPath();
        aw.ctx.strokeStyle = '#00f';
        aw.ctx.lineWidth = 15;
        aw.ctx.moveTo(knobOnScreen.x, knobOnScreen.y);
        aw.ctx.lineTo(endOnScreen.x, endOnScreen.y);
        aw.ctx.stroke();

        curBatEnd.y = 0;
        knobPos.y = 0;
        knobOnScreen = kStadiumViews.battingView.WorldToScreen(knobPos);
        endOnScreen = kStadiumViews.battingView.WorldToScreen(curBatEnd);

        aw.ctx.beginPath();
        aw.ctx.strokeStyle = '#000';
        aw.ctx.moveTo(knobOnScreen.x, knobOnScreen.y);
        aw.ctx.lineTo(endOnScreen.x, endOnScreen.y);
        aw.ctx.stroke();
    }

    UpdateBigText(dt)
    {
        if(!this.bigText)
        {
            return;
        }
        this.bigText.age += dt;
        if(this.bigText.age > this.bigText.maxAge)
        {
            delete this.bigText;
            return;
        }
    }

    DrawBigText()
    {
        if(!this.bigText)
        {
            return;
        }
        if(!this.bigText.size)
        {
            aw.ctx.font = 'bold 48px Arial';
            this.bigText.size = 48 / (aw.ctx.measureText(this.bigText.text).width / (screenWidth * 0.95));
        }
        let size = this.bigText.size;
        if(this.bigText.age < this.bigText.growing)
        {
            size = Math.max(0, Math.sin((this.bigText.age / this.bigText.growing) * QTAU));
            size *= this.bigText.size;
        }
        let y = this.bigText.y !== undefined ? this.bigText.y : 2*screenHeight/3;
        aw.ctx.save();
        aw.ctx.shadowColor = '#000';
        aw.ctx.shadowBlur = 20;
        aw.drawText({
            x: screenHalfWidth, y: y,
            text: this.bigText.text,
            fontSize: size, 
            textAlign: 'center', textBaseline: 'middle',
            color: this.bigText.color,
        });

        if(this.bigText.smallText)
        {
            aw.drawText({
                x: screenHalfWidth, y: y + this.bigText.size / 2 + 10,
                text: this.bigText.smallText,
                fontSize: 48, 
                textAlign: 'center', textBaseline: 'top',
                color: this.bigText.color,
            });
        }

        aw.ctx.restore();
    }

    AddBigText(text, color, growing, maxAge, y)
    {
        this.bigText = {
            text: text, 
            growing: growing,
            maxAge: maxAge,
            color: color,
            age: 0,
            y: y,
        };
    }

    AddSmallText(text, color, age)
    {
        if(!this.bigText)
        {
            this.AddBigText(text, color, 0, age);
        }
        else
        {
            this.bigText.smallText = text;
            if(this.bigText.age > this.bigText.growing)
            {
                this.bigText.age = this.bigText.growing;
            }
            this.bigText.maxAge = this.bigText.growing + age;
        }
    }

    LoseLife()
    {
        this.lives--;
        if(this.lives == 0)
        {
            this.AddBigText('GAME OVER!', '#dd0', 0.25, 10000, screenHalfHeight);
            savePlayerStats();
        }
        else
        {
            this.AddSmallText(`${this.lives} Out${this.lives>1?'s':''} Left`);
        }
        this.outSound.play();
    }

    RecordHomeRun()
    {
        this.homeRuns++;
        let feet = this.ball.distance/foot;
        if(feet > this.longest)
        {
            this.longest = feet;
        }
        if(feet > playerStats[this.skill].longestHr)
        {
            this.AddRecord(`LONGEST HR: ${feet.toFixed(0)} FEET!`);
            playerStats[this.skill].longestHr = feet;
        }
        if(this.homeRuns > playerStats[this.skill].mostHr)
        {
            playerStats[this.skill].mostHr = this.homeRuns;
            if(!this.newMostHrRecord)
            {
                this.newMostHrRecord = true;
                this.AddRecord(`MOST HR: ${this.homeRuns}!`);
            }
        }
    }

    preUpdate(dt)
    {
        this.updateRecord(dt);
        this.UpdateBigText(dt);
        let timeFactor = 1;

        if(this.showInstructions)
        {
            if(aw.mouseButtonsJustPressed[0])
            {
                this.showInstructions = false;
            }
            return;
        }

        if(this.ball.pitching)
        {
            timeFactor = this.timeFactor;
        }
        if(this.batTime !== undefined)
        {
            this.batTime += dt * 1/.1;

            if(this.ball.pitching && this.batTime > 0.5 && this.ball.swingTime == 0)
            {
                this.ball.SetSwingPoint(this.batPos);
                this.changeViewTimer = 0.5;
                this.follow = true;
            }

            if(this.batTime >= 1)
            {
                delete this.batTime;
                delete this.batPos;
            }
        }
        this.ball.Update(dt * timeFactor, this);

        if(this.autoPitch && this.pitchTimer > 0 && !this.ball.pitching && this.lives > 0 && this.recordTimer <= 0)
        {
            this.pitchTimer -= dt;
            if(this.pitchTimer <= 0)
            {
                this.ball.Pitch(this);
                delete this.bigText;
            }
        }

        if(this.ball.isHit)
        {
            if(this.changeViewTimer > 0)
            {
                this.changeViewTimer -= dt;
            }
            else
            {
                this.currentView = (this.ball.hitAngle < 90) ? kStadiumViews.leftFieldLineView : kStadiumViews.rightFieldLineView;
                // if(this.ball.homeRun)
                // {
                //     if(this.ball.pos.x > kBullpenRight && this.ball.pos.x < kBullpenLeft)
                //     {
                //         this.currentView = kStadiumViews.homePlateView;
                //     }
                //     if(this.ball.pos.x > kBeachRight && this.ball.pos.x < kBeachLeft)
                //     {
                //         this.currentView = kStadiumViews.homePlateView;
                //     }
                // }
            }
        }

        if(this.ball.isHit && (this.ball.delta.LengthSq() == 0 || (this.currentView.ballOffscreen && (this.ball.bounced || !this.ball.homeRun))))
        {
            if(this.ball.homeRun)
            {
                this.RecordHomeRun();
            }
            else if(this.lives > 0)
            {
                this.LoseLife();
            }

            this.ball.SetOnMound();
            this.currentView.ballOffscreen = false;
            this.currentView = kStadiumViews.battingView;
            this.follow = true;
            this.pitchTimer = 1;
        }

        // if(aw.keysJustPressed['p'])
        // {
        //     this.autoPitch = !this.autoPitch;
        //     this.currentView = kStadiumViews.battingView;
        // }

        // if(aw.keysJustPressed['f'])
        // {
        //     this.currentView.follow = !this.currentView.follow;
        // }
        // if(aw.keysJustPressed['l'])
        // {
        //     this.currentView = kStadiumViews.leftFieldLineView;
        // }
        // if(aw.keysJustPressed['r'])
        // {
        //     this.currentView = kStadiumViews.rightFieldLineView;
        // }
        // if(aw.keysJustPressed['h'])
        // {
        //     this.currentView = kStadiumViews.homePlateView;
        // }
        // if(aw.keysJustPressed['b'])
        // {
        //     this.currentView = kStadiumViews.battingView;
        // }
        // if(this.currentView != kStadiumViews.battingView)
        // {
        //     if(aw.keys['arrowleft'])
        //     {
        //         this.currentView.center.x -= dt * 300;
        //     }
        //     if(aw.keys['arrowright'])
        //     {
        //         this.currentView.center.x += dt * 300;
        //     }
        //     if(aw.keys['arrowup'])
        //     {
        //         this.currentView.center.y -= dt * 300;
        //     }
        //     if(aw.keys['arrowdown'])
        //     {
        //         this.currentView.center.y += dt * 300;
        //     }
        // }
        if(aw.mouseButtonsJustPressed[0])
        {
            if(this.lives == 0)
            {
                aw.switchState(new menuState());
                return;
            }

            let mousePos = {x: aw.mousePos.x, y: aw.mousePos.y};
            if(this.currentView == kStadiumViews.battingView && !this.ball.isHit)
            {
                this.batPos = mousePos;
                this.batTime = 0;
            }
            else if(this.currentView != kStadiumViews.battingView && this.ball.isHit && this.ball.bounced)
            {
                if(this.ball.homeRun)
                {
                    this.RecordHomeRun();
                }
                else
                {
                    this.LoseLife();
                }

                this.ball.SetOnMound();
                this.currentView = kStadiumViews.battingView;
                this.pitchTimer = 1;
                delete this.batPos;
            }
        }
        if((this.ball.missedSwing || this.ball.noSwing) && this.ball.pos.z < 0)
        {
            if(this.ball.missedSwing || this.ball.strike)
            {
                this.AddBigText('Strike!', "#f00", 0.25, 0.5);
                this.LoseLife();
            }
            else
            {
                this.AddBigText('Ball', "#0d0", 0, 0.5);
            }
            this.ball.SetOnMound();
            this.changeViewTimer = 0;
            this.currentView = kStadiumViews.battingView;
            this.pitchTimer = 1;  
            delete this.batPos;
        }
    }
}