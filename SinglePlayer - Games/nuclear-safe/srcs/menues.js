//gonna be used for storing different menues that we can call i.e menu.main()

//will need a button class

//will need better utilities for drawing text

/////////////////////////////////////////////////////////////////
//////////////////////Tile Class For Grid////////////////////////
/////////////////////////////////////////////////////////////////

//"c #fff 1 1, w 3, p m 0 12 l 10 12 l 25 0 l 25 40 l 10 28 l 0 28 1, a 23 20 10 -50 50 0 1, a 23 20 20 -60 60 0 1,"
//unmuted
//"c silver 1 1, w 3, p m 0 12 l 10 12 l 25 0 l 25 40 l 10 28 l 0 28 1, a 23 20 10 -50 50 0 1, a 23 20 20 -60 60 0 1, c red 0 1, p m 0 0 l 45 40 0 1,"
//muted


class Menu {
    constructor(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state;
        this.stars = [];
        this.hero;
    }

    pause(){
        game = 0;
        this.state = "pause"
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        console.log("test")
    }

    main(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state = "main"
        game = 0;

        this.generateStars(canvas.width/10)

        this.text.push(new text("Play",canvas.width/25,"#fff",0.5,0.5,1,2))
        this.text.push(new text("Controls",canvas.width/25,"#fff",0.5,0.6,1,3))
        this.text.push(new text("Credits",canvas.width/25,"#fff",0.5,0.7,1,4))

        this.text.push(new text("Keep", canvas.width/20, "#fff", 0.3, 0.08, 1))
        this.text.push(new text("YOur", canvas.width/15, "#fff", 0.5, 0.16, 1))
        this.text.push(new text("space", canvas.width/10, "#fff", 0.6, 0.26, 1))


        cellSize = canvas.width/4
        this.hero = new Hero(0,0,[],1)
        this.hero.pos = {
            x:RandomRange(0,canvas.width,1),
            y:RandomRange(0,canvas.height,1)
        }
        this.hero.velX = RandomRange(-5,5,1);
        this.hero.velY = RandomRange(-5,5,1);
    }

    options(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state = "options"
        game = 0;

        this.generateStars(canvas.width/5)

        
        this.text.push(new text("Difficulty", canvas.width/15, "#fff", 0.5, 0.15, 1))

        this.text.push(new text("Easy",canvas.width/25,"#fff",0.5,0.4,1,5))
        this.text.push(new text("NOrmal",canvas.width/25,"#fff",0.5,0.5,1,6))
        this.text.push(new text("Hard",canvas.width/25,"#fff",0.5,0.6,1,7))

        this.text.push(new text("Back",canvas.width/25,"#fff",0.5,0.8,1,8))
    }

    win(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state = "win"
        game = 0;

        this.generateStars(canvas.width/5)

        
        this.text.push(new text("You Win!", canvas.width/15, "#fff", 0.5, 0.3, 1))

        this.text.push(new text("Click to continue",canvas.width/25,"#fff",0.5,0.8,1,8))

        zzfxP(winFX)
    }

    lose(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state = "lose"
        game = 0;

        this.generateStars(canvas.width/5)

        
        this.text.push(new text("You Lose", canvas.width/15, "#fff", 0.5, 0.3, 1))

        this.text.push(new text("Click to continue",canvas.width/25,"#fff",0.5,0.8,1,8))

        if(floor(time/maxTime) == 1){
            this.text.push(new text("you died of radiation poisoning",canvas.width/50,"#fff",0.5,0.5,1))
        }else{
            this.text.push(new text("you were killed by scared citizens",canvas.width/50,"#fff",0.5,0.5,1))
        }

        zzfxP(lostFX)
    }

    controls(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state = "controls"
        game = 0;

        this.generateStars(canvas.width/5)

        this.text.push(new text("Move with", canvas.width/30,"#fff",0.5,0.1,1))

        this.text.push(new text("w", canvas.width/40,"#fff",0.42,0.3,1))//195
        this.text.push(new text("a", canvas.width/40,"#fff",0.36,0.37,1))
        this.text.push(new text("s", canvas.width/40,"#fff",0.42,0.37,1))
        this.text.push(new text("d", canvas.width/40,"#fff",0.48,0.37,1))

        this.text.push(new text("z", canvas.width/40,"#fff",0.655,0.3,1))//195
        this.text.push(new text("q", canvas.width/40,"#fff",0.595,0.37,1))//235
        this.text.push(new text("s", canvas.width/40,"#fff",0.655,0.37,1))
        this.text.push(new text("d", canvas.width/40,"#fff",0.715,0.37,1))
        this.text.push(new text("Find the red buidling", canvas.width/30,"#fff",0.5,0.5,1))
        this.text.push(new text("         red         ", canvas.width/30,"red",0.5,0.5,1))

        this.text.push(new text("Keep Your Space!", canvas.width/20,"#fff",0.5,0.6,1))
        

        this.text.push(new text("Back",canvas.width/25,"#fff",0.5,0.8,1,8))
    }

