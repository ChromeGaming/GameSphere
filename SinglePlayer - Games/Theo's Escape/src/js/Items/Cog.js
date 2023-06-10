/**
 * Cogs
 */
class Cog extends Item {

    /**
     * @param {Vec} pos1 start
     * @param {Vec} pos2 end
     */
    constructor(pos1, pos2) {
        super(pos1.clone());
        this.line = pos2 ? new Line(pos1, pos2) : null;
        this.size = 16;
        this.speed = 1;
        this.frame = 0;
    }

    start() {
        const sfx = Sfx.play("cog", true);
        sfx.mixer.gain.value = 0;
        this.sfx = sfx;
    }

    stop() {
        this.sfx.stop();
    }

    /**
     * @param {Draw} draw
     */
    pre(draw) {
        const line = this.line;
        if (line) {
            draw.begin()
                .to(line.begin)
                .line(line.end.clone().sub(line.begin))
                .stroke(0, 6)
                .end();
        }
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        const pos = this.pos.clone().sub(this.size);
        const frame = Math.round(this.frame) % 3;
        draw.sprite(frame * 32, 72, 32, 32, pos.x, pos.y);
    }

    /**
     * @param {Hero} hero
     */
    update(hero) {
        let pos = this.pos,
            line = this.line,
            speed = this.speed;
        if (line) {
            pos.add(line.vec.clone().multiply(speed));
            let lineDist = pos.clone().sub(line.end).mag();
            if (lineDist < speed) {
                pos = line.end.clone();
                this.line = new Line(line.end, line.begin);
            }
        }
        
        let dist = hero.pos.clone().sub(pos).mag(),
            gain = 1 - dist / 150;
        this.sfx.mixer.gain.value = gain > 0 ? gain : 0;
        if (dist < this.size + hero.size) {
            hero.alive = false;
        }
        this.frame += .5;
    }

}