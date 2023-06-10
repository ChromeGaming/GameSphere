class Map {
    constructor() {
        this.ownedRooms = 1;
    }

    init(map, element) {
        this.rawmap = map;
        this.canvas = gId(element);
        this.ctx = this.canvas.getContext("2d");

        this.importMap();

        window.onresize = this.updateSize.bind(this);
        this.updateSize();
    }

    importMap() {
        let id = 0;
        this.map = [];
        
        this.rawmap.forEach((line, c) => {
            line.forEach((n) => {
                n.id = id++;
                n.j = c;
                n.rsize = randnum() * randsig();
                n.rx = randnum() * randsig();
                n.ry = randnum() * randsig();
                this.map.push(n);
            });
        });
        this.map[0].own = true;
        this.lines = this.rawmap.length;
    }

    capacity() {
        return this.ownedRooms * ANTS_PER_CELL;
    }

    nextcapacity() {
        return (this.ownedRooms + 1) * ANTS_PER_CELL;
    }

    completed() {
        return this.ownedRooms == this.map.length;
    }

    buildRoom() {
        if (this.ownedRooms < this.map.length) {
            this.ownedRooms++;
            for (let i = 0; i < this.ownedRooms; i++) {
                this.map[i].own = true;
            }

            this.updateSize();
        }
    }
    
    updateSize() {
        this.width = this.canvas.parentElement.offsetWidth;
        this.height = this.width / 1.33;
        
        // viewport
        this.vw = this.width - (this.width / 5);
        this.vh = this.height - (this.height / 5);
        this.vx = (this.width - this.vw) / 2;
        this.vy = (this.height - this.vh) / 2;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.update();
    }
    
    update() {
        this.clear();
        this.drawMap();
    }
    
    drawMap() {
        let radius = this.vw / 15;
        this.ctx.lineWidth = this.vw / 20;
        
        this.map.forEach(n => {
            n.x = ((n.c) * this.vw / (MAP_COLUMNS)) + this.vx + (radius * 1.3) + n.rx * (this.vw / 20);
            n.y = (n.j * this.vh / (this.lines)) + this.vy + (radius * 1.3) + n.ry * (this.vh / 20);

            // draw lines
            if (n.l) {
                if (n.own) {
                    this.ctx.strokeStyle = "#1D2227";
                } else {
                    this.ctx.strokeStyle = "#4C5157";
                }
                
                this.ctx.beginPath();
                n.l.forEach(l => {
                    let elem = this.getNode(l);
                    this.ctx.moveTo(n.x, n.y);
                    this.ctx.lineTo(elem.x, elem.y);
                });
                this.ctx.stroke();
            }
        });
        
        this.map.forEach(n => {
            if (n.own) {
                this.ctx.fillStyle = "#1D2227";
            } else {
                this.ctx.fillStyle = "#4C5157";
            }

            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, radius + (n.rsize * radius / 10), 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
    }

    getNode(id) {
        return this.map.filter(n => n.id == id)[0];
    }

    clear() {
        this.ctx.fillStyle = "#3A3F43";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}