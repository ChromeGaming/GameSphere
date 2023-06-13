import { PlayerCharacterEntity, AnimalEntity, ItemEntity, SpiritEntity } from './entities.js';

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

export { PlayerCharacterEntity, World };