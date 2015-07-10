var width = window.innerWidth;
var height = window.innerHeight;

/* 
 *  ====CONSTANTS====
 */

var ballLayer = new Konva.Layer();              // put balls here
var backgroundLayer = new Konva.Layer();        // background objects
var radius= 30;                                     // radius
var anim;                                        // Konva animation

// TODO location updater
function updateBall (frame) {
    var timeDiff = frame.timeDiff;
    var stage = ball.getStage();
    var height = stage.getHeight();
    var width = stage.getWidth();
    // TODO do this for every ball in the ballLayer
    var x = ball.getX();
    var y = ball.getY();
    var radius= ball.getRadius();
    
    // move the ball
    x += ball.velocity.x;
    y += ball.velocity.y;

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

    ball.setPosition({x:x, y:y})
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
    fill: 'green',
    opacity: 0
});



// ball constructor
var ball = new Konva.Circle({
    x: radius + Math.random() * (width - 2 * radius),
    y: radius + Math.random() * (height - 2 * radius),
    radius: radius,
    fill: 'white',
    opacity: 0.8
});

var vel_angle = Math.random() * 2 * Math.PI;
var vel_mag   = 3;

ball.velocity = {
    x: vel_mag * Math.cos(vel_angle),
    y: vel_mag * Math.sin(vel_angle)
};

ballLayer.add(ball);
backgroundLayer.add(left_rectangle);
stage.add(ballLayer);
stage.add(backgroundLayer);

anim = new Konva.Animation(function(frame) {
    updateBall(frame);
}, ballLayer);

anim.start();
