/**
 * Mr Rodman
 */
class Rod extends Item {

    /**
     * @param {Draw} draw
     */
    pre(draw) {
        const pos = this.pos.clone().sub(12);
        draw.begin()
            .to(pos.x, pos.y - 10)
            .text(["Skipping classes", "again, Theodor?"], 0, 5, 1)
            .end();
    }

    /**
     * @param {Draw} draw
     */
    render(draw) {
        const pos = this.pos.clone().sub(12);
        draw.sprite(168, 0, 24, 48, pos.x, pos.y);
    }

}