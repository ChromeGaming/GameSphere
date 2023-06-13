/**
 * Abstract game object class
 */
class Item {

    /**
     * @param {Vec} pos
     */
    constructor(pos) {
        this.pos = pos;
    }

    /**
     * Pre render
     * @param {Draw} draw
     */
    pre(draw) {}

    /**
     * On scene start
     */
    start() {}

    /**
     * On scene stop
     */
    stop() {}

    /**
     * On scene update
     * @param {Hero} hero
     */
    update(hero) {}

    /**
     * On scene render
     * @param {Draw} draw
     */
    render(draw) {}
    
}