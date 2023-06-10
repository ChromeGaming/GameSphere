/**
 * Game scene class
 */
class Scene {

    /**
     * @param {Hero} hero
     * @param {Room} room
     * @param {Door} exit
     * @param {Item[]} mobs
     * @param {String[]} text
     */
    constructor(hero, room, exit, mobs, text) {
        this.room = room;
        this.hero = hero;
        this.exit = exit;
        this.mobs = mobs || [];
        this.text = text || [];
        this.won = false;
        this.img = false;
        this.started = 0;
        this.stoped = 0;
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        draw.clear();
        if (!this.img) {
            this.room.pre(draw);
            this.exit.pre(draw);
            this.mobs.forEach((mob) => mob.pre(draw));
            this.img = draw.merge();
        } else {
            draw.img(this.img);
        }
        this.exit.render(draw);
        this.mobs.forEach((mob) => mob.render(draw));
        this.hero.render(draw);
        if (!this.started && this.text.length > 0) {
            draw.begin()
                .to(this.hero.pos.clone().add(-16, -22))
                .text(this.text, 0, 5, 1)
                .end();
        }
    }

    start() {
        this.started = Date.now();
        this.hero.start();
        this.exit.start();
        this.mobs.forEach((mob) => mob.start());
    }

    stop() {
        this.stoped = Date.now();
        this.hero.stop();
        this.exit.stop();
        this.mobs.forEach((mob) => mob.stop());
    }

    update() {
        const hero = this.hero;
        const room = this.room;
        const exit = this.exit;
        if (this.stoped || !this.started) {
            return;
        }
        hero.update(room);
        this.mobs.forEach((mob) => mob.update(hero, room));
        if (!hero.alive) {
            Sfx.play("lose");
            this.stop();
        } else if (exit.update(hero)) {
            this.won = true;
            Sfx.play("won");
            this.stop();
        }
    }

}