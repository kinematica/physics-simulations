var width = window.innerWidth;
var height = window.innerHeight;

/* 
 *  ====FUNCTIONS====
 */

var entropy = function(grid) {
    var gridSize = grid.length;
    var ballCount = 0;
    var i = gridSize;
    while (i--) { ballCount += grid[i]; }
}

/* 
 *  ====TEST GUI====
 */

var text;

var Params = function() {
  this.message = 'dat.gui';
  this.speed = 1;				// speed of ball
  this.maxwellsDemon = false;			// turn on maxwell's demon?
//  this.displayOutline = false;
  this.addBall = function(){createBall()};
  this.removeBall = function(){removeBall()};
  this.startInSamePlace = function(){startInSamePlace()};
};

// window.onload = function() {
  text = new Params();
  var gui = new dat.GUI();
  gui.add(text, 'message');
  gui.add(text, 'speed', -5, 5);
  gui.add(text, 'maxwellsDemon');
//  gui.add(text, 'displayOutline');
  gui.add(text, 'addBall');
  gui.add(text, 'removeBall');
  gui.add(text, 'startInSamePlace');
// };

/* 
 *  ====CONSTANTS====
 */

var maxBalls = 50;
var ballLayer = new Konva.Layer();              // put balls here
var textLayer = new Konva.Layer();              // write metrics here
var backgroundLayer = new Konva.Layer();        // background objects
var buttonLayer = new Konva.Layer();
var radius= 20;                                 // radius
var anim;                                       // Konva animation
var numOnLeft = 0;
var numOnRight = 0;

/* 
 *  ====COLORS====
 */

var left_rect_color = "#0099FF"; // "#338833";                // color of the indicator rect
var right_rect_color = "#0099FF";               // color of the indicator rect
var text_color = "#cccccc";                     // color of the text
var ball_color = "#cccccc";                     // color of the balls

/*
 *  ====METRICS====
 */

var percentageOnLeftPredicted;
var percentageOnLeftActual;
var maxEntropy;
var entropy;
var timeOnLeft;
var timeTotal;
var ballCount;

/*
 *  ====VARIABLES FOR REUSE====
 */

var x;
var y;

// Keep track of metrics
var metricsText = new Konva.Text({
    x: 25,
    y: 100,
    text: 'Time Spent on Left\nPredicted: ' + percentageOnLeftPredicted + '\nActual: ' + percentageOnLeftActual,
    fontsize: 48,
    fill: text_color,
    align: 'left'
});

/*
 *  ====ANIMATIONS====
 */


// Update ball position
function updateBall (layer, frame) {
    var timeDiff = frame.timeDiff;
    var stage = layer.getStage();
    var balls = layer.getChildren();
    var height = stage.getHeight();
    var width = stage.getWidth();

    numOnLeft = 0;
    numOnRight = 0;

    ballCount = balls.length;

    for (var n=0; n < ballCount; n++) {
        var ball = balls[n];
        x = ball.getX();
        y = ball.getY();
        
        // move the ball
        x += text.speed * ball.velocity.x * timeDiff;
        y += text.speed * ball.velocity.y * timeDiff;

        // collisions with sides

        // ceiling
        if (y < radius) {
            y = radius;
            ball.velocity.y *= -1;
        }

        // floor
        if (y > (height - radius)) {
            y = height - radius;
            ball.velocity.y *= -1;
        }

        // left wall
        if (x < radius) {
            x = radius;
            ball.velocity.x *= -1;
        }

        // right wall
        if (x > (width - radius)) {
            x = width - radius;
            ball.velocity.x *= -1;
        }

	if (text.maxwellsDemon) {
		// maxwell's demon
		if (x > (width / 2 - radius) && x - text.speed * ball.velocity.x * timeDiff < (width / 2 - radius)) {
			x = width/2 - radius;
			ball.velocity.x *= -1;
//			maxwellsDaemonImg.setPosition({x: width / 2, y: y});
//			maxwellsDaemonImg.show();
		}
	}

        // see if we're on the left side of the stage; if not, make it false
        if (x > (width / 2)) {
            numOnRight++;
        } else {
            numOnLeft++;
        }

        ball.setPosition({x:x, y:y})
    }

    // update metrics
    timeTotal += timeDiff;
    if (numOnLeft == ballCount) { timeOnLeft += timeDiff; }
    percentageOnLeftActual = 100 * timeOnLeft / timeTotal;
    maxEntropy = Kinematica.log_binomial(ballCount,Math.floor(ballCount/2));
    entropy = Kinematica.log_binomial(ballCount,numOnLeft); // defined macrostate as numOnLeft

    // update display text
    $('#ballCount').text(ballCount);
    $('#maxEntropy').text(maxEntropy);
    $('#entropy').text(entropy);
    /* $('#percentageOnLeftActual').text(percentageOnLeftActual); */
    /* $('#display').text(
        "Maximum possible entropy with " + ballCount + " balls: " + maxEntropy + "\n" +
        "Current entropy: " + entropy + "\n" +
        "Percentage of Time all balls are on Left (Actual): " + percentageOnLeftActual
    ); */
}

