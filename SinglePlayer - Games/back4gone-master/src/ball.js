
class Ball 
{
    constructor()
    {
        this.pitchStart = new Vec3(0, 2, 60.5 * foot);
        this.radius = 0.038;
        this.SetPosition(this.pitchStart);

        this.age = 0;
        this.delta = new Vec3(0, 0, 0);
        this.pitching = false;
        this.isHit = false;
        this.bounced = false;
        this.onTee = false;
        this.outOfPark = false;
        this.swingTime = 0;
        this.timeAtDirt = 0;
        this.timeAtPlate = 0;
        this.swingPoint = {x: 0, y: 0};
        this.spinVector = new Vec3(0, 0, 0);
        this.floor = 0;
    }

    SetPosition(pos)
    {
        this.pos = pos.Copy();
    }

    GetShadowPos()
    {
        return new Vec3(this.pos.x, this.floor, this.pos.z);
    }
    GetRadiusPos()
    {
        return new Vec3(this.pos.x + this.radius, this.pos.y, this.pos.z);
    }

    intersects(a, b, c, d, p, q, r, s) 
    {
        let det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) 
        {
            return false;
        } 
        else 
        {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }

    raysIntersect(r1, r2)
    {
        return this.intersects(
            r1.points[0].x, r1.points[0].y, 
            r1.points[1].x, r1.points[1].y, 
            r2.points[0].x, r2.points[0].y, 
            r2.points[1].x, r2.points[1].y
        );
          
    }

    IsFoul()
    {
        return Math.abs(this.pos.x) > this.pos.z;
    }


