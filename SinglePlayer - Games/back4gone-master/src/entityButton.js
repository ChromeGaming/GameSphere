// entityButtpn.js

function roundedRect(x, y, w, h, r, edge, flatTop, flatBottom) {
    aw.ctx.beginPath();

    let topR = flatTop ? 0 : r;
    let bottomR = flatBottom ? 0 : r;

    aw.ctx.moveTo(x + topR, y);
    aw.ctx.arcTo(x + w, y, x + w, y + topR, topR);
    aw.ctx.arcTo(x + w, y + h, x + w - bottomR, y + h, bottomR);
    aw.ctx.arcTo(x, y + h, x, y + h - bottomR, bottomR);
    aw.ctx.arcTo(x, y, x + topR, y, topR);
    aw.ctx.closePath();

    if(edge)
    {
        aw.ctx.stroke();
    }
    else
    {
        aw.ctx.fill();
    }
}

let defaultButtonNormalBG = '#094D92';
let defaultButtonPressedBG = '#B33951';
let defaultButtonHoverBG = '#19647E';
let defaultButtonDisabledBG = '#7D8786';

let signalNameCount = 0;
function newSignalName()
{
    signalNameCount++;
    return `aw_signal_${signalNameCount}`;
}

class buttonEntity extends baseEntity
{
    constructor(params)
    {
        super(params);
        let fontSize = (this.height !== undefined) ? this.height * 0.5 : 24;
        if(params.fontSize !== undefined)
        {
            fontSize = params.fontSize;
        }

        this.normalState = (params.normalState !== undefined) ? params.normalState : {
            x:0, y:0,
            fillStyle: defaultButtonNormalBG,
            textInfo: {
                color:'#F1F7ED', fontSize:fontSize, fontName:'Montserrat', textBaseline:'middle', 
                textAlign:'center'
            },
        };
        this.pressedState = (params.pressedState !== undefined) ? params.pressedState : {
            x:0, y:0,
            fillStyle: defaultButtonPressedBG,
            textInfo: {
                color:'#F1F7ED', fontSize:fontSize, fontName:'Montserrat', textBaseline:'middle', 
                textAlign:'center'
            },
        }
        this.hoverState = (params.hoverState !== undefined) ? params.hoverState : {
            x:0, y:0,
            fillStyle: defaultButtonHoverBG,
            textInfo: {
                color:'#F1F7ED', fontSize:fontSize, fontName:'Montserrat', textBaseline:'middle', 
                textAlign:'center'
            },
        }

        this.cornerSize = params.cornerSize !== undefined ? params.cornerSize : this.height / 8;
        this.currentState = this.normalState;
        this.text = params.text !== undefined ? params.text : '';
        this.signalEventName = params.signalEventName;
        this.listener = params.listener !== undefined ? params.listener : window;
        this.enabled = params.enabled !== undefined ? params.enabled : true;
        if(params.signalEventName !== undefined)
        {
            this.signalEventName = params.signalEventName;
        }
        else
        {
            this.signalEventName = newSignalName();
        }
    }

    get text() {
        return this.normalState.textInfo.text;
    }
    set text(text) {
        this.normalState.textInfo.text = text;
        this.pressedState.textInfo.text = text;
        this.hoverState.textInfo.text = text;        
    }

    getRect()
    {
        return {x: this.x - this.width/2, y: this.y - this.height/2, 
            width: this.width, height: this.height};
    }

    doClick()
    {
        if(this.listener != null)
        {
            this.listener.dispatchEvent(new CustomEvent(this.signalEventName, {button: this}));
        }
        this.currentState = this.normalState;
    }

    update(deltaTime)
    {
        if(!this.enabled)
        {
            return;
        }
        let containsMouse = this.containsMouse();
        
        if(this.currentState == this.pressedState)
        {
            if(!containsMouse)
            {
                this.currentState = this.normalState;
            }
            else if(!aw.mouseButtons[0])
            {
                this.doClick();
            }
        }
        else if(this.currentState == this.hoverState)
        {
            if(!containsMouse)
            {
                this.currentState = this.normalState;
            }
            else if(aw.mouseButtonsJustPressed[0])
            {
                this.currentState = this.pressedState;
                this.capture = true;
            }    
        }
        else 
        {
            if(containsMouse)
            {
                this.currentState = aw.mouseButtonsJustPressed[0] ? this.pressedState : this.hoverState;
            }
        }
    }

    render()
    {
        aw.ctx.save();
        aw.ctx.translate(this.x, this.y);
        aw.ctx.fillStyle = this.currentState.fillStyle;
        if(!this.enabled)
        {
            aw.ctx.fillStyle = defaultButtonDisabledBG;
        }
        //aw.ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        roundedRect(-this.width/2, -this.height/2, this.width, this.height, this.cornerSize, false);
        if(this.currentState.textInfo)
        {
            aw.drawText(this.currentState.textInfo);
        }
        aw.ctx.restore();
    }
}

class checkBoxEntity extends buttonEntity
{
    constructor(params)
    {
        super(params);
        this.checked = params.checked !== undefined ? params.checked : false;
    }

    doClick()
    {
        this.checked = !this.checked;
        super.doClick();
    }

    render()
    {
        aw.ctx.save();
        aw.ctx.translate(this.x, this.y);
        let drawState = this.checked ? this.pressedState : this.currentState;
        aw.ctx.fillStyle = drawState.fillStyle;
        if(!this.enabled)
        {
            aw.ctx.fillStyle = '#7D8786';
        }
        roundedRect(-this.width/2, -this.height/2, this.width, this.height, this.cornerSize, false);
        if(drawState.textInfo)
        {
            aw.drawText(drawState.textInfo);
        }
        aw.ctx.restore();
    }

}

function createButtonWithSignal(buttonInfo, fn, params)
{
    buttonInfo.signalEventName = newSignalName();
    let button = new buttonEntity(buttonInfo);
    window.addEventListener(buttonInfo.signalEventName, function() {
        fn(params);
    });
    return button;
}