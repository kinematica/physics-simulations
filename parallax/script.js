//IMAGE SOURCES
var sources = {
  // bg: "img/fill.png",
  // brian: "img/fill.png",
  // bg: "img/fill.png",
  // bg: "img/fill.png",
};

$( window ).resize( function(event){
    // update stage size
    stage.setHeight(fullHeight());
    stage.setWidth(fullWidth());
    // update rectangle sizes
    right_rectangle.x(fullWidth()/2);
    left_rectangle.x(fullWidth()/2);
    console.log('resize!');
});

//DEFINE A GRAPH GLOBAL VARIABLE
var myGraph;
var graphPoints = [];
var graphFrameInterval = 20; //ms
var graphSinceRefresh  = 0; //ms

var right_rectangle,
    right_rectangle,
    left_rectangle,
    text;

var Params = function() {
  this.message = 'dat.gui';
  this.speed = 1;				// speed of ball
  this.maxwellsDaemon = false;			// turn on maxwell's demon?
//  this.displayOutline = false;
  this.addBall = function(){createBall()};
  this.removeBall = function(){removeBall()};
  this.startInSamePlace = function(){startInSamePlace()};
};

// window.onload = function() {
  text = new Params();
  var gui = new dat.GUI();
  gui.add(text, 'message');
  gui.add(text, 'speed', -2, 2);
  gui.add(text, 'maxwellsDaemon');
//  gui.add(text, 'displayOutline');
  gui.add(text, 'addBall');
  gui.add(text, 'removeBall');
  gui.add(text, 'startInSamePlace');
  gui.close();
// };

/*
 *  ====CONSTANTS====
 */

var maxBalls = 30;
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

/*
 *      ====KONVA STUFF====
 */

var stage = new Konva.Stage({
    container: 'container',
    width: fullWidth(),
    height: fullHeight()
});

var ballLayer = new Konva.Layer();              // put balls here
var textLayer = new Konva.Layer();              // write metrics here
var graphStaticLayer = new Konva.Layer();       // graph static background goes here
var graphLayer = new Konva.Layer();             // graph goes here
var backgroundLayer = new Konva.Layer();        // background objects
var buttonLayer = new Konva.Layer();

//==============================================================================
//                                BUILD THE SCENE
//==============================================================================


//WHAT TO DO WITH THE LOADED IMAGES
function draw(images) {
}

function init() {
    //LOAD ALL THE IMAGES AND CALL THE SCENE DRAWING FUNCTIONS WITH IT
    loadImages(sources, function(images) {
      draw(images);
    });

    buildScene();

    buildGUI();

    createBall();

    //EVERYTHING'S LOADED - CAN START ANIMATION
    anim.start();
    animRect.start();
}

function buildScene() {

    // Keep track of metrics
    metricsText = new Konva.Text({
        x: 25,
        y: 100,
        text: 'Time Spent on Left\nPredicted: ' + percentageOnLeftPredicted + '\nActual: ' + percentageOnLeftActual,
        fontsize: 48,
        fill: text_color,
        align: 'left'
    });

    // rectangle constructors; make the rectangles huge. This gives no
    // performance penalty, but it has the advantage of making resizing faster,
    // since we just have to move the rectangles (the excess just hangs off the
    // side of the screen).
    right_rectangle = new Konva.Rect({
        x: stage.getWidth()/2,
        y: 0,
        height: stage.getHeight() * 10,
        width: stage.getWidth() * 10,
        fill: right_rect_color,
    });
    left_rectangle = new Konva.Rect({
        x: stage.getWidth()/2,
        y: 0,
        height: stage.getHeight() * 10,
        width: stage.getWidth() * 10,
        offset: {
            x: stage.getWidth() * 10,
            y: 0
        },
        fill: left_rect_color,
    });

    backgroundLayer.add(left_rectangle);
    backgroundLayer.add(right_rectangle);
    // textLayer.add(metricsText);
    stage.add(backgroundLayer);
    stage.add(ballLayer);
    stage.add(buttonLayer);
    stage.add(textLayer);
    stage.add(graphStaticLayer);
    stage.add(graphLayer);

    stage.on('tap click', function() {
        console.log('tap or click!');
        mousePos = this.getPointerPosition();
        var x = mousePos.x / stage.getWidth();
        var y = mousePos.y / stage.getHeight();
        createBallAt(x,y);
    });

};


