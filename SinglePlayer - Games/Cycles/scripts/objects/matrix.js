function Matrix(width, height, fill) {
    let matrix = [];
    for (let i = 0; i < width; i++) {
        let column = [];
        for (let j = 0; j < height; j++) {
            column.push(fill);
        }
        matrix.push(column);
    }

    this.getXY = function (x, y) {
        if (inBounds(x, y))
            return matrix[x][y];
    }

    this.get = function (position) {
        return this.getXY(position.x, position.y);
    }

    this.setXY = function (x, y, value) {
        if (inBounds(x, y))
            matrix[x][y] = value;
    }

    this.set = function (position, value) {
        this.setXY(position.x, position.y, value);
    }

    this.hasXY = inBounds;

    this.has = function (position) {
        return this.hasXY(position.x, position.y);
    };

    function inBounds(x, y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    this.forEach = function (callback) {
        for (let i = 0; i < width; i++)
            for (let j = 0; j < height; j++)
                callback(matrix[i][j], new Vector2(i, j));
    }

    this.forEachXY = function (callback) {
        for (let i = 0; i < width; i++)
            for (let j = 0; j < height; j++)
                callback(matrix[i][j], i, j);
    }

    this.clone = function () {
        let clone = new Matrix(width, height);
        clone.forEach(function (element, position) {
            let original = matrix[position.x][position.y];
            let copy = original.clone ? original.clone() : deepCopy(original);
            clone.set(position, copy);
        });
        return clone;
    }

    Object.defineProperties(this, {
        "width": {
            value: width,
            writable: false
        },
        "height": {
            value: height,
            writable: false
        },
        "size": {
            value: width,
            writable: false
        }
    });
}
