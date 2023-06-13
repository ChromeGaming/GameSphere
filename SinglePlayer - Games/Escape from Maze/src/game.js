  class Game
  {
    //cotext,stateChange,timer
    constructor(c,sn,tm) {
      this.ctx = c;
      this.key=[];
      this.stateChange = sn;
      this.state = gs.start;
      this.updateTimer = tm;
    }

    get keys() {
      return this.key;
    }

  
    set state(s)
    {
      this._gState = s;

      if(s==gs.play){
        this.sTime = Date.now();
        this.eTime = null;
      }
      if(s==gs.win)
      {
        this.eTime = Date.now();
        Snd.end();
        Score.set(this.maze.sz, this.eTime-this.sTime)
      }
       if(s==gs.start)
       {
          this.eTime = Date.now();
       }

      this.stateChange(s);
    }

    get state(){
      return this._gState;
    }
 
    quit(){
      this.state = gs.start;
    }

    start(mzSize)
    {
      this.maze = new Maze();
      this.maze.build(mzSize);
      this.player = new Player();
 
      this.glitches = [];
      for(let i = 0;i<mzSize;i++){
        this.glitches.push(new Glitch(mzSize));
      }
      
       this.offSetY = 0;
      this.offSetX = 0;
      this.state = gs.play;   
      
    }

    resize(c,maxW,maxH)
    {
      if(this.maze){
        let sz = this.maze.sz;
        c.width = Math.min(maxW,30+sz*40);
        c.height = Math.min(maxH,30+sz*40);
      }
    }

    aim(x,y){
      this.player.aim(this.ctx.canvas,x,y,this.offSetX,this.offSetY);
    }
    
    update()
    {
      if(this.state!=gs.play) return;
    
      if(this.glitches.filter((g)=>g.isHit && !g.isDead).length == 0){
          this.player.update(this.maze.maze,this.key);
          if(this.player.hasWon(this.maze.maze)) this.state = gs.win;
      }
 
      this.glitches.forEach((g)=>{
        g.update(this.player);
        if(g.isDead) this.maze.build(this.maze.sz);
      });

      this.glitches = this.glitches.filter((g)=>{return !g.isDead}); 

      //update timer 
      let t = (this.eTime ? this.eTime : Date.now()) -  this.sTime;
      let s =  Math.floor((t/1000) % 60);
      let m = Math.floor((t/1000/60) % 60 );
      let ms =  ('0'+Math.floor(t%60)).slice(-2);
      this.updateTimer(s,m,ms);
 
      //Set viewport
      let mSize = this.maze.sz * 40;
      let cWidth = this.ctx.canvas.width;
      let cHeight = this.ctx.canvas.height;

      if(cWidth < mSize)
      {
         this.offSetX = this.player.x > 80 ? Math.min(this.player.x - 80,(mSize-cWidth)+10) : 0;
      }

      if(cHeight < mSize)
      {
        this.offSetY = this.player.y > 80 ? Math.min(this.player.y - 80,(mSize-cHeight)+10) : 0;
      }

}


  
    render(){
 
      //render all game elements
      let c = this.ctx;
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);

      c.translate(-this.offSetX,  -this.offSetY); 

      if(this.state!=gs.play) return;

      this.maze.render(c);
      this.player.render(c);

      this.glitches.forEach((g)=>{
        g.render(c);
      }, this);

       c.translate(this.offSetX,  this.offSetY); 
    }
  }