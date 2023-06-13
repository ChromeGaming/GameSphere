let Levels = [{
    isEmpty: function (position) {
        return false;
    },
    text: 'Drag the tiles to create cycles',
    objectiveMet: function (data) {
        return data.score > 0;
    }
}, {
    isEmpty: function (position) {
        return false;
    },
    text: 'Create cycles in a row to combo',
    objectiveMet: function (data) {
        return data.combo.current > 1;
    }
}, {
    isEmpty: function (position) {
        return position.x === 3 && position.y === 3;
    },
    text: 'Destroy the glitch tile!',
    objectiveMet: noGlitch
}, {
    isEmpty: function (position) {
        return (position.x === position.y) && (position.x === 2 || position.x === 4);
    },
    text: 'The glitch is spreading, stop it!',
    time: 240,
    objectiveMet: noGlitch
}, {
    isEmpty: function (position) {
        return (position.x === 2 || position.x === 4) && (position.y === 2 || position.y === 4);
    },
    turns: 100,
    text: 'Get 3,000 points',
    objectiveMet: highscore(3000)
}, {
    isEmpty: function (position) {
        switch (position.x) {
        case 1:
            return position.y === 5;
        case 2:
        case 3:
        case 4:
            return position.x === position.y;
        case 5:
            return position.y === 1;
        default:
            return false;
        }
    },
    isBlocker: function (position) {
        return position.x === 3 && position.y === 3;
    },
    time: 200,
    text: 'Destroy all the glitch tiles',
    objectiveMet: noGlitch
}, {
    isEmpty: function (position) {
        return (position.x === 1 || position.x === 5) && (position.y === 1 || position.y === 5);
    },
    isBlocker: function (position) {
        return (position.x === 1 || position.x === 5) && (position.y === 1 || position.y === 5);
    },
    time: 200,
    text: 'Get a x5 combo',
    objectiveMet: function (data) {
        return data.combo.current >= 5;
    }
}, {
    isEmpty: function (position) {
        return position.x % 3 === 0;
    },
    time: 120,
    text: 'Score 4,000 points in one turn',
    objectiveMet: function (data) {
        this.lastScore = this.lastScore || 0;
        return data.score - this.lastScore >= 4000;
    }
}, {
    isEmpty: function (position) {
        return false;
    },
    isBlocker: function (position) {
        return (position.x === 2 || position.x === 4) && (position.y === 2 || position.y === 4);
    },
    turns: 20,
    text: 'Destroy all blockers',
    objectiveMet: function noGlitch(data) {
        let result = true;
        data.board.forEach(function (element) {
            if (element.isBlocker())
                result = false;
        });
        return result;
    }
}, {
    isEmpty: function (position) {
        switch (position.y) {
        case 0:
            return !(position.x % 3 === 0);
        case 1:
            return position.x % 3 === 0;
        case 2:
        case 3:
            return position.x === 0 || position.x === 6;
        case 4:
            return position.x === 1 || position.x === 5;
        case 5:
            return position.x === 2 || position.x === 4;
        case 6:
            return position.x === 3;
        }
    },
    text: 'Free Play',
    objectiveMet: function (data) {
        return false;
    }
}]

function noGlitch(data) {
    let result = true;
    data.board.forEach(function (element) {
        if (element.isGlitch())
            result = false;
    });
    return result;
}

function highscore(score) {
    return function (data) {
        return data.score >= score;
    }
}
