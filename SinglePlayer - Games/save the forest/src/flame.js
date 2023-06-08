var SF, Flame, H, PI_2, Smoke, Trail, W, SmokyFlame, drawCircle, rand, w, slice = [].slice;

PI_2 = 2 * Math.PI;
rand = function (a, b) {
    return (b - a) * Math.random() + a;
};
drawCircle = function (x, y, r, style) {
    bp();
    ar(x, y, r, 0, PI_2, false);
    ctx.fillStyle = style;
    return fl();
};

Smoke = function () {
    function Smoke(x, y) {
        this.opacity = 0.8;
        this.x = x;
        this.y = y;
        this.r = 2.0;
    }
    Smoke.prototype.step = function (x, y, w) {
        y -= utils.getRandomInt(rand(60,70), rand(200,350))
        // y -= rand(0, 3);
        x += rand(-2, 2);
        this.opacity -= 0.04;
        if (this.opacity <= 0) {
            return this.destroyed = true;
        }
    };
    Smoke.prototype.draw = function (x, y, w) {
        y -= utils.getRandomInt(60, 150)
        x += utils.getRandomInt(rand(-w+w/2, 0), rand(0,w-w/2))
        if (this.opacity <= 0) {
            return;
        }
        return drawCircle(x, y, this.r, 'rgba(60,60,60,' + this.opacity + ')');
    };
    return Smoke;
}();
Trail = function () {
    function Trail(x, y) {
        this.opacity = 1;
        this.x = x;
        this.y = y;
        this.r = 12;
    }
    Trail.prototype.step = function (x, y, w) {
        this.r = w / 5;
        y -= rand(0, 8);
        x -= rand(-3, 3);
        this.opacity -= 0.03;
        if (this.opacity <= 0) {
            this.destroyed = true;
            if (rand(0, 1) < 0.5) {
                return SF.addEntity(Smoke, x, y - this.r);
            }
        }
    };
    Trail.prototype.draw = function (x, y, w) {
        this.r = w / 6;
        y -= rand(rand(-45, 5), rand(25, 75));
        x -= rand(-w/2 - 20, w/2 + 20);
        var color, color2, g, rg;
        if (this.opacity <= 0) {
            return;
        }
        color = 'rgba(255,' + ~~(240 * this.opacity) + ',0,' + this.opacity + ')';
        color2 = 'rgba(255,' + ~~(240 * this.opacity) + ',0,0)';
        rg = this.r * 1.5 + rand(0, 2);
        g = ctx.createRadialGradient(x, y, 0, x, y, rg);
        g.addColorStop(0, color);
        g.addColorStop(1, color2);
        drawCircle(x, y, this.r, g);
        return drawCircle(x, y, this.r * this.opacity, color);
    };
    return Trail;
}();
Flame = function () {
    function Flame() {
        this.x = G.can.width / 2;
        this.y = G.can.height / 2 + 90;
        this.r = 24;
        this.rg = 22;
    }
    Flame.prototype.step = function (x, y, w) {
        return false;
    };
    Flame.prototype.draw = function (x, y, w) {
        this.g = ctx.createRadialGradient(x, y, 0, x, y, w * 1.2);
        this.g.addColorStop(0, 'rgba(255,255,255,1)');
        this.g.addColorStop(1, 'rgba(255,120,0,0)');


        var g, i, j;
        //for (i = j = 1; j <= 1; i = ++j) {
            SF.addEntity(Trail, x, y - this.r / 3);
        //}
        g = ctx.createRadialGradient(x, y, 0, x, y, this.rg);
        g.addColorStop(0, 'rgba(255,180,0,' + rand(0.2, 0.9) + ')');
        g.addColorStop(1, 'rgba(255,180,0,0)');
        drawCircle(x, y, this.rg, g);
        return drawCircle(x + rand(-1.5, 1.5), y + rand(-1.5, 1.5), w, this.g );
    };
    return Flame;
}();

SmokyFlame = function () {
    function SmokyFlame() {
        SF = this;
        this.entities = {};
        this.i = 0;
        this.ii = 0;
        // this.update();
    }
    SmokyFlame.prototype.addEntity = function () {
        var args, klass;
        klass = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        this.entities[this.i] = function (func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
        }(klass, args, function () {
        });
        return this.i += 1;
    };
    SmokyFlame.prototype.update = function (x, y, w) {
        var entity, k, ref;
        // ctx.clearRect(0, 0, W, H);
        ref = this.entities;
        for (k in ref) {
            entity = ref[k];
            if (entity.destroyed === true) {
                delete this.entities[k];
                continue;
            }

            if (this.ii % 5 === 0) {
                entity.step(x + (w / 2), y - 10, w);
                entity.draw(x + (w / 2), y - 10, w);
                this.ii = 0;
            }
            this.ii++;
        }
    };
    return SmokyFlame;
}();