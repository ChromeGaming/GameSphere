/*
 * This class implements some functions for linear algebra.
 * It is used for simulating the movement and detecting colisions.
 * For reasons of optmization, most methods change the vector, 
 * instead of instantiating a new one. If the vector should not be changed, 
 * then the copy method is used. 
 */

Vector = function (x, y) {
    this.x = x;
    this.y = y;
};

// Returns the norm of the vector, that is the length of it.
Vector.norm = function (v) {
    return Math.sqrt(Vector.norm2(v));
};

// Returns the norm of the vector squared (for optimization).
Vector.norm2 = function (v) {
    return v.x * v.x + v.y * v.y;
};

// Scale the given vector by the give factor.
Vector.scale = function (v, factor) {
    v.x *= factor;
    v.y *= factor;
    return v;
};

// Add the 'a' vector to the 'b' vector.
Vector.addTo = function (a, b) {
    b.x += a.x;
    b.y += a.y;
    return b;
};

// Subtract the 'a' vector from the 'b' vector.
Vector.subFrom = function (a, b) {
    b.x -= a.x;
    b.y -= a.y;
    return b;
};

// Creates a new vector with the same coordinate values of the given one.
Vector.copy = function (v) {
    return { x: v.x, y: v.y };
};

// Compares two vectors. Return true if both have the same coordinate values.
Vector.equals = function (a, b) {
    return a.x == b.x && a.y == b.y;
};

// Rounds the coordinates of the given vector.
Vector.round = function (v) {
    v.x = Math.round(v.x);
    v.y = Math.round(v.y);
    return v;
};

// Returns the scalar product of two given vectors.
Vector.scalarProduct = function (a, b) {
    return a.x * b.x + a.y * b.y;
};

// Modifies the vector 'b' projecting it over the vector 'a'.
Vector.project = function (a, b) {
    var factor = Vector.scalarProduct(a, b) / Vector.scalarProduct(b, b);
    return Vector.scale(b, factor);
};