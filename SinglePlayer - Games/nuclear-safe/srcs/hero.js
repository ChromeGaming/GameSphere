/////////////////////////////////////////////////////////////////
/////////////////////////Class For Hero//////////////////////////
/////////////////////////////////////////////////////////////////

class Hero {
    constructor(i,j,health,m=0){
        this.health = health;

        /////////////////////////
        //need to fix
    
        this.size = cellSize/6
        this.menu = m;

        this.angle = 0;

        /////////////////////////

        this.i = i
        this.j = j

        this.velX = 0
        this.velY = 0

        //this.w = 21;
        //this.h = 56;
        this.scale = this.size/21;
        this.width = this.size;
        this.height = -46*this.scale
        this.pos = {
            x:canvas.width/2-this.width/2,
            y:canvas.height/2-this.height/2
        }

        this.m = [0,0,0,0] //left, right, up, down

        //for collision
        this.friction = 1;

        this.roads = [];

        this.a = [0,this.width/1000,0,0,5] //animation = [{bobY,bobVel,bodyRotation,feet&handRotation,feet&handVel]
        this.d; //stores last dir (l & r)

        this.footSteps = [];
    }

    move(){
        if(click){
            click.x > canvas.width/2 ? this.m[1] = 1 : this.m[0] = 1;
            click.y > canvas.height/2 ? this.m[3] = 1 : this.m[2] = 1;
        }

        if(this.m[0]&&this.velX < 40)this.velX += 4; //is moving left?
        if(this.m[1]&&this.velX > -40)this.velX -= 4; //is moving right?
        if(this.m[2]&&this.velY < 20)this.velY += 2; //is moving up?
        if(this.m[3]&&this.velY > -20)this.velY -= 2; //is moving down?


        //is stopped x?
        if(!this.m[0] && !this.m[1]){
            if(this.velX > 0)this.velX = floor(this.velX*0.8)
            if(this.velX < 0)this.velX = Math.ceil(this.velX*0.8)
            //if(this.velX !=0)this.velX > 0 ? this.velX -= 4 : this.velX += 4; //slide to stop
        }

        //is stopped y?
        if(!this.m[2] && !this.m[3]){
            if(this.velY > 0)this.velY = floor(this.velY*0.8)
            if(this.velY < 0)this.velY = Math.ceil(this.velY*0.8)
            //if(this.velY !=0)this.velY > 0 ? this.velY -= 2 : this.velY += 2; //slide to stop
        }

        //move character

        hero.collision()

        x += (cellSize/60*this.velX/20)
        y += (cellSize/60*this.velY/20)

        //keep track of last movement (l,r)
        if(this.m[0])this.d = "l"
        if(this.m[1])this.d = "r"

        //update map co-ords
        this.i = getHeroPos(1)
        this.j = getHeroPos(0)



        //update roads around player
        this.roads = []
        //
        for(let i=-1; i<2; i++){
            for(let j=-1; j<2; j++){
                if(IsInBounds(floor(hero.i)+i,floor(hero.j)+j)){
                    let t = grid[floor(hero.i)+i][floor(hero.j)+j].type;
                    if(t == TYPES.ROAD || t == TYPES.PARK){
                        this.roads.push(grid[floor(hero.i)+i][floor(hero.j)+j])
                    }
                }
            }
        }
    }

    draw(){
        //animation code
        if(this.menu){
            this.angle += 0.3;
        }

        //if moving
        animate(this.a, (this.m[0]+this.m[1]+this.m[2]+this.m[3]))

        if(this.a[3] == 0 && (this.m[0]+this.m[1]+this.m[2]+this.m[3])){
            this.footSteps.push({i:this.i,j:this.j})
        }


        //drawing hero
        ctx.save()
        ctx.translate(this.d == "l" ? this.pos.x : this.pos.x+this.width,this.pos.y+this.height-5*this.scale)
        ctx.rotate(this.angle)

        let px = 0;
        let py = 0;

        if(this.menu){
            px = this.width/2
            py = this.height/2
        }

        svg(`c #000 1,g 0.1,r 0 47.8 21 8.2 1,g 1,c #51fe0e 0 0 1,s 10,c #ffc001 1,<t 0 ${-this.a[0]}, q ${this.a[2]},c #666 0 1,w 2,r 9 12 9.6 18 0 1,r 9 16.8 12 15 1,r 4.8 18 12 24 1,><t 0 ${this.a[0]},r 1.5 6 15 18 1,c #fff 1,r 1.5 13 8.6 8.8 1,c #3b3d3b 1,r 1.5 13.8 7.8 7.2 1,>s 4,c #666 1,<t 10.5 25,q ${this.a[3]/5},r -2.5 ${6+this.a[0]} 6 6 1,><t 10.5 40,q ${this.a[3]},r -7.5 7.5 6 3 1,><t 10.5 40,q ${-this.a[3]},r 1.5 7.5 6 3 1,>`, [px,py,this.d=="l"?this.scale:-this.scale,this.scale])
        ctx.restore()
        /* ctx.strokeStyle = "red"
        ctx.strokeRect(this.pos.x,this.pos.y,this.width,this.height)
        ctx.strokeRect(this.pos.x,this.pos.y,5,5)
        ctx.strokeRect(canvas.width/2,canvas.height/2,5,5) */
    }


