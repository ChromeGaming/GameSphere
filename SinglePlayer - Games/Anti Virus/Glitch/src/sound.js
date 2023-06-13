var aa = {};

window.mobileAndTabletcheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
if (mobileAndTabletcheck() == false) {
    /**
     * SfxrParams
     *
     * Copyright 2010 Thomas Vian
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @author Thomas Vian
     */
    /** @constructor */
    function SfxrParams() {
        //--------------------------------------------------------------------------
        //
        //  Settings String Methods
        //
        //--------------------------------------------------------------------------

        /**
         * Parses a settings array into the parameters
         * @param array Array of the settings values, where elements 0 - 23 are
         *                a: waveType
         *                b: attackTime
         *                c: sustainTime
         *                d: sustainPunch
         *                e: decayTime
         *                f: startFrequency
         *                g: minFrequency
         *                h: slide
         *                i: deltaSlide
         *                j: vibratoDepth
         *                k: vibratoSpeed
         *                l: changeAmount
         *                m: changeSpeed
         *                n: squareDuty
         *                o: dutySweep
         *                p: repeatSpeed
         *                q: phaserOffset
         *                r: phaserSweep
         *                s: lpFilterCutoff
         *                t: lpFilterCutoffSweep
         *                u: lpFilterResonance
         *                v: hpFilterCutoff
         *                w: hpFilterCutoffSweep
         *                x: masterVolume
         * @return If the string successfully parsed
         */
        this.setSettings = function (values) {
            for (var i = 0; i < 24; i++) {
                this[String.fromCharCode(97 + i)] = values[i] || 0;
            }

            // I moved this here from the reset(true) function
            if (this['c'] < .01) {
                this['c'] = .01;
            }

            var totalTime = this['b'] + this['c'] + this['e'];
            if (totalTime < .18) {
                var multiplier = .18 / totalTime;
                this['b'] *= multiplier;
                this['c'] *= multiplier;
                this['e'] *= multiplier;
            }
        }
    }

    /**
     * SfxrSynth
     *
     * Copyright 2010 Thomas Vian
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @author Thomas Vian
     */
    /** @constructor */
    function SfxrSynth() {
        // All variables are kept alive through function closures

        //--------------------------------------------------------------------------
        //
        //  Sound Parameters
        //
        //--------------------------------------------------------------------------

        this._params = new SfxrParams(); // Params instance

        //--------------------------------------------------------------------------
        //
        //  Synth Variables
        //
        //--------------------------------------------------------------------------

        var _envelopeLength0, // Length of the attack stage
            _envelopeLength1, // Length of the sustain stage
            _envelopeLength2, // Length of the decay stage

            _period, // Period of the wave
            _maxPeriod, // Maximum period before sound stops (from minFrequency)

            _slide, // Note slide
            _deltaSlide, // Change in slide

            _changeAmount, // Amount to change the note by
            _changeTime, // Counter for the note change
            _changeLimit, // Once the time reaches this limit, the note changes

            _squareDuty, // Offset of center switching point in the square wave
            _dutySweep; // Amount to change the duty by

        //--------------------------------------------------------------------------
        //
        //  Synth Methods
        //
        //--------------------------------------------------------------------------

        /**
         * Resets the runing variables from the params
         * Used once at the start (total reset) and for the repeat effect (partial reset)
         */
        this.reset = function () {
            // Shorter reference
            var p = this._params;

            _period = 100 / (p['f'] * p['f'] + .001);
            _maxPeriod = 100 / (p['g'] * p['g'] + .001);

            _slide = 1 - p['h'] * p['h'] * p['h'] * .01;
            _deltaSlide = -p['i'] * p['i'] * p['i'] * .000001;

            if (!p['a']) {
                _squareDuty = .5 - p['n'] / 2;
                _dutySweep = -p['o'] * .00005;
            }

            _changeAmount = 1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
            _changeTime = 0;
            _changeLimit = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
        }

        // I split the reset() function into two functions for better readability
        this.totalReset = function () {
            this.reset();

            // Shorter reference
            var p = this._params;

            // Calculating the length is all that remained here, everything else moved somewhere
            _envelopeLength0 = p['b'] * p['b'] * 100000;
            _envelopeLength1 = p['c'] * p['c'] * 100000;
            _envelopeLength2 = p['e'] * p['e'] * 100000 + 12;
            // Full length of the volume envelop (and therefore sound)
            // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
            return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
        }

        /**
         * Writes the wave to the supplied buffer ByteArray
         * @param buffer A ByteArray to write the wave to
         * @return If the wave is finished
         */
        this.synthWave = function (buffer, length) {
            // Shorter reference
            var p = this._params;

            // If the filters are active
            var _filters = p['s'] != 1 || p['v'],
                // Cutoff multiplier which adjusts the amount the wave position can move
                _hpFilterCutoff = p['v'] * p['v'] * .1,
                // Speed of the high-pass cutoff multiplier
                _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
                // Cutoff multiplier which adjusts the amount the wave position can move
                _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
                // Speed of the low-pass cutoff multiplier
                _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
                // If the low pass filter is active
                _lpFilterOn = p['s'] != 1,
                // masterVolume * masterVolume (for quick calculations)
                _masterVolume = p['x'] * p['x'],
                // Minimum frequency before stopping
                _minFreqency = p['g'],
                // If the phaser is active
                _phaser = p['q'] || p['r'],
                // Change in phase offset
                _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
                // Phase offset for phaser effect
                _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
                // Once the time reaches this limit, some of the    iables are reset
                _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
                // The punch factor (louder at begining of sustain)
                _sustainPunch = p['d'],
                // Amount to change the period of the wave by at the peak of the vibrato wave
                _vibratoAmplitude = p['j'] / 2,
                // Speed at which the vibrato phase moves
                _vibratoSpeed = p['k'] * p['k'] * .01,
                // The type of wave to generate
                _waveType = p['a'];

            var _envelopeLength = _envelopeLength0, // Length of the current envelope stage
                _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
                _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
                _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

            // Damping muliplier which restricts how fast the wave position can move
            var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
            if (_lpFilterDamping > .8) {
                _lpFilterDamping = .8;
            }
            _lpFilterDamping = 1 - _lpFilterDamping;

            var _finished = false, // If the sound has finished
                _envelopeStage = 0, // Current stage of the envelope (attack, sustain, decay, end)
                _envelopeTime = 0, // Current time through current enelope stage
                _envelopeVolume = 0, // Current volume of the envelope
                _hpFilterPos = 0, // Adjusted wave position after high-pass filter
                _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
                _lpFilterOldPos, // Previous low-pass wave position
                _lpFilterPos = 0, // Adjusted wave position after low-pass filter
                _periodTemp, // Period modified by vibrato
                _phase = 0, // Phase through the wave
                _phaserInt, // Integer phaser offset, for bit maths
                _phaserPos = 0, // Position through the phaser buffer
                _pos, // Phase expresed as a Number from 0-1, used for fast sin approx
                _repeatTime = 0, // Counter for the repeats
                _sample, // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
                _superSample, // Actual sample writen to the wave
                _vibratoPhase = 0; // Phase through the vibrato sine wave

            // Buffer of wave values used to create the out of phase second wave
            var _phaserBuffer = new Array(1024),
                // Buffer of random values used to generate noise
                _noiseBuffer = new Array(32);
            for (var i = _phaserBuffer.length; i--;) {
                _phaserBuffer[i] = 0;
            }
            for (var i = _noiseBuffer.length; i--;) {
                _noiseBuffer[i] = Math.random() * 2 - 1;
            }

            for (var i = 0; i < length; i++) {
                if (_finished) {
                    return i;
                }

                // Repeats every _repeatLimit times, partially resetting the sound parameters
                if (_repeatLimit) {
                    if (++_repeatTime >= _repeatLimit) {
                        _repeatTime = 0;
                        this.reset();
                    }
                }

                // If _changeLimit is reached, shifts the pitch
                if (_changeLimit) {
                    if (++_changeTime >= _changeLimit) {
                        _changeLimit = 0;
                        _period *= _changeAmount;
                    }
                }

                // Acccelerate and apply slide
                _slide += _deltaSlide;
                _period *= _slide;

                // Checks for frequency getting too low, and stops the sound if a minFrequency was set
                if (_period > _maxPeriod) {
                    _period = _maxPeriod;
                    if (_minFreqency > 0) {
                        _finished = true;
                    }
                }

                _periodTemp = _period;

                // Applies the vibrato effect
                if (_vibratoAmplitude > 0) {
                    _vibratoPhase += _vibratoSpeed;
                    _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
                }

                _periodTemp |= 0;
                if (_periodTemp < 8) {
                    _periodTemp = 8;
                }

                // Sweeps the square duty
                if (!_waveType) {
                    _squareDuty += _dutySweep;
                    if (_squareDuty < 0) {
                        _squareDuty = 0;
                    } else if (_squareDuty > .5) {
                        _squareDuty = .5;
                    }
                }

                // Moves through the different stages of the volume envelope
                if (++_envelopeTime > _envelopeLength) {
                    _envelopeTime = 0;

                    switch (++_envelopeStage) {
                    case 1:
                        _envelopeLength = _envelopeLength1;
                        break;
                    case 2:
                        _envelopeLength = _envelopeLength2;
                    }
                }

                // Sets the volume based on the position in the envelope
                switch (_envelopeStage) {
                case 0:
                    _envelopeVolume = _envelopeTime * _envelopeOverLength0;
                    break;
                case 1:
                    _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
                    break;
                case 2:
                    _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
                    break;
                case 3:
                    _envelopeVolume = 0;
                    _finished = true;
                }

                // Moves the phaser offset
                if (_phaser) {
                    _phaserOffset += _phaserDeltaOffset;
                    _phaserInt = _phaserOffset | 0;
                    if (_phaserInt < 0) {
                        _phaserInt = -_phaserInt;
                    } else if (_phaserInt > 1023) {
                        _phaserInt = 1023;
                    }
                }

                // Moves the high-pass filter cutoff
                if (_filters && _hpFilterDeltaCutoff) {
                    _hpFilterCutoff *= _hpFilterDeltaCutoff;
                    if (_hpFilterCutoff < .00001) {
                        _hpFilterCutoff = .00001;
                    } else if (_hpFilterCutoff > .1) {
                        _hpFilterCutoff = .1;
                    }
                }

                _superSample = 0;
                for (var j = 8; j--;) {
                    // Cycles through the period
                    _phase++;
                    if (_phase >= _periodTemp) {
                        _phase %= _periodTemp;

                        // Generates new random noise for this period
                        if (_waveType == 3) {
                            for (var n = _noiseBuffer.length; n--;) {
                                _noiseBuffer[n] = Math.random() * 2 - 1;
                            }
                        }
                    }

                    // Gets the sample from the oscillator
                    switch (_waveType) {
                    case 0: // Square wave
                        _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
                        break;
                    case 1: // Saw wave
                        _sample = 1 - _phase / _periodTemp * 2;
                        break;
                    case 2: // Sine wave (fast and accurate approx)
                        _pos = _phase / _periodTemp;
                        _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
                        _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
                        _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample - _sample) + _sample;
                        break;
                    case 3: // Noise
                        _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
                    }

                    // Applies the low and high pass filters
                    if (_filters) {
                        _lpFilterOldPos = _lpFilterPos;
                        _lpFilterCutoff *= _lpFilterDeltaCutoff;
                        if (_lpFilterCutoff < 0) {
                            _lpFilterCutoff = 0;
                        } else if (_lpFilterCutoff > .1) {
                            _lpFilterCutoff = .1;
                        }

                        if (_lpFilterOn) {
                            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
                            _lpFilterDeltaPos *= _lpFilterDamping;
                        } else {
                            _lpFilterPos = _sample;
                            _lpFilterDeltaPos = 0;
                        }

                        _lpFilterPos += _lpFilterDeltaPos;

                        _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
                        _hpFilterPos *= 1 - _hpFilterCutoff;
                        _sample = _hpFilterPos;
                    }

                    // Applies the phaser effect
                    if (_phaser) {
                        _phaserBuffer[_phaserPos % 1024] = _sample;
                        _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
                        _phaserPos++;
                    }

                    _superSample += _sample;
                }

                // Averages out the super samples and applies volumes
                _superSample *= .125 * _envelopeVolume * _masterVolume;

                // Clipping if too loud
                buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
            }

            return length;
        }
    }

    // Adapted from http://codebase.es/riffwave/
    var synth = new SfxrSynth();
    // Export for the Closure Compiler
    window['jsfxr'] = function (settings) {
        // Initialize SfxrParams
        synth._params.setSettings(settings);
        // Synthesize Wave
        var envelopeFullLength = synth.totalReset();
        var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
        var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
        var dv = new Uint32Array(data.buffer, 0, 44);
        // Initialize header
        dv[0] = 0x46464952; // "RIFF"
        dv[1] = used + 36; // put total size here
        dv[2] = 0x45564157; // "WAVE"
        dv[3] = 0x20746D66; // "fmt "
        dv[4] = 0x00000010; // size of the following
        dv[5] = 0x00010001; // Mono: 1 channel, PCM format
        dv[6] = 0x0000AC44; // 44,100 samples per second
        dv[7] = 0x00015888; // byte rate: two bytes per sample
        dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
        dv[9] = 0x61746164; // "data"
        dv[10] = used; // put number of samples here

        // Base64 encoding written by me, @maettig
        used += 44;
        var i = 0,
            base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            output = 'data:audio/wav;base64,';
        for (; i < used; i += 3) {
            var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
            output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
        }
        return output;
    }



    function ArcadeAudio() {
        this.sounds = {};
    }

    ArcadeAudio.prototype.add = function (key, count, settings) {
        this.sounds[key] = [];
        settings.forEach(function (elem, index) {
            this.sounds[key].push({
                tick: 0,
                count: count,
                pool: []
            });
            for (var i = 0; i < count; i++) {
                var audio = new Audio();
                audio.src = jsfxr(elem);

                this.sounds[key][index].pool.push(audio);
            }
        }, this);
    };

    ArcadeAudio.prototype.play = function (key) {
        var sound = this.sounds[key];
        var soundData = sound.length > 1 ? sound[Math.floor(Math.random() * sound.length)] : sound[0];
        soundData.pool[soundData.tick].play();
        soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;

    };

    aa = new ArcadeAudio();

    function initSound() {
        aa.add('powerup', 10, [
    [0, , 0.062, 0.0016, 0.4789, 0.2066, , 0.3463, , 0.0322, , , , 0.3806, -0.0057, 0.5264, , 0.0145, 1, , , 0.0466, , 0.4]
  ]);
        aa.add('laser', 5, [
    [0, , 0.1779, , 0.3597, 0.5614, 0.2637, -0.1699, , , , , , 0.8236, -0.4205, , , , 1, , , , , 0.25],
  ]);
        aa.add('explosion', 20, [
    [3, , 0.139, 0.39, 0.56, 0.1534, , 0.2012, , , , , , , , , -0.1093, -0.2849, 1, , , , , 0.2],
  ]);
        aa.add('fade', 20, [
    [3, 0.49, 1, , , 0.89, 0.02, -0.3537, , , , -0.6599, , , , , 0.3999, 0.3799, 1, , , , 0.02, 0.4]
  ]);
        aa.add('buy', 20, [
    [0, , 0.01, 0.4786, 0.4222, 0.5756, , , , , , 0.4119, 0.6761, , , , , , 1, , , , , 0.4]
  ]);
        aa.add('noclick', 20, [
    [0, , 0.01, 0.4786, 0.4222, 0.5756, , , , , , -0.76, 0.97, , 0.02, , , , 1, , , , , 0.4]
  ]);
        aa.add('keypress', 2, [
    [3, , 0.0859, 0.12, 0.094, 0.32, , 1, 0.48, , 0.57, -0.14, , , -0.02, , , 0.28, 0.46, -0.54, , , , 0.3]
  ]);
        aa.add('jitter', 20, [
    [3, , 0.18, , , 0.77, , -1, -1, , , -1, , , , , 0.1, 0.1, 1, , , 0.5, -1, 0.2]
  ]);
    };
    setTimeout(initSound, 1);
} else {

    aa.play = function () {};
}