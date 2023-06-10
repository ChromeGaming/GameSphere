// Create out function rect1 and rect2 are the objects we will be colliding
function collision(rect1, rect2) {
    // check if they are overlapping
    if (typeof rect1 != "undefined" && typeof rect2 != "undefined") {
        if (rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x &&
            rect1.y <= rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
            // If they are colliding, return true
            return true;
        } else {
            // If they are not colliding, return false
            return false;
        }
    } else {
        return false;
    }

};

function hoverOn(obj) {
    if (pointer.x >= obj.x && pointer.x <= obj.x + obj.width && pointer.y >= obj.y && pointer.y <= obj.y + obj.height) {
        return true;
    } else {
        return false;
    }
}