    credits(){
        this.buttons = [];
        this.text = [];
        this.graphics = [];
        this.state = "credits"
        game = 0;

        this.generateStars(canvas.width/5)

        this.text.push(new text("Credits", canvas.width/20,"#fff",0.5,0.11,1))

        this.text.push(new text("Coding", canvas.width/30,"#ff01cc",0.3,0.225,1))
        this.text.push(new text("Nathan Yang", canvas.width/50,"#fff",0.3,0.3,1))
        this.text.push(new text("Addison Craik", canvas.width/50,"#fff",0.3,0.375,1))

        this.text.push(new text("Artwork", canvas.width/30,"#39ff14",0.7,0.225,1))
        this.text.push(new text("Nathan Yang", canvas.width/50,"#fff",0.7,0.3,1))
        this.text.push(new text("Addison Craik", canvas.width/50,"#fff",0.7,0.375,1))

        this.text.push(new text("Playtesting", canvas.width/30,"#00c0f9",0.3,0.475,1))
        this.text.push(new text("Nathan Yang", canvas.width/50,"#fff",0.3,0.55,1))
        this.text.push(new text("Addison Craik", canvas.width/50,"#fff",0.3,0.625,1))
        this.text.push(new text("Aidan Webb", canvas.width/50,"#fff",0.3,0.7,1))

        this.text.push(new text("Music", canvas.width/30,"#ffff00",0.7,0.475,1))
        this.text.push(new text("Aidan Webb", canvas.width/50,"#fff",0.7,0.55,1))

        this.text.push(new text("Back",canvas.width/25,"#fff",0.5,0.8,1,8))
    }

    generateStars(amount){
        this.stars = []
        for(let i =0; i < amount; i++){
            this.stars.push({x:RandomRange(0,canvas.width,1),y:RandomRange(0,canvas.height,1),r:RandomRange(1,3,1)})
        }
    }

    update(){
        for(let i = 0; i < this.buttons.length; i++){
            this.buttons[i].update()
        }
    }

    draw(){
        if(this.state == "main"){

            this.hero.pos.x += this.hero.velX;
            this.hero.pos.y += this.hero.velY;

            if(this.hero.pos.x > canvas.width+200){
                this.hero.pos.x = -200
                this.hero.pos.y = RandomRange(0,canvas.height,1)
                this.hero.velY = RandomRange(-5,5,1)
            }
            if(this.hero.pos.x < -200){
                this.hero.pos.x = canvas.width+100
                this.hero.pos.y = RandomRange(0,canvas.height,1)
                this.hero.velY = RandomRange(-5,5,1)
            }
            if(this.hero.pos.y > canvas.height+200){
                this.hero.pos.y = -200
                this.hero.pos.x = RandomRange(0,canvas.width,1)
                this.hero.velX = RandomRange(-5,5,1)
            }
            if(this.hero.pos.y < -200){
                this.hero.pos.y = canvas.height+200
                this.hero.pos.x = RandomRange(0,canvas.width,1)
                this.hero.velX = RandomRange(-5,5,1)
            }

            this.hero.draw()
        }

        if(this.state == "controls"){
            svg("c white 1 1, w 3, p m 20 25 l 20 50 l 50 25 l 20 0 l 20 25 1,",[canvas.width*0.201,canvas.height*0.35,0.7,0.7])
            svg("c white 1 1, w 3, p m 20 25 l 20 50 l 50 25 l 20 0 l 20 25 1,",[canvas.width*0.161,canvas.height*0.35,-0.7,0.7])
            svg("c white 1 1, w 3, q 90, p m 20 25 l 20 50 l 50 25 l 20 0 l 20 25 1,",[canvas.width*0.2,canvas.height*0.35,0.7,0.7])
            svg("c white 1 1, w 3, q 90, p m 20 25 l 20 50 l 50 25 l 20 0 l 20 25 1,",[canvas.width*0.2,canvas.height*0.35,0.7,-0.7])
            svg("w 0.5,c #252323 1 1, a 10 25 10 0 360 1, r 0 15 20 10 1, p m 0 15 l 2 5 l 8 3 l 8 15 1, p m 20 15 l 18 5 l 12 3 l 12 15 1, r 8 7 4 10 1, c #39ff14 1 1 1, s 4, r 8.5 7 3 6 0 1, p m 0 15 l 8.5 13 0 1, p m 20 15 l 11.5 13 0 1, p m 10 17.5 l 5 25 l 15 25 0 1, a 10 22.25 1 0 360 0 1,", [canvas.width*0.8,canvas.height*0.25,5,5])
        }

        for(let i=0; i < this.text.length; i++){
            this.text[i].draw()
        }
    }

}

class text {
    constructor(str,fs,c,x,y,center=1,b=0){
        this.color = c;
        this.text = str;
        this.scale = fs/50;
        this.x = canvas.width*x;
        this.y = canvas.height*y;
        this.b = b

        if(center){
            this.x -= (str.length*(this.scale*60))/2
        }
        if(this.b){
            menu.buttons.push(new button(this.x-5,this.y-5,str.length*(this.scale*60)+10,fs+10,this.b))
        }
    }
    draw(){
        ctx.fillStyle = ctx.strokeStyle = this.color
        for(let i =0; i < this.text.length; i++){
            let char = this.text.charAt(i).toLowerCase()
            svg(font[char],[this.x+i*60*this.scale,this.y,this.scale,this.scale])
        }
    }
}

class graphic {

}

class button {
    constructor(x, y, w, h, e){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.e = e;
    }

    update(){
        if(click){
            if(click.x > this.x && click.x < this.x+this.w && click.y > this.y && click.y < this.y+this.h){
                if(this.e == 1 && !pause)map = !map;

                if(this.e == 2)menu.options();

                if(this.e == 3)menu.controls()

                if(this.e == 4)menu.credits()

                if(this.e == 5)startGame(1)
                if(this.e == 6)startGame(2)
                if(this.e == 7)startGame(3)

                if(this.e == 8)menu.main()

                if(this.e == 9){
                    mute = !mute;
                    if(mute){
                        song.stop();
                        songCount = 0;
                        clearTimeout(songDelay)
                    }else{
                        playSong(floor(time/maxTime*d.length))
                    }
                }

                click = 0;
                zzfxP(clickFX);
            }
        }
    }
}
