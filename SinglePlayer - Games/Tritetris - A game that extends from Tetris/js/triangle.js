function Triangle(angle, r, color, cx) {
  this.angle = angle; // 下面顶点与中心连线与x轴正向的夹角
  this.r = r; // r means the radius of its circumcircle
  this.color = color;
  this.cx = cx;
  this.apex1 = new Vector(r * Math.cos(angle), r * Math.sin(angle));
  this.apex2 = new Vector(r * Math.cos(angle + 2 * Math.PI / 3),
                          r * Math.sin(angle + 2 * Math.PI / 3));
  this.apex3 = new Vector(r * Math.cos(angle - 2 * Math.PI / 3),
                          r * Math.sin(angle - 2 * Math.PI / 3));
  this.thickness = 0.08 * r;
}

Triangle.prototype.display = function() {
  var cx = this.cx;
  cx.lineWidth = this.thickness;
  cx.lineJoin = "round";
  cx.strokeStyle = this.color;
  this.makeClosedPath(cx, this.apex1, this.apex2, this.apex3);
  cx.stroke();
};

Triangle.prototype.disappear = function() {
  var cx = this.cx;
  cx.strokeStyle = cx.canvas.style.backgroundColor;
  cx.lineWidth = 0.11 * this.r;
  this.makeClosedPath(this.apex1, this.apex2, this.apex3);
  cx.stroke();
};

Triangle.prototype.rotate = function(angle) {
  var step, maxStep = 0.08, rest, anglePassed = 0, requestID;
  var self = this;
  function animate() {
    self.disappear();
    rest = Math.abs(angle - anglePassed);
    step = angle > 0 ? Math.min(maxStep, rest) : -Math.min(maxStep, rest);
    self.angle += step;
    self.setApexes();
    self.display();
    anglePassed += step;
    if (anglePassed === angle)
      cancelAnimationFrame(requestID);
    else
      requestID = requestAnimationFrame(animate);
  }
  requestID = requestAnimationFrame(animate);
};

Triangle.prototype.setApexes = function() {
  var angle = this.angle;
  var r = this.r;
  this.apex1.set(r * Math.cos(angle), r * Math.sin(angle));
  this.apex2.set(r * Math.cos(angle + 2 * Math.PI/3), 
                 r * Math.sin(angle + 2 * Math.PI/3));
  this.apex3.set(r * Math.cos(angle - 2 * Math.PI/3), 
                 r * Math.sin(angle - 2 * Math.PI/3));
};

Triangle.prototype.makeClosedPath = function() {
  var cx = this.cx;
  cx.beginPath();
  cx.moveTo(arguments[0].x, arguments[0].y);
  for (var i = 1; i < arguments.length; i++) {
    cx.lineTo(arguments[i].x, arguments[i].y);
  }
  cx.closePath();
}