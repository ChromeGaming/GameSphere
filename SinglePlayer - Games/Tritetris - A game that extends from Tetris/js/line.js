function Line(length, r2center, color, cx) {
  this.length = length;
  this.r2center = r2center;
  this.color = color;
  this.cx = cx;
}

Line.prototype.display = function() {
  var cx = this.cx;
  cx.strokeStyle = this.color;
  cx.lineWidth = 0.5;
  cx.beginPath();
  cx.moveTo(-this.length / 2, -this.r2center);
  cx.lineTo(this.length / 2, -this.r2center);
  cx.stroke();
};

Line.prototype.disappear = function() {
  var cx = this.cx;
  cx.strokeStyle = cx.canvas.style.backgroundColor;
  cx.lineWidth = 2;
  cx.beginPath();
  cx.moveTo(-this.length / 2, -this.r2center);
  cx.lineTo(this.length / 2, -this.r2center);
  cx.stroke();
}

// invoking display() makes it thicker and thicker, so reset() is necessary
Line.prototype.reset = function() {
  this.disappear();
  this.display();
}