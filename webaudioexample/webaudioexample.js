// What is web audio?

// Web audio creates a context within which to handle audio operations.
// In the context are audio sources. These are connected to a destination. 
// The destination is your speaker. 

// create an audio context

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create audio source, aka oscillator node

var oscillatorNode1 = audioCtx.createOscillator();

// give the oscillator node a type of wave. (sine, triangle, saw-tooth, square, custom)

oscillatorNode1.type = 'triangle';

// give the oscillator node a frequency

oscillatorNode1.frequency.value = 138.591; // C#

// link the source to the destination

oscillatorNode1.connect(audioCtx.destination)

// get current time
var when = audioCtx.currentTime;

// start and stop the source 
oscillatorNode1.start(when)
oscillatorNode1.stop(when + 1);

// now create two more oscillator nodes in the same context

var oscillatorNode2 = audioCtx.createOscillator();
oscillatorNode2.type = 'triangle';
oscillatorNode2.frequency.value = 164.814; // E

var oscillatorNode3 = audioCtx.createOscillator();
oscillatorNode3.type = 'triangle';
oscillatorNode3.frequency.value = 415.305; // G#

// connect both of the oscillator nodes to the destination

oscillatorNode2.connect(audioCtx.destination)
oscillatorNode3.connect(audioCtx.destination)

// play these sources together

oscillatorNode2.start(when + 2);
oscillatorNode3.start(when + 2);

oscillatorNode2.stop(when + 3);
oscillatorNode3.stop(when + 3);

// can we play oscillatorNode1 again?
// no, once it is stopped it is gone.

// oscillatorNode1.start(when + 2) // this results in error.
// oscillatorNode1.stop(when + 3)

// Can we control the volume?
// Yes with a gain node.

// create a gain node

var gainNode = audioCtx.createGain();

// create a new oscillator

var oscillatorNode4 = audioCtx.createOscillator()
oscillatorNode4.type = 'triangle'
oscillatorNode4.frequency = 138.591 // C#

// connect the oscillator to the gain node 

oscillatorNode4.connect(gainNode)

// connect the gain node to the destination

gainNode.connect(audioCtx.destination)

oscillatorNode4.start(when + 5)
gainNode.gain.setValueAtTime(0.5, when + 5)
gainNode.gain.setValueAtTime(1, when + 6)
gainNode.gain.setValueAtTime(.3, when + 7)
gainNode.gain.setValueAtTime(0.01, when + 8)
gainNode.gain.exponentialRampToValueAtTime(1, 10)
gainNode.gain.setValueAtTime(0.01, when + 10)
gainNode.gain.linearRampToValueAtTime(1, when + 12)

// this wont work because exponential ramp requires a positive value
// gainNode.gain.exponentialRampToValueAtTime(0, 14)

gainNode.gain.exponentialRampToValueAtTime(0.01, 14)

oscillatorNode4.stop(when + 14)

// can I create multiple contexts?

// yes, but...
// there is a limit determined by hardware, so don't do this.

var createContext = function() {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

for(var i = 0; i < 10; i++) {
      try {createContext();}
      catch (err) {
            console.log('For best results, just use one context.', err)
            break;
      }
}

// what is this? Low frequency oscillator

// create an oscillator node

var oscillatorNode4 = audioCtx.createOscillator();
oscillatorNode4.type = 'triangle';
oscillatorNode4.frequency.value = 440; // A

// connect to gain
oscillatorNode4.connect(gainNode);

// create an oscillator node that will be used as an LFO (Low-frequency
// oscillator), and will control a parameter
var lfo = audioCtx.createOscillator();

// set the frequency of the lfo to a low number
lfo.frequency.value = 2; // 2Hz: two oscillations per second

// look, this is different! connecting to gainNode.gain, not gainNode!
// connect the LFO to the gain AudioParam. This means the value of the LFO
// will not produce any audio, but will change the value of the gain instead

lfo.connect(gainNode.gain);

// connect the sources to the distination through the gain node.

gainNode.connect(audioCtx.destination);

gainNode.gain.setValueAtTime(1, when + 15)

oscillatorNode4.start(when + 15)
oscillatorNode4.stop(when + 25);
lfo.start(when + 20)
lfo.stop(when + 25);









