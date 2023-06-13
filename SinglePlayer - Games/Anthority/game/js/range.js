class Range extends Widget{
    constructor(min, max, step, label) {
        super();
        this.min = min;
        this.max = max;
        this.val = min;
        this.step = step;
        this.label = label;
        this.init();
    }

    getHTML() {
        let str = "<div class=\"range\"><h1>%2</h1><div class=\"range-controls\"><a href=\"javascript:;\" class=\"button inline-button small-button\">-</a><span>0</span><a href=\"javascript:;\" class=\"button inline-button small-button\">+</a></div></div>";
        return str.replace("%2", this.label);
    }

    init() {
        this.elem = cEl(this.getHTML());

        this.valLabel = this.elem.querySelector("span");
        this.elem.querySelector(".button:first-child").onclick = this.less.bind(this);
        this.elem.querySelector(".button:last-child").onclick = this.more.bind(this);
        this.update();
    }

    less() {
        playaudio(SOUNDS.range_change);
        this.val = clamp(this.val - this.step, this.min, this.max);
        this.update();
    }
    
    more() {
        playaudio(SOUNDS.range_change);
        this.val = clamp(this.val + this.step, this.min, this.max);
        this.update();
    }

    update() {
        this.valLabel.innerText = this.val;
    }
}
