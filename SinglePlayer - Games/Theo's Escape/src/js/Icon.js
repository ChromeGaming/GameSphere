class Icon {

    constructor(ctx) {
        this.draw = new Draw(ctx);
    }

    render(callback) {
        const draw = this.draw;
        const color = draw.grad("#fc0", "#960", 12, -4, -4);
        draw.scale(8)
            .to(12, 12)
            .begin()
            .ellipse(11.3)
            .fill(color)
            .stroke()
            .to(-3, 5)
            .rect(6, 1, 0)
            .end()
            .to(0, -3)
            .ellipse(5)
            .fill(1)
            .ellipse(2)
            .fill(0)
            .merge(false, callback);
    }
}