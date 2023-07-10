var sounds = {
  byName: {
    'fx1.ogg': '0',
  },
  byId: {}
};
for (var soundName in sounds.byName) {
  if (sounds.byName.hasOwnProperty(soundName)) {
    sounds.byId[sounds.byName[soundName]] = soundName;
  }
}
module.exports = SOUNDS = sounds;
