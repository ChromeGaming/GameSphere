let BoardCreator = {
    create: function (level) {
        let board = new Matrix(Game.BOARD_SIZE, Game.BOARD_SIZE, new Tile());
        this.spiralFill(board);
        this.levelFill(board, level);
        return board;
    },
    spiralFill: function (board) {
        let position = new Vector2(3, 3);
        let steps = 1;
        let times = 2;
        let direction = 0;
        while (true) {
            for (let i = 0; i < steps; i++) {
                if (!fill(board, position))
                    return;
                position = position.add(Vector2.directions[direction]);
            }
            direction = (direction + 1) % 4;
            if (--times === 0) {
                steps++;
                times = 2;
            }
        }

        function fill(board, position) {
            if (board.has(position)) {
                let tiles = shuffle(Tile.tileset.slice());
                while (true) {
                    board.set(position, tiles.pop().clone());
                    if (BoardAnalizer.isTree(board))
                        break;
                }
                return true;
            }
            return false;
        }
    },
    levelFill: function (board, level) {
        board.forEach(function (element, position) {
            if (level.isEmpty(position)) {
                board.set(position, new Tile());
            }
            if (level.hasOwnProperty('isBlocker') && level.isBlocker(position)) {
                board.get(position).setBlocker(true);
            }
        });
    }
}
