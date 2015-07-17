var width = window.innerWidth;
var height = window.innerHeight;

/* 
 *  ====CONSTANTS====
 */

var ballLayer = new Konva.Layer();              // put balls here
var textLayer = new Konva.Layer();              // write metrics here
var backgroundLayer = new Konva.Layer();        // background objects
var buttonLayer = new Konva.Layer();
var radius= 20;                                 // radius
var vel_mag = 1;                                // speed of ball
var anim;                                       // Konva animation
var onLeft = false;                             // are all balls on left?
var oldOnLeft;                                  // track changes
var rect_color = "#338833";                     // color of the indicator rect
var text_color = "#cccccc";                     // color of the text
var ball_color = "#cccccc";                     // color of the balls

/*
 *  ====METRICS====
 */

var percentageOnLeftPredicted;
var percentageOnLeftActual;
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

// Update ball position
function updateBall (layer, frame) {
    var timeDiff = frame.timeDiff;
    var stage = layer.getStage();
    var balls = layer.getChildren();
    var height = stage.getHeight();
    var width = stage.getWidth();

    oldOnLeft = onLeft;
    onLeft = true;

    for (var n=0; n < balls.length; n++) {
        var ball = balls[n];
        x = ball.getX();
        y = ball.getY();
        
        // move the ball
        x += vel_mag * ball.velocity.x * timeDiff;
        y += vel_mag * ball.velocity.y * timeDiff;

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

        // see if we're on the left side of the stage; if not, make it false
        if (x > (width / 2)) {
            onLeft = false;
        }

        ball.setPosition({x:x, y:y})
    }

    // update metrics
    timeTotal += timeDiff;
    if (onLeft) { timeOnLeft += timeDiff; }
    percentageOnLeftActual = 100 * timeOnLeft / timeTotal;
}

function updateRect(frame) {
    if (onLeft) {
        left_rectangle.show()
    } else {
        left_rectangle.hide()
    }
}

/*
 *      ====KONVA STUFF====
 */

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

// left rectangle constructor
var left_rectangle = new Konva.Rect({
    x: 0,
    y: 0,
    height: height,
    width: width/2,
    fill: rect_color,
    visible: false
});


function createBall() {
    // ball constructor
    var ball = new Konva.Circle({
        x: radius + Math.random() * (width - 2 * radius),
        y: radius + Math.random() * (height - 2 * radius),
        radius: radius,
        fill: ball_color
    });

    var vel_angle = Math.random() * 2 * Math.PI;

    ball.velocity = {
        x: Math.cos(vel_angle),
        y: Math.sin(vel_angle)
    };

    ballLayer.add(ball);
}

// add ball
makeLabel('add', 'New Ball', 20, '#ffeb32', '#484848', 0.9, 100, 50, 75, 50, buttonLayer);
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
textLayer.add(metricsText);
stage.add(backgroundLayer);
stage.add(ballLayer);
stage.add(buttonLayer);
stage.add(textLayer);

// update positions of the balls
anim = new Konva.Animation(function(frame) {
    updateBall(ballLayer, frame);
}, ballLayer);

// update rectangle showing whether all particles are on the left
animRect = new Konva.Animation(function(frame) {
    if (onLeft === oldOnLeft) {
        return false;
    } else {
        updateRect(backgroundLayer, frame);
    }
}, backgroundLayer);

anim.start();
animRect.start();
