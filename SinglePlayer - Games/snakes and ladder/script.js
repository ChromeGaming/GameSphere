const cssColorsOriginal=["lightblue","lightgray","pink","red","yellow"];
let cssColors=cssColorsOriginal;
let music = new Audio("./Assets/snlMusic.mp3")
let diceroll = new Audio("./Assets/Dice Roll.mp3")
let climbladder = new Audio("./Assets/ladder.mp3")
let snakebite = new Audio("./Assets/snake.mp3")

class Player {
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.id=id;
	}
	getDomElement(){
		if(!this.dom){
			this.dom = document.createElement("div");
			this.dom.classList.add("player");
			let idx=randIntv1(cssColors.length);
			this.dom.style["background"]=cssColors[idx];
			cssColors.splice(idx,1);
			this.dom.style["marginLeft"]=`${randIntv1(20)}px`;
			this.dom.style["marginTop"]=`${randIntv1(20)}px`;
			let text=document.createTextNode(this.id);
			this.dom.appendChild(text);
		}
		return this.dom;
	}
}

class Ladder {
	constructor(startX, startY, endX, endY) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}
	getAngle() {
		return Math.atan((this.endY - this.startY) / (this.endX - this.startX));
	}
	getLength() {
		return Math.sqrt(Math.pow(this.endY - this.startY, 2) + Math.pow(this.endX - this.startX, 2));
	}
}

class Snake {
	constructor(startX, startY, endX, endY) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}
	getAngle() {
		return Math.atan((this.endY - this.startY) / (this.endX - this.startX));
	}
	getLength() {
		return Math.sqrt(Math.pow(this.endY - this.startY, 2) + Math.pow(this.endX - this.startX, 2));
	}
}

const height = 10;
const width = 10;

let players =[];
let currentPlayer,playerIterator;

//normally have 8 to 9 ladders, and one less snake to ladders
let ladders = [
	new Ladder(7, 1, 6, 3),
	new Ladder(8, 2, 9, 4),
	new Ladder(1, 3, 3, 5),
	new Ladder(2, 6, 3, 9),
	new Ladder(5, 6, 6, 7),
	new Ladder(0, 7, 2, 8),
];

let snakes = [
	new Snake(2, 7, 0, 5),
	new Snake(5, 4, 5, 2),
	new Snake(4, 2, 2, 0),
	new Snake(9, 7, 8, 4),
	new Snake(4, 8, 3, 5),
]

function randIntv1(x){
	return Math.trunc((Math.random()*100000)%x);
}

function* cyclicIterator(v){
	let i=0;
	let j=v.length;
	while(true){
		yield {idx:i,value:v[i]};
		j=v.length;
		i=(i+1)%j;
	}
}

function startGame(){
	let selector=document.querySelector("#player-num");
	if(!selector.checkValidity()){
		alert("Please select a valid number from 2 to 4");
		selector.valueAsNumber=2;
		return;
	}
	//with the correct values provided lets setup the internal structures
	let v=selector.valueAsNumber;
	for(let i=0;i<v;i++){
		players.push(new Player(0,0,i+1));
	}
	//initialize the iterators
	playerIterator=cyclicIterator(players);
	currentPlayer=playerIterator.next().value;
	//show the game board
	document.querySelector("#gameboard").hidden=false;
	document.querySelector("#welcome").hidden=true;
	document.getElementById("dice-results").innerText=`Player ${currentPlayer.idx+1}'s turn`;
	document.getElementById("roll-dice").disabled = false;
	renderBoard();
}

function restart() {
    music.pause();
	document.getElementById("win").hidden = true;
	document.querySelector("#gameboard").hidden=true;
	document.querySelector("#welcome").hidden=false;
	players=[]; //clear the player list
	cssColors=cssColorsOriginal; //reset the colors
	currentPlayer=undefined;
	playerIterator=undefined; //clear the ptrs
}

function initializeBoard() {
    music.play();
	let board = [];
	for (let y = 0; y < height; y++) {
		let array = [];
		for (let x = 0; x < width; x++) {
			array.push(new Tile(x, y));
		}
		board.push(array);
	}
	return board;
}

function initializeLadders() {}

function renderBoard() {
    music.play();
	let output = document.getElementById("board");
	output.innerHTML = "";
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let tile = document.createElement("div");
			tile.classList.add("tile");

			players.forEach((player) => {
				if(player.x == x && player.y == y){
					tile.appendChild(player.getDomElement());
				}
			});
			output.append(tile);
		}
	}
}

async function rollDice() {
    diceroll.play();
	let result = randIntv1(6)+1;
	// result = 1;
	document.getElementById("dice-results").innerText = `dice: ${result}`;
	document.getElementById("roll-dice").disabled = true;
	for (let i = 0; i < result; i++) {
		await new Promise(resolve => setTimeout(resolve, 200));
		movePlayer(currentPlayer.value);
		// setTimeout(movePlayer, 200 * i);
		if(checkWin(currentPlayer))return i+1;
	}
	document.getElementById("roll-dice").disabled = false;
	//make it slower
	await new Promise(resolve => setTimeout(resolve, 200));
	// console.log("finished moving player");
	checkLadder(currentPlayer.value);
	checksnakes(currentPlayer.value);
	//next player
	currentPlayer=playerIterator.next().value;
	document.getElementById("dice-results").innerText=`Player ${currentPlayer.idx+1}'s turn`;
	return result;
}

function movePlayer(player) {
	if (player.y % 2 == 0) {
		// at even row
		if (player.x >= width - 1) {
			// reached boundary, wrap
			player.y++;
		} else {
			player.x++;
		}
	} else {
		if (player.x <= 0) {
			// reached boundary at front, wrap
			player.y++;
		} else {
			player.x--;
		}
	}
	renderBoard();
}

function checkLadder(player) {
	// console.log("chekcing ladder");
	ladders.forEach(ladder => {
		if (ladder.startX == player.x && ladder.startY == player.y) {
			climbladder.play();
            player.x = ladder.endX;
			player.y = ladder.endY;
			renderBoard();
		}
	});
}

function checksnakes(player) {
	snakes.forEach(Snake => {
		if (Snake.startX == player.x && Snake.startY == player.y) {
			snakebite.play();
            player.x = Snake.endX;
			player.y = Snake.endY;
			renderBoard();
		}
	});
}

function checkWin(data) {
	let player=data.value;
	let idx=data.idx;
	if (height % 2 == 0) {
		// player wins when they are at x = 0
		if (player.y >= height - 1 && player.x <= 0) {
			console.log("WIN");
			document.getElementById("win").hidden = false;
			document.getElementById("win-text").innerHTML=`Player ${idx+1} wins`;
			return true;
		}
	} else {
		// player wins at x = width - 1
		if (player.y >= height - 1 && player.x >= width - 1) {
			console.log("WIN");
			document.getElementById("win").hidden = false;
			document.getElementById("win-text").innerHTML=`Player ${idx+1} wins`;
			return true;
		}
	}
}

function openDrawer() {
	document.getElementById("drawer").style.width = "35rem";
  }

  function closeDrawer() {
	document.getElementById("drawer").style.width = "0";
  }