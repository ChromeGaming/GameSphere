/**
 * JSON level definition.
 *
 * @class JSONLevel
 * @property {String} name
 * @property {Number[]} stars
 * @property {JSONMap} map
 */

/**
 * JSON map definition.
 *
 * @class JSONMap
 * @property {Number} height
 * @property {Number} width
 * @property {String} map
 */

(function () {
  "use strict";
  var levels = [];

  window.MapLoader = function () {
    this.getLevel = function (id) {
      return levels[id] || null;
    };

    this.getNumberOfLevels = function() {
      return levels.length;
    }
  };

  levels = [{
    name: "Just a wall",
    stars: [1],
    map: {
      width: 7,
      height: 7,
      tiles: (new Array(50)).join('X')
    }
  },{
    name: "Training",
    stars: [6,7,10],
    map: {
      width: 7,
      height: 7,
      tiles: "" +
        "XXXXXXX" +
        "XXXXXXX" +
        "XXOXXXX" +
        "S#*#O E" +
        "XOOOO X" +
        "XXXXXXX" +
        "XXXXXXX"
    }
  },{
    name: "That's easy",
    stars: [15,17,20],
    map: {
      width: 7,
      height: 7,
      tiles: "" +
        "XXXXXXX" +
        "X###OOX" +
        "X##O*#X" +
        "S#### X" +
        "X#O#O X" +
        "X##*# E" +
        "XXXXXXX"
    }
  }, {
    name: "Rolling stones",
    stars: [25, 29, 31],
    map: {
      width: 10,
      height: 7,
      tiles: "" +
        "XXXXXXXXXX" +
        "XOOO#OOOOX" +
        "X*OO#O##*X" +
        "X#OO####OE" +
        "X##### ##X" +
        "S#OO##O##X" +
        "XXXXXXXXXX"
    }
  }, {
    name: "Two roads",
    stars: [1],
    map: {
      width: 12,
      height: 7,
      tiles: "" +
        "XXXXXXXXXXXX" +
        "X OX####O  X" +
        "XOO #X#X*XOX" +
        "S#O X*XO#O#X" +
        "X*#    O O#X" +
        "X##XX O# ##E" +
        "XXXXXXXXXXXX"
    }
  }, {
    name: "Heavy lifting",
    stars: [1],
    map: {
      width: 10,
      height: 7,
      tiles: "" +
        "XXXXOXXXXX" +
        "X ##OX  OX" +
        "X ##O   OX" +
        "X OOO#X #E" +
        "XO##*OX  X" +
        "S#O  *#  X" +
        "XXXXXXXXXX"
    }
  }, {
    name: "The End",
    stars: [1],
    map: {
      width: 7,
      height: 7,
      tiles: "" +
        "XXXXXXX" +
        "XXXXXXX" +
        "XXXXXXX" +
        "S O $ X" +
        "XXX XXX" +
        "XXXXXXX" +
        "XXXXXXX"
    }
  }];
}());