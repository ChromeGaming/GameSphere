/*var BG;
function Background() {
	BG = this;
	BG.animate();
}

Background.prototype = {
	burnBurnBurn: function() {
		var x, y, bottomLine = BG.canvasWidth * (BG.canvasHeight - 1);

		// draw random pixels at the bottom line
		for (x = 0; x < BG.canvasWidth; x++) {
			var value = 0;

			if (Math.random() > BG.threshold)
				value = 255;

			BG.fire[bottomLine + x] = value;
		}

		// move flip upwards, start at bottom
		var value = 0;

		for (y = 0; y < BG.canvasHeight; ++y) {
			for (var x = 0; x < BG.canvasWidth; ++x) {
				if (x == 0) {
					value = BG.fire[bottomLine];
					value += BG.fire[bottomLine];
					value += BG.fire[bottomLine - BG.canvasWidth];
					value /= 3;
				} else if (x == BG.canvasWidth -1) {
					value = BG.fire[bottomLine + x];
					value += BG.fire[bottomLine - BG.canvasWidth + x];
					value += BG.fire[bottomLine + x - 1];
					value /= 3;
				} else {
					value = BG.fire[bottomLine + x];
					value += BG.fire[bottomLine + x + 1];
					value += BG.fire[bottomLine + x - 1];
					value += BG.fire[bottomLine - BG.canvasWidth + x];
					value /= 4;
				}

				if (value > 1)
					value -= 1;

				value = Math.floor(value);
				var index = bottomLine - BG.canvasWidth + x;
				BG.fire[index] = value;
			}

			bottomLine -= BG.canvasWidth;
		}

		var skipRows = 1; // skip the bottom 2 rows

		// render the flames using our color table
		for (var y = skipRows; y < BG.canvasHeight; ++y) {
			for (var x = 0; x < BG.canvasWidth; ++x) {
				var index = y * BG.canvasWidth * 4 + x * 4;
				var value = BG.fire[(y - skipRows) * BG.canvasWidth + x];

				BG.data[index] = BG.colors[value][0];
				BG.data[++index] = BG.colors[value][1];
				BG.data[++index] = BG.colors[value][2];
				BG.data[++index] = 255;
			}
		}

		// sometimes change BG.fire intensity
		if (BG.intensity == null) {
			if (Math.random() > 0.95) {
				BG.randomizeThreshold();
			}
		}

		BG.ctx.putImageData(BG.imageData, 0, BG.CC.height - BG.canvasHeight);

	},
	randomizeThreshold: function() {
		BG.threshold += Math.random() * 0.2 - 0.1;
		BG.threshold = Math.min(Math.max(BG.threshold, 0.5), 0.8);
	},
	animate: function () {
		BG.intensity = null;
		BG.threshold = 0.5;
		BG.CC = document.querySelector('canvas');
		BG.ctx = BG.CC.getContext('2d');
		BG.canvasWidth = BG.CC.width;
		BG.canvasHeight = 50 || P.fireOffset;
		BG.imageData = BG.ctx.getImageData(0, BG.CC.height - BG.canvasHeight, BG.canvasWidth, BG.canvasHeight);
		BG.data = BG.imageData.data;
		//BG.numPixels = BG.data.length / 4;
		BG.colors = [];

		for (var i = 0; i < 256; i++) {
			var color = [];
			color[0] = color[1] = color[2] = 75;
			BG.colors[i] = color;
		}

		for (var i = 0; i < 32; ++i) {
			BG.colors[i][2] = i << 1;
			BG.colors[i + 32][0] = i << 3;
			BG.colors[i + 32][2] = 64 - (i << 1);
			BG.colors[i + 64][0] = 255;
			BG.colors[i + 64][1] = i << 3;
			BG.colors[i + 96][0] = 255;
			BG.colors[i + 96][1] = 255;
			BG.colors[i + 96][2] = i << 2;
			BG.colors[i + 128][0] = 255;
			BG.colors[i + 128][1] = 255;
			BG.colors[i + 128][2] = 64 + (i << 2);
			BG.colors[i + 160][0] = 255;
			BG.colors[i + 160][1] = 255;
			BG.colors[i + 160][2] = 128 + (i << 2);
			BG.colors[i + 192][0] = 255;
			BG.colors[i + 192][1] = 255;
			BG.colors[i + 192][2] = 192 + i;
			BG.colors[i + 224][0] = 255;
			BG.colors[i + 224][1] = 255;
			BG.colors[i + 224][2] = 224 + i;
		}

		BG.fire = [];
		// init BG.fire array
		for (var i = 0; i < BG.canvasWidth * BG.canvasHeight; i++) {
			BG.fire[i] = 75;
		}

		BG.burnBurnBurn();

		// intercept key up event to change intensity on BG.fire effect
		document.body.onkeyup = function(event) {
			if (event.keyCode >= 97 && event.keyCode <= 105) {
				BG.intensity = (event.keyCode - 97);
				BG.intensity = BG.intensity / 8;
				BG.intensity = BG.intensity * 0.4;
				BG.intensity = BG.intensity + 0.2;
				BG.threshold = 1 - BG.intensity;
			} else if (event.keyCode == 96) { // 0 ==> randomize
				BG.intensity = 0;
				BG.randomizeThreshold();
			}
 		};

	}
};*/

