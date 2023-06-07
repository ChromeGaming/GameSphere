(function () {
  "use strict";

  /**
   * @param {JSONMap} map
   * @constructor
   */
  window.Board = function (map) {
    var startTile = null,
      endTiles = [],
      numberOfBugs = 0,
      tiles = null;

    function init() {
      var i, type, tile, x, y;

      if (map.width * map.height !== map.tiles.length) {
        throw "Map definition is invalid. Width * Height != number of tiles.";
      }

      tiles = [];
      for(i = 0; i < map.height; i++) {
        tiles.push([]);
      }

      for (i = 0; i < map.tiles.length; i++) {
        x = i % map.width;
        y = Math.floor(i / map.width);
        type = map.tiles[i];
        tile = new Tile(x, y, type);

        tiles[y][x] = tile;

        if (tile.getType() === 'start') {
          startTile = tile;
        }
        if (tile.getType() === 'end') {
          endTiles.push(tile);
        }
        if(tile.getType() === 'bug') {
          numberOfBugs++;
        }
      }
    }

    init();

    /*********************
     ******* PUBLIC *******
     **********************/

    /**
     * Get map width.
     * @returns {number}
     */
    this.getWidth = function () {
      return map.width;
    };

    /**
     * Get map height.
     * @returns {number}
     */
    this.getHeight = function () {
      return map.height;
    };

    /**
     * Get array of starting tiles.
     * @returns {Tile}
     */
    this.getStartTile = function () {
      return startTile;
    };

    /**
     * Get array of ending tiles.
     * @returns {Tile[]} Array with x and y positions of objects
     */
    this.getEndTiles = function () {
      return endTiles;
    };

    /**
     * Get number of bugs that appear on map.
     * @returns {number}
     */
    this.getNumberOfBugs = function() {
      return numberOfBugs;
    };

    /**
     * Return single tile at given position.
     *
     * @param x {number}
     * @param y {number}
     * @returns {Tile}
     */
    this.getTile = function (x, y) {
      return (tiles[y] && tiles[y][x]) || null;
    };
  };
}());