    Update(dt, gameState)
    {
        this.age += dt;
        let newPos = this.pos.Add(this.delta.Scale(dt));
        if(!gameState.wallSections)
        {
            return;
        }
        if(this.onTee)
        {
            this.screenPointAtPlate = gameState.WorldToScreen(this.pos);
            this.timeAtPlate = this.age;
        }
        else
        {
            // drag
            if(this.pos.y > this.floor + this.radius / 2)
            {
                let cd = 0.35;
                let density = 1.23;
                let a = 0.00426;
                let weight = 0.149;
                let vs = this.delta.LengthSq();
                let drag = this.delta.Normalize().Scale(cd * density * a * vs * 0.5 / weight * dt);
                this.delta.SubFromSelf(drag);
            }
            else
            {
                this.delta = this.delta.Scale(0.99);
                let lsq = this.delta.LengthSq();
                if(lsq < 1)
                {
                    this.delta = new Vec3(0, 0, 0);
                }
            }

            // magnus
            let magnusFactor = 0.1;
            let mf = this.delta.Cross(this.spinVector).Scale(magnusFactor * dt);
            this.delta = this.delta.Add(mf);


            // hit wall?
            if(this.isHit)
            {
                let ray = {points: [
                    {x: this.pos.x, y: this.pos.z},
                    {x: newPos.x, y: newPos.z},
                ]};
                for(let i = 0; i < gameState.wallSections.length; i++)
                {
                    let section = gameState.wallSections[i];
                    let intersects = this.raysIntersect(ray, section);
                    if(intersects)
                    {
                        if(this.pos.y > section.height)
                        {
                            if(section.fair)
                            {
                                if(this.bounced)
                                {
                                    if(!this.groundRuleDouble && !this.homeRun)
                                    {
                                        gameState.AddBigText(`GROUND RULE DOUBLE!`, '#fff', 0.25, 1.0);
                                        this.groundRuleDouble = true;
                                    }
                                }
                                else
                                {
                                    if(!this.homeRun)
                                    {
                                        this.minDistance = this.pos.Length();
                                        gameState.AddBigText(`GONE!`, '#fff', 0.5, 2.0);
                                        gameState.hrSound.play();
                                        this.homeRun = true;
                                    }
                                }
                            }
                            if(section.toggleOutOfPark)
                            {
                                this.outOfPark = !this.outOfPark;
                            }
                            if(section.newFloor)
                            {
                                this.floor = section.height;
                                this.outOfPark = false;
                            }
                            if(section.overMsg)
                            {
                                gameState.AddBigText(section.overMsg, '#fff', 0.5, 2.0);
                            }
                        }
                        if(section.height > this.pos.y && this.pos.y >= section.minHeight)
                        {
                            this.hitWall = true;
                            newPos = this.pos.Copy();   // return ball to previous position

                            let sectionVector = new Vec3(section.points[1].x - section.points[0].x, 0, section.points[1].y - section.points[0].y).Normalize();

                            if(sectionVector.x == 0)
                            {
                                // vertical wall
                                this.delta.x *= -1;
                            }
                            else if(sectionVector.z == 0)
                            {
                                // horizontal wall
                                this.delta.z *= -1;
                            }
                            else
                            {
                                let sectionNormalVector = sectionVector.Copy().Normalize();
                                sectionNormalVector.x = -sectionVector.z;
                                sectionNormalVector.z = sectionVector.x;
    
                                let nd = this.delta.Reflect(sectionNormalVector); 
                                this.delta = nd.Scale(0.9);
                            }

                            if(section.msg)
                            {
                                gameState.AddBigText(section.msg, '#fff', 0.25, 2);
                            }

                            break;
                        }
                    }
                }

            }

            if(this.isHit && !this.bounced && !this.outOfPark && !this.homeRun)
            {
                let distance = this.pos.Length()/foot;

                if(!this.IsFoul())
                {
                    let lane = 2 - Math.floor(Math.abs(this.hitAngle - 90) / 18);
                    let backDistances = [
                        250, 275, 300, 325, 350, 375,
                    ];
                    for(let i = lane; i < backDistances.length; i++)
                    {
                        if(distance > backDistances[i] && this.backMsg < backDistances[i] && this.pos.y > 15 * foot)
                        {
                            this.backMsg = backDistances[i];
                            gameState.AddBigText('BACK...', '#fff', 0, 0.1);
                            gameState.backSounds[i-lane].play();
                            break;
                        }
                    }
                }
            }

            // bounce?
            if(newPos.y <= this.floor + this.radius / 2)
            {
                newPos.y = this.floor + this.radius / 2;
                this.delta.y = -this.delta.y / 3;
                if(this.delta.y < 0.25)
                {
                    this.delta.y = 0;
                }
                else
                {
                    this.delta.x *= 0.9;
                    this.delta.z *= 0.9;
                }
                if(this.isHit && !this.bounced)
                {
                    this.distance = this.pos.Length();
                    if(this.homeRun)
                    {
                        let feet = Math.max(this.minDistance, this.distance)/foot;
                        // in bullpen?
                        if(this.pos.x > kBattersEyeLower[4] && this.pos.x < kBullpenWalls[0] && this.pos.z < kBullpenWalls[3])
                        {
                            gameState.AddBigText(`IN THE BULLPEN!`, '#fff', 0, 3);
                        }
                        else if(this.pos.x < kBattersEyeLower[0] && this.pos.x > kBeachWalls[0] && this.pos.z < kBeachWalls[3])
                        {
                            gameState.AddBigText(`INTO THE BEACH!`, '#fff', 0, 3);
                        }
                        gameState.AddSmallText(`${feet.toFixed(0)}'`, '#fff', 3);
                    }
                    this.bounced = true;
                }
                if(this.outOfPark && (!this.homeRun || this.bounced))
                {
                    this.delta = new Vec3(0, 0, 0);
                }
            }
            else if(newPos.y > this.radius / 2)
            {
                // gravity
                this.delta.y -= dt * 9.8;
            }
            
            this.SetPosition(newPos);

            // get timeAtDirt
            let dirtZ = foot * 16;
            if(this.pitching && this.pos.z >= dirtZ)
            {
                this.timeAtDirt = this.age;
            }

            // crossing plate?
            if(newPos.z < plateWidth && !this.isHit && this.pitching && this.timeAtPlate == 0)
            {
                this.screenPointAtPlate = gameState.WorldToScreen(this.pos);
                this.timeAtPlate = this.age;

                this.strike = (this.pos.y >= 2 * foot && this.pos.y < 4 * foot && this.pos.x >= -halfPlateWidth && this.pos.x <= halfPlateWidth);
            }

            // no swing?
            if(this.pitching && newPos.z < -1.5 && !this.isHit)
            {
                this.pitching = false;
                this.noSwing = true;
            }
        }

        if(this.swingTime != 0 && !this.isHit)
        {
            // calculate hit
            if(this.timeAtPlate == 0)
            {
                let timeToPlate = (this.pos.z - plateWidth) / -this.delta.z;
                this.timeAtPlate = this.age + timeToPlate;
                let pos = this.pos.Add(this.delta.Scale(timeToPlate));
                let screenPointNow = gameState.WorldToScreen(this.pos);
                this.screenPointAtPlate = gameState.WorldToScreen(pos);
            }

            let perfectTiming = this.timeAtPlate;
            let timing = (this.swingTime - perfectTiming) / ((this.timeAtPlate - this.timeAtDirt) / 2);
            if(this.onTee)
            {
                timing = Math.sin(-3 * Math.random() * QTAU);
            }
            let dx = (this.swingPoint.x - this.screenPointAtPlate.x) / (screenWidth / 4);
            let dy = (this.screenPointAtPlate.y - this.swingPoint.y) / (screenHeight / 4);

            if(this.Hit(timing, dx, dy))
            {
                this.isHit = true;
                let m = this.delta.Length() / MPH_TO_MPS;
                this.pitching = false;
                // console.log(`new delta = ${this.delta.x},${this.delta.y},${this.delta.z}. ${m} mph`);
            }
            else
            {
                this.swingTime = 0;
                this.missedSwing = true;
                this.pitching = this.pos.z > 0;
            }
            this.onTee = false;
            //gameState.isPaused = true;
        }
    }

