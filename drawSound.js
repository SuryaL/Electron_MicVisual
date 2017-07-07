const remote = require('electron').remote;
angular.module( 'micSoundVisual', [
        'angular-p5'
    ] )
    .factory( 'SoundVisual', [ 'p5', '$rootScope', function( p5, $rootScope ) {
        // $rootScope.win = win;
        return function( p ) {
            var mic,fft,canvas;
            var size= 512;  //power of 2; => 32 , <= 1024
            var smooth= 0.9;  //smooth values between frequencies. btwn 0 and 1
            var noiseCutoff= 1;  //depending on what you want, you can choose to not draw below this_value(px) noise.
            p.setup = function() {
                canvas = p.createCanvas(size,size);
                mic = new p5.AudioIn();
                fft = new p5.FFT(smooth,size);
                mic.start();
                fft.setInput(mic);
            };


            p.draw = function() {
                var spectrum = fft.waveform();
                p.background(0);
                p.beginShape();
                p.noFill();
                p.stroke(255);
                for(var i = 0; i<spectrum.length;i++){
                    var amp = (size/2)*spectrum[i];
                    amp = Math.abs(amp)> noiseCutoff ? amp : 0;
                    p.vertex(i,p.height/2 + amp);
                }
                p.endShape();
            };
            $rootScope.closeWindow = function(){
                const win = remote.getCurrentWindow();
                win.close();
            }
        }
    } ] )