    ////////////needs fixing/////////////
    collision(){
            for(let j=0; j<this.roads.length; j++){
                    let g = this.roads[j]
                    let gPos = {
                        x:x + (g.i-g.j) * cellSize,
                        y:y + (g.i+g.j) * cellSize/2
                    }

                    let neighbours = [
                        (IsInBounds(g.i-1,g.j) && grid[g.i-1][g.j].type !=TYPES.ROAD && grid[g.i-1][g.j].type !=TYPES.PARK) || (!IsInBounds(g.i-1,g.j)) ? 1 : 0,
                        (IsInBounds(g.i+1,g.j) && grid[g.i+1][g.j].type !=TYPES.ROAD && grid[g.i+1][g.j].type !=TYPES.PARK) || (!IsInBounds(g.i+1,g.j)) ? 1 : 0,
                        (IsInBounds(g.i,g.j-1) && grid[g.i][g.j-1].type !=TYPES.ROAD && grid[g.i][g.j-1].type !=TYPES.PARK) || (!IsInBounds(g.i,g.j-1)) ? 1 : 0,
                        (IsInBounds(g.i,g.j+1) && grid[g.i][g.j+1].type !=TYPES.ROAD && grid[g.i][g.j+1].type !=TYPES.PARK) || (!IsInBounds(g.i,g.j+1)) ? 1 : 0,
                        (IsInBounds(g.i+1,g.j+1) && grid[g.i+1][g.j+1].type !=TYPES.ROAD && grid[g.i+1][g.j+1].type !=TYPES.PARK) || (!IsInBounds(g.i+1,g.j+1)) ? 1 : 0,
                        (IsInBounds(g.i-1,g.j-1) && grid[g.i-1][g.j-1].type !=TYPES.ROAD && grid[g.i-1][g.j-1].type !=TYPES.PARK) || (!IsInBounds(g.i-1,g.j-1)) ? 1 : 0,
                    ]

                    let vel = {
                        x:cellSize/60*this.velX/20,
                        y:cellSize/60*this.velY/20
                    }

                    let pointsX = [gPos.x,gPos.x-cellSize,gPos.x,gPos.x+cellSize]
                    let pointsY = [gPos.y,gPos.y+cellSize/2,gPos.y+cellSize,gPos.y+cellSize/2]
                    let heroPoints = [this.pos.x-vel.x,this.pos.y-vel.y,this.pos.x+this.width-vel.x,this.pos.y-vel.y]

                    if(neighbours[5] && lineCircle(...heroPoints,pointsX[0],pointsY[0],10)){
                        let distance = {
                            y:this.pos.y-pointsY[0]-10,
                        }

                        y += distance.y-5

                        this.velY = -this.velY;
                    }

                    if(neighbours[4] && lineCircle(...heroPoints,pointsX[2],pointsY[2],10)){
                        let distance = {
                            y:this.pos.y-pointsY[2]+10,
                        }

                        y += distance.y+5

                        this.velY = -this.velY;
                    }

                    //top left
                    if(neighbours[0] && lineLine(...heroPoints,pointsX[0],pointsY[0],pointsX[1],pointsY[1])){
                        let p = lineLine(...heroPoints,pointsX[0],pointsY[0],pointsX[1],pointsY[1],1)
                        let distance = {
                            x:this.pos.x-p.x,
                            y:this.pos.y-p.y,
                        }

                        x += distance.x
                        y += distance.y

                        this.velX = -this.velX;
                        this.velY = -this.velY;
                    }
                    //top right
                    if(neighbours[2] && lineLine(...heroPoints,pointsX[0],pointsY[0],pointsX[3],pointsY[3])){
                        let p = lineLine(...heroPoints,pointsX[0],pointsY[0],pointsX[3],pointsY[3],1)
                        let distance = {
                            x:this.pos.x-(p.x-this.width),
                            y:this.pos.y-p.y,
                        }

                        x += distance.x
                        y += distance.y

                        this.velX = -this.velX;
                        this.velY = -this.velY;
                    }

                    //bottom left
                    if(neighbours[3] && lineLine(...heroPoints,pointsX[1],pointsY[1],pointsX[2],pointsY[2])){
                        let p = lineLine(...heroPoints,pointsX[1],pointsY[1],pointsX[2],pointsY[2],1)
                        let distance = {
                            x:this.pos.x-p.x,
                            y:this.pos.y-p.y,
                        }

                        x += distance.x
                        y += distance.y

                        this.velX = -this.velX;
                        this.velY = -this.velY;
                    }

                    //bottom right
                    if(neighbours[1] && lineLine(...heroPoints,pointsX[2],pointsY[2],pointsX[3],pointsY[3])){
                        let p = lineLine(...heroPoints,pointsX[2],pointsY[2],pointsX[3],pointsY[3],1)
                        let distance = {
                            x:this.pos.x-(p.x-this.width),
                            y:this.pos.y-p.y,
                        }

                        x += distance.x
                        y += distance.y

                        this.velX = -this.velX;
                        this.velY = -this.velY;
                    }
            }
    }

