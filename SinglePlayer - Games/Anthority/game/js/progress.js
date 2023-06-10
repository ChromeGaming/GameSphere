class Progress extends Widget{
    constructor(scheduler, label, time, callback) {
        super();
        this.scheduler = scheduler;
        this.label = label;
        this.time = time | 1;
        this.value = 0;
        this.callback = callback;
        this.init();
    }

    getHTML() {
        let str = "<li id=\"wprog%1\" class=\"wprogress\"><p>%2</p><progress value=\"0\" max=\"1000\"></progress></li>";
        return str.replace("%1", this.index).replace("%2", this.label);
    }

    init(container) {
        this.elem = cEl(this.getHTML());

        this.container = container;
        this.prog = this.elem.querySelector("progress");
        this.baseTime = this.scheduler.cycle;
        this.uc = this.update.bind(this);
        this.scheduler.addUpdateCallback(this.uc);

        playaudio(SOUNDS.progress_start);
    }
    
    update() {
        this.value = (this.scheduler.cycle - this.baseTime) * 1000 / this.time * this.scheduler.cpt;
        this.prog.value = this.value;

        if (this.value > 1000) {
            this.destroy();
        }
    }
    
    destroy() {
        playaudio(SOUNDS.warn);

        this.scheduler.removeUpdateCallback(this.uc);
        
        if (this.callback) {
            this.callback();
        }
        
        if (this.elem.parentNode) {
            this.elem.parentNode.removeChild(this.elem);
        }
    }
}
