class TimeSchedule {
    constructor() {
        this.schedules = [];
        this.hour = 0;
        this.day = 0;
        this.time = 0;
        this.cycle = 0;

        this.updateCallbacks = [];
    }
    
    addUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    removeUpdateCallback(callback) {
        this.updateCallbacks.splice(this.updateCallbacks.indexOf(callback), 1);
    }
    
    update() {
        this.cycle += TIME_SCALE;

        this.time = this.cycle * (TIME_INTERVAL / 1000) *  (TIME_PACE / 60);
        this.hour = Math.floor(this.time % 24);
        this.day = Math.floor(this.time / 24);

        this.cpt = this.time / this.cycle;

        this.updateCallbacks.forEach(f => f());
    }
    
    pause() {
        clearInterval(this.timeInterval);
    }
    
    play() {
        this.timeInterval = setInterval(this.update.bind(this), TIME_INTERVAL);
    }
}