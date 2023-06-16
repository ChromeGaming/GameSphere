const clip=document.querySelectorAll(".clip")
for(let i=0;i<clip.length;i++){
    clip[i].addEventListener('mouseenter',function(e){
        clip[i].play()
    })
    clip[i].addEventListener('mouseout',function(e){
        i=0;
        clip[i].pause()
    })
}

