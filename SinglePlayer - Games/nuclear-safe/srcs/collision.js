function lineCircle(x1, y1, x2, y2, cx, cy, r) {
    /* ctx.fillStyle = "red"
    ctx.beginPath() */
    //ctx.arc(cx,cy,r,0,Math.PI*2)
    //ctx.fill()
    // is either end INSIDE the circle?
    // if so, return true immediately
    if (circleCircle(x1,y1, cx,cy,r) || circleCircle(x2,y2, cx,cy,r)) return true;
    // get dot product of the line and circle
    let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / (dist(x1,y1,x2,y2)**2);
    // find the closest point on the line
    let closestX = x1 + (dot * (x2-x1));
    let closestY = y1 + (dot * (y2-y1));
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    if (!linePoint(x1,y1,x2,y2, closestX,closestY)) return false;
    if (dist(closestX,closestY,cx,cy) <= r) {
      return true;
    }
    return false;
  }
  
  
  // circle/circle or point/circle
  function circleCircle(cx1, cy1, cx2, cy2, r1, r2=0) {
    let distance = dist(cx1,cy1,cx2,cy2)
    if (distance <= r1 + r2) {
      return true;
    }
    return false;
  }

  function lineLine(x1, y1, x2, y2, x3, y3, x4, y4,returnPoint) {
   /*  ctx.strokeStyle="red"
    ctx.beginPath()
    ctx.moveTo(x3,y3)
    ctx.lineTo(x4,y4)
    ctx.stroke() */
    // calculate the distance to intersection point
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        if(returnPoint) return {
            x: x1 + (uA * (x2-x1)),
            y: y1 + (uB * (y2-y1))
        }
        return true;
    }
    return false;
  }

  function circleRect(cx,cy,r,rx,ry,rw,rh){
    let testX = cx;
    let testY = cy;

    if (cx < rx)         testX = rx;      // test left edge
    else if (cx > rx+rw) testX = rx+rw;   // right edge
    if (cy < ry)         testY = ry;      // top edge
    else if (cy > ry+rh) testY = ry+rh;   // bottom edge

    if(dist(testX,testY,cx,cy) <= r){
        return true;
    }
    return false;
  }
  
  
  // LINE/POINT
  function linePoint(x1, y1, x2, y2, px, py) {
    // get distance from the point to the two ends of the line
    let d1 = dist(px,py, x1,y1);
    let d2 = dist(px,py, x2,y2);
  
    // get the length of the line
    let lineLen = dist(x1,y1, x2,y2);
  
    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 2;    // higher # = less accurate
  
    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
      return true;
    }
    return false;
  }

function dist(x1,y1,x2,y2){
    let distX = x1 - x2;
    let distY = y1 - y2;
    return Math.sqrt( distX**2 + distY**2 );
  }