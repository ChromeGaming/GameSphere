(function () {
    'use strict';

    let sounds;
    const setSounds = () => {
        if (!Sound) throw new Error('no Sound');
        if (sounds) return; // already set
        const s = (a) => new Sound(a);
        sounds = {
            // for some reason, the property names were getting uglified so they need quotes
            'hit': s([,,183,.03,.02,.09,,1.49,-1.8,,,,-0.01,1.8,-1,.1,,.36,.08,.25]),
            'attack': s([,,493,.01,.09,0,4,1.14,,,,,,,,.1,,.1,.01]),
            'craft': s([,,7,.03,.28,.44,2,1.44,,-0.3,20,.11,.04,,,.1,,.55,.29]),
            'dud': s([.8,,112,,.07,.05,1,2.26,-0.6,,,,,1.8,,.1,.2,.98,.1,.1]),
            'powerup': s([,,1152,,.04,.17,,1.21,,,744,.08,,,,,,.91,.03]),
            'pickup': s([1.05,,172,.02,,.17,2,.02,,,-409,.06,,,,.1,,.55,,.19]),
            'walk': s([.65,.1,70,,,.01,4,,,,-9,.1,,,,,,.5]),
            'consume': s([1.2,,16,.07,.18,.34,1,.38,-0.1,-5.6,49,.15,.02,-0.1,36,.1,,.39,.14]),
        };
    };

    const playSound = (name, pos) => {
        setSounds();
        if (!sounds) throw new Error('no sounds');
        if (!sounds[name]) { console.warn('No sound', name, 'in', sounds); return; }
        sounds[name].play(pos);
    };

    let achievements = [
        ['Move (W,A,S,D or Arrows)'], // 0
        ['Pick up and equip knife (#)'], // 1
        ['Stab an animal'], // 2
        ['Make forbidden wine (9 blood)'], // 3
        ['Breed animals (with herbs)'], // 4
        ['Collect 13 meat'], // 5
        ['Eat a meaty, home-cooked meal'], // 6
    ];
    let a = achievements;
    a.award = (n) => {
        if (!a[n][1]) playSound('powerup');
        a[n][1] = (a[n][1] || 0) + 1;
    };
    a.count = () => a.reduce((c, x) => c + (x[1] ? 1 : 0), 0);

    const size = 24;
    const ri$1 = randInt;
    const MUTANT_CHANCE = 20; // 1 out of 20

    function fixPoint(n) {
    	return Math.max(Math.min(Math.round(n), size), 0);
    }

    function addMid(obj) {
    	obj.midX = fixPoint(obj.x + (obj.sizeX / 2));
    	obj.midY = fixPoint(obj.y + (obj.sizeY / 2));
    	obj.endX = fixPoint(obj.x + obj.sizeX);
    	obj.endY = fixPoint(obj.y + obj.sizeY);
    }

    function getSpecies(color) {
    	let r = color ? color.r * 255 : ri$1(180) + 20,
    		g = color ? color.g * 255 : ri$1(180) + 20,
    		b = color ? color.b * 255 : ri$1(180) + 20;
    	const bodyW = ri$1(6, size * .6),
    		bodyL = ri$1(6, size * .6),
    		bodyH = ri$1(5, size * .6);
    	const bodyLevel = ri$1(0, size - bodyH - 2); // leave space for feet
    	const headH = ri$1(6, size * .5); // size / 3 + rand(size / 5);
    	const headW = ri$1(8, size * .6);
    	const headLevel = ri$1(0, size - headH - size * .2);
    	const eyeLevel = ri$1(2, headH - 4);
    	const eyeGap = ri$1(1, headW * .5);
    	const mouthW = ri$1(3, headW - 4);
    	const mouthH = ri$1(1, 2);
    	return {
    		baseColor: [r-20,g-20,b-10],
    		backColor: [r-40,g-40,b-20],
    		forwardColor: [r,g,b],
    		eyeColor: (ri$1(2) === 0) ? [0,0,0] : [200,200,200],
    		headW, headH, headLevel,
    		bodyW, bodyL, bodyH, bodyLevel,
    		eyeW: ri$1(1, 3),
    		eyeH: ri$1(1, 3),
    		eyeLevel,
    		eyeGap,
    		mouthW,
    		mouthH,
    		mouthLevel: ri$1(2, headH - eyeLevel - mouthH),
    		frontKneeBend: ri$1(-4, -1),
    		backKneeBend: ri$1(-4, 3),
    		kneeWidth: 2,
    		legWidth: Math.min(bodyW / 2, ri$1(1, 6)),
    	};
    }

    function breedRandomValue(bioParents, key) {
    	// First parent in array is considered the dominant parent
    	const dominantParentValue = bioParents[0][key];
    	// If it's a number value, then determine randomly
    	if (typeof dominantParentValue === 'number') {
    		const range = bioParents.reduce((rangeArr, species) => {
    			const value = species[key];
    			if (value < rangeArr[0]) rangeArr[0] = value;
    			if (value > rangeArr[1]) rangeArr[1] = value;
    			return rangeArr;
    		}, [Infinity, -Infinity]); // index 0 is min, index 1 is max
    		return ri$1(range[0], range[1]);
    	}
    	// Otherwise just use the dom parent's value e.g. for colors
    	return dominantParentValue;
    }

    function breedSpecies(bioParents) {
    	if (!bioParents) return;
    	const newDna = getSpecies();
    	Object.keys(newDna).forEach((key) => {
    		if (ri$1(MUTANT_CHANCE) > 0) newDna[key] = breedRandomValue(bioParents, key);
    	});
    	return newDna;
    }

    function getLegPoints(x, y, kneeY, legWidth, kneeBend, kneeWidth, lift) {
    	const len = size - y;
    	const liftAmount = Math.floor((len / 2) * lift);
    	const footY = size - liftAmount;
    	const liftKneeY = kneeY - (liftAmount / 2);
    	// TODO: This is not symmmetric, doesn't look correct when leg is pointing right
    	const kneeX = Math.max(0, x + kneeBend + (kneeBend * lift));
    		return [
    		x, y, // hip - top left
    		x + legWidth, y, // hip - top right
    		kneeX + kneeWidth, liftKneeY, // right side of knee (back if left)
    		x + legWidth, footY, // foot (heel if left)
    		x, footY, // foot - toe
    		kneeX, liftKneeY, // knee
    	];
    }

    function drawSpecies(ctx, pos, species, direction = 4, t = 0) {
    	// const { x, y } = worldToScreen(pos);
    	const {
    		baseColor, backColor, forwardColor, eyeColor,
    		bodyW, bodyL, bodyH, bodyLevel,
    		headW, headH, headLevel,
    		eyeW, eyeH, eyeLevel, eyeGap,
    		mouthW, mouthH, mouthLevel,
    		frontKneeBend, backKneeBend, kneeWidth, legWidth,
    	} = species;
    	const showEyes = (direction >= 2 && direction <= 6);
    	const kneeDirectionMultipliers = [0, -.5, -1, -.5, 0, .5, 1, .5];
    	const kneeDirectionMultiplier = kneeDirectionMultipliers[direction];
    	const xMultipliers = [.5, .75, 1, .75, .5, .25, 0, .25];
    	const xMultiplier = xMultipliers[direction];
    	const head = {
    		x: (size - headW) * xMultiplier,
    		y: headLevel,
    		sizeX: headW, sizeY: headH,
    	};
    	const bodyActualW = (bodyW + bodyL) / 2;
    	const bodyXMult = ((1 - xMultiplier) + 1) / 3; // once we get body actualW working we can decrease this effect and make it .5
    	const body = {
    		x: (size - bodyActualW) * bodyXMult,
    		y: bodyLevel,
    		sizeX: bodyActualW, sizeY: bodyH,
    	};
    	addMid(head);
    	addMid(body);
    	const legLength = (size - body.endY) / 2;
    	const kneeY = fixPoint(body.endY + legLength);
    	const lift = (Math.sin(t) + 1) / 2;
    	const kneeBend = frontKneeBend * kneeDirectionMultiplier;
    	const frontLegPoints = getLegPoints(body.x, body.endY, kneeY, legWidth, kneeBend, kneeWidth, 1 - lift);
    	const backLegPoints = getLegPoints(body.endX - legWidth, body.endY, kneeY, legWidth, kneeBend, kneeWidth, lift);
    	const neckPoints = [
    		head.midX - (headW / 4), head.midY,
    		head.midX + (headW / 4), head.midY,
    		body.midX + (bodyActualW / 4), body.midY - 1,
    		body.midX - (bodyActualW / 4), body.midY - 1,
    	];
    	const headCenterX = head.x + (headW * xMultiplier);
    	const eyeOffset = Math.max(1, eyeGap / 2);
    	const eye1 = {
    		x: headCenterX - eyeOffset - eyeW,
    		y: head.y + eyeLevel,
    		sizeX: eyeW, sizeY: eyeH,
    	};
    	const eye2 = {
    		x: headCenterX + eyeOffset,
    		y: eye1.y,
    		sizeX: eyeW, sizeY: eyeH,
    	};
    	const mouthX = Math.max(headCenterX - (mouthW / 2), head.x);
    	const mouthEndX = Math.min(mouthX + mouthW, head.endX);
    	const mouth = {
    		x: mouthX,
    		y: head.y + eyeLevel + mouthLevel,
    		sizeX: mouthEndX - mouthX,
    		sizeY: mouthH,
    	};

    	// TODO: Fix this?
    	const offsetX = -.5; // -12;
    	const offsetY = -.5; // -12;
    	const offsetScale = 0.055;
      	const drawMyPolygon = (p, c) => {
    		drawCanvas2D(pos, vec2(offsetScale), 0, 0, (ctx) => drawPolygon(ctx, offsetX, offsetY, p, c));
    	};
    	const drawMyPart = (p, c) => {
    		drawCanvas2D(pos, vec2(offsetScale), 0, 0, (ctx) => drawPart(ctx, offsetX, offsetY, p, c));
    	};
    	if (!showEyes) {
    		drawMyPart(head, backColor);
    		drawMyPolygon(neckPoints, baseColor);
    		drawMyPolygon(frontLegPoints, baseColor);
    		drawMyPolygon(backLegPoints, baseColor);
    		drawMyPart(body, baseColor);
    	} else {
    		drawMyPart(body, baseColor);
    		drawMyPolygon(neckPoints, baseColor);
    		drawMyPolygon(frontLegPoints, baseColor);
    		drawMyPolygon(backLegPoints, baseColor);
    		drawMyPart(head, forwardColor);
    		if (eye1.x >= head.x) {
    			drawMyPart(eye1, eyeColor);
    		}
    		if (eye2.x <= head.x + headW) {
    			drawMyPart(eye2, eyeColor);
    		}
    		drawMyPart(mouth, [0,0,0]);
    	}
    }

    function getColorStyle(color) {
    	if (!color) return '#fff';
      const c = (i) => Math.max(0, Math.min(255, color[i]));
      return `rgb(${c(0)},${c(1)},${c(2)}`;
    }

    function drawPolygon(ctx, x, y, points, color) {
    	ctx.fillStyle = getColorStyle(color);
    	ctx.beginPath();
    	points.forEach((n, i) => {
    		if (i % 2 === 1) return; // skip odd indices
    		const fn = i === 0 ? 'moveTo' : 'lineTo';
    		ctx[fn](
    			Math.round(x * size + n),
    			Math.round(y * size + points[i + 1])
    		);
    	});
    	ctx.closePath();
    	ctx.fill();
    }

    function drawPart(ctx, x, y, part, color) {
    	ctx.fillStyle = getColorStyle(color);
    	ctx.fillRect(
    		Math.round(x * size + part.x),
    		Math.round(y * size + part.y),
    		Math.round(part.sizeX),
    		Math.round(part.sizeY),
    	);
    }

    const nc = (...a) => new Color(...a);

    /** A WorldEntity is a generic "thing" that exists in the world */
    class WorldEntity extends EngineObject {
        constructor(entOptions = {}) {
            const {
                pos = vec2(),
                size = vec2(1),
                tileIndex = 1,
                tileSize,
                angle,
                world,
                damaging = 0,
                name = randInt(999),
                health = 0,
            } = entOptions;
            super(pos, size, tileIndex, tileSize, angle);
            this.name = name;
            this.world = world;
            this.facing = PI; // Radians: 0 = up, PI = down
            this.direction = 4; // 0-7
            this.damageTimer = new Timer;
            this.health = health;
            this.damaging = damaging;
            // 0 = up, 1 = right-up, 2 = right, 3 = right-down, 4 = down, 5 = left-down, 6 = left, 7 = left-up
            this.drawSize = vec2(1);
            // this.tileIndex = 1;
        }

        getTileData() {
            const direction = randInt(4);
            const mirror = randInt(2);
            const color = randColor();
            return new TileLayerData(this.tileIndex, direction, mirror, color);        
        }

        setDirection() {
            this.direction = Math.round(
                (this.facing < 0) ? 4 + ((PI + this.facing) * 4 / PI) : (this.facing * 4 / PI)
            ) % 8;
        }

        damage(damage, damagingObject) {
            ASSERT(damage >= 0);
            if (this.isDead()) return 0;
            if (this.damageTimer.active()) return 0;

            // set damage timer;
            this.damageTimer.set(1);
            for (const child of this.children)
                child.damageTimer && child.damageTimer.set(1);
            // apply damage and kill if necessary
            const newHealth = max(this.health - damage, 0);
            const amountDamaged = this.health - newHealth;
            this.health = newHealth;
            if (!this.health) this.kill(damagingObject);
            return amountDamaged;
        }

        isDead() { return !this.health; }
        kill() { this.destroy(); }

        update() {
            super.update();
            this.setDirection();

            // flash white when damaged
            if (!this.isDead() && this.damageTimer.isSet()) {
                const a = .5*percent(this.damageTimer.get(), .15, 0);
                this.additiveColor = nc(a,.1,.1,.5);
            } else this.additiveColor = nc(0,0,0,0);
        }

        findPc() {
            return this.world.animals.find((a) => a.isPlayerCharacter && !a.isDead());
        }
    }

    class CharacterEntity extends WorldEntity {
        constructor(entOptions) {
            super(entOptions);
            this.actionTimer = new Timer;
            this.lookTimer = new Timer;
            this.planTimer = new Timer(20);
            this.agingTimer = new Timer;
            this.bleedTimer = new Timer;
            this.walkSoundTimer = new Timer;
            this.lungeTimer = new Timer;
            // Emotions
            this.emotionKey = null;
            this.estrousTimer = new Timer; // "in heat"?
            this.fearTimer = new Timer;
            // Fixed values
            this.color = (new Color).setHSLA(rand(),1,.7);
            this.bioParents = entOptions.bioParents || null;
            this.species = entOptions.species || breedSpecies(this.bioParents) || getSpecies(this.color);
            this.renderOrder = 10;
            this.health = 2;
            this.speedRamp = 0; // 0-1 ~ acceleration
            this.maxSpeed = .26;
            this.lookRange = 7;
            this.oldAge = Infinity;
            this.timid = false;
            this.followsBait = false;
            this.setCollision(1);
            // Changeable / temp values
            this.age = 0;
            this.walkTick = 0;
            this.walkCyclePercent = 0;
            this.urgency = 1;
            this.movementVelocity = vec2();
            this.moveInput = vec2();
            // New
            this.max = vec2(window.TILE_SIZE);
            // this.head = vec2(12 + randInt(12), 12 + randInt(4));
            // this.body = vec2(12 + randInt(12), 12 + randInt(4));
            // this.head = vec2(0.5, 0.3);
            // this.body = vec2(0.6, 0.3);
            // this.legs = [
            //     // hip, knee, foot
            //     [vec2(-.2, -.1), vec2(-.3, -.3), vec2(-.2, -.5)],
            //     [vec2(.2, -.1), vec2(.3, -.3), vec2(.2, -.5)],
            // ];
            this.drawScale = this.drawSize.x / this.size.x;
            this.inventory = [,,,,,,,,,,];
            this.equipIndex = -1;
            this.equippedEntity = null;
            this.walkTarget = null; // vec2();

            this.addChild(this.emotionEntity = new WorldEntity({ tileIndex: 9 }));
            this.emotionEntity.localPos = vec2(0, 1.2);
            this.setEmotion();

            this.addChild(this.bloodEmitter = new ParticleEmitter(
                vec2(), 0, 0, 0, 0, PI,  // pos, angle, emitSize, emitTime, emitRate, emiteCone
                undefined, undefined, // tileIndex, tileSize
                nc(1,.2,.2), nc(.5,.1,.1), // colorStartA, colorStartB
                nc(.4,.1,.1), nc(.4,.2,.2,.3), // colorEndA, colorEndB
                5, .2, .1, .07, .1, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                .95, .95, 1, PI, .01,    // damping, angleDamping, gravityScale, particleCone, fadeRate, 
                .2, 1              // randomness, collide, additive, randomColorLinear, renderOrder
            ), vec2(), 0);
            this.bloodEmitter.elasticity = .5;
            // this.bloodEmitter.particleDestroyCallback = persistentParticleDestroyCallback;
        }

        setEmotion(emotionKey) {
            const emotionTiles = { 'estrous': 9, 'fear': 10, 'anger': 11, 'dead': 12 };
            this.emotionEntity.drawSize = vec2(emotionKey ? 1 : 0);
            if (!emotionKey) return;
            this.emotionEntity.tileIndex = emotionTiles[emotionKey];
        }

        updateEmotion() {
            if (this.isDead()) this.emotionKey = 'dead';
            else {
                const estrous = -1 * this.estrousTimer.get();
                const fear = -1 * this.fearTimer.get();
                if (estrous > 0 && estrous > fear) this.emotionKey = 'estrous';
                else if (fear > 0) this.emotionKey = 'fear';
                else this.emotionKey = null;
            }
            this.setEmotion(this.emotionKey);
        }

        damage(damage, damagingObject) {
            const actualDmg = super.damage(damage, damagingObject);
            if (actualDmg <= 0) return 0;
            playSound('hit', this.pos);
            if (damagingObject && damagingObject.pos) {
                this.velocity = this.velocity.add(this.pos.subtract(damagingObject.pos).scale(rand(.4, .8)));
            }
            this.bleed();
            this.lookTimer.unset();
            return actualDmg;
        }

        bleed() {
            if (this.bleedTimer.active()) return;
            this.bleedTimer.set(this.isDead() ? .5 : .2);
            this.bloodEmitter.emitRate = 100;
        }

        clot() {
            if (!this.bleedTimer.active()) this.bloodEmitter.emitRate = 0;
        }

        findOpenInventoryIndex(itemName) {
            // Look for open slots with the same name and stackable - Don't consider index 0 (empty hands)
            const invIndex = this.inventory.findIndex((item, i) => (
                item && item.name === itemName && ((item.quantity || 0) < (item.stack || 0)) && i > 0
            ));
            if (invIndex !== -1) return invIndex;
            // Look for empty slots
            return this.inventory.findIndex((item, i) => (!item && i > 0));
        }

        findInventoryItem(name) {
            const i = this.inventory.findIndex((item, i) => (item && item.name === name));
            return (i < 0) ? null : this.inventory[i];
        }

        getEquippedItem() {
            return this.inventory[this.equipIndex];
        }

        pickup(itemType, pickupQuant = 1, invIndex) {
            if (typeof invIndex !== 'number') {
                invIndex = this.findOpenInventoryIndex(itemType.name);
            }
            if (!itemType || invIndex < 1 || invIndex > 9) return false;
            const existingItem = this.inventory[invIndex];
            // TODO: Rework this to allow partial pickups if quantity is too high
            if (existingItem && existingItem.name === itemType.name) {
                const newQuant = (existingItem.quantity || 0) + pickupQuant;
                if (newQuant >= (existingItem.stack || 0)) return 0;
                existingItem.quantity = newQuant;
            } else { // Item doesn't exist in inventory, so let's add it
                this.inventory[invIndex] = {
                    ...itemType, // important to clone this so we don't modify the item type's values
                    quantity: pickupQuant, // TODO: check for stack size
                };
            }
            playSound('pickup', this.pos);
            return pickupQuant;
        }

        throw(invIndex) { // aka drop
            if (invIndex < 1 || invIndex > 9) return 0;
            const item = this.inventory[invIndex];
            if (!item) return 0;
            const throwQuant = item.quantity >= 1 ? 1 : 0;
            item.quantity -= throwQuant;
            // Remove item from inventory if there's no more
            if (!item.quantity) this.inventory[invIndex] = null;
            this.reEquip();
            if (throwQuant) this.world.makeItem(item.name, this.pos, 3);
            // TODO: Adjust the quantity of this new item to 1?
            return throwQuant;
        }

        toggleEquip(invIndex) {
            this.equip(this.equipIndex === invIndex ? -1 : invIndex);
        }

        reEquip() { this.equip(this.equipIndex); }

        equip(invIndex) {
            if (invIndex < -1 || invIndex > 9) return false;
            const item = this.inventory[invIndex];
            // Shrink the existing equipped entity if it exists (we'll make a new one if needed)
            if (this.equippedEntity) this.equippedEntity.kill();
            // If no item found, or item has run out, then we're unequipping and we're done
            if (!item || !item.quantity) {
                this.equipIndex = -1; // force an unequip in case we're here because of zero quantity
                return;
            }
            this.equipIndex = invIndex;
            if (item.name === 'Butcher knife') achievements.award(1);
            this.addChild(this.equippedEntity = new ItemEntity(
                { itemType: { ...item }, world: this.world },
                vec2(-.2, .2),
            ));
            if (!item.quantity) this.equippedEntity.drawSize = vec2();
        }

        getEquippedWeight() {
            const item = this.getEquippedItem();
            return item ? item.weight || 0 : 0;
        }

        hasBaitEquipped() {
            const item = this.getEquippedItem();
            if (!item) return; // creature is not holding item
            return item.bait || 0;
        }

        attack() {
            // const s = new Sound([.5,.5]);
            // s.play(this.pos);
            playSound('attack', this.pos);
            // this.damage(1);
        }

        getNearest(things = [], targetPos) {
            let nearest;
            things.reduce((best, a) => {
                const dist = a.pos.distance(targetPos);
                if (dist < best) {
                    nearest = a;
                    return dist;
                }
                return best;
            }, Infinity);
            return nearest;
        }

        findNearestAnimal(nearestPos = this.pos) {
            const aliveAnimals = this.world.animals.filter((a) => !a.isDead() && a !== this);
            const ee = this.equippedEntity;
            const interactingAnimals = aliveAnimals.filter((a) => isOverlapping(a.pos, a.size, ee.pos, ee.size));
            return this.getNearest(interactingAnimals, nearestPos);
        }

        feedNearest(nearestPos = this.pos, feedWhat = this.getEquippedItem()) {
            const nearestAnimal = this.findNearestAnimal(nearestPos);
            if (!nearestAnimal || !feedWhat.quantity) { playSound('dud', this.pos); return; }
            this.consume(feedWhat, true);
            nearestAnimal.health += 1;
            nearestAnimal.estrousTimer.set(10);
            playSound('craft', this.pos);
        }

        craft(craftWhat) {
            const equippedItem = this.getEquippedItem();
            if (craftWhat === 'wine') {
                if (equippedItem.name !== 'Blood' || equippedItem.quantity < 9) {
                    playSound('dud', this.pos);
                    return;
                }
                equippedItem.quantity -= 9;
                achievements.award(3);
                this.world.makeItem('Blood wine', this.pos, 2);
                playSound('craft');
            } else if (craftWhat === 'meal') {
                if (equippedItem.name !== 'Meat' || equippedItem.quantity < 13) {
                    playSound('dud', this.pos);
                    return;
                }
                equippedItem.quantity -= 13;
                this.world.makeItem('Meal', this.pos, 2);
                playSound('craft', this.pos);
            }
        }

        build() {
            const w = this.world;
            const where = this.getActionTilePos();
            const currentGround = w.getGroundFromWorld(where);
            const isBuilding = (currentGround.tileIndex !== 29);
            if (isBuilding) {
                const bricks = this.findInventoryItem('Stone');
                if (!this.consume(bricks, true)) { playSound('dud'); return; }
            } 
            playSound('attack');
            if (!isBuilding) w.makeItem('Stone', where, 1);
            w.setGroundTileFromWorld(
                where,
                // ground:
                (isBuilding) ? { tileIndex: 29, blocked: true } : { tileIndex: 4, blocked: false },
            );
        }

        dig() {
            const w = this.world;
            const where = this.getActionTilePos();
            const currentGround = w.getGroundFromWorld(where);
            const isRock = (currentGround.tileIndex === 25 || currentGround.tileIndex === 26);
            // if (!isRock) { playSound('dud'); return; }
            playSound('attack');
            if (isRock) w.makeItem('Stone', where, 2, randInt(1, 3));
            const ground = { tileIndex: 4, blocked: false };
            w.setGroundTileFromWorld(where, ground);
        }

        consume(item, quiet) {
            if (!item || item.quantity <= 0) return 0;
            item.quantity -= 1;
            if (item.youth) {
                this.health += 1;
                this.age = Math.round(Math.max(1,
                    this.age - (item.youth || 0) - (this.age / 10)
                ));
            }
            this.reEquip();
            if (item.name === 'Meal') achievements.award(6);
            if (!quiet) playSound('consume', this.pos);
            return 1;
        }

        lunge(n) {
            if (this.lungeTimer.active()) return;
            this.lungeTimer.set(1);
            this.velocity = this.velocity.add(vec2().setAngle(this.facing, .5));
        }

        getActionTilePos() {
            if (!this.equippedEntity) return null;
            return this.world.worldPosToTilePos(
                this.equippedEntity.pos.add(vec2().setAngle(this.facing, 0.7))
            ).add(vec2(.5,.5));
        }

        action(targetPos) {
            if (this.actionTimer.active()) return;
            const item = this.getEquippedItem();
            this.actionTimer.set(.25);
            if (!item) return; // this.pickupNearby();
            if (item.lunge) this.lunge(item.lunge);
            if (item.damaging) return this.attack();
            if (item.bait) return this.feedNearest(targetPos);
            if (item.name === 'Blood') this.craft('wine');
            if (item.name === 'Meat') this.craft('meal');
            if (item.build) this.build();
            else if (item.dig) this.dig();
            else if (item.consumable) this.consume(item);
        }

        plan() {
            if (this.planTimer.active()) return;
            this.planTimer.set(rand(2, 20));
            const tooFar = this.pos.distance(this.world.center) > (this.world.size.x / 3);
            const base = tooFar ? this.world.center : this.pos;
            this.walkTarget = base.add(vec2(rand(-10, 10), rand(-10, 10)));
            this.urgency = rand(1);
        }

        look() {
            if (this.lookTimer.active()) return;
            const fear = this.lookScary();
            if (this.estrousTimer.active()) this.lookMate();
            else if (!fear) this.lookFood();
        }

        lookScary() {
            if (!this.timid) return 0;
            const scaryEnt = this.world.animals.find((a) => a.scary && !a.isDead() && !a.hasBaitEquipped() && a !== this);
            if (!scaryEnt) return 0;
            const dist = scaryEnt.pos.distance(this.pos);
            if (dist > this.lookRange) return 0; // player is out of sight/smell
            const FEAR_DIST = 6;
            const fear = dist < FEAR_DIST;
            this.lookTimer.set(fear ? .5 : rand(.5, 2));
            this.fearTimer.set(1);
            if (fear) {
                const away = this.pos.subtract(scaryEnt.pos).normalize(FEAR_DIST + 1);
                this.goTo(this.pos.add(away));
            }
            return fear;
        }

        goTo(pos = null, unplan) {
            if (unplan) this.planTimer.set(60);
            this.walkTarget = pos;
            this.urgency = 1;
        }

        lookFood() {
            if (!this.followsBait) return;
            const pc = this.findPc();
            if (!pc) return;
            const dist = pc.pos.distance(this.pos);
            const LOOK_FOOD_DIST = 4;
            if (dist > this.lookRange || dist > LOOK_FOOD_DIST) return; // player is out of sight/smell
            const item = pc.getEquippedItem();
            if (!item) return; // player is not holding food
            if (pc.hasBaitEquipped() && pc.equippedEntity) {
                this.walkTarget = pc.equippedEntity.pos.add( vec2().setAngle(rand(2 * PI), rand(1, 2)) );
            }
        }

        lookMate() {
            if (!this.estrousTimer.active()) return;
            this.lookTimer.set(1);
            const mates = this.world.animals.filter((a) => !a.isDead() && a.estrousTimer.active() && a !== this);
            // console.log(mates);
            if (!mates.length) return;
            const nearestMate = this.getNearest(mates, this.pos);
            // console.log(nearestMate);
            if (!nearestMate) return;
            // TODO: don't do the mating in the looking?
            if (isOverlapping(nearestMate.pos, nearestMate.size, this.pos, this.size)) this.mate(nearestMate);
            else this.walkTarget = nearestMate.pos;
        }

        mate(mate) {
            this.lookTimer.set(5);
            mate.estrousTimer.unset();
            this.estrousTimer.unset();
            achievements.award(4);
            this.world.makeAnimal(this.pos, [this.species, mate.species]);
        }

        getOlder() {
            if (this.agingTimer.active()) return false;
            // @ 6 sec/year --> 10 minutes IRL = 600 sec IRL = 100 years
            // @ 3 sec/year --> 5 minutes IRL = 100 years
            this.agingTimer.set(4);
            this.age += 1;
            if (this.isOld()) this.damage(1, this);
        }

        isOld() { return this.age > this.oldAge; }

        live() { // "update" logic that happens when alive
            if (this.isDead()) return;
            const moveInput = this.moveInput.copy();
            const isMoveInput = (moveInput.x || moveInput.y);
            if (isMoveInput) this.goTo(null, true); // "un-plan"
            this.look();
            this.plan();

            // Movement
            // Get the movement velocity direction, and the acceleration
            // Base vel and acceleration is based on slowing down
            let accel = -.04;
            let newMoveVel = this.movementVelocity.copy();
            if (isMoveInput) { // Player-input based movement
                if (!this.walkSoundTimer.active()) {
                    playSound('walk', this.pos);
                    this.walkSoundTimer.set(.21);
                }
                newMoveVel = moveInput; // gets direction
                accel = .03;
            } else if (this.walkTarget) { // "AI" target based movement
                const dist = this.pos.distance(this.walkTarget);
                newMoveVel = this.walkTarget.subtract(this.pos);
                accel = (dist < 3) ? -.03 : .03;
            }
            // Determine the speed the creature should be moving based on ramping up, urgency, and max speed
            this.speedRamp = Math.min(1, Math.max(0, this.speedRamp + accel));
            const moveSpd = this.maxSpeed * this.urgency * (1 - this.getEquippedWeight()) * this.speedRamp;
            newMoveVel = newMoveVel.normalize(moveSpd).clampLength(this.maxSpeed);
            // this.movementVelocity = this.movementVelocity.normalize(moveSpd).clampLength(this.maxSpeed);
            this.movementVelocity = this.movementVelocity.lerp(newMoveVel, .08);
            // Only use movement velocity if you're currently moving slower
            // If we're moving faster, we might have been pushed, boosted, or something else - and that shouldn't constrain velocity
            const vx = this.velocity.x, vy = this.velocity.y;
            this.velocity = vec2(
                (vx > moveSpd || vx < -moveSpd) ? vx : this.movementVelocity.x,
                (vy > moveSpd || vy < -moveSpd) ? vy : this.movementVelocity.y,
            );
            // this.velocity = this.velocity.lerp(this.movementVelocity, .1);

            const speed = this.velocity.length();
            // TODO: clean this up - redundant?
            this.walkTick += this.movementVelocity.length() * 3.5;
            this.walkTick = this.walkTick % 10000;
            this.walkCyclePercent += speed * .5;
            this.walkCyclePercent = speed > .01 ? mod(this.walkCyclePercent) : 0;
            // Facing
            if (speed !== 0) this.facing = this.velocity.angle();
            
            // Aging
            this.getOlder();
        }

        update() {
            this.updateEmotion();
            this.live();
            this.clot();
            // TODO: Always apply friction?
            const friction = vec2(.9999);
            if (this.moveInput.x === 0) friction.x = 0.9;
            if (this.moveInput.y === 0) friction.y = 0.9;
            this.velocity = this.velocity.multiply(friction);
            // call parent and update physics
            super.update();
        }

        render() {
            // Render reticle
            const ee = this.equippedEntity;
            if (ee && ee.reticle) drawRect(
                this.getActionTilePos(),
                ee.size,
                nc(.5,1,1,.2),
            );
            // Render body
            const bodyPos = this.pos.add(vec2(0,.05*Math.sin(this.walkCyclePercent*PI)));
            // const color = this.color.add(this.additiveColor).clamp();
            [[1,.2],[.9,.1]].forEach((ca) =>
                drawRect(bodyPos.add(vec2(0, -this.size.y * .75)), vec2(this.size.x * ca[0], ca[1]), nc(0,0,0, .1), this.angle)
            );
            // drawRect(bodyPos.add(vec2(0, -this.size.y * .75)), vec2(this.size.x * .9, .1), nc(0,0,0, .1), this.angle);
            drawSpecies(mainContext, bodyPos, this.species, this.direction, this.walkTick);
            // drawRect(bodyPos, this.size.scale(this.drawScale), nc(.3, .3, .3, .4), this.angle);
            
            return;
        }

        // renderOld() {
        //     // drawRect(bodyPos.add(vec2(0, .5)), this.head.scale(this.drawScale), color, this.angle);
        //     drawRect(bodyPos.add(vec2(0, 0)), this.body, color, this.angle);
        //     drawRect(bodyPos.add(vec2(0, .3)), this.head, color, this.angle);
        //     this.legs.forEach((leg, li) => {
        //         // console.log(this.walkCyclePercent);s
        //         // TODO: Fix this walking animation
        //         const liftPercent = Math.sin((this.walkCyclePercent + (.1 * li)) * PI); 
        //         const lift = vec2(0, .2 * liftPercent);
        //         leg.forEach((legSegment, i) => {
        //             if (!i) return; // skip first point
        //             drawLine(
        //                 bodyPos.add(leg[i - 1]).add(lift),
        //                 bodyPos.add(legSegment).add(lift),
        //                 .1,
        //                 color, 
        //             );
        //         });
        //     });
        //     // Eyes
        //     drawRect(bodyPos.add(vec2(-.1, .3)), vec2(.1), nc(0, 0, 0));
        //     drawRect(bodyPos.add(vec2(.1, .3)), vec2(.1), nc(0, 0, 0));
        //     drawRect(bodyPos, vec2(.05, .2), nc(1, 1, 0, .5), this.facing); // Center dot
        // }
    }

    class PlayerCharacterEntity extends CharacterEntity {
        constructor(entOptions) {
            super(entOptions);
            this.isPlayerCharacter = true;
            this.health = 5;
            this.maxSpeed = .25;
            this.renderOrder = 10;
            this.age = 18;
            this.oldAge = 100;
        }

        update() { // from platformer Player extends Character
            if (mouseIsDown(2)) this.goTo(mousePos, true); // right click movement

            const numKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
            numKeyCodes.forEach((n) => { if (keyWasPressed(n)) this.toggleEquip(n - 48); });

            // "Q" or "Z" key
            if (keyIsDown(81) || keyIsDown(90) || gamepadIsDown(1)) this.throw(this.equipIndex);
            // "E" or "X" key
            if (keyIsDown(69) || keyIsDown(88) || mouseIsDown(0) || gamepadIsDown(0)) this.action(mousePos);

            // movement control
            this.moveInput = isUsingGamepad ? gamepadStick(0) : 
                vec2(keyIsDown(39) - keyIsDown(37), keyIsDown(38) - keyIsDown(40));

            if (this.moveInput && this.moveInput.x || this.moveInput.y) {
                achievements.award(0);
            }
            this.scary = true;

            super.update();
            this.updateEquip();
        }

        updateEquip() {
            const ee = this.equippedEntity;
            if (!ee) return;
            const item = this.getEquippedItem();
            if (!item) {
                // this.equip(-1);
                return;
            }
            const thrust = this.actionTimer.active() ? 1.1 : .8;
            ee.drawSize = vec2(
                !item.quantity ? 0 : (this.actionTimer.active() ? 1.2 : 1)
            );
            ee.localPos = vec2().setAngle(this.facing, thrust);
            let offset = vec2();
            if (this.direction === 0) offset = vec2(.35, -.1);
            else if (this.direction === 1) offset = vec2(.2, -.2);
            else if (this.direction === 7) offset = vec2(-.2, -.1);
            ee.localPos = ee.localPos.add(offset);
            ee.localAngle = this.facing + (PI * 1.2) + (item.holdAngleOffset || 0);
            ee.renderOrder = (ee.pos.y < this.pos.y) ? 11 : 9;

        }
    }

    class AnimalEntity extends CharacterEntity {
        constructor(entOptions) {
            super(entOptions);
            this.timid = true;
            this.followsBait = true;
        }

        kill() {
            playSound('hit', this.pos);
            this.health = 0;
            // this.angle = .1;
            this.bleed();
            this.setEmotion('dead');
            // Not sure if setTimeout is the best approach in this framework
            setTimeout(() => this.world.makeItem('Meat', this.pos, 1), 500);
            setTimeout(() => super.kill(), 4000);
        }

        update() {
            super.update();
            const pc = this.findPc();
            const ee = pc ? pc.equippedEntity : null;
            if (!this.isDead() && ee && ee.itemType.damaging) {
                if (isOverlapping(this.pos, this.size, ee.pos, ee.size)) {
                    achievements.award(2);
                    const dmg = this.damage(ee.itemType.damaging, ee);
                    if (dmg) {
                        pc.pickup(
                            { ...this.world.getItemType('Blood') }, // item type
                            randInt(1, 3), // quantity
                        );
                    }
                }
            }
        }
    }

    class ItemEntity extends WorldEntity {
        constructor(entOptions) {
            super(entOptions);
            this.itemType = entOptions.itemType;
            this.reticle = entOptions.itemType.reticle;
            this.tileIndex = this.itemType.tileIndex;
            this.fadeTimer = new Timer;
        }

        update() {
            super.update();
            const pc = this.findPc();
            if (this.isDead()) {
                this.drawSize = vec2(1 - this.fadeTimer.getPercent());
                if (pc) this.pos = this.pos.lerp(pc.pos, .1);
            } else if (pc) {
                if (isOverlapping(this.pos, this.size, pc.pos, pc.size)) {
                    // achievements.award(2);
                    // const dmg = this.damage(pc.equippedEntity.damaging, pc.equippedEntity);
                    pc.pickup(this.itemType, this.itemType.quantity || 1);
                    this.health = 0;
                    this.fadeTimer.set(.4);
                    setTimeout(() => this.kill(), 400);
                }
            }
        }
    }

    class SpiritEntity extends WorldEntity {
        constructor(entOptions) {
            super(entOptions);
            this.restTimer = new Timer;
            this.moveTimer = new Timer;
            this.setCollision(0);
            this.tileIndex = 1;
            this.moveTarget = this.pos.copy();
        }

        update() {
            super.update();
            if (this.restTimer.active()) return;
            const dist = this.pos.distance(this.moveTarget);
            if (this.moveTimer.active()) {
                if (dist > 1) {
                    this.velocity = this.velocity.lerp(this.moveTarget.subtract(this.pos), 0.9);
                    this.velocity = this.velocity.clampLength(4);
                } else { // Reached destination
                    this.velocity = this.velocity.scale(.1);
                    this.restTimer.set(10);
                    this.moveTimer.unset();
                }
                return;
            }
            // Not moving
            if (rand() > .2) {
                // Don't make herbs if the player isn't there yet
                if (this.world.pc) this.world.makeItem('Herb', this.pos, 1);
                this.restTimer.set(10);
            } else {
                this.moveTarget = this.world.getRandPos();
                this.moveTimer.set(5);
            }
        }
    }

    const WORLD_SIZE = 200;
    // const SEED = 1235;
    const SEED = randInt(9999);
    const MAX_CHUNK_DNA = 999;
    // const TILE_SIZE = 24;
    const TERRAIN_TILE_LOOKUP = [1, 2, 27, 3, 28, 4]; //  25, 26];
    // const HALF_WORLD_SIZE = WORLD_SIZE / 2;

    const getPseudoRand = (n) => {
        // http://stackoverflow.com/a/19303725/1766230
        const x = Math.sin(n) * 10000;
        return x - Math.floor(x);
    };

    class Chunk {
        constructor(pos) {
            this.size = vec2(WORLD_SIZE, WORLD_SIZE);
            this.center = this.size.scale(.5);
            this.key = Chunk.getKey(pos);
            this.pos = pos;
            this.seed = Math.round(100000 * getPseudoRand((10000 * pos.y + pos.x) + SEED));
            this.dna = this.generateDna();
            this.tileCellArray = this.generateTerrainTileCellArray(); // A number of points to be used for the Voronoi diagram of tiles
            this.customizedGround = {};
            // console.log(this);
        }

        static getKey(pos) { return `${pos.x},${pos.y}`; }

        generateDna() {
            const dna = [];
            randSeed = this.seed;
            for(let i = 999; i--;) dna.push(randSeeded(0, 1));
            return dna;
        }

        getDnaValue(i) {
            return this.dna[i % MAX_CHUNK_DNA];
        }

        getDnaPosition(i) {
            return vec2(this.getDnaValue(i) * WORLD_SIZE, this.getDnaValue(i + 1) * WORLD_SIZE);
        }

        getDnaRand(i, a = 1, b = 0) {
            return b + (a-b) * this.getDnaValue(i);
        }

        getDnaInt(i, a = 1, b = 0) {
            return this.getDnaRand(i, a, b)|0;
        }

        generateTerrainTileCellArray() {
            // 
            const arr = [{ pos: vec2(WORLD_SIZE/2, WORLD_SIZE/2), terrainIndex: 0, weight: 1 }];
            for(let t = 200; t--;) {
                const i = t * 4;
                arr.push({
                    pos: this.getDnaPosition(i),
                    terrainIndex: this.getDnaInt(i + 3, TERRAIN_TILE_LOOKUP.length),
                    weight: .2 + (this.getDnaValue(i + 4) * .8),
                });
            }
            return arr;
        }

        loopOver(callback) {
            const { x, y } = this.size;
            const pos = vec2(); // counter
            for (pos.x = x; pos.x--;)
                for (pos.y = y; pos.y--;)
                    callback(pos, pos.x + (pos.y * x));
        }

        getNearestTerrain(pos) {
            let terrainIndex;
            this.tileCellArray.reduce((nearest, cell) => {
                const dist = cell.pos.distance(pos) * cell.weight;
                if (dist < nearest) {
                    terrainIndex = cell.terrainIndex;
                    return dist;
                }
                return nearest;
            }, Infinity);
            return terrainIndex;
        }

        getGround(pos) {
            const cg = this.customizedGround[Chunk.getKey(pos)]; // TODO: combine custom + procedural together in case there are missing properties?
            if (cg) return { ...cg };
            const posSeed = pos.x + pos.y * WORLD_SIZE;
            let i = Math.round(getPseudoRand(posSeed) * MAX_CHUNK_DNA);
            const r = this.getDnaValue(i);
            const terrainIndex = this.getNearestTerrain(pos);
            let tileIndex = TERRAIN_TILE_LOOKUP[terrainIndex]; // preferred tile index based on location
            const isRockyProne = tileIndex === 28;
            const blocked = r > (isRockyProne ? .975 : .991);
            const rock = blocked && (isRockyProne || pos.distance(this.center) > WORLD_SIZE / 3.5);
            if (r < .1) tileIndex = 1;
            else if (r < .2) tileIndex = tileIndex + this.getDnaInt(++i, -1, 1);
            else if (r < .4) tileIndex = this.getDnaInt(++i, 1, 5);
            if (rock) tileIndex = 25 + this.getDnaInt(++i, 2);
            // console.log('pos', pos.x, pos.y, tileIndex);
            const color = blocked && !rock ? randColor() : undefined;
            return { tileIndex, color, blocked };
        }

        customizeGround(pos, ground = {}) {
            this.customizedGround[Chunk.getKey(pos)] = ground;
        }
    }

    class World {
        constructor() {
            this.size = vec2(WORLD_SIZE, WORLD_SIZE);
            this.center = this.size.scale(.5);
            // this.blocks = [];
            this.items = [];
            this.animals = [];
            this.spirits = [];
            this.itemTypes = [
                { name: 'Meat', tileIndex: 7, quantity: 1, stack: 64, emoji: '🍖' },
                { name: 'Blood', tileIndex: 6, quantity: 1, stack: 64, emoji: '🩸' },
                { name: 'Butcher knife', type: 'w', tileIndex: 5, quantity: 1, stack: 8, damaging: 1, lunge: 1, emoji: '🔪' },
                { name: 'Herb', tileIndex: 8, quantity: 1, stack: 64, bait: 1, emoji: '🌿', angleOffset: -.6, holdAngleOffset: PI/2 },
                { name: 'Blood wine', tileIndex: 13, quantity: 1, stack: 64, youth: 10, consumable: 1, emoji: '🍷' },
                { name: 'Meal', tileIndex: 14, quantity: 1, stack: 8, youth: 1, consumable: 1, emoji: '🍲' },
                { name: 'Hammer', tileIndex: 17, quantity: 1, stack: 8, build: 1, weight: .5, reticle: 1, emoji: '🔨', holdAngleOffset: PI },
                { name: 'Pickaxe', tileIndex: 15, quantity: 1, stack: 8, dig: 1, weight: .5, reticle: 1, emoji: '⛏️', holdAngleOffset: PI },
                { name: 'Stone', tileIndex: 19, quantity: 1, stack: 64, emoji: '🧱' },
            ];
            this.tiles = [];
            this.chunkPos = vec2();
            this.chunks = {};
            this.pc = 0;
            this.groundTileLayer;
        }

        makePc(pos = this.center.copy()) {
            this.pc = new PlayerCharacterEntity({ pos, world: this });
            this.animals.push(this.pc);
            return this.pc;
        }

        getItemType(name) {
            return this.itemTypes.find((i) => i.name === name);
        }

        getRandPos() {
            return vec2(rand(this.size.x), rand(this.size.y));
        }

        makeItem(itemTypeParam, posParam, dist = 0, n = 1) {
            const itemType = (typeof itemTypeParam === 'string') ? this.getItemType(itemTypeParam) : itemTypeParam;
            if (!itemType) console.error('Cannot make item', itemTypeParam);
            for (let i = n; i--;) {
                const pos = (dist) ? posParam.add( vec2(rand(-dist, dist), rand(-dist, dist)) ) : posParam.copy();
                this.items.push(new ItemEntity({
                    itemType,
                    pos,
                    health: 1,
                    world: this,
                    angle: (itemType.angleOffset || 0) + rand(-.2, .2),
                }));
            }
        }

        makeAnimal(pos, bioParents) {
            this.animals.push(new AnimalEntity({
                tileIndex: 0,
                pos,
                world: this,
                bioParents,
            }));
        }

        makeSpirit() {
            this.spirits.push(new SpiritEntity({
                pos: this.getRandPos(),
                world: this,
            }));
        }

        makeChunk() {
            const chunk = new Chunk(this.chunkPos);
            this.chunks[chunk.key] = chunk;
            return chunk;
        }

        getChunk() {
            const key = Chunk.getKey(this.chunkPos);
            return this.chunks[key] || this.makeChunk();
        }

        worldPosToTilePos(worldPos) { // TODO: could have a static equivalent
            const conv = (n) => Math.floor(n);
            return vec2(conv(worldPos.x), conv(worldPos.y));
        }

        getGroundFromWorld(worldPos) {
            return this.getChunk().getGround(this.worldPosToTilePos(worldPos));
        }

        setGroundTileFromWorld(worldPos, ground) {
            const tilePos = this.worldPosToTilePos(worldPos);
            this.groundTileLayer.redrawStart();
            this.setGroundTile(tilePos, ground, true);
            this.groundTileLayer.redrawEnd();
        }

        setGroundTile(tilePos, ground = {}, redraw) {
            const { tileIndex, color, blocked } = ground;
            this.getChunk().customizeGround(tilePos, ground);
            // console.log(arguments, worldPos, tilePos, this.getChunk());
            if (blocked) setTileCollisionData(tilePos, 1);
            else if (redraw) setTileCollisionData(tilePos, 0);
            const data = new TileLayerData(
                tileIndex,
                randInt(4), // direction
                randInt(2), // mirror
                color,
            );
            this.groundTileLayer.setData(tilePos, data, redraw);
        };

        init() {
            // const { size, species, animals, items } = this;
            const { size } = this;
            // const pc = this.makePc();
            const chunk = this.getChunk();

            let i;
            // for(i = 100; i--;) { species.push(makeSpecies()) }
            for(i = 20; i--;) {
                // TODO: pick a random species
                for(let q = 2; q--;) {
                    this.makeAnimal(vec2(rand(WORLD_SIZE), rand(WORLD_SIZE)));
                }
            }

            const getNear =  (n) => this.center.add( vec2().setAngle(rand(2 * PI), n) );
            this.makeItem('Butcher knife', getNear(9));
            this.makeItem('Pickaxe', getNear(34));
            this.makeItem('Hammer', getNear(35));
            [20, 21, WORLD_SIZE/2, rand(20, WORLD_SIZE/2)].forEach((n) =>
                this.makeItem('Herb', getNear(n))
            );
            this.makeSpirit();
            
            // create tile collision and visible tile layer
            initTileCollision(size.copy());
            this.groundTileLayer = new TileLayer(vec2(), size);
            const darknessTileLayer = new TileLayer(vec2(), size);
            // const charactersTileLayer = new TileLayer(vec2(), size);

            chunk.loopOver((pos, i) => {
                this.setGroundTile(pos, chunk.getGround(pos));
            });

            this.tiles = [this.groundTileLayer, darknessTileLayer];
            this.tiles.forEach((t) => t.redraw());
        }

        update() {
            // this.tiles[0].setData(pc.pos, pc.getTileData());
            const { pc } = this;
            if (pc) {
                let x, y;
                if (pc.pos.x > this.size.x) x = 0;
                else if (pc.pos.x < 0) x = this.size.x;
                if (pc.pos.y > this.size.y) y = 0;
                else if (pc.pos.y < 0) y = this.size.y;
                if (x !== undefined) { pc.pos.x = x; cameraPos = pc.pos; }
                if (y !== undefined) { pc.pos.y = y; cameraPos = pc.pos; }
            }
        }
    }

    const TILE_SIZE$1 = window.TILE_SIZE || 24;
    let ctx;
    let tileCount = 0;
    let ri = randInt;

    function getTileX() {
        return TILE_SIZE$1 * (++tileCount);
    }

    const rect = (r, g, b, x, y, q = TILE_SIZE$1, w = TILE_SIZE$1) => {
        ctx.fillStyle = `#${r}${g}${b}`;
        ctx.fillRect(x, y, q, w);
    };

    function drawTerrain(r, g, b) {
        const x = getTileX(),
            y = 0;
        rect(r, g, b, x, y);
        [6, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1].forEach((n) => {
            rect(
                ri(r, 6),
                ri(g, 6),
                ri(b, 6),
                x + ri(TILE_SIZE$1 - n),
                y + ri(TILE_SIZE$1 - n),
                n,
                n,
            );
        });
        return x;
    }

    function drawRockyTerrain(r, g, b) {
        const x = drawTerrain(r, g, b),
            y = 0;
        [14, 10, 6, 3, 3, 3, 2, 2].forEach((n) => rect(
            ri(7, 9), ri(7, 9), 'a',
            x + ri(TILE_SIZE$1 - n),
            y + ri(TILE_SIZE$1 - n),
            n,
            n,
        ));
    }

    function drawStoneWall() {
        const x = getTileX(),
            y = 0;
        rect(5, 5, 6, x, y);
        [8, 8, 8, 8, 8, 6, 6, 6, 6, 4].forEach((n) => rect(
            ri(8, 9), 8, 'a',
            x + ri(TILE_SIZE$1 - n),
            y + ri(TILE_SIZE$1 - (n/2)),
            n,
            n/2,
        ));
    }

    function drawTiles(doc) {
        const canvas = doc.createElement('canvas');
        canvas.width = 30 * TILE_SIZE$1;
        canvas.height = 2 * TILE_SIZE$1;
        // doc.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        canvas.style = styleCanvas;
        ctx.drawImage(tileImage, 1000, 1000);
        // 0
        rect('f', 0, 0, 0, 0, 12, 12);
        rect('f', 'f', 0, 12, 12, 12, 12);
        drawTerrain(2, 4, 3); // 1
        drawTerrain(2, 4, 2); // 2
        drawTerrain(3, 4, 3); // 3
        drawTerrain(4, 3, 3); // 4
        ctx.fillStyle = '#fff';
        ctx.font = '20px serif';
        [ // Tile indices:
            '🔪', // 5
            '🩸', // 6
            '🍖', // 7
            '🌿', // 8 
            '💕', // 9
            '❕', // 10
            '💢', // 11
            '💀', // 12
            '🍷', // 13
            '🍲', // 14
            '⛏️', // 15
            '🪓', // 16
            '🔨', // 17
            '🕯️', // 18
            '🧱', // 19
            '', // 20
            '', // 21
            '', // 22
            '', // 23
            '', // 24
        ].forEach((emoji) => {
            ctx.fillText(emoji, getTileX() - 1, 20);
        });
        drawRockyTerrain(3, 4, 3); // 25
        drawRockyTerrain(4, 3, 3); // 26
        drawTerrain(3, 4, 2); // 27 -- Between 2 and 3
        drawTerrain(3, 3, 3); // 28 -- Between 3 and 4
        drawStoneWall(); // 29
        // const x = getTileX();
        // rect(3, 3, 3, x, 0);
        // Tile incides 5, 6, 7, 8, 9
        // ctx.fillText('🔪🩸🍖🌿💕', x - 1, 19.5);
        // Test
        // ctx.fillText('🦀🍖🥩🍗💀🔪', 0, 44);
        // ctx.fillText('🔥', 0, 22);
        return canvas.toDataURL();
    }

    function loadTileImageSource(src) {
        return new Promise((resolve) => {
            const t = new Image(); // The tile image
            t.onload = () => resolve(drawTiles(document));
            if (src) t.src = src;
            else t.onload();
        });
    }

    // popup errors if there are any (help diagnose issues on mobile devices)
    //onerror = (...parameters)=> alert(parameters);

    // game variables
    // let particleEmiter;
    const win = window;
    let gameState = 0; // 0 = not begun, 1 = alive & running, 2 = dead, 3 = win
    const TILE_SIZE = win.TILE_SIZE = 24; // was 16 in demo
    const WIN_MEAT = 13;
    let w;
    let font;

    // medals
    // const medal_example = new Medal(0, 'Example Medal', 'Medal description goes here.');
    // medalsInit('Hello World');

    ///////////////////////////////////////////////////////////////////////////////
    function gameInit()
    {
        w = win.w = win.world = new World();
        w.init();
        font = new FontImage;

        // move camera to center of collision
        cameraPos = tileCollisionSize.scale(.5);
        cameraScale = 42;

        // enable gravity
        gravity = 0; // -.01;

        // create particle emitter
        // const emPos = vec2(10, 12);
        // particleEmiter = new ParticleEmitter(
        //     emPos, 0, 1, 0, 200, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
        //     0, vec2(TILE_SIZE),                            // tileIndex, tileSize
        //     new Color(1,1,1),   new Color(0,0,0),   // colorStartA, colorStartB
        //     new Color(1,1,1,0), new Color(0,0,0,0), // colorEndA, colorEndB
        //     2, .2, .2, .1, .05,     // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        //     .99, 1, .5, PI, .05,     // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        //     .5, 1, 1                // randomness, collide, additive, randomColorLinear, renderOrder
        // );
        // particleEmiter.elasticity = .3; // bounce when it collides
        // particleEmiter.trailScale = 2;  // stretch in direction of motion


        // console.log(tileImage.src);
        // mainContext.drawImage(tileImage, 1000, 1000);
        // mainContext.fillStyle = 'green';
        // mainContext.fillRect(0, 0, 100, 100);
        // // tileImage = new Image();
        // tileImage.src = mainCanvas.toDataURL();
        
        // console.log(tileImage.src);
        // mainContext.drawImage(tileImage, 1000, 1000);
        // glInit();
        // glTileTexture = glCreateTexture(tileImage);
    }

    ///////////////////////////////////////////////////////////////////////////////
    function gameUpdate()
    {
        const { pc } = w;
        if (pc !== win.pc) win.pc = pc; // Just for easy debugging
        // if (mouseWasPressed(0)) {
            // achievements.award(0);
            // if (pc) pc.damage(1, pc);
            // play sound when mouse is pressed
            // sounds.click.play(mousePos);

            // change particle color and set to fade out
            // particleEmiter.colorStartA = new Color;
            // particleEmiter.colorStartB = randColor();
            // particleEmiter.colorEndA = particleEmiter.colorStartA.scale(1,0);
            // particleEmiter.colorEndB = particleEmiter.colorStartB.scale(1,0);

            // unlock medals
            // medal_example.unlock();
            // console.log(mousePos);
        // }

        if (keyWasReleased(13)) {
            if (gameState === 2 || gameState === 3) {
                win.location.reload();
            } else if (gameState === 0 || gameState === 2) {
                gameState = 1;
                w.makePc();
            }
        }
        if (pc) {
            win.achievements = achievements;
            cameraPos =  cameraPos.lerp(pc.pos, 0.1);
            // cameraPos =  cameraPos.lerp(w.spirits[0].pos, 0.1);
            if (pc.isDead()) gameState = 2;
            else {
                const meat = pc.findInventoryItem('Meat');
                const meatQuantity = meat ? meat.quantity : 0;
                if (meatQuantity >= WIN_MEAT) achievements.award(5);
                if (achievements.count() === achievements.length) gameState = 3;
            }
        }

        // move particles to mouse location if on screen
        // if (mousePosScreen.x) {
            // particleEmiter.pos = mousePos;
            // pc.pos = mousePos;
            // particleEmiter.pos = pc.pos;
        // }as

        cameraScale = clamp(cameraScale*(1-mouseWheel/10), 3, 700);
        
        if (w) w.update();
    }

    ///////////////////////////////////////////////////////////////////////////////
    function gameUpdatePost()
    {

    }

    ///////////////////////////////////////////////////////////////////////////////
    function gameRender()
    {
        // draw a grey square in the background without using webgl
        // drawRect(cameraPos, tileCollisionSize.add(vec2(5)), new Color(.2,.2,.2), 0, 0);
    }

    ///////////////////////////////////////////////////////////////////////////////
    function renderInventory(pc) {
        const midX = overlayCanvas.width/2;
        // const invText = pc.inventory
        //     .map((item) => item ? (item.name || ' ') + ' x' + item.quantity : ' ')
        //     .map((n, i) => i + ': ' + (pc.equipIndex === i ? `[ ${n.toUpperCase()} equipped ]` : `[ ${n} ]`))
        //     .concat(['0: [Hands]', 'E: Action'])
        //     .join('    ');
        // drawTextScreen(invText, vec2(midX, overlayCanvas.height - 40), 20, new Color, 4);

        const equipItem = pc.inventory[pc.equipIndex];
        const invTipText = `${equipItem ? equipItem.name : 'Nothing'} equipped, 1-9: Equip, E: Action, Q: Drop`;
        // drawTextScreen(invTipText, vec2(midX, overlayCanvas.height - 40), 20, new Color, 4);
        font.drawText(invTipText, screenToWorld(vec2(midX, overlayCanvas.height - 40)), 2/cameraScale, 1);

        for(let i = 1; i <= 10; i++) {
            const size = vec2(50, 70);
            const pos = vec2(
                midX - (5 * 60) + (i * 60),
                overlayCanvas.height - 100,
            );
            const itemIndex = i % 10;
            const color = (itemIndex === pc.equipIndex) ? new Color(.9,.9,.9,.3) : new Color(.1,.1,.1,.3);
            drawRectScreenSpace(pos, size, color);
            const item = pc.inventory[itemIndex];
            if (item) {
                // TODO: Switch to drawing pixelated tile
                drawTextScreen(item.emoji, pos.add(vec2(0, -6)), 28);
                font.drawText(''+item.quantity, screenToWorld(pos.add(vec2(5, 14))), 2/cameraScale, 1);
            }
        }
    }

    function gameRenderPost()
    {
        const { pc } = w;
        const d = drawTextScreen;
        const white = new Color;
        // draw to overlay canvas for hud rendering
        // d('Hello World 🦀', vec2(overlayCanvas.width/2, 80), 80, new Color, 9);
        const midX = overlayCanvas.width/2;
        const midY = overlayCanvas.height/2;
        const pxFontSize = overlayCanvas.width / 8000;
        // const r = (n) => Math.round(pc.pos[n] * 10) / 10;
        // d(`x ${r('x')}, y ${r('y')}`, vec2(midX, 80), 20, new Color, 9);
        

        
        if (gameState === 2) {
            d('YOU DIED', vec2(midX, midY - 90), 90, new Color(1, 0, 0), 4);
            d('Press Enter to restart', vec2(midX, midY), 40, new Color(1, .5, .5), 4);
        } else if (gameState === 0) {
            // overlayCanvas.width
            font.drawText('BIT BUTCHER', cameraPos.add(vec2(0,6)), pxFontSize, 1);
            // d('BIT BUTCHER', vec2(midX, midY - 90), 90, white, 4);
            // d('Press Enter to start', vec2(midX, midY), 40, white, 4);
            font.drawText('Press Enter to start', cameraPos.add(vec2(0, .4)), pxFontSize / 2, 1);
        } else if (gameState === 1 || gameState === 3 && pc) {
            renderInventory(pc);

            achievements.forEach((a, i) => 
                d(
                    `[${a[1] ? 'X' : ' '}] ` + a[0],
                    vec2(overlayCanvas.width - 300, 100 + (i * 30)),
                    18,
                    a[1] ? new Color(.4,1,.4,.5) : white,
                    4,
                    new Color(0,0,0, a[1] ? .5 : 1),
                    'left'
                )
            );

            const gb = (pc.age > 85) ? 0 : 1;
            const c = new Color(1,gb,gb,.8);
            const w = 500 * (Math.max(0, 100 - pc.age)/100);
            drawRectScreenSpace(vec2(midX, 40), vec2(w, 2), c);
            d(`Age: ${Math.ceil(pc.age)}`, vec2(midX, 40), 20, c, 4);
            if (gameState === 3) {
                font.drawText('YOU WIN', cameraPos.add(vec2(0,5)), .2, 1);
                d('Press Enter to play again', vec2(midX, midY - 80), 40, white, 4);
            }
        }
    }



    ///////////////////////////////////////////////////////////////////////////////
    // Startup LittleJS Engine
    (async () => {
        tileSizeDefault = vec2(TILE_SIZE);
        const tis = await loadTileImageSource();
        engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, tis);
    })();

})();
