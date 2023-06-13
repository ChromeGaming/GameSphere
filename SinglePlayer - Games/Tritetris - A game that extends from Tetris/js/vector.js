function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
}