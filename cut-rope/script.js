//==============================================================================
//                               PARAMETERS
//==============================================================================

var R = 2*Math.round(width/12);     // LENGTH OF THE ROPE, DIVISIBLE BY 2
var L = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));    // VELOCITY LINE LENGTH
var targetR = Math.round(width/24); // RADIUS OF THE TARGET
if (R < 150) R = 150;
if (R > 250) R = 250;
if (R > width/2) R = Math.round(width/2);
var x0 = Math.round(3*width/4);     // CENTER OF ROTATION
var y0 = Math.round(width/4);
var x1 = Math.round(x0 + R);   // INITIAL LOCATION OF END OF ROPE
var theta = 0;
var angularVelocity = 4;
var ropeIsCut = false;              // ARE WE ROTATING OR FREE-FLYING?
var r = {
    x: x1,
    y: y0
};
var v = {
    x: 0,
    y: R*angularVelocity
}

// TODO : rope, ball, target, velocity vector, dotted velocity line
// TODO : put colors in some central location

// STYLE
var strokeWidth = 3;
var dash = [12, 6]                  // LENGTH OF SEGMENTS AND SPACES FOR DASHED LINES
var speedColour = {up: "#8cff69", down: "#ff8268", opacity: "0.5"};
var colours = {bg: "#313131", poleTop: "#acacac", poleBottom: "#919191",
                stroke: "#737373", shadow: "#1f1f1f",
                text: "#ffffff"};
var fonts = "Calibri";

Konva.angleDeg = false;             // WORK IN RADIANS

//==============================================================================
//                         INITIALIZE STAGE AND LAYERS
//==============================================================================

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var motionLayer = new Konva.Layer();
var staticLayer = new Konva.Layer();
var sliderLayer = new Konva.Layer();
var targetLayer = new Konva.Layer();

//==============================================================================
//                             BUILD THE SCENE
//==============================================================================

// HUGE BACKGROUND SHAPE FOR GETTING MOUSE POSITION
var stageBG = new Konva.Rect({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: colours.bg,
    opacity: 0
});

var rope = new Konva.Line({
    points: [x0, y0, x1, y0],
    stroke: colours.stroke,
    lineCap: 'round',
    lineJoin: 'round',
    id: 'rope'//,
//    offset: {
//        x: -R/2,
//        y: 0
//    }
    // TODO : ADD TENSION AND ANIMATION FOR LINE SNAPPING
});

var velocityLine = new Konva.Line({
    points: [x1, y0+L, x1, y0-L],
    stroke: colours.stroke,
    lineCap: 'round',
    lineJoin: 'round',
    dash: dash,
    id: 'velocityLine'
});

var velocityArrow = new Konva.Arrow({
    x: x1,
    y: y0,
    points: [0, 0, 0, -Math.round(R/4)],
    pointerLength: 20,
    pointerWidth: 20,
    fill: colours.stroke,
    stroke: colours.stroke,
    strokeWidth: strokeWidth,
    id: 'velocityArrow'
});

// MAKE A NEW TARGET AT A RANDOM SPOT IN THE LEFTMOST QUARTER OF THE STAGE
var makeNewTarget = function() {
    return new Konva.Rect({
        x: Math.random()*width/4,
        y: Math.random()*height,
        radius: targetR,
        stroke: colours.stroke,
        strokeWidth: strokeWidth
    });
};

var target = makeNewTarget();

staticLayer.add(stageBG)
motionLayer.add(rope);
motionLayer.add(velocityLine);
motionLayer.add(velocityArrow);
targetLayer.add(target)

//==============================================================================
//                                 LISTENERS
//==============================================================================

// TODO

//==============================================================================
//                               BUILD THE STAGE
//==============================================================================

stage.add(staticLayer);
stage.add(targetLayer);
stage.add(motionLayer);
stage.batchDraw();

//==============================================================================
//                                  ANIMATION
//==============================================================================

// TODO

var anim = new Konva.Animation(function(frame) {
    var t = frame.time
    var nodeRope = motionLayer.find("#rope")[0];
    var nodeLine = motionLayer.find("#velocityLine")[0];
    var nodeArrow = motionLayer.find("#velocityArrow")[0];

    if (ropeIsCut) {
        nodeArrow.x(v.x * t + r.x);     // UPDATE POSITIONS
        nodeArrow.y(v.y * t + r.y);
    } else {
        theta += angularVelocity * frame.timeDiff / 1000;

        // UPDATE ROTATIONS
        nodeRope.rotate(theta);
        nodeLine.rotate(theta);
        nodeArrow.rotate(theta);

        // UPDATE POSITIONS
        nodeArrow.x(x0 + R * Math.cos(theta));
        nodeArrow.y(y0 + R * Math.sin(theta));
        nodeLine.x(x0 + R * Math.cos(theta));
        nodeLine.y(y0 + R * Math.sin(theta));
    }
});

var cutRope = function(){
    ropeIsCut = true;

    // SET VELOCITIES
    v.x(-R * angularVelocity * Math.sin(theta));
    v.y( R * angularVelocity * Math.cos(theta));

    // SET RELEASE POINT
    r.x(R * Math.cos(theta) + x0);
    r.y(R * Math.sin(theta) + y0);

    // RESET ANIMATION TIME
    anim.frame.time = 0;
};

var resetScene = function(){
    ropeIsCut = false;
    // TODO : Redraw things and place the target in its original spot
};

anim.start();
