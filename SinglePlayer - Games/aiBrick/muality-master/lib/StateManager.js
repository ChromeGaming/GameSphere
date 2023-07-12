function StateManager(){
  this.states = {};
  this.activeState;

    var that = this;
    this.transitions = {
        'slide-left':{
            pre: function(ctx){
                var x = smoothstep(0,-16*GU, 1-that.transitionTime/that.maxTransitionTime);
                ctx.translate(x|0,0);
            },
            post: function(ctx){
                var x = smoothstep(16*GU,0, 1-that.transitionTime/that.maxTransitionTime);
                ctx.translate(x|0,0);
            }
        },
        'slide-right':{
            pre: function(ctx){
                var x = smoothstep(0,16*GU, 1-that.transitionTime/that.maxTransitionTime);
                ctx.translate(x|0,0);
            },
            post: function(ctx){
                var x = smoothstep(-16*GU,0, 1-that.transitionTime/that.maxTransitionTime);
                ctx.translate(x|0,0);
            }
        }
    }
}

StateManager.prototype.addState = function(name, state){
  state.init();
  this.states[name] = state;
}

StateManager.prototype.changeState = function(name, message, transitionEffect, transitionTime){
    this.transitionTime = transitionTime || 0;
    this.maxTransitionTime = this.transitionTime;
    this.transitionEffect = transitionEffect || "slide-right";
    this.oldState = this.activeState;
    this.activeState = this.states[name];
    if(this.transitionTime == 0){
        this.transitionTime--;
        this.oldState && this.oldState.pause();
    }
    this.activeState.resume(message);
}

StateManager.prototype.render = function(ctx){
    if(this.transitionTime > 0){
        ctx.save();
        this.transitions[this.transitionEffect].pre(ctx);
        this.oldState.render(ctx);
        ctx.restore();
        ctx.save();
        this.transitions[this.transitionEffect].post(ctx);
        this.activeState.render(ctx);
        ctx.restore();
    }else{
        this.activeState.render(ctx);
    }
}

StateManager.prototype.update = function(){
    if(this.transitionTime == 0){
        if(this.oldState) this.oldState.pause();
    }
    if (this.transitionTime >= 0) {
        this.transitionTime--;
    }

    if(this.oldState && this.transitionTime > 0){
        this.oldState.update();
    }
  this.activeState.update();
}
