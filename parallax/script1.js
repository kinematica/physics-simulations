//==============================================================================
//           DAT.GUI: SET UP BASIC CONTROLS
//==============================================================================

var GuiParams = function() {
  //this.message = 'dat.gui';
  //this.speed = 1;				// speed of ball
  //this.maxwellsDaemon = false;			// turn on maxwell's demon?
//  this.displayOutline = false;
  //this.addBall = function(){createBall()};
  //this.removeBall = function(){removeBall()};
  //this.startInSamePlace = function(){startInSamePlace()};
  this.deltaTheta = 0.5;
};

params = new GuiParams();
var gui = new dat.GUI();
gui.add(params, 'deltaTheta', 0, 2);
// gui.close();

//==============================================================================
//           STUFF FOR RESPONSIVE RESIZING AND FULLSCREEN
//==============================================================================

var fullWidth = function(){
    return $('#fullscreen').innerWidth();
}
var fullHeight = function(){
    return $('#fullscreen').innerHeight();
}
// FULLSCREEN
$('.fs-button').on('click', function(){
        var elem = document.getElementById('fullscreen');
        if(document.webkitFullscreenElement) {
            document.webkitCancelFullScreen();
        } else {
            elem.webkitRequestFullScreen();
        };
});
var fullWidth = function(){
    return $('#fullscreen').innerWidth();
}
var fullHeight = function(){
    return $('#fullscreen').innerHeight();
}
var lastResize = new Date();
$( window ).resize( function(event){
    // update stage size
    stage.setHeight(fullHeight());
    stage.setWidth(fullWidth());
    // update star position
    sun.x(x0());
    sun.y(y0());
    orbit.radius(orbitRadius());
    orbit.x(x0());
    orbit.y(y0());
    anim.start();
    anim.stop();
    // update rectangle sizes
    /*
    right_rectangle.x(fullWidth()/2);
    left_rectangle.x(fullWidth()/2);
    */
    console.log('resize!');
});

//==============================================================================
//           COLORS
//==============================================================================

var earth_color = 'blue';
var sun_color = 'yellow';
var star_color  = '#cccccc';
var line_color  = '#cccccc';
var highlight_line_color = '#cc9999';

//==============================================================================
//           SCALED LENGTHS
//==============================================================================

function earthRadius()  {  return fullWidth() / 40;     }
function sunRadius()    {  return fullWidth() / 160;    }
function orbitRadius()  {  return fullWidth() / 40;     }
function innerRadius()  {  return fullWidth() / 120;    }
function outerRadius()  {  return fullWidth() / 60;     }
function x0()           {  return fullWidth() / 10;     }
function y0()           {  return fullWidth() / 10;     }
function x0star()       {  return 7 * fullWidth() / 10; }
function y0star()       {  return fullWidth() / 10;     }

//==============================================================================
//           NON-RESPONSIVE CONSTANTS (EVENTUALLY FACTOR OUT)
//==============================================================================

