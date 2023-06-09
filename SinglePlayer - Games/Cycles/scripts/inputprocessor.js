function InputProcessor(data) {
    let tileSelected;
    let offset = {};

    this.onpress = function (location) {
        if (data.ignoreBoardInput === true)
            return;
        tileSelected = location;
    }

    this.onmove = function (location) {
        if (data.ignoreBoardInput === true)
            return;
        offset = {
            x: location.x - tileSelected.x,
            y: location.y - tileSelected.y
        }
        processOffset();
    }

    function processOffset() {
        if (!data.offset.invalid && (Math.abs(offset.x) > 0.3 || Math.abs(offset.y) > 0.3) && data.offset.value === undefined) {
            if (Math.abs(offset.x) > Math.abs(offset.y)) {
                data.offset.row = Math.floor(tileSelected.y);
                data.offset.invalid = false;
                for (let i = 0; i < data.board.size; i++) {
                    if (data.board.getXY(i, data.offset.row).isBlocker()) {
                        data.offset.invalid = true;
                        break;
                    }
                }
            } else {
                data.offset.column = Math.floor(tileSelected.x);
                data.offset.invalid = false;
                for (let i = 0; i < data.board.size; i++) {
                    if (data.board.getXY(data.offset.column, i).isBlocker()) {
                        data.offset.invalid = true;
                        break;
                    }
                }
            }
            updateDataOffsetValue();
        }
        if (data.offset.value !== undefined) {
            updateDataOffsetValue();
        }
    }

    function updateDataOffsetValue() {
        let limit = data.board.width - 1;
        if (data.offset.invalid === true) {
            data.offset.value = 0;
        } else if (data.offset.row !== undefined) {
            data.offset.value = clamp(offset.x, -limit, limit);
        } else {
            data.offset.value = clamp(offset.y, -limit, limit);
        }
    }

    function clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }

    this.onrelease = function () {
        if (data.ignoreBoardInput === true)
            return;

        data.offset.value = Math.round(-data.offset.value) || 0;
        if (data.offset.value < 0)
            data.offset.value += data.board.width;
        if (data.offset.value !== 0) {
            updateBoardAfterShift();
            data.ignoreInput = true;
            data.boardChanged = true;
        }

        data.offset = {};
    }

    function updateBoardAfterShift() {
        let shifted = [];
        if (data.offset.row !== undefined) {
            for (let i = 0; i < data.board.size; i++) {
                shifted[i] = data.board.getXY((i + data.offset.value) % data.board.size, data.offset.row);
            }
            for (let i = 0; i < data.board.size; i++) {
                data.board.setXY(i, data.offset.row, shifted[i]);
            }
        } else {
            for (let i = 0; i < data.board.size; i++) {
                shifted[i] = data.board.getXY(data.offset.column, (i + data.offset.value) % data.board.size);
            }
            for (let i = 0; i < data.board.size; i++) {
                data.board.setXY(data.offset.column, i, shifted[i]);
            }
        }
    }

    this.oncancel = function () {
        data.offset = {};
    }

    this.restartLevelPressed = function () {
        data.restart = true;
    }

    this.wipeSavePressed = function () {
        if (window.confirm('Erase all saved data?')) {
            localStorage.removeItem(Logic.LEVEL_KEY);
            location.reload();
        }
    }
}
