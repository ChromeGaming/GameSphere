/**
 * Sprite generator class
 */
class Sprite {

    /**
     * @param {Draw} draw
     */
    constructor(draw) {
        this.draw = draw;
    }

    /**
     * @param {Function} callback
     */
    render(callback) {
        const draw = this.draw;
        draw.begin();
        for (let y=1; y>-2; y--) {
            for (let x=-1; x<2; x++) {
                draw.begin().to(x*24+24, y*24+24);
                this.hero(x, y);
                draw.end();
                draw.begin().to(x*24+120, y*24+24);
                this.evil(x, y);
                draw.end();
            }
        }

        draw.begin().to(72, 0);
        this.hero(0, 0, true);
        draw.end();

        draw.begin().to(168, 0);
        this.rod(0, 0, true);
        draw.end();

        draw.to(0, 72);
        for (let a=0; a<3; a++) {
            draw.begin().to(a * 32, 0);
            this.cog(a * 10);
            draw.end();
        }

        draw.to(0, 32);
        this.door();

        draw.to(0, 32);
        for (let a=0; a<6; a++) {
            draw.begin().to(a * 72, 0);
            this.boss(a * 15, a / 2);
            draw.end();
        }

        draw.end().merge(true, callback);
    }

    /**
     * Sentinel sprites
     */
    boss(angle, eye) {
        let dark = "#339",
            light = "#66c";
        this.draw
            .begin()
            .to(36, 36)
            .rotate(angle)
            .to(-6, -32)
            .rect(12, 64, dark)
            .to(-26, 26)
            .rect(64, 12, dark)
            .end()

            .begin()
            .to(36, 36)
            .rotate(angle + 45)
            .to(-6, -32)
            .rect(12, 64, light)
            .to(-26, 26)
            .rect(64, 12, light)
            .end()
            
            .begin()
            .to(16, 20)
            .rect(40, 32)
            .fill(light)
            .stroke(0)
            .to(12, 10)
            .rect(16, 12, 1)
            .to(3 + eye / 2, 2 + eye / 2)
            .rect(10 - eye, 8 - eye, 0)
            .end();
    }

    /**
     * Door and key sprites
     */
    door() {
        let blue = "#669",
            dark = "#003";
        this.draw
            .begin()
            .rect(24, 32, 0)
            .to(1, 1)
            .rect(22, 30, "#960")
            .to(14, 14)
            .rect(5, 2, 0)
            .end()

            .begin()
            .to(24, 0)
            .rect(24, 32, 0)
            .to(12, 19)
            .rect(11, 12, 2)
            .to(-6, 6)
            .rect(17, 6, 3)
            .end()

            .begin()
            .to(60, 8)
            .begin()
            .to(-7, 16)
            .rect(6, 8, dark)
            .to(1, 1)
            .rect(4, 6, blue)
            .end()
            .begin()
            .to(-3, 0)
            .rect(6, 24, dark)
            .to(1, 1)
            .rect(4, 22, blue)
            .end()
            .ellipse(10.5, 7)
            .fill(blue)
            .stroke(dark)
            .ellipse(5, 3)
            .composite("destination-out")
            .fill(1)
            .composite()
            .stroke(dark)
            .end();
    }

    /**
     * Cogs
     * @param {Number} a
     */
    cog(a) {
        const draw = this.draw;
        const color = draw.grad("#ccc", "#666", 16);
        draw.begin()
            .to(16, 16)
            .rotate(a)
            .ngon(15, 15.3, 12)
            .fill(color)
            .stroke()
            .ellipse(3)
            .fill(0)
            .end();
    }

    /**
     * Theodor
     * @param {Number} x
     * @param {Number} y
     * @param {Boolean} dead
     */
    hero(x, y, dead) {
        const draw = this.draw;
        const color = draw.grad("#fc0", "#960", 12, -4, -4);
        draw.to(12, 12)
            .begin()
            .ellipse(11.3)
            .fill(color)
            .stroke()
            .to(-3-x, 5+y)
            .rect(6, 1, 0)
            .end();
        if (dead) {
            draw.to(-4, -2)
                .rect(8, 2, 0);
        } else {
            draw.to(x, y-3)
                .ellipse(5)
                .fill(1)
                .to(x, y)
                .ellipse(2)
                .fill(0);
        }
    }

    /**
     * The Infected Ones
     * @param {Number} x
     * @param {Number} y
     */
    evil(x, y) {
        const draw = this.draw;
        const color = draw.grad("#0c0", "#060", 12, -4, -4);
        draw.to(12, 12)
            .begin()
            .ngon(20, 11.5, 10)
            .fill(color)
            .stroke()
            .to(x, y)
            .ellipse(4.5)
            .fill(1)
            .to(x, y)
            .ellipse(2)
            .fill(0)
            .end();
    }

    /**
     * Mr Rodman
     */
    rod() {
        this.draw
            .begin()
            .to(4, 0)
            .rect(16, 48, 0)
            .to(1, 1)
            .rect(14, 46, 3)
            .to(2, 10)
            .rect(10, 10, 1)
            .to(3, 3)
            .rect(4, 4, 0)
            .to(0, 16)
            .rect(4, 1, 0)
            .end();
    }
}
