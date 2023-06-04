/////////////////////////////////////////////////////////////////
/////////////////////////Class for NPCs//////////////////////////
/////////////////////////////////////////////////////////////////

class npc {
    constructor(x,y) {
        this.x = x;
        this.y = y;

        this.destination = {x:x,y:y};
        this.lastPosition = {x:floor(x),y:floor(y)};

        //nathan stuff
        this.angry = 0;
        this.health = 20;
        this.bulletArray = [];
        this.isMoving = 1;
        this.justTookDamage = false;
        this.canShoot = true;

        this.pos ={
            x:floor(x + (this.x-this.y) * cellSize),
            y:floor(y + (this.x+this.y) * cellSize/2)
        }

        //this.w = 21;
        //this.h = 54;
        this.vel = cellSize/300
        this.scale = hero.size/21;
        this.width = 21*this.scale;
        this.height = -44*this.scale

        this.a = [0,this.width/1000,0,0,5] //animation = [{bobY,bobVel,bobyRotation,feet&handRotation,feet&handVel]
        this.armY = 0;
        this.armX = 0;
        this.d; //stores last dir (l & r)
        this.pallet = [garments[RandomRange(0,garments.length,1)],hair[RandomRange(0,hair.length, 1)],skin[RandomRange(0,skin.length,1)]]
        this.f = RandomRange(0,2,1) //is female?
        this.roads = [];
    }

    draw () {
        //makes sure npc is in viewfinder
        if(this.pos.x+this.width < 0 || this.pos.x > canvas.width || this.pos.y< 0 || this.pos.y+this.height > canvas.width){
            return;
        }

        //animate
        animate(this.a,this.isMoving)
        svg(`c green 0 0 1, s ${this.health < 10?30:0}, c #000 1, g 0.1, r 0 46 21 8 1, g 1, <t 0 ${-this.a[0]}, q ${this.a[2]}, c ${this.pallet[0][0]} 1, r 4.8 18 12 24 1, c ${this.pallet[0][1]} 1, r 4.4 35 12.8 10 1, >< t 0 ${this.a[0]}, c ${this.pallet[2]} 1, r 4 8 14 14 1, c ${this.angry ? "red":"#fff"} 1, r 5.5 13.2 4 4 1, c ${this.angry ? "darkred":"#000"} 1, r 6.5 14.2 2 2 1, c ${this.pallet[1]} 1, r 3 7 14.4 5 1, r 14 7 5 ${this.f ? 18 : 8} 1,> c ${this.pallet[2]} 1, < t 10.5 25, q ${this.a[3]/5}, r ${-2.5+this.armX} ${6+this.a[0]+this.armY} 6 6 1, >< t 10.5 40, q ${this.a[3]}, r -7.5 7.5 6 3 1, >< t 10.5 40, q ${-this.a[3]}, r 1.5 7.5 6 3 1, >`,[this.d == "l" ? this.pos.x : this.pos.x+this.width,this.pos.y+this.height-5*this.scale,this.d=="l"?this.scale:-this.scale,this.scale])
        svg(`c #fff 1, r 0.5 0 ${this.health == 20?0:this.health} 2 1,`,[this.pos.x,this.pos.y+this.height,this.scale,this.scale])
        /*  ctx.strokeStyle = "red"
        ctx.strokeRect(this.pos.x,this.pos.y,this.width,this.height)
        ctx.strokeRect(this.pos.x,this.pos.y,5,5) */

    }
    
    findNextDestination () {
        //current (p)osition
        let p = {i:floor(this.x), j:floor(this.y)}
        //(a)rray for this.possible this.positions
        let a = []
        //(v)alues of neighbours left,right,top,bottom [x-this.position, y-this.position, is on x-axis?]
        let v = [[p.i-1,p.j,1],[p.i+1,p.j,1],[p.i,p.j-1,0],[p.i,p.j+1,0]]
        //loops through neighbours
        for(let i=0;i<v.length;i++){
            //checks if walkable if so adds to array
            a = this.check(v[i][0],v[i][1],v[i][2],a)
        }
        //if there are moveable this.positions...
        if(a.length > 0) {
            //pick one randomly
            this.destination = a[Math.floor(RandomRange(0,a.length))];
        }
        //set the last this.position to the current this.position
        this.lastPosition = p;
    }
    //checks if neighbours are moveable 
    check(i,j,x,a){
        //i = x this.position of neighbour in array
        //j = y this.position of neighbour in array
        //x = if neighbour on x-axis
        //a = array of moveable neighbours

        //if neighbour exsists && it's a road && it isn't the last tile we were on
        if(IsInBounds(i,j) && (grid[i][j].type == TYPES.ROAD || grid[i][j].type == TYPES.PARK) && (x ? i : j) != (x ? this.lastPosition.i : this.lastPosition.j)){
            //add to moveable neighbours array
            a.push({x:i+RandomRange(0,0.8)+0.1,y:j+RandomRange(0,0.8)+0.1})
        }
        //return array
        return a
    }


