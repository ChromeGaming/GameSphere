/**
 * Theodor
 */
class Hero extends Item {

    /**
     * @param {Vec} pos
     * @param {Vec} bound
     */
    constructor(pos, bound) {
        super(pos);
        this.size = 12;
        this.bound = bound;
        this.alive = true;
        this.speed = new Vec();
        this.minSpeed = new Vec();
        this.maxSpeed = new Vec(3, 5);
        this.velocity = new Vec(.1, .15);
        this.jumpSpeed = new Vec(3, -5);
        this.collide = new Vec();
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        const pos = this.pos.clone().sub(12);
        let vec = new Vec(72, 0);
        if (this.alive) {
            vec = this.speed.clone().bit();
            if (this.collide.x) {
                vec.y = 0;
            }
            if (this.collide.y) {
                vec.x = 0;
            }
            vec.multiply(24).add(24);
        }
        draw.sprite(vec.x, vec.y, 24, 24, pos.x, pos.y);
    }

    /**
     * @param {Room} room
     */
    update(room) {
        const pos = this.pos;
        const size = this.size;
        const speed = this.speed;
        const bound = this.bound;
        const collide = new Vec();
        this.speed.add(this.velocity).max(this.maxSpeed),
        pos.x += speed.x;
        collide.y = room.collide(pos, size, true);
        pos.y += speed.y;
        collide.x = room.collide(pos, size, true);
        if (!this.sfx && speed.y > 0 && collide.x != collide.y) {
            this.sfx = Sfx.play("slide", true);
        } else if (collide.x == collide.y) {
            this.stop();
        }
        if (collide.x || (collide.y && !this.collide.y)) {
            speed.y = this.minSpeed.y;
        } 
        this.collide = collide;
        if (
            pos.x < -size ||
            pos.y < -size || 
            pos.x > bound.x + size ||
            pos.y > bound.y + size
        ) {
            this.alive = false;
        }
    }

    stop() {
        if (this.sfx) {
            this.sfx.stop();
            this.sfx = false;
        }
    }

    turn() {
        this.velocity.x = -this.velocity.x;
        this.speed.x = -this.speed.x;
    }

    jump() {
        const collide = this.collide;
        if (collide.x || collide.y) {
            this.speed.y = this.jumpSpeed.y;
            if (collide.y && !collide.x) {
                this.turn();
            }
            Sfx.play("jump");
            if (this.srcSlide) {
                this.srcSlide.stop();
            }
        }
    }

}
