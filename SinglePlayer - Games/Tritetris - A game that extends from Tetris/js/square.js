function Square(topleft, side, color, cx) {
  this.topleft = new Vector(topleft.x, topleft.y);
  this.side = side;
  this.color = color;
  this.cx = cx;
  this.apex1 = new Vector(topleft.x, topleft.y);
  this.apex2 = new Vector(topleft.x + side, topleft.y);
  this.apex3 = new Vector(topleft.x + side, topleft.y + side);
  this.apex4 = new Vector(topleft.x, topleft.y + side);
  this.apexes = [];
  this.apexes.push(this.apex1, this.apex2, this.apex3, this.apex4);
  this.thetas = [];
}

Square.prototype.display = function() {
  var cx = this.cx;
  cx.strokeStyle = this.color;
  cx.lineWidth = 0.125 * this.side;
  cx.lineJoin = "miter";
  this.makeClosedPath(this.apex1, this.apex2, this.apex3, this.apex4);
  cx.stroke();
};

Square.prototype.disappear = function() {
  var cx = this.cx;
  cx.strokeStyle = cx.canvas.style.backgroundColor;
  cx.lineWidth = 0.125 * this.side + 1.5;
  this.makeClosedPath(cx, this.apex1, this.apex2, this.apex3, this.apex4);
  cx.stroke();
}

Square.prototype.rotate = function(angle) {
  this.disappear();
  for (var i = 0; i < 4; i++) {
    this.thetas[i] += angle;
  }
  this.rotateApexes();
  this.display();
};

Square.prototype.fall = function(distance) {
  this.disappear();
  this.topleft.y += distance;
  this.moveApexes();
  this.display();
}

Square.prototype.moveApexes = function() {
  this.apex1.set(this.topleft.x, this.topleft.y);
  this.apex2.set(this.topleft.x + this.side, this.topleft.y);
  this.apex3.set(this.topleft.x + this.side, this.topleft.y + this.side);
  this.apex4.set(this.topleft.x, this.topleft.y + this.side);
  this.setThetasBasedOnApexes();
};

Square.prototype.rotateApexes = function() {
  var r0 = Math.sqrt(this.topleft.x * this.topleft.x
                     + this.topleft.y * this.topleft.y);
  this.topleft.x = r0 * Math.cos(this.thetas[0]);
  this.topleft.y = r0 * Math.sin(this.thetas[0]);
  for (var i = 0; i < 4; i++) {
    var apex = this.apexes[i];
    var r = Math.sqrt(apex.x * apex.x + apex.y * apex.y);
    apex.set(r * Math.cos(this.thetas[i]), r * Math.sin(this.thetas[i]));
  }
  //在该函数调用之前，thetas就已经更新了，如果再更新，就会出现错误。
  //this.setThetasBasedOnApexes();
};

Square.prototype.setThetasBasedOnApexes = function() {
  if (this.thetas.length !== 0) {
    this.thetas.length = 0;
  }
  var theta1 = this.apex1.x === 0 ? -Math.PI / 2 :
                                    Math.atan(this.apex1.y / this.apex1.x);
  var theta2 = this.apex2.x === 0 ? -Math.PI / 2 :
                                    Math.atan(this.apex2.y / this.apex2.x);
  var theta3 = this.apex3.x === 0 ? -Math.PI / 2 :
                                    Math.atan(this.apex3.y / this.apex3.x);
  var theta4 = this.apex4.x === 0 ? -Math.PI / 2 :
                                    Math.atan(this.apex4.y / this.apex4.x);
  
  this.thetas.push(theta1, theta2, theta3, theta4);
  for (var i = 0; i < 4; i++) {
    if (this.thetas[i] > 0) {
      this.thetas[i] = -(Math.PI - this.thetas[i]);
    }
  }
};

Square.prototype.makeClosedPath = function() {
  var cx = this.cx;
  cx.beginPath();
  cx.moveTo(arguments[0].x, arguments[0].y);
  for (var i = 1; i < arguments.length; i++) {
    cx.lineTo(arguments[i].x, arguments[i].y);
  }
  cx.closePath();
}

Square.prototype.setTopleft = function(x, y) {
  this.topleft.set(x, y);
}