    move (){
        this.pos ={
            x:x + (this.x-this.y) * cellSize,
            y:y + (this.x+this.y) * cellSize/2
        }

        if(this.pos.x < hero.pos.x)this.d = "r";
        if(this.pos.x > hero.pos.y)this.d = "l";

        if(this.isMoving){
            let dpos = {
                x:floor(x + (this.destination.x-this.destination.y) * cellSize),
                y:floor(y + (this.destination.x+this.destination.y) * cellSize/2)
            }
    
            if(Math.abs(this.pos.x+this.width/2 - dpos.x) < 5 && Math.abs(this.pos.y - dpos.y) < 5)this.findNextDestination();
            
            if(this.pos.x+this.width/2 < dpos.x)this.pos.x += this.vel*2;
            if(this.pos.x+this.width/2 > dpos.x)this.pos.x -= this.vel*2;
            if(this.pos.y < dpos.y)this.pos.y += this.vel;
            if(this.pos.y > dpos.y)this.pos.y -= this.vel;
            
            if(this.pos.x < dpos.x)this.d = "r";
            if(this.pos.x > dpos.x)this.d = "l";
    
            this.x = (this.pos.y - y) / cellSize + (this.pos.x - x) / (cellSize*2)
            this.y = (this.pos.y - y) / cellSize - (this.pos.x - x) / (cellSize*2) 

            this.roads = []

            for(let i=-1; i<2; i++){
                for(let j=-1; j<2; j++){
                    if(IsInBounds(floor(this.x)+i,floor(this.y)+j)){
                        let t = grid[floor(this.x)+i][floor(this.y)+j].type;
                        if(t == TYPES.ROAD || t == TYPES.PARK){
                            this.roads.push(grid[floor(this.x)+i][floor(this.y)+j])
                        }
                    }
                }
            }
        }
    }

    ////////////////////
    //needs to be refactored

    die () {
        if(this.health > 0){
            let dx = canvas.width/2 - (this.pos.x+this.width/2)
            let dy = canvas.height/2 - (this.pos.y+this.height/2)
            let distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < -this.height * 2 && this.justTookDamage == false) {
                this.justTookDamage = true;
                this.health --
                ///
                setTimeout(() => {
                    this.justTookDamage = 0
                }, 40);
                ///
            }
        }else{
            zzfxP(npcD);
            let index;
            for (let j=0;j<npcArray.length;j++) {
                for(let i=0; i<this.roads.length; i++){
                    if(dist(this.x,this.y,npcArray[j].x,npcArray[j].y) < 3){
                        npcArray[j].angry = 1;
                        npcArray[j].isMoving = 0;
                    }
                }
                if(npcArray[j].health <= 0){
                    index = j;
                }
            }
            npcArray.splice(index,1)
          }
    }


    addBullet () {
        ////////////////////////

        if(this.pos.x+this.width < 0 || this.pos.x > canvas.width || this.pos.y< 0 || this.pos.y+this.height > canvas.width){
            return;
        }

        for(let i=0; i<this.roads.length; i++){

            if(floor(hero.i) == this.roads[i].i && floor(hero.j) == this.roads[i].j && this.angry){
                //console.log(roads)
                if(this.armY  <= -25){ 
                    let v = [], a = Math.abs(Math.atan((canvas.height/2-(this.pos.y+this.height))/(canvas.width/2-(this.pos.x+this.width/2)))); //angle between hero & npc
    
                    //velocity calculator
                    v[0] = (canvas.width/2 < this.pos.x + this.width/2 ? -1 : 1)
                    v[1] = (canvas.width/2 < this.pos.y+this.height ? -1 : 1)
    
                    //probability of type of bullet
                    let prob = RandomRange();
                    let b;
                    let bp = 0;
    
                    for(let i =0; i<bulletTypes.length; i++){
                        b=bulletTypes[i];
                        bp += b.p;
                        if(prob < bp){
                            break;
                        }
                    }
    
                    //fix spawn location
                    let bx = ((this.pos.y+this.height) - y) / cellSize + ((this.pos.x+this.width/2) - x) / (cellSize*2)
                    let by = ((this.pos.y+this.height) - y) / cellSize - ((this.pos.x+this.width/2) - x) / (cellSize*2) 
    
                    bullets.push(new bullet(bx,by,Math.cos(a)*v[0],Math.sin(a)*v[1],b))
                    zzfxP(bulletFX)
                    this.armY = this.armX = 0;
                }else{
                    this.armY -= 0.3;
                    this.armX += 0.15;
                    break;
                }
            }
        }

        /////////////////////
    }

    /////////////////////
}

function spawnNPCs(amount){
    let spawnLocations = findCells(TYPES.ROAD)
  
    for(let i=0;i<amount;i++){
      let spawnLocation = spawnLocations[floor(Math.random()*spawnLocations.length)]
      npcArray.push(new npc(spawnLocation.i+RandomRange(0,0.8)+0.1,spawnLocation.j+RandomRange(0,0.8)+0.1))
    }
  }