function Vector2(x, y) {
    Object.defineProperties(this, {
        "x": {
            value: x,
            writable: false
        },
        "y": {
            value: y,
            writable: false
        }
    });

    this.add = function (vector) {
        return new Vector2(x + vector.x, y + vector.y);
    }

    this.sub = function (vector) {
        return new Vector2(x - vector.x, y - vector.y);
    }

    this.mul = function (scalar) {
        return new Vector2(x * scalar, y * scalar);
    }

    this.equals = function (other) {
        if (!(other instanceof Vector2))
            return false;
        return x === other.x && y === other.y;
    }
}

Vector2.directions = [
    new Vector2(0, -1),
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(-1, 0)
]
