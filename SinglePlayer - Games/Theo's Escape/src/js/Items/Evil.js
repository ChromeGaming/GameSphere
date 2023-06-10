/**
 * The Infected Ones
 */
class Evil extends Item {

    /**
     * @param {Vec} pos
     */
    constructor(pos) {
        super(pos);
        this.size = 12;
        this.speed = new Vec();
        this.velociy = .5;
        this.collide = new Vec();
    }

    /**
     * @param {Hero} hero
     * @param {Room} room
     */
    update(hero, room) {
        this.speed = hero.pos.clone().sub(this.pos).bit().multiply(this.velociy);
        this.pos.x += this.speed.x;
        this.collide.y = room.collide(this.pos, this.size);
        this.pos.y += this.speed.y;
        this.collide.x = room.collide(this.pos, this.size);
        if (hero.pos.clone().sub(this.pos).mag() < this.size + hero.size) {
            hero.alive = false;
        }
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        const pos = this.pos.clone().sub(12);
        const vec = this.speed.clone().bit();
        if (this.collide.x) {
            vec.y = 0;
        }
        if (this.collide.y) {
            vec.x = 0;
        }
        vec.multiply(24);
        draw.sprite(vec.x + 120, vec.y + 24, 24, 24, pos.x, pos.y);
    }

}