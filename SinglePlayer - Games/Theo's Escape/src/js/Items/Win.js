/**
 * Window
 */
class Win extends Item {

    /**
     * @param {Draw} draw
     */
    pre(draw) {
        const pos = this.pos;
        const sky = draw.glin("#09c", "#cff", 0, 0, 0, 24);
        draw.begin()
            .to(pos.x - 16, pos.y - 12)
            .rect(32, 24, sky)
            .to(1, 1)
            .rect(10, 22)
            .stroke(0, 2)
            .to(10, 0)
            .rect(10, 22)
            .stroke(0, 2)
            .to(10, 0)
            .rect(10, 22)
            .stroke(0, 2)
            .end();
    }

}