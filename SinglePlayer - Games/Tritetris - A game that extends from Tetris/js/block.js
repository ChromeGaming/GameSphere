function Block(topleft, shape, squareSide, gap, cx) {
  this.topleft = topleft;
  this.shape = shape;
  this.squareSide = squareSide;
  this.gap = gap;
  this.cx = cx;
  var cvHeight = cx.canvas.height;
  var color;
  var startY, col, row, maxCol;
  var pattern1, pattern2, pattern3, pattern4;

  this.squares = [];
  // this.falling = false;
  switch(shape) {
    case "I":
      color = "wheat";
      pattern1 = "00010203";
      pattern2 = "00102030";
      pattern3 = pattern1;
      pattern4 = pattern2;
      break;
    case "J":
      color = "hotpink";
      pattern1 = "10111202";
      pattern2 = "00011121";
      pattern3 = "00010210";
      pattern4 = "00102021";
      break;
    case "L":
      color = "aqua";
      pattern1 = "00010212";
      pattern2 = "00102001";
      pattern3 = "00101112";
      pattern4 = "01112120";
      break;
    case "O":
      color = "mediumpurple";
      pattern1 = "00011011";
      pattern2 = "00100111";
      pattern3 = "00101101";
      pattern4 = "00011110";
      break;
    case "S":
      color = "olive";
      pattern1 = "01111020";
      pattern2 = "00011112";
      pattern3 = pattern1;
      pattern4 = pattern2;
      break;
    case "Z":
      color = "navajowhite";
      pattern1 = "00101121";
      pattern2 = "10110102";
      pattern3 = pattern1;
      pattern4 = pattern2;
      break;
    case "T":
      color = "tomato";
      pattern1 = "01111021";
      pattern2 = "00010211";
      pattern3 = "00102011";
      pattern4 = "01101112";
      break;
  }
  this.patterns = [pattern1, pattern2, pattern3, pattern4];
  this.pattern = this.patterns[0];

  var self = this;
  this.build(function(squareIndex, col, row) {
    var squareTopleft =
          new Vector(self.topleft.x + col * squareSide + col * self.gap, 
                     self.topleft.y + row * squareSide + row * self.gap);
    self.squares[squareIndex] = new Square(squareTopleft, squareSide,
                                           color, cx);
  });
}

//也可以根据block的width和height来“涂抹”block的区域，但为了简单，直接
//调用square的disappear()。
Block.prototype.disappear = function() {
  this.squares.forEach(function(s) {
    s.disappear();
  });
};

Block.prototype.display = function() {
  this.squares.forEach(function(s) {
    s.display();
  });
};

Block.prototype.deform = function(gotoNext) {
  this.disappear();
  this.invisiblyDeform(gotoNext);
  this.display();
};

// just update data, no displaying
Block.prototype.invisiblyDeform = function(gotoNext) {
  var val = gotoNext ? 1 : -1; // go to next or go to previous
  var index = this.patterns.indexOf(this.pattern);
  if (index + val > 3) {
    index = 0;
  } else if (index + val < 0) {
    index = 3;
  } else {
    index += val;
  }
  this.pattern = this.patterns[index];
  this.setSquareCoors();
};

Block.prototype.move = function(vector) {
  this.disappear();
  this.invisiblyMove(vector);
  this.display();
}

// just update data, no displaying
Block.prototype.invisiblyMove = function(vector) {
  this.setTopleft(this.topleft.x + vector.x, this.topleft.y + vector.y);
  this.setSquareCoors();
}

Block.prototype.setTopleft = function(x, y) {
  this.topleft.set(x, y);
}

Block.prototype.setSquareCoors = function() {
  var self = this;
  this.build(function(squareIndex, col, row) {
    self.squares[squareIndex]
      .setTopleft(self.topleft.x + col * self.squareSide + col * self.gap,
                  self.topleft.y + row * self.squareSide + row * self.gap);
    self.squares[squareIndex].moveApexes();
  })
};

Block.prototype.build = function(callback) {
  var maxCol = this.pattern[0], maxRow = this.pattern[1];
  for (var i = 0; i < 4; i++) {
    var col = this.pattern[2 * i],
        row = this.pattern[2 * i + 1];
    
    callback(i, col, row);

    maxCol = Math.max(maxCol, col);
    maxRow = Math.max(maxRow, row);
  }
  this.width = (maxCol + 1) * this.squareSide + maxCol * this.gap;
  this.height = (maxRow + 1) * this.squareSide + maxRow * this.gap;
}

Block.prototype.copy = function() {
  var block = new Block(this.topleft.copy(), this.shape,
                        this.squareSide, this.gap, this.cx);
  block.setPattern(this.pattern);
  return block;
}

Block.prototype.setPattern = function(pattern) {
  this.pattern = pattern;
}