class InfoWidget extends Widget{
    constructor(scheduler, timefunc, energyfunc) {
        super();
        this.scheduler = scheduler;
        this.timefunc = timefunc;
        this.energyfunc = energyfunc;
        this.init();
    }

    init() {
        let elem_energy = cEl(TEXTS.infoWidgetEnergy);
        let elem_hours = cEl(TEXTS.infoWidgetHours);
        let elem_days = cEl(TEXTS.infoWidgetDays);
        let elem_cost = cEl(TEXTS.infoWidget);

        this.value_energy = elem_energy.querySelector("span");
        this.value_hours = elem_hours.querySelector("span");
        this.value_days = elem_days.querySelector("span");

        this.elem = cEl("<div class=\"infowidget\"></div>");
        this.elem.appendChild(elem_cost);
        this.elem.appendChild(elem_hours);
        this.elem.appendChild(elem_days);
        this.elem.appendChild(elem_energy);

        this.uc = this.update.bind(this);
        this.scheduler.addUpdateCallback(this.uc);
    }
    
    update() {
        const hours = Math.ceil(this.timefunc());
        const energy = Math.ceil(this.energyfunc());

        this.value_energy.innerText = energy;
        this.value_days.innerText = Math.floor(hours / 24);
        this.value_hours.innerText = Math.floor(hours % 24);
    }
    
    destroy() {
        this.scheduler.removeUpdateCallback(this.uc);
    }
}