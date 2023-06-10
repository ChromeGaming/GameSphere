/**
 * Camera renderer
 */
class Camera {

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} size
     * @param {String|CanvasGradient} sky
     */
    constructor(ctx, size, sky) {
        this.ctx = ctx;
        this.sky = sky;
        this.size = size;
        this.pos = new Vec();
        this.resize();
    }

    resize() {
        const ctx = this.ctx;
        const size = this.size;
        const canvas = ctx.canvas;
        let w = canvas.clientWidth,
            h = canvas.clientHeight,
            ratio = w / h;
        if (ratio > 1) {
            canvas.width = Math.round(size * ratio);
            canvas.height = size;
        } else {
            canvas.width = size;
            canvas.height = Math.round(size / ratio);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        const out = this.ctx;
        const canvas = out.canvas;
        let w = canvas.width,
            h = canvas.height,
            sw = ctx.canvas.width,
            sh = ctx.canvas.width,
            sx = Math.round(this.pos.x) - Math.round(w / 2),
            sy = Math.round(this.pos.y) - Math.round(h / 2),
            dx = 0,
            dy = 0;
        out.fillStyle = this.sky;
        out.fillRect(0, 0, w, h);
        if (sx < 0) {
            dx = -sx;
            sx = 0;
        }
        if (sy < 0) {
            dy = -sy;
            sy = 0;
        }
        if (sx + w > sw) {
            w = sw - sx;
        }
        if (sy + h > sh) {
            h = sh - sy;
        }
        if (w > 0 && h > 0) {
            out.drawImage(ctx.canvas, sx, sy, w, h, dx, dy, w, h);
        }
    }

}
