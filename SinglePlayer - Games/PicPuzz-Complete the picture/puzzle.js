var rows = 3;
var columns = 3;

var currTile;
var otherTile;

var turns = 0; 

//The actual correct order of the pieces
let order=['9', '8', '7', '6', '5', '4', '3', '2', '1'];


window.onload = function() {

    // retrieves which level player has clicked to play and loads it 

    let level=localStorage.getItem('level');
    console.log(level);
    let l=1;
    if(level=="Level 2"){
            l=2;
    }
    if(level=="Level 3"){
        l=3;
    }
    let t=1;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
           
            let tile = document.createElement("img");
            tile.id="bkatile"+t;
            tile.src = "Assets1/blank.jpg";
            t++;
           
            tile.addEventListener("dragstart", dragStart); 
            tile.addEventListener("dragover", dragOver);   
            tile.addEventListener("dragenter", dragEnter); 
            tile.addEventListener("dragleave", dragLeave); 
            tile.addEventListener("drop", dragDrop);       
            tile.addEventListener("dragend", dragEnd);     

            document.getElementById("board").append(tile);
        }
    }
    
    let pieces = [];
    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); 
    }
    
    // to shuffle the pieces
    pieces.reverse();
    for (let i =0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j]; 
        pieces[j] = tmp;
    }
    
    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
       
        tile.src = "Assets"+l+"/" + pieces[i] + ".jpg";

        tile.addEventListener("dragstart", dragStart); 
        tile.addEventListener("dragover", dragOver);  
        tile.addEventListener("dragenter", dragEnter); 
        tile.addEventListener("dragleave", dragLeave); 
        tile.addEventListener("drop", dragDrop);       
        tile.addEventListener("dragend", dragEnd);      

        document.getElementById("pieces").append(tile);     
       
    }
    let butt=document.getElementById("but");
    butt.addEventListener("func",butfunc);
}

function dragStart() {
    currTile = this; 
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; 
    
}

function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    
    turns += 1;
    document.getElementById("turns").innerText = turns;
}

// To close popup after submit
function func_close(check){ 
    if(check==1){ 
        let pp=document.getElementById("popup");
        pp.classList.remove('popup_opened');
    }
    else {let pp=document.getElementById("popup2");
        pp.classList.remove('popup_opened2');}
    
}

// To open popup after submit
function func_open(check){ 
    if(check==1){ let pp=document.getElementById("popup");
    pp.classList.add('popup_opened');
    }
    else { let pp=document.getElementById("popup2");
           pp.classList.add('popup_opened2');
    }
}

function butfunc(){
    
    let get_order=[];
    var i=1;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
             let bt=document.getElementById("bkatile"+i);
            
            let str=(bt.src).toString();
            get_order.push(str.charAt(str.length-5));
             i++;
        }
    }
   //console.log(get_order);
   const fl= arraysAreIdentical(order, get_order);
   
    if(fl){
            func_open(1);
            
    }
    else {
        func_open(2);
    }
    
    //Function to check if all pieces are arranged correctly or not 
    
   function arraysAreIdentical(order, get_order){
    
        for (var i = 0;i < 9; i++){
            if (order[i] !== get_order[i]){
                console.log("not same");
                return false;
            }          
        }
        console.log('same');
        return true; 
    }
    
}
