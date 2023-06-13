/**
 * The Sentinel
 */
class Boss extends Item {

    /**
     * @param {Vec} pos
     */
    constructor(pos) {
        super(pos);
        this.size = 32;
        this.speed = new Vec();
        this.velociy = 1;
        this.frame = 0;
    }

    start() {
        const sfx = Sfx.play("boss", true);
        sfx.mixer.gain.value = 0;
        this.sfx = sfx;
    }

    stop() {
        this.sfx.stop();
    }

    /**
     * @param {Hero} hero
     * @param {Room} room
     */
    update(hero, room) {
        this.speed = hero.pos.clone().sub(this.pos).bit().multiply(this.velociy);
        this.pos.x += this.speed.x;
        room.collide(this.pos, this.size);
        this.pos.y += this.speed.y;
        room.collide(this.pos, this.size);
        let dist = hero.pos.clone().sub(this.pos).mag(),
            gain = 1 - dist / 300;
        this.sfx.mixer.gain.value = gain > .1 ? gain : .1;
        if (dist < this.size + hero.size) {
            hero.alive = false;
        }
        this.frame += .5;
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        const pos = this.pos.clone().sub(36);
        const frame = Math.round(this.frame) % 6;
        draw.sprite(frame * 72, 136, 72, 72, pos.x, pos.y);
    }

}