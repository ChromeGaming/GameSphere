/**
 * 2D Vector math
 */
class Vec {

    /**
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * @returns {Vec}
     */
    clone() {
        return new Vec(this.x, this.y);
    }

    /**
     * @param {Vec} vec
     * @returns {Boolean}
     */
    eq(vec) {
        return this.x == vec.x && this.y == vec.y;
    }

    /**
     * @returns {Number}
     */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * @param {Vec} vec
     * @returns {Vec}
     */
    max(vec) {
        if (this.x > vec.x) {
            this.x = vec.x;
        }
        if (this.x < -vec.x) {
            this.x = -vec.x;
        }
        if (this.y > vec.y) {
            this.y = vec.y;
        }
        if (this.y < -vec.y) {
            this.y = -vec.y;
        }
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vec}
     */
    add(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x += x;
        this.y += y;
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vec}
     */
    sub(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x -= x;
        this.y -= y;
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vec}
     */
    div(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x = x > 0 ? this.x / x : 0;
        this.y = y > 0 ? this.y / y : 0;
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vec}
     */
    multiply(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x *= x;
        this.y *= y;
        return this;
    }

    /**
     * @returns {Vec}
     */
    invert() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * @returns {Vec}
     */
    norm() {
        this.div(this.mag());
        return this;
    }

    /**
     * @returns {Vec}
     */
    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * @returns {Vec}
     */
    bit() {
        this.x = this.x > 0 ? 1 : this.x < 0 ? -1 : 0;
        this.y = this.y > 0 ? 1 : this.y < 0 ? -1 : 0;
        return this;
    }

    /**
     * @returns {Vec}
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

}
