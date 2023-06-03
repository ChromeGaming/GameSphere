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

export { setSounds, playSound };
