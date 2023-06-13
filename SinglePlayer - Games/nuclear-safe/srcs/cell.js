/////////////////////////////////////////////////////////////////
//////////////////////Tile Class For Grid////////////////////////
/////////////////////////////////////////////////////////////////


function Cell(i, j) {
    //x,y,type,id
    this.i = i;
    this.j = j;

    /////////////////////////
    //need to fix this
    this.type;
    this.id = -1;
    ////////////////////////
    this.treeX;
    this.treeY;
    this.cubeOrTri;
    this.alpha = 1;
    this.pallet = buildingPallet[RandomRange(0,buildingPallet.length,1)]
    this.scale = cellSize /100;
    //height if building
    if(this.type != TYPES.ROAD){
      this.h = RandomRange(1.3, 3);
    }
    if (this.type = TYPES.PARK) {
        this.treeX = this.i+RandomRange(0,.5)+0.25
        this.treeY = this.j+RandomRange(0,.5)+0.25
        this.cubeOrTri = RandomRange(0,2,1)
    }
    //draw function
    this.draw = () => {
        //find on screen position
        let pos = {
            x:x + (this.i-this.j) * cellSize,
            y:y + (this.i+this.j) * cellSize/2
        }
         //out of canvas?
        if(pos.x+cellSize < 0 || pos.x-cellSize > canvas.width || pos.y+cellSize < 0 || pos.y > canvas.width){
            return;
        }
        
        //draw tile//

        //set fill colour
        ctx.fillStyle = ctx.strokeStyle = getColor(this.type)

        //main tile
        svg(`w ${1/cellSize}, p m 0 0 l 1 .5 l 0 1 l -1 .5 1 1,`, [pos.x,pos.y,cellSize,cellSize])

        //sides if on edge
        let info = [pos.x,pos.y,cellSize,cellSize]
        if(this.i == mapSize-1) svg(`g 0.8, p m 1 .5 l 1 .7 l 0 1.2 l 0 1 1,`,info)
        if(this.j == mapSize-1) svg(`g 0.8, p m -1 .5 l -1 .7 l 0 1.2 l 0 1 1,`,info)
    }
  
    //draws buildings
    this.buildings = () => {
        //find on screen position
        let pos = {
            x:x + (this.i-this.j) * cellSize,
            y:y + (this.i+this.j) * cellSize/2
        }
        //out of canvas?
        if(pos.x+cellSize < 0 || pos.x-cellSize > canvas.width || pos.y+cellSize < 0 || pos.y-this.h*cellSize > canvas.width){
            return;
        }

        ///footsteps
        for(let i=0;i<hero.footSteps.length;i++){
            if(floor(hero.footSteps[i].i) == this.i && floor(hero.footSteps[i].j) == this.j){
                let footPos = {
                    x:x+(hero.footSteps[i].i-hero.footSteps[i].j)*cellSize,
                    y:y+(hero.footSteps[i].i+hero.footSteps[i].j) * cellSize/2
                };

                svg("c #39ff19 1 1 1, s 20, r 0 0 20 10 1,",[footPos.x,footPos.y,1,1])
            }
        }

        //if not road
        if(this.type == 0){

            //loop through roads near hero

            let fade = 0;

            //for(let i = 0; i<hero.roads.length; i++){
                //get road's position
                let road = {
                    x:x + (floor(hero.i)-floor(hero.j)) * cellSize,
                    y:y + (floor(hero.i)+floor(hero.j)) * cellSize/2
                }

                //is colliding?
                if(road.x+cellSize > pos.x-cellSize && road.x-cellSize < pos.x+cellSize && road.y < pos.y+cellSize/2 && road.y+cellSize > pos.y-this.h*cellSize){
                    //hide building
                    fade = 1;
                    //break;
                }
            //}

            if(fade){
                this.alpha > 0.15 ? this.alpha -= 0.03 : this.alpha = 0.15
            }else{
                this.alpha < 1 ? this.alpha += 0.01 : this.alpha = 1
            }

            //draw building//

            //set alpha
            ctx.globalAlpha = this.alpha;
            //main building
            svg(`w ${0.5/cellSize}, c ${this.pallet[0]} 1 1, p m 0 0 l 1 .5 l 0 1 l -1 .5 1 1, c ${this.pallet[1]} 1 1, p m 0 1 l 0 ${1+this.h} l -1 ${.5+this.h} l -1 .5 1 1, c ${this.pallet[2]} 1 1, p m 0 1 l 0 ${1+this.h} l 1 ${.5+this.h} l 1 .5 1 1,`, [pos.x,pos.y-this.h*cellSize,cellSize,cellSize])
            //windows
            if(this.alpha > 0.15){
                for(let i = this.h-0.15; i>0.2; i-=0.15){
                    svg(`w ${5/cellSize}, c ${this.pallet[2]} 0 1, p m -0.9 0.55 l -.1 .95 0 1, c ${this.pallet[3]} 0 1, p m 0.9 0.55 l .1 .95 0 1,`, [pos.x,pos.y-i*cellSize,cellSize,cellSize])
                }
            }
            //reset alpha
            ctx.globalAlpha = 1;
            
        }else if(this.type == 1){

            //needs fixing!!!!
            if(dist(hero.i,hero.j,this.i+0.5,this.j+0.5) < 1){
                menu.win()
            }   

            svg(`w ${0.5/cellSize}, c #98002e 0 1, c #E31B23 1, p m 0 0 l 1 .5 l 0 1 l -1 .5 m 0 1 l 0 ${1+this.h} l -1 ${.5+this.h} l -1 .5 m 0 1 l 0 ${1+this.h} l 1 ${.5+this.h} l 1 .5 1 1,`, [pos.x,pos.y-this.h*cellSize,cellSize,cellSize])
            //

        }else if(this.type == 2){
            this.treePos = {
                x:x+(this.treeX-this.treeY)*cellSize-40*this.scale,
                y:y+(this.treeX+this.treeY) * cellSize/2
            };

            /* if(this.treePos.y > hero.pos.y && this.treePos.y+70*this.scale < hero.pos.y && this.treePos.x > hero.pos.x && this.treePos.x+40*this.scale < hero.pos.x){
                ctx.globalAlpha = 0.3;
            }else{
                ctx.globalAlpha = 1;
            } */

            ctx.globalAlpha = 1;
            if (this.cubeOrTri) {
                this.treePos.y -= 63*this.scale;
                if(hero.pos.y < this.treePos.y+63*this.scale && hero.pos.y > this.treePos.y && hero.pos.x < this.treePos.x+40*this.scale && hero.pos.x+hero.width > this.treePos.x){
                    ctx.globalAlpha = 0.1;
                }
                for(i=0;i<npcArray.length;i++){
                    if(npcArray[i].pos.y < this.treePos.y+70*this.scale && npcArray[i].pos.y > this.treePos.y && npcArray[i].pos.x < this.treePos.x+40*this.scale && npcArray[i].pos.x+hero.width > this.treePos.x){
                        ctx.globalAlpha = 0.1;
                    }
                }
                svg("c #613e28 1 1, p m 15 44 l 15 60 l 20 63 l 20 45 1, c #986748 1, p m 20 63 l 20 45 l 25 44 l 25 60 1, c #4e7d13 1 1, p m 0 10 l 0 45 l 20 55 l 20 20 1, c #8db344 1 1, p m 20 55 l 40 45 l 40 10 l 20 20 1, c #c9fd66 1, p m 0 10 l 20 20 l 40 10 l 20 0 1,",[this.treePos.x,this.treePos.y,this.scale,this.scale])
            } else {
                this.treePos.y -= 70*this.scale;
                if(hero.pos.y < this.treePos.y+70*this.scale && hero.pos.y > this.treePos.y && hero.pos.x < this.treePos.x+40*this.scale && hero.pos.x+hero.width > this.treePos.x){
                    ctx.globalAlpha = 0.1;
                }
                for(i=0;i<npcArray.length;i++){
                    if(npcArray[i].pos.y < this.treePos.y+70*this.scale && npcArray[i].pos.y > this.treePos.y && npcArray[i].pos.x < this.treePos.x+40*this.scale && npcArray[i].pos.x+hero.width > this.treePos.x){
                        ctx.globalAlpha = 0.1;
                    }
                }
                svg("c #613e28 1 1, p m 15 50 l 15 66 l 20 69 l 20 51 1, c #986748 1, p m 20 69 l 20 51 l 25 50 l 25 66 1, c #4e7d13 1 1, p m 0 50 l 20 60 l 20 0 1, c #8db344 1 1, p m 20 60 l 40 50 l 20 0 1,",[this.treePos.x,this.treePos.y,this.scale,this.scale])  
            }

            ctx.globalAlpha = 1;
        }

        //draw npcs in order
        for(i=0;i<npcArray.length;i++){
            if(floor(npcArray[i].x) == this.i && floor(npcArray[i].y) == this.j){
                npcArray[i].draw()
            }
        }
         //draw hero in order of map
        if(floor(hero.i) == this.i && floor(hero.j) == this.j){
            hero.draw()
        }

        for(let i=0;i<bullets.length;i++){
            if(floor(bullets[i].x) == this.i && floor(bullets[i].y) == this.j){
                bullets[i].draw()
            }
        }
    }
}

function getColor(zone) {
    if(zone == TYPES.ROAD){
        return "#213131"
    }else if(zone == TYPES.HOSPITAL){
        return "red"
    }else if(zone == TYPES.PARK){
        return "#81a71b"
    }else if(zone == TYPES.LAKE){
        return "#58bcd8"
    }else{
        return "silver"
    }
}