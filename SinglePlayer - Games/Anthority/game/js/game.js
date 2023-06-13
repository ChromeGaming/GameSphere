class Game {
    constructor() {
        this.energy = 10;
        this.ants = this.total_ants = 10;
        this.defense = 1.0;
        this.alive = true;

        this.actionMenu = true;

        this.balance = new GameBalance();
        this.time = new TimeSchedule();
        this.time.addUpdateCallback(this.timeUpdate.bind(this));

        this.initMap();
        this.initUI();
    }
    
    initUI() {
        this.container = gId("game");

        this.actionFindFood = gId("btnScout");
        this.actionHatchEggs = gId("btnHatch");
        this.actionBuildRoom = gId("btnBuildRoom");

        this.header = gId("header");
        this.labelEnergy = gId("energy");
        this.labelAnts = gId("ants");
        this.labelDefense = gId("defense");
        this.labelHour = gId("hour");
        this.labelDay = gId("day");

        this.labelAvCells = gId("avcells");
        this.labelCells = gId("cells");
        this.labelCapacity = gId("capacity");

        this.statusContainer = qSel("#status ul");
        this.mapContainer = gId("map");
        this.actionsContainer = gId("actions");
    
        this.actionFindFood.onclick = this.doFindFood.bind(this);
        this.actionHatchEggs.onclick = this.doHatchEggs.bind(this);
        this.actionBuildRoom.onclick = this.doBuildRoom.bind(this);

        this.mapContainer.onclick = this.toggleActions.bind(this, true);

        this.update();
    }

    toggleActions(close = false) {
        if (this.actionMenu) {
            this.actionMenu = false;
            this.actionsContainer.classList.add("collapse");
            
            if (close && window.matchMedia("(max-width: 768px)").matches) {
                playaudio(SOUNDS.action_close);
            }

        } else {
            this.actionMenu = true;
            this.actionsContainer.classList.remove("collapse");

            if (window.matchMedia("(max-width: 768px)").matches) {
                playaudio(SOUNDS.action_open);
            }
        }
    }

    hide() {
        this.container.classList.add("screenhidden");
    }
    
    show() {
        this.container.classList.remove("screenhidden");
    }
     
    addProgress(p) {
        this.statusContainer.appendChild(p.elem);
    }

    hasProgress() {
        return this.statusContainer.childElementCount > 0;
    }

    checkGameStatus() {
        this.defense = this.ants / this.map.capacity();

        if (this.alive) {
            if (this.defense < .1) {
                if (randnum() < (1 - (this.defense * 5))) {
                    this.sufferAttack();
                    return;
                }
            } 
            
            if (this.energy == 0 && !this.hasProgress() && !dialog.active) {
                this.sufferAttack();
            }

            if (this.map.completed()) {
                this.winGame();
            }
        }
    }
    
    update() {
        this.checkGameStatus();
        this.updateUI();
    }

    updateUI() {
        this.labelEnergy.innerText = this.energy;
        this.labelAnts.innerText = this.ants;
        this.labelDefense.innerText = Math.ceil(this.defense * 100) + "%";

        this.labelAvCells.innerText = this.map.map.length;
        this.labelCells.innerText = this.map.ownedRooms;
        this.labelCapacity.innerText = this.map.capacity();
        
        this.header.classList.remove("hhighlight");
        this.header.offsetWidth;
        this.header.classList.add("hhighlight");
    }

    sufferAttack() {
        this.time.pause();
        this.alive = false;

        playaudio(SOUNDS.attack);
        
        showDialogOk("Defenses Down", TEXTS.sufferAttack, 
            this.gameOver.bind(this));
    }

    gameOver() {
        dialog.flush();
        
        co(function*() {
            fadeOut();
            yield 1.5;
            game.hide();
            messenger.playGameOver();
            yield .1;
            fadeIn();
        });
    }
    
    winGame() {
        dialog.flush();
        this.alive = false;
        
        co(function*() {
            fadeOut();
            yield 1.5;
            game.hide();
            messenger.playWinGame();
            yield .1;
            fadeIn();
        });
    }

    disableButton(elem) {
        elem.classList.add("disabled");
    }

    enableButton(elem) {
        elem.classList.remove("disabled");
    }

    timeUpdate() {
        this.labelHour.innerText = fmt(this.time.hour, "00");
        this.labelDay.innerText = this.time.day;

        this.checkGameStatus();
    }

    initMap() {
        this.map = new Map();
        this.map.init(MAP, "mapcanvas");
    }

    // Actions
    doFindFood() {
        this.toggleActions();

        let dist = new Range(10, 100, 5, "Distance");
        let ants = new Range(1, this.ants, 1, "Scouts");
        let info = new InfoWidget(this.time, 
            this.balance.time_find_food.bind(null, dist, ants), 
            this.balance.energy_find_food.bind(null, ants));

        showDialogWidget("Find Food", "<p>Choose how many ants you want to send and the search radius.</p>", [
            dist, ants, info], this.sendScouts.bind(this));
    }
    
    doHatchEggs() {
        this.toggleActions();

        const maxEggs = Math.min(this.ants, (this.map.capacity() - this.total_ants));

        if (maxEggs <= 0) {
            const txt = "<div>"+ TEXTS.defaultError + TEXTS.hatchEggError + "</div>";
            showDialogOk("Error: Hatch Eggs", txt, () => {});
        } else {
            let eggs = new Range(1, maxEggs, 1, "Eggs");
            let info = new InfoWidget(this.time, 
                this.balance.time_hatch_egg.bind(null, eggs),
                this.balance.energy_hatch_egg.bind(null, eggs));
    
            showDialogWidget("Hatch Eggs", "<div><p>How many eggs you want to hatch?</p></div>", 
            [eggs, info], this.hatchEggs.bind(this));
        }
    }
    
    doBuildRoom() {
        this.toggleActions();

        const e = this.balance.value_room_energy(this.map.ownedRooms);
        const a = this.balance.value_room_ants(this.map.ownedRooms);
        const t = Math.floor(this.balance.time_build_room() / 24);

        if (e > this.energy || a > this.ants) {
            const txt = "<div>"+ TEXTS.defaultError + repltxt(TEXTS.buildRoomPrompt, [e, a, t]) + "</div>";
            showDialogOk("Error: Build Cell", txt, () => {});
        } else {
            let info = new InfoWidget(this.time, 
                this.balance.time_build_room,
                this.balance.value_room_energy.bind(null, this.map.ownedRooms));

            showDialogWidget("Build Cell", repltxt(TEXTS.buildRoomPrompt, [e, a, this.balance.time_build_room()]),
            [info],
            this.buildRoom.bind(this, e, a, t));
        }

        this.update();
    }

    // Create jobs
    sendScouts([dist, ants, info]) {
        info.destroy();
        const energy = this.balance.energy_find_food(ants);

        if (energy > this.energy) {
            showDialogOk("Error", TEXTS.energyError, () => {});
        } else {
            let progress = new Progress(this.time, "Scouts", 
                this.balance.time_find_food(dist, ants),
                this.evaluateScouts.bind(this, dist.val, ants.val));
            this.addProgress(progress);

            this.energy -= energy;
            this.ants -= ants.val;
            this.update();
        }

        this.update();
    }

    hatchEggs([eggs, info]) {
        info.destroy();

        const energy = this.balance.energy_hatch_egg(eggs);

        if (energy > this.energy) {
            showDialogOk("Error", TEXTS.energyError, () => {});
        } else {
            let progress = new Progress(this.time, "Hatching Eggs", 
                this.balance.time_hatch_egg(eggs),
                this.evaluateEggs.bind(this, eggs.val));
            this.addProgress(progress);
    
            this.disableButton(this.actionHatchEggs);
    
            this.energy -= energy;
            this.ants -= eggs.val;
        }

        this.update();
    }

    buildRoom(energy, ants, time, [info]) {
        info.destroy();

        let progress = new Progress(this.time, "Building a Room", 
            time,
            this.placeRoom.bind(this, ants));
        this.addProgress(progress);

        this.disableButton(this.actionBuildRoom);

        this.energy -= energy;
        this.ants -= ants;
        this.update();
    }
    
    play() {
        this.show();
        this.time.play();
        this.map.updateSize();
    }
    
    // Evaluation methods
    evaluateScouts(dist, ants) {
        const r = this.balance.evaluateScouts(dist, ants);
        this.ants += r.ants;

        let rants = new Range(1, this.ants, 1, "Ants");
        let info = new InfoWidget(this.time, 
            this.balance.time_get_food.bind(null, r.dist, rants, r.energy),
            this.balance.energy_get_food.bind(null, rants));
        
        showDialogWidget(
            "Scout Result",
            repltxt(TEXTS.scoutFound, [r.ants, r.dist, r.source.n, r.energy]),
            [rants, info], 
            this.goGetFood.bind(this, r));
        
        this.update();
    }

    evaluateEggs(eggs) {
        let r = this.balance.evaluateEggs(eggs);

        showDialogOk("Hatch Eggs", repltxt(TEXTS.hatchResults, [r.eggsHatched]), (() => {
            this.ants += r.ants + r.eggsHatched;
            this.total_ants += r.eggsHatched;
            this.enableButton(this.actionHatchEggs);
            this.update();
        }).bind(this), false);

        this.update();
    }

    evaluateResources(v) {
        const r = this.balance.evaluateResources(v);

        const lostAntsText = r.lostants > 0 ? repltxt(TEXTS.lostAnts, [r.lostants]) : "";

        this.energy += r.energy;

        showDialogOk("Resource Fetching", repltxt(TEXTS.fetchedResources, [r.energy, lostAntsText]), (() => {
            this.ants += r.ants;
            this.total_ants -= r.lostants;
            this.update();
        }).bind(this), false);
    }

    placeRoom(ants) {
        showDialogOk("Build Room", repltxt(TEXTS.buildRoomResult, [this.map.nextcapacity()]), (() => {
            this.map.buildRoom();
            this.ants += ants;
            this.enableButton(this.actionBuildRoom);
            this.update();
            playaudio(SOUNDS.built_cell);
            this.checkGameStatus();
        }).bind(this), false);

        this.update();
    }
    
    goGetFood(v, [ants, info]) {
        info.destroy();

        const energy = this.balance.energy_get_food(ants);

        if (energy > this.energy) {
            showDialogOk("Error", TEXTS.energyError, () => {});
        } else {
            let progress = new Progress(this.time, "Fetching Resources", 
                this.balance.time_get_food(v.dist, ants, v.energy),
                this.evaluateResources.bind(this, v));
            this.addProgress(progress);

            this.energy -= energy;
            this.ants -= v.ants;
        }

        this.update();
    }
}
