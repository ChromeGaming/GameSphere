Logic.LEVEL_KEY = 'pl.szpiotr.cycles.level';

function Logic() {
    let FALL_SPEED = 6,
        levelCompleted;

    this.init = function(data) {
        let level = localStorage.getItem(Logic.LEVEL_KEY) || 0;
        initLevel(data, level);
    }

    function initLevel(data, number) {
        clearData();
        data.offset = {};
        initTime();
        initScore();

        localStorage.setItem(Logic.LEVEL_KEY, number);
        initLevelProperties();

        function clearData() {
            for (let prop in data) {
                if (data.hasOwnProperty(prop))
                    delete data[prop];
            }
        }

        function initTime() {
            data.time = {
                last: Date.now(),
                now: Date.now()
            }
        }

        function initScore() {
            data.score = 0;
            data.combo = {
                current: 0,
                previous: 0,
                color: 'white'
            };
        }

        function initLevelProperties() {
            let level = Levels[number];
            levelCompleted = level.objectiveMet;

            data.message = new Message('Level ' + number, 2);
            data.level = {};
            data.level.current = number;
            data.level.text = level.text;
            if (level.hasOwnProperty('turns')) {
                data.level.turnsLeft = level.turns;
            } else if (level.hasOwnProperty('time')) {
                data.level.startTime = Date.now();
                data.level.timeTotal = level.time;
                data.level.timeLeft = level.time;
            }
            data.board = BoardCreator.create(level);
        }
    }

    this.update = function(data) {
        if (data.restart === true) {
            initLevel(data, data.level.current);
            return;
        }
        data.message.update(data);
        updateTimeLeft(data);
        processPlayerActions(data);
        removeTilesIfNeeded(data);
        updateTiles(data);
        endLevelIfNecessary(data);
    }

    function updateTimeLeft(data) {
        if (data.level.hasOwnProperty('timeLeft')) {
            data.level.timeLeft = Math.ceil((data.level.timeTotal * 1000 + data.level.startTime - Date.now()) / 1000);
            if (data.level.timeLeft < 0)
                data.level.timeLeft = 0;
        }
    }

    function processPlayerActions(data) {
        if (data.boardChanged === true) {
            data.boardChanged = false;
            analyzeBoard();
            handleEndOfTurn();
        }

        function analyzeBoard() {
            if (BoardAnalizer.findCycles(data)) {
                Graphics.cycleColor = Graphics.getRainbow();
                data.timeUntilTileRemove = 0.7;
            } else {
                data.ignoreInput = false;
                data.turnPassed = true;
            }
        }

        function handleEndOfTurn() {
            if (data.turnPassed === true) {
                data.turnPassed = false;

                if (data.level.hasOwnProperty('turnsLeft'))
                    data.level.turnsLeft--;

                if (data.combo.current === data.combo.previous) {
                    data.combo.current = data.combo.previous = 0;
                } else {
                    data.combo.previous = data.combo.current;
                }
            }
        }
    }

    function removeTilesIfNeeded(data) {
        if (data.timeUntilTileRemove > 0) {
            data.timeUntilTileRemove -= data.time.delta;
            if (data.timeUntilTileRemove < 0) {
                let shouldDelete = BoardAnalizer.shouldDeleteArray(data.board);
                updateScore(data, shouldDelete);
                removeTiles(data, shouldDelete);
            }
        }
    }

    function updateScore(data, shouldDelete) {
        let updateCombo = false;
        let counter = 0;
        data.board.forEachXY(function(element, x, y) {
            if (shouldDelete[x][y]) {
                updateCombo = true;
                data.score += ++counter * (data.combo.current + 1) * 10;
                if (element.isGlitch())
                    data.score += 500 * (data.combo.current + 1);
            }
        });
        if (updateCombo) {
            data.combo.color = Graphics.getRainbow();
            data.combo.current++;
            ComboAnnouncer.announce(data);
        }
    }

    function removeTiles(data, shouldDelete) {
        for (let i = 0; i < data.board.size; i++) {
            let ceiling = 1;
            for (let j = data.board.size - 1; j >= 0; j--) {
                if (shouldDelete[i][j]) {
                    for (var k = j - 1; k >= 0; k--) {
                        if (!shouldDelete[i][k])
                            break;
                    }
                    if (k >= 0) {
                        shouldDelete[i][k] = true;
                        let tile = data.board.getXY(i, k);
                        tile.offset = j - k;
                        data.board.setXY(i, j, tile);
                    } else {
                        let tile = Tile.tileset[Math.floor(Math.random() * Tile.tileset.length)].clone();
                        tile.offset = j + ceiling;
                        data.board.setXY(i, j, tile);
                        ceiling++;
                    }
                }
            }
        }
    }

    function updateTiles(data) {
        let positionChanged = false;
        data.board.forEach(function(tile) {
            updateHue(tile);
            if (updatePosition(tile, data.time.delta)) {
                positionChanged = true;
            }
        });
        if (data.timeUntilTileRemove < 0 && !positionChanged) {
            data.timeUntilTileRemove = 0;
            data.boardChanged = true;
        }

        function updateHue(tile) {
            if (tile.isGlitch()) {
                if (!tile.hasOwnProperty('nextChange') || tile.nextChange <= 0) {
                    tile.hue = Math.random() * 360;
                    tile.nextChange = Math.random() * 1.5;
                }
                tile.nextChange -= data.time.delta;
            }
        }

        function updatePosition(tile) {
            if (tile.offset === 0)
                return false;

            tile.offset -= data.time.delta * FALL_SPEED;
            if (tile.offset <= 0) {
                tile.offset = 0;
            }

            return true;
        }
    }

    function endLevelIfNecessary(data) {
        if (!data.ignoreInput) {
            if (noTurnsLeft() || noTimeLeft()) {
                if (data.ignoreBoardInput != true) {
                    data.message = new Message('Level failed', 1, true);
                    data.ignoreBoardInput = true;
                }
            } else if (levelCompleted(data)) {
                initLevel(data, ++data.level.current);
            }
        }

        function noTurnsLeft() {
            return data.level.hasOwnProperty('turnsLeft') && data.level.turnsLeft <= 0;
        }

        function noTimeLeft() {
            return data.level.hasOwnProperty('timeLeft') && data.level.timeLeft <= 0;
        }
    }
}
