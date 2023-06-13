
const g = new Game(document.getElementById("canvas").getContext("2d"),
  (e)=>{
      if(e==gs.play){
        $("footer")[0].classList.remove("hdn");
        $("#starting")[0].classList.add("hdn");
        $("#mz")[0].classList.remove("hdn");
        resizeCanvas()
      }
      if(e==gs.win){
        $("footer")[0].classList.add("hdn");
        $("#end")[0].classList.remove("hdn");
        $("#toptm")[0].innerHTML = "Your Best Time: " + Score.top(g.maze.sz);
      }
    },
  (s,m,ms)=>
      {
          $("#sec")[0].innerText = s;
          $("#min")[0].innerText  = m; 
          $("#ms")[0].innerText  = ms; 
          $("#tm")[0].innerText = `${m}m ${s}s ${ms}ms`; 
      });

lvlSelect = () => {
    $("#lvl")[0].classList.remove("hdn");
  $(".pb-sm")[0].innerText = Score.top(10);
  $(".pb-rg")[0].innerText = Score.top(15);
  $(".pb-lg")[0].innerText = Score.top(20);
  $("#start")[0].classList.add("hdn"); 
  $("#end")[0].classList.add("hdn");
  Snd.start();
}

$(".quit").on("click", ()=>{
   g.quit();
   $("footer")[0].classList.add("hdn");
   lvlSelect();
});

$(".go").on("click", ()=>{
  lvlSelect();
});

$(".snd").on("click", (e)=>{
  Snd.tglMute();
  e.target.classList.toggle('snd-off');
});

$(".lvl").on("click", (e)=>{
  let lvl = e.target.dataset.mz;
  $("#starting")[0].classList.remove("hdn");
  $("#lvl")[0].classList.add("hdn"); 
  var e = $("#starting p")[0];
  Snd.start();
  e.classList.add("cd");
  e.innerText = 3;
  e.on("animationstart", e => {e.target.innerHTML=3;Snd.start()});
  e.on("animationiteration", e => {e.target.innerHTML=3-Math.abs(e.elapsedTime);Snd.start()});
  e.on("animationend", e => {g.start(lvl);Snd.enter(); resizeCanvas()});
});
$("#tw")[0].on("click", ()=>{this.window.location.href="https://twitter.com/intent/tweet?text=I%20have%20just%20escaped%20maze%2013%20in%20" + encodeURIComponent($("#tm")[0].innerText) + "%20at%20" + encodeURIComponent(this.window.location.href) + "&hashtags=js13k,maze13&via=johnkilmister"});
 $("#canvas").on("click", (e)=>{g.aim(e.clientX,e.clientY)});
document.onkeydown = (e) =>{g.keys[e.keyCode]=true;}
document.onkeyup = (e) =>{g.keys[e.keyCode]=null;}

(function () {
  function main(tFrame) {
    g.stopMain = window.requestAnimationFrame(main);
    
    g.update(tFrame);  
    g.render();
  }
  
  main(); 
})();
 

 function resizeCanvas()
 {
    let m = $("main")[0],
    maxW =  m.offsetWidth-30,
    maxH = m.offsetHeight-30;
    g.resize($("canvas")[0],maxW,maxH)
 }