function updateRect(frame) {
    right_rectangle.opacity(0.5 * numOnRight / ballCount);
    left_rectangle.opacity(0.5 * numOnLeft / ballCount);
}

/*
 *      ====KONVA STUFF====
 */

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

// rectangle constructors
var right_rectangle = new Konva.Rect({
    x: width/2,
    y: 0,
    height: height,
    width: width/2,
    fill: right_rect_color,
    // visible: false
});
var left_rectangle = new Konva.Rect({
    x: 0,
    y: 0,
    height: height,
    width: width/2,
    fill: left_rect_color,
    // visible: false
});

function createBall() {
    // create ball at random position
    createBallAt(Math.random(), Math.random());
}

function createBallAt(x, y) {
    if (ballCount >= maxBalls) {
        return 0;
    }

    // ball constructor
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        var ball = new Konva.Circle({
            x: radius + x * (width - 2 * radius),
            y: radius + y * (height - 2 * radius),
            radius: radius,
            fill: ball_color
        });
    
        var vel_angle = Math.random() * 2 * Math.PI;

        ball.velocity = {
            x: Math.cos(vel_angle),
            y: Math.sin(vel_angle)
        };

        ballLayer.add(ball);
    } else {
        throw new RangeError('coordinates of new position of the ball must be between zero and one.')
    }
}

// remove a ball
function removeBall () {
    ballLayer.getChildren().pop().destroy();
    console.log('ball removed.');
}

// get all balls to start at same place
function startInSamePlace () {
    // delete existing balls
    var balls = ballLayer.getChildren();
    var numBalls = balls.length;
    for (var n=numBalls-1; n > -1; n--) {
	balls[n].destroy();
        console.log('ball number ' + n + ' destroyed');
    };

    var x = Math.random();
    var y = Math.random();

    // make a bunch of balls in one spot
    for (var i=0; i<10; i++) {
        createBallAt(x, y);
        console.log('ball number + ' + i + ' created');
    }
}

// add ball
// makeLabel('add', 'New Ball', 20, '#ffeb32', '#484848', 0.9, 100, 50, 75, 50, buttonLayer);
buttonLayer.find('.add').on('mousedown touchstart', function() {
    createBall();
    ballCount++;
    percentageOnLeftPredicted = 100 * Math.pow(0.5, ballCount);
    percentageOnLeftActual = 0;
    timeOnLeft = 0;
    timeTotal = 0;
});

createBall();
backgroundLayer.add(left_rectangle);
backgroundLayer.add(right_rectangle);
// textLayer.add(metricsText);
stage.add(backgroundLayer);
stage.add(ballLayer);
stage.add(buttonLayer);
stage.add(textLayer);

/* 
 *  ====BRIAN====
 */

// var maxwellsDaemonImg;
// var imageObj = new Image();
// imageObj.onload = function() {
//     var maxwellsDaemonImg = new Konva.Image({
//         x: 0,
//         y: 0,
//         image: imageObj,
//         hidden: true
//     });
//     backgroundLayer.add(maxwellsDaemonImg);
// }
// imageObj.src = 'maxwells-daemon.png';


// update positions of the balls
anim = new Konva.Animation(function(frame) {
    updateBall(ballLayer, frame);
}, ballLayer);

// update rectangle showing whether all particles are on the left
animRect = new Konva.Animation(function(frame) {
        updateRect(backgroundLayer, frame);
}, backgroundLayer);

stage.on('click', function() {
    mousePos = this.getPointerPosition();
    var x = mousePos.x / width;
    var y = mousePos.y / height;
    createBallAt(x,y);
});

anim.start();
animRect.start();
