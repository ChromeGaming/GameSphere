class Load {
  
  constructor(g) {
    this.g = g;

    this.imgsLoaded = 0;
    this.imgsTotal = Object.keys($.data.i).length;


    this.loadImages();

  }


  loadImages() {
      var g = this.g,
          append = 'data:image/gif;base64,R0lGODlh',
          i = $.data.i, n;

      for (n in i) {
          if (i.hasOwnProperty(n)) {
              g.imgs[n] = new Image();
              g.imgs[n].onload = this.checkLoaded();
              g.imgs[n].src = append + i[n];
          }
      }
  }


  checkLoaded() {

      var g = this.g,
          s = this,
          p;
      this.imgsLoaded += 1;


      if (s.imgsLoaded === s.imgsTotal) {
        window.setTimeout(() => { 
          this.mkFonts() ;
          $.loadCallback(this.g);
        }, 900);
      }

  }

  mkFonts() {
      let g = this.g,
          fonts = {
            b: [0,0,0],
            w: [255,255,255],
            g: [68,137,26],
            lg: [163,206,39],
            r: [190,38,51],
            y: [247,226,107],
            o: [235,137,49],
            p: [224,111,139]
          },
          i = g.imgs,
          n;

      for (n in fonts) {
        g.fonts[n] = $.H.resize(g.imgs.font, 1, fonts[n]);
      }

      for (n in i) {
        i[n + '_w'] = $.H.resize(i[n], 1, [255,255,255]);
      }
    
      window.setTimeout(function() {
        g.init();
      }, 250);

  }


}
