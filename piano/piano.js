

// get the width of the container div

var width = d3.select('#piano').style('width').slice(0,-2);
var height = 3*width/6;

var margin = 0.05*width;
var keywidth = (width - 2 * margin)/14;

// get the svg and set the width and height
var svg = d3.select('svg');
svg.attr('width', width);
svg.attr('height', height);

// get the data async from csv file and initialize the program
var getData = function() {
      
            var baseurl = './'
            
            d3.csv(baseurl + 'piano.csv', function(err, data) {
                  if(err) {
                        console.log('Error getting data. ', err)
                  }
                  else{
                        // find the x,y,width,height,fill values for each object and add as properties to the object
                        var accumulator = 0;
      
                        data.forEach(function(d, i, a) {
                              var keyisblack = d.note.includes('#');
                              d.width = keyisblack? 0.8*keywidth : keywidth;
                              d.height = keyisblack? 3*keywidth : 5*keywidth;
                              d.x = keyisblack? keywidth * accumulator - d.width/2 + margin : keywidth * accumulator + margin;
                              if (!keyisblack) { accumulator++ }
                              d.y = (height - 5*keywidth)/2;
                              d.fill = keyisblack? 'black' : 'white'
                        })
      
                        // initialize the programs with the data
                        init(data);
                  }
            })
      }
var drawPiano = function(data) {
      
            // sort data so that the black keys will be drawn on top on the white keys
            data.sort(function(x,y) {
                  return d3.descending(x.fill, y.fill);
            })
      
            var piano = svg.append('g');
      
            piano = piano.selectAll('rect').data(data);
      
            piano.enter().append('rect')
      
                  // define attributes for each key
                  .attr('x', d => d.x)
                  .attr('y', d => d.y)
                  .attr('width', d => d.width)
                  .attr('height', d => d.height)
                  .attr('rx', '3')
                  .attr('fill', d => d.fill)
                  .attr('stroke-width', '3px' )
                  .attr('stroke', 'black')
                  .attr('note', d => d.note)
                  .attr('keyColor', d => d.fill)
                  .attr('frequency', d => d.frequency)
      
                  // play note on mousedown
                  .on('mousedown', function(d) {
                        var frequency = d.frequency;
                        playContinuousNote(frequency, d3.select(this))
                  })
      
                  // change color of key on mouseover
                  .on('mouseenter', function(d) {
                        d3.select(this).attr('fill', 'rgb(200,230,200)')
                  })
                  .on('mouseleave', function(d) {
                        d3.select(this).attr('fill', d => d.fill)
                  })
            
      }

      var displayNote = function(frequency) {
            // get note and key
            var key = d3.selectAll('rect').filter(d => d.frequency === frequency)
            var note = key.attr('note')
      
            var x = +key.attr('x') + key.attr('width')/2;
            var y = +key.attr('y') + key.attr('height') * 0.8;
            var r = +key.attr('width')/2;
      
            // create the circle and append to g
            var circle = d3.select('g').append('circle').attr('fill', 'skyblue')
                  .attr('r', r*1.2)
                  .attr('cx', x)
                  .attr('cy', y)
                  .attr('pointer-events', 'none')
                  .attr('class', 'circle')
                  
            // create the text and append to g
            var text = d3.select('g').append('text').text(note)
                  .attr("font-family", "sans-serif")
                  .attr("font-size", r + "px")
                  .attr("fill", "yellow")
                  .attr('x', x - r/3)
                  .attr('y', y + r/3)
                  .attr('pointer-events', 'none')
                  .attr('class','text')
            
            // remove the circle and text at same time single note ends
            setTimeout(function() {
                  circle.remove()
                  text.remove()
            }, 4000) 
      }
      

// get a random number so can select random key by index
var getRandomIndex = function() {
      // random number from [0,23]
      return Math.floor(Math.random()*24)
}
var trainYourEar = function() {
      
            // select a random key
            var keys = d3.selectAll('rect');
            var index = getRandomIndex();
            var frequency = keys.filter((d,i) => i === index ).attr('frequency');
            var challengeKey = keys.filter(d => d.frequency === frequency);
            
            // select challenge div then print new challenge
            var div = d3.select('#challenge');
            div.html('<p>Listen...</p>');
      
            // play sound of the key
            playChallengeNote(frequency, challengeKey);
      }
var findThatKey = function() {

      var keys = d3.selectAll('rect');
      var index = getRandomIndex();
      var note = keys.filter((d,i) => i === index ).attr('note')
      var challengeKeys = keys.filter(d => d.note === note)

      // clear any old listeners
      keys.on('click', null)

      // select challenge div, then print new challenge
      var html = '<p>Where is: <h2>' + note + '</h2></p>';
      var div = d3.select('#challenge');
      div.html(html);

      //listen for click on challengeKeys
      challengeKeys.on('click', function(d) {
            console.log('clicked')
            displayNote(d.frequency)
            playSingleNote(d.frequency, 4)
            challengeKeys.on('click', null)
            div.html("<h2>That's It!</h2>")
      })

      // if another challenge is chosen stop listening for the challngeKeys
      var reset = function() {
            challengeKeys.on('click', null)
      }

      d3.selectAll('.challenge').on('mousedown', () => reset());

}
var freePlay = function() {

      // select challenge div then print new challenge
      var div = d3.select('#challenge');
      div.html('<p>Freeplay!</p>');

      //display note on click
      var keys = d3.selectAll('rect').on('click', function(d) {     
            displayNote(d.frequency);
      })

      // if another challenge is chosen stop listening for the challngeKeys
      var reset = function() {
            keys.on('click', null)
      }

      d3.selectAll('.challenge').on('mousedown', () => reset());
}

var addEventListeners = function() {
      d3.select('#ear').on('click', function() {
            trainYourEar();
      })
      d3.select('#find').on('click', function() {
            findThatKey();
      })
      d3.select('#play').on('click', function() {
            freePlay();
            
      })
}
var init = function(data) {

            addEventListeners();
            drawPiano(data);

      
}
      
getData();