    SetSwingPoint(pos)
    {
        // console.log(`swing point = ${pos.x}, ${pos.y}`);
        this.swingPoint = {x: pos.x, y: pos.y};
        this.swingTime = this.age;
    }

    SetAtPos(pos)
    {
        this.onTee = true;
        this.pitching = false;
        this.swingTime = 0;
        this.isHit = false;
        this.delta = new Vec3(0, 0, 0);
        this.floor = 0;
        this.missedSwing = false;
        this.noSwing = false;
        this.outOfPark = false;
        this.homeRun = false;
        this.distance = 0;
        this.backMsg = 0;
        this.minDistance = 0;
        this.groundRuleDouble = false;
        this.SetPosition(pos);
    }

    SetOnMound()
    {
        this.SetAtPos(this.pitchStart);
    }

    GetProjectedPlatePos()
    {
        let pos = this.pos.Copy();
        if(!this.pitching || this.delta.z == 0)
        {
            return pos;
        }
        let t = -(pos.z - plateWidth) / this.delta.z;
        pos.x += this.delta.x * t;
        pos.z += this.delta.z * t;
        pos.y += this.delta.y * t;
        return pos;
    }

    Pitch(gameState)
    {
        if(this.pitching)
        {
            return;
        }
        this.noSwing = false;
        this.missedSwing = false;
        this.outOfPark = false;
        this.onTee = false;
        this.floor = 0;
        
        this.SetPosition(this.pitchStart);

        let SpeedAndHeight = [
            // fastballs
            {minSpeed: 71, maxSpeed: 75, minHeight: 1.6, maxHeight: 2.3},
            {minSpeed: 76, maxSpeed: 80, minHeight: 1.5, maxHeight: 2.2},
            {minSpeed: 81, maxSpeed: 85, minHeight: 1.5, maxHeight: 2.0},
            {minSpeed: 86, maxSpeed: 90, minHeight: 1.5, maxHeight: 1.9},
            {minSpeed: 91, maxSpeed: 95, minHeight: 1.5, maxHeight: 1.8},
            {minSpeed: 96, maxSpeed: 101, minHeight: 1.5, maxHeight: 1.7},

            // curveballs
            {minSpeed: 65, maxSpeed: 70, minHeight: 2.5, maxHeight: 3.1, curve: true},
            {minSpeed: 71, maxSpeed: 75, minHeight: 2.3, maxHeight: 3, curve: true},
            {minSpeed: 76, maxSpeed: 80, minHeight: 2.2, maxHeight: 2.9, curve: true},
            {minSpeed: 81, maxSpeed: 85, minHeight: 2.2, maxHeight: 2.7, curve: true},
            {minSpeed: 86, maxSpeed: 90, minHeight: 2.2, maxHeight: 2.6, curve: true},
        ];
        let pitchMax = SpeedAndHeight.length;
        if(gameState.homeRuns == 0)
        {
            pitchMax = 6;
        }

        let r = ~~(Math.random() * pitchMax);
        let pitchType = SpeedAndHeight[r];

        let insideOut = Math.random();
        let x = -halfPlateWidth + insideOut * plateWidth;
        this.pitchTarget = new Vec3(x, 2, 0);

        this.spinVector = new Vec3(-1, 0, 0);
        if(pitchType.curve)
        {
            this.pitchTarget.x += 7.5*foot;
            this.spinVector.x = 1;
            this.spinVector.y = -5;
        }



        this.pitchMph = pitchType.minSpeed + Math.random() * (pitchType.maxSpeed - pitchType.minSpeed);
        this.pitchTarget.y = pitchType.minHeight + Math.random() * (pitchType.maxHeight - pitchType.minHeight);

        let v = this.pitchMph * MPH_TO_MPS;
        this.delta = this.pitchTarget.Sub(this.pitchStart).Normalize().Scale(v);

        this.pitching = true;
        this.isHit = false;
        this.bounced = false;
        this.timeAtPlate = 0;
    }

