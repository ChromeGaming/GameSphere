// entityBase.js

function containsPoint(rect, point)
{
    return point.x >= rect.x && point.x < rect.x + rect.width 
    && point.y >= rect.y && point.y < rect.y + rect.height;
}

function containsMouse(rect)
{
    return containsPoint(rect, aw.mousePos);
}

class baseEntity
{
    constructor(params)
    {
        if(params === undefined)
        {
            params = {};
        }
        if(params.rect !== undefined)
        {
            this.x = params.rect.x;
            this.y = params.rect.y;
            this.width = params.rect.width;
            this.height = params.rect.height;
            return;
        }

        this.x = params.x !== undefined ? params.x : 0;
        this.y = params.y !== undefined ? params.y : 0;
        this.width = params.width !== undefined ? params.width : 0;
        this.height = params.height !== undefined ? params.height : 0;
    }

    getRect()
    {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }

    containsPoint(point)
    {
        let rect = this.getRect();
        return containsPoint(rect, point);
    }
    containsMouse()
    {
        return this.containsPoint(aw.mousePos);
    }
}

class spriteEntity extends baseEntity
{
    constructor(params)
    {
        super(params);
        this.name = params.name;
        this.angle = params.angle;
        this.alpha = params.alpha;
    }

    render()
    {
        aw.drawSprite(this);
    }
}

class textEntity extends baseEntity
{
    constructor(params)
    {
        super(params);
        this.text = params.text;
        this.angle = params.angle;
        this.fontName = params.fontName;
        this.color = params.color;
        this.fontSize = params.fontSize !== undefined ? params.fontSize : 12;
        this.fontStyle = params.fontStyle !== undefined ? params.fontStyle : "";
        this.fillStyle = params.color !== undefined ? params.color : "#FFF";
        this.textAlign = params.textAlign !== undefined ? params.textAlign.toLowerCase() : "left";
        this.textBaseline = params.textBaseline !== undefined ? params.textBaseline.toLowerCase() : "bottom";
    }

    render()
    {
        aw.drawText(this);
    }
}