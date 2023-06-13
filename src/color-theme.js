let settingel=document.querySelector(".setting");

// settingel.addEventListener("click", ()=>{
    
//     let theamdiv=document.querySelector(".theam-div")
//    theamdiv.classList.toggle("open");
// })
function translatex(){
    let theamdiv=document.querySelector(".theam-div")
   theamdiv.classList.toggle("open")
}
// translatex()


let r = document.querySelector(':root');




function changeColor(){
        if((localStorage.getItem("mode"))=="red"){

                r.style.setProperty('--main-color', '#E90064');
        }
        else if((localStorage.getItem("mode"))=="purple"){

                r.style.setProperty('--main-color', '#B799FF');

        }
        else if((localStorage.getItem("mode"))=="green"){

                
                r.style.setProperty('--main-color', '#127C56');

        }
        else if((localStorage.getItem("mode"))=="pink"){

                

                r.style.setProperty('--main-color', '#FF55BB');
        }
        else if(localStorage.getItem("mode")=="blue"){

                
                
                r.style.setProperty('--main-color', 'rgb(0 159 157 ))');
        }

}

function redtoggle(){
localStorage.setItem("mode","red")
r.style.setProperty('--main-color', '#E90064');

}
function purpletoggle(){
        localStorage.setItem("mode","purple")
        r.style.setProperty('--main-color', '#B799FF');

}
function greentoggle(){
        localStorage.setItem("mode","green")
        r.style.setProperty('--main-color', '#127C56');


}
function pinktoggle(){
        localStorage.setItem("mode","pink")
        r.style.setProperty('--main-color', '#FF55BB');

}
function bluetoggle(){
        localStorage.setItem("mode","blue")
        r.style.setProperty('--main-color', 'rgb(0 159 157 )');

}

changeColor()

// auto text type animation



