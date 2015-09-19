//==============================================================================
//           STUFF FOR RESPONSIVE RESIZING
//==============================================================================

var fullWidth = function(){
    return $('#fullscreen').innerWidth();
}
var fullHeight = function(){
    return $('#fullscreen').innerHeight();
}

//==============================================================================
//           COLORS
//==============================================================================

var earth_color = 'blue';
var sun_color = 'yellow';
var star_color  = '#cccccc';
var line_color  = '#cccccc';

//==============================================================================
//           SCALED LENGTHS
//==============================================================================

function earthRadius()  {  return fullWidth() / 40;     }
function sunRadius()    {  return fullWidth() / 160;    }
function orbitRadius()  {  return fullWidth() / 40;     }
function innerRadius()  {  return fullWidth() / 160;    }
function outerRadius()  {  return fullWidth() / 80;     }
function x0()           {  return fullWidth() / 10;     }
function y0()           {  return fullWidth() / 10;     }
function x0star()       {  return 7 * fullWidth() / 10; }
function y0star()       {  return fullWidth() / 10;     }

//==============================================================================
//           VARIABLES
//==============================================================================

var stage;
var bgLayer;
var motionLayer;
var xstar = x0star();       // Current x position of the star
var ystar = y0star();       // Current y position of the star
var anim;                   // Animation for the triangle
var motionLayer;            // Layer for animated objects
var triangle;               // The triangle
var radialLine;
var earth;
var sun;                    // The sun
var orbit;                  // The earth's orbit
var star;

//==============================================================================
//           CONVENIENCE FUNCTIONS
//==============================================================================

// Get the vector pointing from orbit center to star center
function r()     {  return [ xstar - x0() , ystar - y0() ]      }
// Get it as a unit vector
function rhat()  {
    var r = [ xstar - x0() , ystar - y0() ];
    var absr = Math.sqrt( r[0]*r[0] + r[1]*r[1] );
    return [ r[0]/absr , r[1]/absr ];
}
// Rotate the unit vector by +90 degrees and scale it to the orbit radius
function rup() {
    var rh = rhat();
    var rad = orbitRadius();
    return [ -rh[1] * rad , rh[0] * rad ];
}
// Rotate the unit vector by -90 degrees and scale it to the orbit radius
function rdown() {
    var rh = rhat();
    var rad = orbitRadius();
    return [ rh[1] * rad , -rh[0] * rad ];
}
// Get the vertices of the triangle
function triangleVertices() {
    var upx, upy, downx, downy, upr, downr
    upr = rup();
    downr = rdown();
    upx = upr[0] + x0();
    upy = upr[1] + y0();
    downx = downr[0] + x0();
    downy = downr[1] + y0();
    return [ upx, upy, downx, downy, xstar, ystar ];
}
// TODO: Find half the angle between the two vectors
// TODO: Animate a little earth in orbit
// TODO: Animate the vector between the earth and the star
// TODO: add a little diagram with the earth and the vector changing
// TODO: add a little picture showing the star "moving" against the background

//==============================================================================
//           KONVA SETUP: BUILD THE SCENE
//==============================================================================

function init() {
    buildScene();
}


function buildScene() {
    stage = new Konva.Stage({
        container: 'container',
        width: fullWidth(),
        height: fullHeight()
    });

    bgLayer = new Konva.Layer();
    motionLayer = new Konva.Layer();

    /*
    * create a circle representing earth's orbit and a smaller one for the sun
    */

    orbit = new Konva.Circle({
        x: x0(),
        y: y0(),
        radius: orbitRadius(),
        stroke: line_color
    });

    sun = new Konva.Circle({
        x: x0(),
        y: y0(),
        radius: sunRadius(),
        fill: sun_color
    });

    /* 
    * create a star representing, uh, the distant star
    */

    star = new Konva.Star({
        x: x0star(),
        y: y0star(),
        numPoints: 4,
        innerRadius: innerRadius(),
        outerRadius: outerRadius(),
        fill: star_color,
        draggable: true
    });

    /*
    * create a triangle shape starting at the center of the circle and
    * leading to some other point
    */

    triangle = new Konva.Line({
        points: triangleVertices(),
        stroke: line_color,
        stroke_width: 3,
        closed: true
    });

    /*
    * create the readial line connecting the center of the circle and the star
    */

    radialLine = new Konva.Line({
        points: [x0(), y0(), xstar, ystar],
        stroke: line_color,
        dash: [10, 10],
        stroke_width: 3,
        closed: false
    });

    bgLayer.add(orbit);
    bgLayer.add(sun);
    motionLayer.add(triangle);
    motionLayer.add(radialLine);
    motionLayer.add(star);

    stage.add(motionLayer);
    stage.add(bgLayer);

    /*
    * when the star is moved, refresh the xstar and ystar positions
    */
    star.cache();
    star.on('dragstart', function() {
        anim.start();
    });
    star.on('dragend', function() {
        anim.stop();
    });
}

//==============================================================================
//           DEFINE ANIMATIONS
//==============================================================================

var anim = new Konva.Animation(function(frame) {
    xstar = star.getX();
    ystar = star.getY();
    triangle.points(triangleVertices());
    radialLine.points([x0(), y0(), xstar, ystar]);
}, motionLayer);

//==============================================================================
//           DEFINE ANIMATIONS
//==============================================================================

$( document ).ready(function() {
    console.log('Kinematica v' + Kinematica.version);
    init();
});
