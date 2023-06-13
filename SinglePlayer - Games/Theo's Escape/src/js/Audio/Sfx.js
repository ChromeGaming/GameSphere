/**
 * Sound FX module
 */
class Sfx {

    /**
     * @param {String} name
     * @param {Array} config
     */
    static add(name, config) {
        const data = jsfxr(config);
        if (!Sfx.ctx) {
            Sfx.ctx = window.AudioContext
                ? new AudioContext()
                : new webkitAudioContext();
            Sfx.buffer = {};
            Sfx.master = Sfx.ctx.createGain();
            Sfx.master.connect(Sfx.ctx.destination);
        }
        Sfx.ctx.decodeAudioData(data, (buffer) => {
            Sfx.buffer[name] = buffer;
        });
        return Sfx;
    }

    /**
     * @param {String} name
     * @param {Boolean} loop
     */
    static play(name, loop) {
        if (!Sfx.buffer[name]) {
            return;
        }
        const source = Sfx.ctx.createBufferSource();
        source.mixer = Sfx.ctx.createGain();
        source.mixer.connect(Sfx.master);
        source.loop = loop || false;
        source.buffer = Sfx.buffer[name];
        source.connect(source.mixer);
        source.start(Sfx.ctx.currentTime);
        return source;
    }

}