var flameBack = new function() {
    var context;
    var buffer;
    var bufferContext;
    var imageData;
    var palette;
    var colorMap;
    var width;
    var height;
    var scale = 2;
    var fan = 2.5;
    var slack = 5;
    this.time = new Date();

    this.canvas = undefined;

    this.init = function() {
        context = this.canvas.getContext('2d');

        width = (this.canvas.width + 30) / scale;
        height = P.fireOffset / scale;

        width = Math.ceil(width);
        height = Math.ceil(height);

        colorMap = Array(width * height);

        for(var i = 0; i < colorMap.length; i++)
            colorMap[i] = 255;

        initPalette();
        initBuffer();

        this.update();
    };

    // init palette from warm to white hot colors
    var initPalette = function() {
        palette = Array(256);

        for(var i = 0; i < 64; i++) {
            palette[i] = [(i << 2), 0, 0];
            palette[i + 64] = [255, (i << 2), 0];
            palette[i + 128] = [255, 255, (i << 2)];
            palette[i + 192] = [255, 255, 255];
        }
    };

    // offscreen buffer for rendering and scaling
    var initBuffer = function() {
        buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer.style.visibility = 'hidden';

        bufferContext = buffer.getContext('2d');
        imageData = bufferContext.createImageData(width, height);
    };

    // main render loop
   this.update = function() {
   		if (!G.isMobile()) {
	        smooth();
	        draw();
	        fan = utils.getRandomInt(0, 6);
	    } else {
	    	var grd = ctx.createLinearGradient(0, CC.h - P.fireOffset , 0, G.can.height);
	    	grd.addColorStop(0, 'rgba(255, 0, 0, ' + utils.getRandomInt(8, 10)/10 + ')');
	    	grd.addColorStop(0.7, 'rgba(255, 165, 0, ' + utils.getRandomInt(8, 10)/10 + ')');
	    	grd.addColorStop(0.9, 'rgba(255, 255, 0, ' + utils.getRandomInt(8, 10)/10 + ')');
	    	sv();
	    	fs(grd);
	    	fr(0, CC.h - P.fireOffset, G.can.width, P.fireOffset)
	    	rs();
	    }
    };

    var smooth = function() {
        for(var x = width - 1; x >= 1; x--) {
            for(var y = height; y--;) {
                var p = ((
                    colorMap[toIndex(x - 1, y - 1)] +
                    colorMap[toIndex(x, y - 1)] +
                    colorMap[toIndex(x + 1, y - 1)] +
                    colorMap[toIndex(x - 1, y)] +
                    colorMap[toIndex(x + 1, y)] +
                    colorMap[toIndex(x - 1, y + 1)] +
                    colorMap[toIndex(x, y + 1)] +
                    colorMap[toIndex(x + 1, y + 1)]) >> 3);

                p = Math.max(0, p - randomValue(fan));

                colorMap[toIndex(x, y - 1)] = p;

                if (y < height - slack) { // don't draw random noise in bottom rows
                    if (y < height - 2) {
                        // set two lines of random palette noise at bottom of
                        // colorMap
                        colorMap[toIndex(x, height)] =
                            randomValue(palette.length);
                        colorMap[toIndex(x, height - 1)] =
                            randomValue(palette.length);
                    }

                    drawPixel(x, y, palette[colorMap[toIndex(x, y)]]);
                }
            }
        }
    };

    // draw colormap->palette values to screen
    var draw = function() {
        // render the image data to the offscreen buffer...
        bufferContext.putImageData(imageData, 0, 0);
        // ...then draw it to scale to the onscreen canvas
        context.drawImage(buffer, -20, CC.h - (height * scale), width * scale, height * scale + 10);
    };

    // set pixels in imageData
    var drawPixel = function(x, y, color) {
        var offset = (x + y * imageData.width) * 4;
        imageData.data[offset] = color[0];
        imageData.data[offset + 1] = color[1];
        imageData.data[offset + 2] = color[2];
        imageData.data[offset + 3] = 255;
    };

    var randomValue = function(max) {
        // protip: a double bitwise not (~~) is much faster than
        // Math.floor() for truncating floating point values into "ints"
        return ~~(Math.random() * max);
    };

    // because "two-dimensional" arrays in JavaScript suck
    var toIndex = function(x, y) {
        return (y * width + x);
    };

    // draw a bunch of random embers onscreen
    this.drawEmbers = function() {
        for(var x = 1; x < width - 1; x++) {
            for(var y = 1; y < height; y++) {
                if(Math.random() < 0.11)
                    colorMap[toIndex(x, y)] = randomValue(palette.length);
            }
        }
    };
};
