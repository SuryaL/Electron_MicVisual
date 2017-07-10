const remote = require('electron').remote;

angular.module('micSoundVisual', [
        'angular-p5'
    ])
    .factory('SoundVisual', ['p5', '$rootScope', function(p5, $rootScope) {

        return function(p) {
            var mic, fft, canvas, btn;
            $rootScope.modes = ['freq', 'beats'];
            $rootScope.mode = 0;
            var size = 512; //power of 2; => 32 , <= 1024
            var smooth = 0.9; //smooth values between frequencies. btwn 0 and 1
            var noiseCutoff = 1; //depending on what you want, you can choose to not draw below this_value(px) noise.
            p.setup = function() {
                canvas = p.createCanvas(size, size);
                mic = new p5.AudioIn();
                var div = p.createDiv('');
                btn = p.createButton('show bars');
                btn.size(100, 30);
                div.child(btn);
                div.size(size, 30);
                btn.size(size, 30);
                div.style("text-align", "center");
                fft = new p5.FFT(smooth, size);
                mic.start();
                fft.setInput(mic);
                p.colorMode(p.HSB, 100);
            };

            p.draw = function() {
                p.background(0);
                if ($rootScope.modes[$rootScope.mode] == 'freq') {
                    var spectrum = fft.waveform();
                    p.beginShape();
                    p.noFill();
                    p.stroke(0, 200, 100);
                    for (var i = 0; i < spectrum.length; i++) {
                        var amp = (size / 2) * spectrum[i];
                        amp = Math.abs(amp) > noiseCutoff ? amp : 0;
                        p.vertex(i, p.height / 2 + amp);
                    }
                    p.endShape();
                } else if ($rootScope.modes[$rootScope.mode] == 'beats') {
                    var spectrum2 = fft.analyze();
                    p.noFill();
                    for (var i = 0; i < spectrum2.length; i++) {
                        var amp = (size / 256) * spectrum2[i];
                        var temp = p.map(i, 0, spectrum2.length, 0, 100);
                        p.stroke(temp, size - amp, 100);
                        p.line(i, size, i, size - amp);
                    }
                }
            };

            $rootScope.switchMode = function() {
                if ($rootScope.mode == $rootScope.modes.length - 1)
                    $rootScope.mode = 0;
                else
                    $rootScope.mode += 1;
            }

            $rootScope.nextMode = function() {
                if ($rootScope.mode == $rootScope.modes.length - 1)
                    return 0;
                else
                    return ($rootScope.mode + 1);
            }

            $rootScope.closeWindow = function() {
                const win = remote.getCurrentWindow();
                win.close();
            }

        }
    }])
