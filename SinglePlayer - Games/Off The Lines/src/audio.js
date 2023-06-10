/*global AudioContext*/

var game = game || {};

(function () {
    
    "use strict";

    game.playSound = function (type) {

        var a = new window.AudioContext(),
            pitches,
            timings,
            oscType;
        
        if (type === "start") {
            pitches = [1, 1, 1, 2, 5];
            timings = [2, 4, 6, 3, 1];
            oscType = "triangle";
        } else if (type === "point") {
            pitches = [5];
            timings = [1];
            oscType = "sine";
        } else if (type === "control") {
            pitches = [10];
            timings = [1];
            oscType = "sine";
        } else if (type === "lose") {
            pitches = [12, 13, 14, 15, 16, 17, 18, 19];
            timings = [1, 2, 3, 4, 5, 6, 7, 8];
            oscType = "triangle";
        } else if (type === "warning") {
            pitches = [24, 24, 24, 24, 24, 24];
            timings = [1, 3, 7, 9, 13, 15];
            oscType = "triangle";
        } else if (type === "out-of-time") {
            pitches = [20, 20, 20, 20];
            timings = [1, 5, 9, 13];
            oscType = "triangle";
        }
        
        pitches.forEach(function (v, i) {
            var o = a.createOscillator(),
                e = timings[i] / 5;
            v && o.start(e, o.connect(a.destination), o.frequency.value = 988 / 1.06 ** v, oscType) + o.stop(e + 0.2);
        });
        
        window.setTimeout(function () {
            a.close();
        }, 4000);
        
    };

}());