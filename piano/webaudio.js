

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var playSingleNote = function(frequency, length) {
      
      var oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      var gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination)

      var when = audioCtx.currentTime;
      
      
      gainNode.gain.value = 0.01;
      oscillator.start(when);
      gainNode.gain.linearRampToValueAtTime(1, when + 0.25)
      gainNode.gain.setValueAtTime(1, when + length);
      gainNode.gain.linearRampToValueAtTime(0.001, when + length + 0.75)

      oscillator.stop(when + length + 0.75);
}

var playContinuousNote = function(frequency, key) {
      
      var oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      var gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination)
      
      var when = audioCtx.currentTime;  
      gainNode.gain.value = 0.01;
      oscillator.start(when);
      gainNode.gain.linearRampToValueAtTime(1, when + 0.10)

      var stopPlayingContinuousNote = function() {
            d3.select(key).on('mouseup', null)
            d3.select(key).on('mouseout', null)
            var when = audioCtx.currentTime;
            gainNode.gain.setValueAtTime(1, when + 0.5);
            gainNode.gain.linearRampToValueAtTime(0.001, when + 1.25)
      
            oscillator.stop(when + 1.25);
      }
      
      key.on('mouseup', () => stopPlayingContinuousNote())
      key.on('mouseout', () => stopPlayingContinuousNote())
}

var playChallengeNote = function(frequency, key) {

      var oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      var gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination)

      var lfo = audioCtx.createOscillator();
      lfo.frequency.value = .75; // 2Hz: two oscillations per second
      lfo.connect(gainNode.gain);
      
      var when = audioCtx.currentTime;  
      gainNode.gain.value = 0.01;
      oscillator.start(when);
      gainNode.gain.linearRampToValueAtTime(1, when + 0.10)
      lfo.start(when + 0.10)

      var stopPlayingChallengeNote = function() {

            // print success message
            var div = d3.select('#challenge');
            div.html('<h2> You got it!</h2>')

            // display note
            displayNote(frequency)

            playSingleNote(frequency, 4)

            var when = audioCtx.currentTime;
            gainNode.gain.setValueAtTime(1, when);
            gainNode.gain.linearRampToValueAtTime(0.001, when + 0.75)
            lfo.stop(when + 0.75)
            oscillator.stop(when + 0.75);

            // reset on click
            key.on('click', () => null)
      }
      var reset = function() {

            var when = audioCtx.currentTime;
            gainNode.gain.setValueAtTime(1, when);
            gainNode.gain.linearRampToValueAtTime(0.001, when + 1)
            lfo.stop(when + 1)
            oscillator.stop(when + 1);

            // reset on click
            key.on('click', () => null)

      }
      // if correct key is clicked stop playing challenge note
      key.on('click', () => stopPlayingChallengeNote())

      // if another challenge is chosen stop playing challenge note 
      d3.selectAll('.challenge').on('mousedown', () => reset())
}



