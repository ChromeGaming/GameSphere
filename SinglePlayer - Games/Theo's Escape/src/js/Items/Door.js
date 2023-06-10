/**
 * Door and key
 */
class Door extends Item {

    /**
     * @param {Vec} pos
     * @param {Vec} key
     */
    constructor(pos, key) {
        super(pos);
        this.key = key || false;
        this.open = key ? false : true;
        this.size = 12;
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        const pos = new Vec(-12, -16).add(this.pos);
        draw.sprite(this.key ? 0 : 24, 104, 24, 32, pos.x, pos.y);
        if (this.key) {
            const key = new Vec(-12, -16).add(this.key);
            draw.sprite(48, 104, 24, 32, key.x, key.y);
        }
    }

    /**
     * @param {Hero} hero
     * @param {Room} room
     */
    update(hero) {
        let result = false;
        if (!this.key) {
            result = hero.pos.clone().sub(this.pos).mag() < this.size;
        } else if (hero.pos.clone().sub(this.key).mag() < this.size) {
            Sfx.play("key");
            this.key = false;
        }
        if (result) {
            this.open = true;
        }
        return result;
    }

}