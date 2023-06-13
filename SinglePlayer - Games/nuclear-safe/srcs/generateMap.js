/////////////////////////////////////////////////////////////////
////////////////Map Generation Helper Functions//////////////////
/////////////////////////////////////////////////////////////////

//shuffle an array
function shuffle(array) {
    //create array to store shuffled array
    let copy = []
    //array length
    let n = array.length
    let i;

    //loop through old array
    while (n) {
        //select random index
        i = RandomRange(0,array.length,1);
        
        //if index is in array
        if (i in array) {
            //add index to shuffled array
            copy.push(array[i]);
            //delete array[index]
            delete array[i];
            n--;
        }
    }
    //return shuffled array
    return copy;
}

//turns 2d map into 1d
function GetAllCells() {
    //new array for 1d map
    var cells = [];
    //loop through 2d map
    for (var i = 0; i < mapSize; i+=2) {
        for (var j = 0; j < mapSize; j+=2) {
            cells.push(grid[i][j]);
        }
    }
    //return 1d map
    return cells;
}

/////////////////////////////////////////////////////////////////
///////////////////////Generates Map/////////////////////////////
/////////////////////////////////////////////////////////////////

function createMap(){
    //populate grid array with tile objects
    for (var i = 0; i < mapSize; i++) {
        grid[i] = [];
        for (var j = 0; j < mapSize; j++) {
          grid[i][j] = new Cell(i, j);
        }
      }
    
    //shuffle grid array in random order
    let checkOrder = shuffle(GetAllCells());
    //min and max size of "blocks"
    let minSize = 4;
    let maxSize = 10;

    //loop through shuffled array
    for (var id = 1; id < checkOrder.length; id++) {

        //set current tile
        var curTile = checkOrder[id];
      
        //if current tile is undefined
        if (curTile.id == -1) {
            let type = RandomRange(0,1) > 0.9 ? 2 : 0;
            //dirrection of new block
            let direction = (Math.random() > .5 ? 1 : 0);
            //new block width & height
            let square_width = RandomRange(minSize, (direction ? maxSize : minSize));
            let square_height = RandomRange(minSize, (direction ? minSize : maxSize));
                
            //go through grid array
            for (var i = 0; i < square_width; i+=2) {
                for (var j = 0; j < square_height; j+=2) {
                    //if all members of block are real
                    if (IsInBounds(curTile.i + i+1, curTile.j + j+1)) {
                        //set current tile equal to new type
                        grid[curTile.i + i][curTile.j + j].id = id;			    // [x] O
                        grid[curTile.i + i][curTile.j + j].type = type          //	O  O
                        //set right neighbour equal to new type
                        grid[curTile.i + i+1][curTile.j + j].id = id;		 	//	x [O]
                        grid[curTile.i + i+1][curTile.j + j].type = type        //	O  O
                        //set bottom left neighbour equal to new type
                        grid[curTile.i + i][curTile.j + j+1].id = id;			//	x  O
                        grid[curTile.i + i][curTile.j + j+1].type = type        // [O] O
                        //set bottom right neighbour equal to new type
                        grid[curTile.i + i+1][curTile.j + j+1].id = id;         //  x  O 
                        grid[curTile.i + i+1][curTile.j + j+1].type = type;     //	O [O]
                    }
                }
            }
        }
    }

    //go thorugh grid array
    for (var i = 0; i < mapSize; i++) {
        for (var j = 0; j < mapSize; j++) {
            //carve roads
            if (IsInBounds(i + 1, j) && grid[i + 1][j].id != grid[i][j].id) {
                grid[i][j].type = TYPES.ROAD;
              }
            if (IsInBounds(i, j + 1) && grid[i][j + 1].id != grid[i][j].id) {
                grid[i][j].type = TYPES.ROAD;
            }
        }
    }

    //carve(2,0.2)
    carve(3,0.2)
}

function carve(type,frequency){
    let l = findCells(TYPES.PARK).length

    for(let i = 0; i < floor(l*frequency); i++){
        let b = shuffle(findCells(TYPES.PARK))[0]
        grid[b.i][b.j].type = type;
    }
}