var oRadius = orbitRadius();

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
// Function for getting length of a vector
function mag(vec) { return Math.sqrt( vec[0]*vec[0] + vec[1]*vec[1] ); }
// Function for normalizing a vector
function hat(vec) {
    var r = mag(vec);
    return [ vec[0]/r, vec[1]/r ];
}
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
    return [ upx, upy, xstar, ystar, downx, downy ];
}
/* THESE AREN'T ESPECIALLY NECESSARY AND MIGHT SLOW THINGS DOWN */
// get the vertices of the max-distance triangle
function plusDeltaTriangleVertices() {
    var v = triangleVertices();
    var r = starPlusDelta();
    // replace the star vertex's position with its own max-distance
    v[2] = r[0];
    v[3] = r[1];
    return v;
}
// get the vertices of the min-distance triangle
function minusDeltaTriangleVertices() {
    var v = triangleVertices();
    var r = starMinusDelta();
    // replace the star vertex's position with its own min-distance
    v[2] = r[0];
    v[3] = r[1];
    return v;
}
// Get the cosine of the angle between the star and the orbit of earth using dot products
function cosTheta() {
    var centerToStar, downr, downrToStar, downrToStarHat;
    // vector between star and edge of circle
    downr = rdown();
    toStar = r();
    downrToStar = [toStar[0] - downr[0], toStar[1] - downr[1]];
    downrToStarHat = hat(downrToStar);
    // vector between star and orbit center
    centerToStar = rhat();
    // cos of angle between them
    return centerToStar[0]*downrToStarHat[0] + centerToStar[1]*downrToStarHat[1];
}
// Get the angle between the star and the orbit of earth
function theta() {
    // inverse cosine
    return Math.acos(cosTheta());
}
// calculate distance (not using theta)
function d() { rr=r(); return Math.sqrt( rr[0]*rr[0] + rr[1]*rr[1] ); }
// put an upper bound on R; careful, can return Infinity!
function rUpperLimit() {
    var thetaMax = theta() - Math.PI * params.deltaTheta / 180; // small angle => big distance
    if (thetaMax < 0) {
        return Infinity;
    } else {
        return oRadius / Math.tan(thetaMax);
    }
}
// put a lower bound on R
function rLowerLimit() { return oRadius / Math.tan( theta() + Math.PI * params.deltaTheta / 180 ); }
// calculate uncertainty in distance
function deltaR() { return rUpperLimit() - rLowerLimit(); }
// calculate max-distance location of the star
function starPlusDelta() {
    var dR = rUpperLimit();
    var runit = rhat();
    return [x0() + dR*runit[0], y0() + dR*runit[1]];
    /*
    var rUpper = [xstar, ystar]; //r();
    rUpper[0] += dR * runit[0];
    rUpper[1] += dR * runit[1];
    return rUpper;
    */
}
// calculate min-distance location of the star
function starMinusDelta() {
    var dR = rLowerLimit();
    var runit = rhat();
    return [x0() + dR*runit[0], y0() + dR*runit[1]];
}
// create a line showing the size of delta R
function deltaRLabelPoints() {
    var rPlusDelta = starPlusDelta();
    var rMinusDelta = starMinusDelta();
    var rDown = rup()
    return [
        rMinusDelta[0] + 0.7*rDown[0],
        rMinusDelta[1] + 0.7*rDown[1],
        rMinusDelta[0] + rDown[0],
        rMinusDelta[1] + rDown[1],
        rPlusDelta[0] + rDown[0],
        rPlusDelta[1] + rDown[1],
        rPlusDelta[0] + 0.7*rDown[0],
        rPlusDelta[1] + 0.7*rDown[1]
    ]
}
function deltaRTextPoints() {
    var rPlusDelta = starPlusDelta();
    var rUp = rup();
    return [
        rPlusDelta[0] + rUp[0],
        rPlusDelta[1] + rUp[1]
    ]
}

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
        draggable: true,
        hitFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getOuterRadius() * 2.5, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStrokeShape(this);
        }
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

    plusDeltaTriangle = new Konva.Line({
        points: plusDeltaTriangleVertices(),
        stroke: highlight_line_color,
        stroke_width: 1,
        opacity: 0.5,
        closed: false
    });

    minusDeltaTriangle = new Konva.Line({
        points: minusDeltaTriangleVertices(),
        stroke: highlight_line_color,
        stroke_width: 1,
        opacity: 0.5,
        closed: false
    });

    deltaRLabel = new Konva.Line({
        points: deltaRLabelPoints(),
        stroke: line_color,
        stroke_width: 3,
        closed: false
    });

    deltaRText = new Konva.Text({
        x: deltaRTextPoints()[0],
        y: deltaRTextPoints()[1],
        text: 'ΔR',
        fontSize: 24,
        fill: line_color,
        fontFamily: 'sans-serif'
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
    motionLayer.add(plusDeltaTriangle);
    motionLayer.add(minusDeltaTriangle);
    motionLayer.add(deltaRLabel);
    motionLayer.add(deltaRText);
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
    plusDeltaTriangle.points(plusDeltaTriangleVertices());
    minusDeltaTriangle.points(minusDeltaTriangleVertices());
    radialLine.points([x0(), y0(), xstar, ystar]);
    deltaRLabel.points(deltaRLabelPoints());
    deltaRText.x(deltaRTextPoints()[0]);
    deltaRText.y(deltaRTextPoints()[1]);
    // update metrics display
    $('#thetaDisplay').text((Math.round(100*180*theta()/Math.PI)/100).toString() + '°');
    $('#dist').text(Math.round(d()));
    $('#maxDist').text(Math.round(10*rUpperLimit())/10);
    $('#minDist').text(Math.round(10*rLowerLimit())/10);
    $('#deltaTheta').text(Math.round(100*params.deltaTheta)/100);
    $('#deltaR').text(Math.round(10*deltaR())/10);
    $('#relativeUncertainty').text((Math.round(100*deltaR()/d())).toString() + '%');
}, motionLayer);

//==============================================================================
//           DEFINE ANIMATIONS
//==============================================================================

$( document ).ready(function() {
    console.log('Kinematica v' + Kinematica.version);
    init();
});
