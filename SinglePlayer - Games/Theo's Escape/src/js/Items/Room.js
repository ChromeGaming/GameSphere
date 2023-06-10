/**
 * The room
 */
class Room {

    /**
     * @param {Number} grid
     * @param {number} margin
     */
    constructor(grid, margin) {
        this.grid = grid;
        this.margin = margin;
        this.dots = [];
        this.lines = [];
        this.glitch = [];
    }

    /**
     * Add walls 
     * @param {Number[]} data
     */
    map(data) {
        const grid = this.grid;
        const margin = this.margin;
        const lines = this.lines;
        const dots = [];
        let i = 0,
            j = 0,
            x = data[0] * grid,
            y = data[1] * grid;
        dots.push(new Vec(x, y).add(margin));
        for (i = 1; i < data.length - 1; i++) {
            if (i % 2) {
                x = data[i + 1] * grid;
            } else {
                y = data[i + 1] * grid;
            }
            dots.push(new Vec(x, y).add(margin));
            lines.push(new Line(dots[j], dots[++j]));
        }
        lines.push(new Line(dots[j], dots[0]));
        this.dots.push(dots);
    }

    /**
     * @param {Draw} draw
     */
    pre(draw) {
        const color = "rgba(0,0,0,.1)";
        let w = draw.ctx.canvas.width,
            h = draw.ctx.canvas.height;
        draw.begin().rect(w, h, "#420");
        for (let i = 0; i < this.dots.length; i++) {
            draw.path(this.dots[i]).fill(i ? "#420" : "#fec").stroke(0, 2);
        }
        for (let i = 0; i < 100; i++) {
            let width = Math.round(Math.rnd(8, 10)),
                height = Math.round(Math.rnd(4, 6)),
                x = Math.round(Math.rnd(0, w - width)),
                y = Math.round(Math.rnd(0, h - height));
            draw.begin()
                .to(x, y)
                .rect(width, height, color)
                .end();
        }
        draw.end();
        for (let i = 0; i < this.glitch.length; i++) {
            let line = this.lines[this.glitch[i]];
            draw.begin()
                .to(line.begin)
                .line(line.end.clone().sub(line.begin))
                .shadow("#c0c")
                .stroke("#c0c", 3)
                .end();
        }
    }

    /**
     * Check wall collides
     * @param {Vec} pos
     * @param {Number} size
     * @param {Boolean} glitch
     */
    collide(pos, size, glitch) {
        let collide = 0;
        for (let i = 0; i < this.lines.length; i++) {
            if (glitch && this.glitch.indexOf(i) > -1) {
                continue;
            }
            let line =  this.lines[i],
                dot = line.project(pos),
                vec = pos.clone().sub(dot),
                distance = vec.mag();
            if (distance < size) {
                pos.add(vec.clone().div(distance).multiply(size - distance));
                collide = 1;
            }
        }
        return collide;
    }

}
