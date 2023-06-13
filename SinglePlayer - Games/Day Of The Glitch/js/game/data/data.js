$.data = { title: 'Day Of The Glitch' };


$.loadCallback = function(g) {

        let c = document.createElement('canvas'),
          ctx,
          tile0 = g.draw.scale(g.imgs.tile0, 3),
          x = 0,
          i,
          xc,
          y, s;


        c.width = g.w;
        c.height = g.h;
        ctx = c.getContext('2d');


        ctx.fillStyle = $.cols.nightblue;
        ctx.fillRect(0, 0, g.w, g.h);

        ctx.globalAlpha = 0.1;
        for (y= 0; y < g.h / tile0.height; y += 1) {
          for (i = 0; i < g.w / tile0.width; i += 1) {
            ctx.drawImage(tile0, i * tile0.width, x);
          }
          x += tile0.height;
        }
        ctx.globalAlpha = 1;

        i = new Image();
        i.src = c.toDataURL('image/gif');
        g.imgs.floor = i;

};