function buildGUI() {

    // add ball
    // makeLabel('add', 'New Ball', 20, '#ffeb32', '#484848', 0.9, 100, 50, 75, 50, buttonLayer);
    // buttonLayer.find('.add').on('mousedown touchstart', function() {
    //     createBall();
    //     ballCount++;
    //     percentageOnLeftPredicted = 100 * Math.pow(0.5, ballCount);
    //     percentageOnLeftActual = 0;
    //     timeOnLeft = 0;
    //     timeTotal = 0;
    // });

    // CREATE AN ENTROPY GRAPH
    myGraph = new Kinematica.Graph({
        id: "entropyGraph",
        title: "Live Entropy Graph",
        // titleColour: "#ffffff",
        // colour: "#ffffff",
        bg: '#a1e4ff',
        x: 30,
        y: 80,
        w: 450,
        h: 150,
        points: 100,
        xmin: 0,
        xmax: 100,
        ymin: 0,
        ymax: 20,
        lineSep: 40, //separation (in px) between helper graph lines
        // xTicks: [2, 4, 6, 8],
        yTicks: [0, 5, 10, 15, 20]
    });
    myGraph.getTicks();
    myGraph.addFunction();

    graphStaticLayer.add(myGraph.BGnode);
    graphLayer.add(myGraph.node[0]);

    graphStaticLayer.batchDraw();
    graphLayer.batchDraw();
    // ballLayer.add(myGraph.node[1]);
}

//==============================================================================
//                                FUNCTIONS
//==============================================================================

var entropy = function(grid) {
    var gridSize = grid.length;
    var ballCount = 0;
    var i = gridSize;
    while (i--) { ballCount += grid[i]; }
}

// Update ball position
function updateBall (layer, frame) {
    var timeDiff = Math.min(frame.timeDiff,100);
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

        // console.log('ballx : ' + x);

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
        if (y > (stage.getHeight() - radius)) {
            y = stage.getHeight() - radius;
            ball.velocity.y *= -1;
        }

        // left wall
        if (x < radius) {
            x = radius;
            ball.velocity.x *= -1;
        }

        // right wall
        if (x > (stage.getWidth() - radius)) {
            x = stage.getWidth() - radius;
            ball.velocity.x *= -1;
        }

    if (text.maxwellsDaemon) {
        // maxwell's demon
        if (x > (stage.getWidth() / 2 - radius) && x - text.speed * ball.velocity.x * timeDiff < (stage.getWidth() / 2 - radius)) {
            x = stage.getWidth()/2 - radius;
            ball.velocity.x *= -1;
//          maxwellsDaemonImg.setPosition({x: stage.getWidth() / 2, y: y});
//          maxwellsDaemonImg.show();
        }
    }

        // see if we're on the left side of the stage; if not, make it false
        if (x > (stage.getWidth() / 2)) {
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
    $('#maxEntropy').text(Math.round(maxEntropy*100)/100);
    $('#entropy').text(Math.round(entropy*100)/100);
    /* $('#percentageOnLeftActual').text(percentageOnLeftActual); */
    /* $('#display').text(
        "Maximum possible entropy with " + ballCount + " balls: " + maxEntropy + "\n" +
        "Current entropy: " + entropy + "\n" +
        "Percentage of Time all balls are on Left (Actual): " + percentageOnLeftActual
    ); */
}

function updateRect (layer, frame) {
    right_rectangle.opacity(0.5 * numOnRight / ballCount);
    left_rectangle.opacity(0.5 * numOnLeft / ballCount);
}


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
            x: radius + x * (stage.getWidth() - 2 * radius),
            y: radius + y * (stage.getHeight() - 2 * radius),
            radius: radius,
            fill: ball_color,
            // velocity: {
            // x: Math.cos(vel_angle),
            // y: Math.sin(vel_angle)
            // }
        });

        var vel_angle = Math.random() * 2 * Math.PI;
        // ball.prototype.velocty = [];
        ball.velocity = {
            x: Math.cos(vel_angle),
            y: Math.sin(vel_angle)
        };
        // console.log('ballx: ' + ball.velocity.x);
        // console.log('ballx: ' + ball.x());

        ball.cache();
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
    for (var i=0; i<15; i++) {
        createBallAt(x, y);
        console.log('ball number + ' + i + ' created');
    }
}

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


//==============================================================================
//                                ANIMATIONS
//==============================================================================
// update positions of the balls
anim = new Konva.Animation(function(frame) {

    updateBall(ballLayer, frame);

    if ((frame.time - graphSinceRefresh) >= graphFrameInterval) {

        // console.log('11');
        graphSinceRefresh = frame.time;

        graphPoints.push({x: myGraph.points+1, y: entropy});

        if (graphPoints.length > myGraph.points) graphPoints.shift();

        graphPoints.forEach(function(element, index, array) {element.x--});

        myGraph.mapToGraph(graphPoints, 0);

        graphLayer.batchDraw();
    }
    // myGraph.mapToGraph(points2, 1);

    updateRect(backgroundLayer, frame);


}, ballLayer);

// update rectangle showing whether all particles are on the left
animRect = new Konva.Animation(function(frame) {

    updateRect(backgroundLayer, frame);

}, backgroundLayer);

//==============================================================================
//                                INITIATE
//==============================================================================
$( document ).ready(function() {
    console.log('Kinematica v' + Kinematica.version);
    // console.log('Kinematica LogBinomial: ' + Kinematica.log_binomial(2,1));
    init();
});
