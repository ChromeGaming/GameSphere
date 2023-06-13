/**
 * Canvas draw tool
 */
class Draw {

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {
        this.ctx = ctx;
        this.rgb = [
            "#000",                    // 0 = black
            "#fff",                    // 1 = white
            "#666",                    // 2 = dark grey
            "#999",                    // 3 = grey
            "#ccc",                    // 4 = light gray
            "rgba(192,192,192,.9)"
        ];
        ctx.font = "13px sans-serif";
    }

    /**
     * @param {Number|String|CanvasGradient} value
     */
    color(value) {
        value = value || 0;
        return value in this.rgb ? this.rgb[value] : value;
    }

    /**
     * @param {Number|String|CanvasGradient} color
     * @param {Number} blur
     * @param {Number} x
     * @param {Number} y
     */
    shadow(color, blur, x, y) {
        const ctx = this.ctx;
        ctx.shadowColor = this.color(color || 0);
        ctx.shadowBlur = blur || 3;
        ctx.shadowOffsetX = x || 0;
        ctx.shadowOffsetY = y || 0;
        return this;
    }

    /**
     * Radial gradient
     * @param {Number|String|CanvasGradient} color0
     * @param {Number|String|CanvasGradient} color1
     * @param {Number} r
     * @param {Number} x
     * @param {Number} y
     */
    grad(color0, color1, r, x, y) {
        const ctx = this.ctx;
        const color = ctx.createRadialGradient(x || 0, y || 0, 0, 0, 0, r);
        color.addColorStop(0, color0);
        color.addColorStop(1, color1);
        return color;
    }

    /**
     * Linear gradient
     * @param {Number|String|CanvasGradient} color0
     * @param {Number|String|CanvasGradient} color1
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */
    glin(color0, color1, x1, y1, x2, y2) {
        const ctx = this.ctx;
        const color = ctx.createLinearGradient(x1, y1, x2, y2);
        color.addColorStop(0, color0);
        color.addColorStop(1, color1);
        return color;
    }

    /**
     * Context save
     */
    begin() {
        this.ctx.save();
        return this;
    }

    /**
     * Context restore
     */
    end() {
        this.ctx.restore();
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     */
    scale(x, y) {
        this.ctx.scale(x, y || x);
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     */
    to(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        this.ctx.translate(x, y);
        return this;
    }

    /**
     * @param {Number} angle
     */
    rotate(angle) {
        this.ctx.rotate(angle * Math.PI / 180);
        return this;
    }

    /**
     * Composition type
     * @param {String} type
     */
    composite(type) {
        this.ctx.globalCompositeOperation = type || "source-over";
        return this;
    }

    /**
     * @param {Number|String|CanvasGradient} color
     */
    fill(color) {
        const ctx = this.ctx;
        ctx.fillStyle = this.color(color);
        ctx.fill();
        return this;
    }

    /**
     * @param {Number|String|CanvasGradient} color
     * @param {Number} size
     */
    stroke(color, size) {
        const ctx = this.ctx;
        ctx.lineWidth = size || 1;
        ctx.strokeStyle = this.color(color);
        ctx.stroke();
        return this;
    }

    /**
     * @param {Number} width
     * @param {Number} height
     */
    clear(width, height) {
        const canvas = this.ctx.canvas;
        this.ctx.clearRect(0, 0, width || canvas.width, height || canvas.height);
        return this;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     */
    line(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.closePath();
        return this;
    }

    /**
     * @param {Number} width
     * @param {Number} height
     * @param {Number|String|CanvasGradient} color
     */
    rect(width, height, color) {
        const ctx = this.ctx;
        if (color !== undefined) {
            ctx.fillStyle = this.color(color);
            ctx.fillRect(0, 0, width, height);
            return this;
        }
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.closePath();
        return this;
    }

    /**
     * @param {Number} rad1
     * @param {Number} rad2
     * @param {Number} angle
     */
    ellipse(rad1, rad2, angle) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.ellipse(0, 0, rad1, rad2 || rad1, angle || 0, 0, 2 * Math.PI);
        ctx.closePath();
        return this;
    }

    /**
     * NGon draw
     * @param {Number} num
     * @param {Number} rad1
     * @param {Number} rad2
     */
    ngon(num, rad1, rad2) {
        const ctx = this.ctx;
        ctx.beginPath();
        for (let i = 0; i < num; i++) {
            let a = Math.PI * 2 / num;
            if (i > 0) {
                let b = a * i;
                ctx.lineTo(Math.sin(b) * rad1, Math.cos(b) * rad1);
            } else {
                ctx.moveTo(0, rad1);
            }
            if (rad2) {
                let c = a * (i + 0.5);
                ctx.lineTo(Math.sin(c) * rad2, Math.cos(c) * rad2);
            }
        }
        ctx.closePath();
        return this;
    }

    /**
     * @param {Vec[]} dots
     */
    path(dots) {
        const ctx = this.ctx;
        let dot = dots[0];
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        for (let i = 1; i < dots.length; i++) {
            dot = dots[i];
            ctx.lineTo(dot.x, dot.y);
        }
        ctx.closePath();
        return this;
    }

    /**
     * Save image
     * @param {Boolean} store use as sprite
     * @param {Function} callback on loaded
     */
    merge(store, callback) {
        const img = new Image();
        img.src = this.ctx.canvas.toDataURL();
        if (store) {
            this.store = img;
        }
        if (callback) {
            img.onload = () => callback.call(img);
        }
        return img;
    }

    /**
     * Text message
     * @param {String} value
     * @param {Number|String|CanvasGradient} color
     * @param {Number|String|CanvasGradient} back
     * @param {Boolean} say
     */
    text(value, color, back, say) {
        const ctx = this.ctx;
        let line = 14,
            width = 0,
            height = 0;
        if (!(value instanceof Array)) {
            value = [value];
        }
        value.forEach((row) => {
            let size = ctx.measureText(row);
            if (size.width > width) {
                width = size.width;
            }
        });
        height = line * value.length;
        this.begin();
        if (say) {
            this.ngon(3, 5)
                .fill(back)
                .to(-15, -7-height);
        }
        this.rect(width + 10, height + 6, back);
        ctx.fillStyle = this.color(color);
        for (let i = 0; i < value.length; i++) {
            ctx.fillText(value[i], 5, i * line + 14);
        }
        return this.end();
    }

    /**
     * @param {Image} img
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    img(img, x, y, w, h) {
        this.ctx.drawImage(img, x || 0, y || 0, w || img.width, h || img.height);
        return this;
    }

    /**
     * @param {Number} sx
     * @param {Number} sy
     * @param {Number} sw
     * @param {Number} sh
     * @param {Number} dx
     * @param {Number} dy
     * @param {Number} dw
     * @param {Number} dh
     */
    sprite(sx, sy, sw, sh, dx, dy, dw, dh) {
        this.ctx.drawImage(this.store, Math.round(sx), Math.round(sy), sw, sh, Math.round(dx || 0), Math.round(dy || 0), dw || sw, dh || sh);
        return this;
    }

}