    ///////////////////////
    /* removeHealth (dmg = 1) {
        for(let i=0; i<dmg*3; i++){

            let index = {
                i:RandomRange(0,this.health.length,1),
                j:RandomRange(0,10,1)
            }

            if(this.detectIfDead())break;

            if(this.health[index.i][index.j])this.health[index.i][index.j] = 0;
            else i--;
        }
    } */

    removeHealth(dmg = 1){
        for(let i=0; i<dmg; i++){

            let index = {
                i:RandomRange(0,10,1),
                j:RandomRange(0,10,1)
            }

            if(this.detectIfDead())break;

            if(this.health[index.i][index.j])this.health[index.i][index.j] = 0;
            else i--;
        }
    }

    ////////////////////
    /* drawHealth (x,y,scale,index, color="red") {
        ctx.save()
        ctx.translate(x,y)
        ctx.rotate(45*Math.PI/180)
        ctx.lineWidth = 0.8;

        for(let t = 0; t < 30; t+=10){
            ctx.fillStyle = "rgba(0,0,0,0.4)"
            if(t == 20){
                ctx.fillRect((t-10)*scale,-10*scale,scale*10,scale*10)
            }else{
                ctx.fillRect(t*scale,0,scale*10,scale*10)
            }

            for (let i=t;i<t+10;i++) {
                for (let j=0;j<10;j++) {
                    if (this.health[i][j]) {
                        ctx.fillStyle = ctx.strokeStyle = color

                        ctx.beginPath()
                        if(t == 20){
                            ctx.rect((i-10)*scale,(j-10)*scale,scale,scale)
                        }else{
                            ctx.rect(i*scale,j*scale,scale,scale)
                        }
                        ctx.fill()
                        ctx.stroke()
                    }
                }
            }
            
        }

        ctx.restore()
    } */

    drawHealth (x,y,scale,index, color="#E31B23") {
        ctx.save()
        ctx.translate(x,y)
        ctx.lineWidth = 0.8;

        ctx.fillStyle = "rgba(0,0,0,0.4)"
        ctx.strokeStyle = "#98002e"
        ctx.lineWidth = 4;
        ctx.fillRect(0,0,scale*10,scale*10)
        ctx.strokeRect(-2,-2,scale*10+4,scale*10+4)

            for (let i=0;i<10;i++) {
                for (let j=0;j<10;j++) {
                    if (this.health[i][j]) {
                        ctx.fillStyle = color
                        ctx.fillRect(i*scale,j*scale,scale,scale)
                    }
                }
            }

        ctx.restore()
    }

    /////////////////////
    detectIfDead () {
        if(time > 630){
            return true
        }
        for (let i=0;i<10;i++) {
            for (let j=0;j<10;j++) {
                if (this.health[i][j]) {
                    return false
                }
            }
        }
        return true
    }

    //////////////////
}

function spawnHero(){
    //grab all available spawn locations
    let spawnLocations = findCells(TYPES.ROAD)
  
    //choose a random one
    let spawnLocation = spawnLocations[floor(Math.random()*spawnLocations.length)]

    let h = []
    for(let i = 0; i < 10; i++){
        h.push([1,1,1,1,1,1,1,1,1,1])
    }
    //spawn hero with co-ords
    hero = new Hero(spawnLocation.i,spawnLocation.j,h)

    //update map position to player pos
    x = -((spawnLocation.i-spawnLocation.j) * cellSize) + floor(canvas.width/2)
    y = -((spawnLocation.i+spawnLocation.j) * cellSize/2) + floor(canvas.width/2) - cellSize/2 + hero.size/2
}