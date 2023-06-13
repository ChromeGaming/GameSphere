import cards from './cards.js';

export default (() => {
  var minerals = 0;
  var level = 0;
  var handSize = 3;
  var maxEnergy = 5;
  var maxShield = 3;
  var deck = [];

  var a = {
    reset: () => {
      minerals = 0;
      level = 0;
      handSize = 3;
      maxEnergy = 5;
      maxShield = 3;
      deck = [
        cards[0],cards[0],cards[0],
        cards[1],cards[1],cards[1],
        cards[2],cards[2],cards[2],
      ];
    },

    getMinerals: () => minerals,
    addMineral: (m) => minerals += m,

    getLevel: () => level,
    setLevel: (l) => level = l,

    getHandSize: () => handSize,
    setHandSize: (e) => handSize = e,

    getMaxEnergy: () => maxEnergy,
    setMaxEnergy: (e) => maxEnergy = e,

    getMaxShield: () => maxShield,
    setMaxShield: (e) => maxShield = e,

    getDeck: () => deck,
    addToDeck: (c) => deck.push(c),
  };
  a.reset();

  return a;
})();