    Hit(timing, dx, dy)
    {
        let mph = 115;
        timing = timing !== undefined ? timing : 0;
        dx = dx !== undefined ? dx : 0;
        dy = dy !== undefined ? dy : 0;

        let delta = new Vec3(0, 0, 0);
        let launchAngle = 35;
        if(dy > 1 || dy < -1)
        {
            return false;
        }
        else
        {
            if(dy > 0)
            {
                launchAngle -= dy * 40;
            }
            else if(dy < 0)
            {
                launchAngle -= dy * 67;
            }
        }

        if(dx > 1 || dx < -1)
        {
            return false;
        }
        else
        {
            mph -= Math.abs(Math.sin(Math.PI * dx / 4) * 70);
        }

        let hitAngle = QTAU;
        // hit angle is partially determined by location of pitch 
        let insideOutside = -this.pos.x / plateWidth;
        let insideOutsideInfluence = insideOutside * Math.PI/4;

        // and further influenced by timing
        let timingInfluence = 0;
        if(timing < -1)
        {
            return false;
        }
        else if(timing > 1)
        {
            return false;
        }
        else 
        {
            timingInfluence = timing * Math.PI / 4;
        }
        hitAngle += timingInfluence + insideOutsideInfluence;
        
        // calculate new spin vector
        this.spinVector.x = Math.sqrt(1 - timing * timing);
        this.spinVector.y = timing * 2;
        this.spinVector.z = 0;

        delta.y = Math.sin(launchAngle * kDegToRad);
        delta.x = delta.z = Math.cos(launchAngle * kDegToRad);
        delta.x *= Math.cos(hitAngle);
        delta.z *= Math.sin(hitAngle);

        this.hitAngle = hitAngle * kRadToDeg;
        // console.log(`hitAngle = ${this.hitAngle}`);
        this.delta = delta.Normalize().Scale(mph * MPH_TO_MPS);
        this.bounced = false;
        this.floor = 0;
        // console.log(`launch angle = ${launchAngle}`);
        return true;
    }

}