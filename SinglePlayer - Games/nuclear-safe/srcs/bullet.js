/*

//different types of bullets
//implement bullet svgs
//collision with buildings

//array of bullet objects
bullets = [
    {velocity,density,svg,w,h},
    ...
]
*/


//needs refactoring
class bullet {
    constructor (x,y,velX,velY,type) {
        this.x = x;
        this.y = y;

        this.angle = 0;
        this.aVel = type.vel;

        this.xVel = velX*type.vel;
        this.yVel = velY*type.vel;

        this.svg = type.svg
        this.dmg = type.dmg
        this.scale = (-type.s*hero.height) / (type.h > type.w ? type.h : type.w)
        this.width = type.w*this.scale;
        this.height = type.h*this.scale;
    }
    draw () {
        if(!map && !pause)this.angle+=this.aVel*2
        let pos = {
            x:x + (this.x-this.y) * cellSize,
            y:y + (this.x+this.y) * cellSize/2
        }
        
        ctx.save()
        ctx.translate(pos.x,pos.y)
        ctx.rotate(this.angle*Math.PI/180)
        svg(this.svg,[-this.width/2,-this.height/2,this.scale,this.scale])
        ctx.restore();
    }
    move (i) {
        setTimeout(() => {this.yVel = this.xVel = 0;}, 3000)

        let pos = {
            x:x + (this.x-this.y) * cellSize,
            y:y + (this.x+this.y) * cellSize/2
        }
        
        pos.x += this.xVel;
        pos.y += this.yVel;
        
        this.x = (pos.y - y) / cellSize + (pos.x - x) / (cellSize*2)
        this.y = (pos.y - y) / cellSize - (pos.x - x) / (cellSize*2)   
        
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                let gPos = {
                    x:x + (grid[i][j].i-grid[i][j].j) * cellSize,
                    y:y + (grid[i][j].i+grid[i][j].j) * cellSize/2
                }
                let r = (this.height > this.width ? this.height/2 : this.width/2)

                let pointsX = [gPos.x,gPos.x-cellSize,gPos.x,gPos.x+cellSize]
                let pointsY = [gPos.y,gPos.y+cellSize/2,gPos.y+cellSize,gPos.y+cellSize/2]

                if(IsInBounds(i,j+1) && grid[i][j+1].type == TYPES.ROAD){
                    pointsX[1] -= hero.height;
                    pointsX[2] -= hero.height;

                    pointsY[1] += hero.height/2;
                    pointsY[2] += hero.height/2;
                }

                if(IsInBounds(i+1,j) && grid[i+1][j].type == TYPES.ROAD){
                    pointsX[2] += hero.height;
                    pointsX[3] += hero.height;

                    pointsY[3] += hero.height/2;

                    pointsY[2] += hero.height/2;
                }
                if(grid[i][j].type == TYPES.NONE)lineCircle(pointsX[0],pointsY[0],pointsX[1],pointsY[1],pos.x,pos.y,r) + lineCircle(pointsX[0],pointsY[0],pointsX[3],pointsY[3],pos.x,pos.y,r) + lineCircle(pointsX[1],pointsY[1],pointsX[2],pointsY[2],pos.x,pos.y,r) + lineCircle(pointsX[2],pointsY[2],pointsX[3],pointsY[3],pos.x,pos.y,r) > 0 && (this.yVel = this.xVel = 0)
            }
        }

        if(circleRect(pos.x,pos.y,(this.height > this.width ? this.height/2 : this.width/2),hero.pos.x,hero.pos.y+hero.height,hero.width,-hero.height)){
            hero.removeHealth(this.dmg)
            zzfxP(dmg);
            bullets.splice(i,1)
            shakeScreen(hero.width/2)
        }

        if(!this.yVel && !this.xVel){
            bullets.splice(i,1)
        }
    }
}
