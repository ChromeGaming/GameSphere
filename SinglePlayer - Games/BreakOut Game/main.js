// Main JS file 

var canvas = document.getElementById("myCanvas"),
	ctx = canvas.getContext("2d"),
	// Positions
	x = canvas.width/4,
	y = canvas.height-30,
	dx = 0.2,
	dy = -0.2,
	ballRadius = 10,
	ballColour = randomColour(),

	// Paddle 
	paddleHeight = 10,
	paddleWidth = 75, 
	paddleX = (canvas.width-paddleWidth)/2,

	// Keys
	rightPressed = false,
	leftPressed = false,

	// Bricks
	brickRowCount = 3,
	brickColumnCount  = 5,
	brickWidth = 75,
	brickHeight = 20,
	brickPadding = 10,
	brickOffsetTop = 30,
	brickOffsetLeft = 30,
	bricks = [],

	//Score 
	score = 0,

	//Restart Button
	restartButton = document.getElementById('reset-btn'),

	//Timestamp
	tZero;

// Build our bricks 
for(c = 0; c < brickColumnCount; c++){
	bricks[c] = [];
	for(r = 0; r < brickRowCount; r++){
		bricks[c][r] = {
			x: 0,
			y: 0,
			status: 1 
		};
	}
}

// Draw our bricks 
function drawBricks(){
	for (c = 0; c < brickColumnCount; c++){
		for(r = 0; r < brickRowCount; r++){
			if(bricks[c][r].status == 1) { // Only draw bricks that not have been hit
			var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft,
				brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			} 
		}
	}
}

// Draw our ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColour;
	ctx.fill();
	ctx.closePath();
}

// Get a random rgb colour 
function randomColour() {

	function value() {
		return Math.floor(Math.random() * Math.floor(255)) 
	}
	return 'rgb(' + value() + ',' + value() + ',' + value() + ')';
}

// Draw our paddle
function drawPaddle() {
	ctx.beginPath()
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = 'rgb(48, 10, 38)';
	ctx.fill();
	ctx.closePath();
}

// Create some collsion detection
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) { 
            	// Check if the brick has been hit
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    // Winner
                    if(score == brickRowCount*brickColumnCount){
                    	alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD"
	ctx.fillText("Score: "+score, 8, 20); // Text to draw + placement on canvas
}


// Our main Draw function
function draw(t) {

	if(!tZero){
		tZero = t;
	}

	var dt = t - tZero;
	tZero = t;

	var canvasContainer = document.getElementById('js-canvas');
	ctx.clearRect(0, 0, canvas.width, canvas.height); 	//stop drawing from leaving a trail by clearing the canvas each time
	drawBricks();
	drawBall(ballColour);
	drawPaddle();
	drawScore();
	collisionDetection();

//- Bounce of top or bottom
	if(y + dy < ballRadius){
		dy = -dy;
		ballColour = randomColour();
		drawBall(ballColour);

	}else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
        	canvasContainer.classList.add('game-over');
        	document.getElementById('score-box').innerHTML = "Your Score was: "+score;
  			return false;
        }
    }
//- Bounce of left or right 
	if(x + dx < ballRadius || x + dx > canvas.width - ballRadius){
		dx = -dx;
		ballColour = randomColour();
		drawBall(ballColour);
	}

	x += dx * dt; //update x and y to move the position each time it draws
	y += dy * dt;

//-- Move the paddle
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 0.5 * dt;
	} else if(leftPressed && paddleX > 0){
		paddleX -= 0.5 * dt;
	}

	requestAnimationFrame(draw);

}

requestAnimationFrame(draw);

// Key event functions
function keyDownHandler(e){
	if(e.keyCode == 39) {
		rightPressed  = true;
	} else if(e.keyCode == 37){
		leftPressed = true;
	}
}

function keyUpHandler(e){
	if(e.keyCode == 39) {
		rightPressed = false;
	} else if(e.keyCode == 37) {
		leftPressed = false;
	}

}

function restartGame(){
	setTimeout(function(){
		document.location.reload();
	}, 100);
}

// Listen for key event
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Listen for click on restart button 
restartButton.addEventListener("click", restartGame);
