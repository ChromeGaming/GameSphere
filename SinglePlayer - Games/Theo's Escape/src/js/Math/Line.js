/**
 * Line math
 */
class Line {

    /**
     * @param {Vec} begin
     * @param {Vec} end
     */
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
        this.vec = end.clone().sub(begin).norm();
    }

    /**
     * Dot projection
     * @param {Vec} dot
     * @returns {Vec}
     */
    project(dot) {
        let param = -1;
        const a = dot.clone().sub(this.begin);
        const b = this.end.clone().sub(this.begin);
        if (!this.begin.eq(this.end)) {
            param = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
        }
        if (param < 0) {
            return this.begin.clone();
        } else if (param > 1) {
            return this.end.clone();
        }
        return b.clone().multiply(param).add(this.begin);
    }
}
