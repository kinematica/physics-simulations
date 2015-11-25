// THINGS THAT AREN'T BOILERPLATE GET ACTUAL NUMBERS; EVERYTHING ELSE SHOULD
// BE GENERIC.

//==============================================================================
//           DAT.GUI: SET UP BASIC CONTROLS
//==============================================================================

//******************************************************************************
//************BOILERPLATE
// a function for restarting
function restart(){
    t = 0;
    photons.forEach( function(photon) {photon.fill(color());} );
    stopCreatingPhotons();
    createPhotonsEverySecond();
    motionLayer.draw();
}

// a function for switching the direction of the star
function switchDirection() {
    direction *= -1;
}
//************BOILERPLATE
//******************************************************************************

//==============================================================================
//           1. DAT.GUI: DECLARE EDITABLE PARAMETERS
//==============================================================================

// we're just treating it like it's regular old doppler shift
// TODO: just phrase this as a bunch of editable parameters. also have constants.
var GuiParams = function() {
    this.speed = 0.00,
    this.switchDirection = switchDirection,
    this.restart = restart,
    this.stopCreatingPhotons = stopCreatingPhotons
};

// instantiate the params object and the gui; add the former to the latter later
params = new GuiParams();
var gui = new dat.GUI();

// add the parameters to the gui object
gui.add(params, 'speed', 0, 0.05).onChange(restart);
gui.add(params, 'switchDirection').onChange(restart);
gui.add(params, 'restart');
gui.add(params, 'stopCreatingPhotons')

//==============================================================================
//           STUFF FOR RESPONSIVE RESIZING AND FULLSCREEN
//==============================================================================

//******************************************************************************
//************BOILERPLATE
var fullWidth = function(){
    return $('#fullscreen').innerWidth();
}
var fullHeight = function(){
    return $('#fullscreen').innerHeight();
}
var oldFullWidth = fullWidth();
var oldFullHeight = fullHeight();
// FULLSCREEN
$('.fs-button').on('click', function(){
        var elem = document.getElementById('fullscreen');
        if(document.webkitFullscreenElement) {
            document.webkitCancelFullScreen();
        } else {
            elem.webkitRequestFullScreen();
        };
});
var lastResize = new Date();

//==============================================================================
//           COLORS (WE SHOULD MAKE A LIBRARY OF 'KINEMATICA' COLORS)
//==============================================================================

var earth_color = 'blue';
var sun_color = 'yellow';
var photon_color  = '#cccccc';
var line_color  = '#cccccc';
var highlight_line_color = '#cc9999';
//************BOILERPLATE
//******************************************************************************

//==============================================================================
//           2. 'TRUE' POSITIONS/SCALES (BEFORE SCALING; SHOULD GO IN OBJECT)
//==============================================================================

var earthX          = 0.1;
var earthY          = 0.1;
var earthRadius     = 0.025;
var photonY         = 0.1;
var photonRadius    = 0.01;
var starY           = 0.1;
var starX0          = 0.8;
var starInnerR      = 0.008;
var starOuterR      = 0.016;

//==============================================================================
//           VARIABLES
//==============================================================================

//******************************************************************************
//************BOILERPLATE
var t = 0;
var bgLayer;
var motionLayer;
var anim;                   // Animation for the triangle
var earth;
var star;
var photons = [];           // An array holding all current photons
var photonCreatorId;        // This is the process id for the function that periodically creates photons
var direction = -1;         // The direction of star motion
//************BOILERPLATE
//******************************************************************************

//==============================================================================
//           3. 'TRUE' POSITIONS/SCALES, TIME VARYING (BEFORE SCALING; MAKE OO)
//==============================================================================

function starX(t)           { return starX0 + direction * params.speed * t; }
function photonX(t, x0)     { return x0 - 0.1*t;                            }

//==============================================================================
//           SCALED LENGTHS
//==============================================================================

//******************************************************************************
//************BOILERPLATE
function scaledEarthX(t)        { return earthX             * fullWidth() }
function scaledEarthY(t)        { return earthY             * fullWidth() }
function scaledEarthR(t)        { return earthRadius        * fullWidth() }
function scaledPhotonX(t, x0)   { return photonX(t, x0)     * fullWidth() }
function scaledPhotonY(t)       { return photonY            * fullWidth() }
function scaledPhotonR(t)       { return photonRadius       * fullWidth() }
function scaledStarX(t)         { return starX(t)           * fullWidth() }
function scaledStarY(t)         { return starY              * fullWidth() }
function scaledStarInnerR(t)    { return starInnerR         * fullWidth() }
function scaledStarOuterR(t)    { return starOuterR         * fullWidth() }
//************BOILERPLATE
//******************************************************************************

//==============================================================================
//           UTILITY FUNCTIONS
//==============================================================================

// calculate the doppler factor for the frequency (c=0.1)
function doppler(v) {
    return 1 / (1 + 10*v);
}

// calculate the color of the ball based on the speed
function color() {
    // center around hue = 1/6, which is yellow
    var hue = doppler(direction * params.speed) / 3 - 1 / 6;
    return tinycolor.fromRatio({ h: hue, s: 1, l: 0.5 }).toHexString();
}

//==============================================================================
//           KONVA SETUP: BUILD THE SCENE
//==============================================================================

// make a new photon and add it to the photons array; later, use splice to remove
function createPhoton() {
    // Find starting position of the photon
    var x0 = starX(t*0.001);
    var photon = new Konva.Circle({
        x:      scaledPhotonX(0, x0),
        y:      scaledPhotonY(0),
        radius: scaledPhotonR(0),
        fill: color()
    });
    // keep track of time for each photon since it was emitted
    photon.time = 0;
    photon.x0 = x0;
    motionLayer.add( photon )
    photons.push( photon )
}

// schedule a new photon to be emitted every second; returns the id of the scheduled function
function createPhotonsEverySecond() {
    photonCreatorId = window.setInterval(createPhoton, 1000);
}

// stop emitting photons; you have to provide the id of the scheduled function
// that must be cancelled
function stopCreatingPhotons() {
    window.clearInterval(photonCreatorId);
}

//******************************************************************************
//************BOILERPLATE
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
//************BOILERPLATE
//******************************************************************************

// INSTANTIATING THESE SHOULD BE AUTOMATED

    earth = new Konva.Circle({
        x:      scaledEarthX(0),
        y:      scaledEarthY(0),
        radius: scaledEarthR(0),
        fill: earth_color
    });

    createPhotonsEverySecond();

    star = new Konva.Star({
        x:      scaledStarX(0),
        y:      scaledStarY(0),
        numPoints: 4,
        innerRadius: scaledStarInnerR(0),
        outerRadius: scaledStarOuterR(0),
        fill: sun_color
    });

//******************************************************************************
//************BOILERPLATE
    bgLayer.add(earth);
    motionLayer.add(star);

    stage.add(bgLayer);
    stage.add(motionLayer);

    anim.start();

    $( window ).resize( function(event){
        stage.setHeight(fullHeight());
        stage.setWidth(fullWidth());
        // TODO: create a loop for resizing things
    });
//************BOILERPLATE
//******************************************************************************
};

//==============================================================================
//           DEFINE ANIMATIONS
//==============================================================================
 
//******************************************************************************
//************BOILERPLATE
function updatePositions(frame){
    dt = Math.min(frame.timeDiff,100);
    t += dt
    star.x(scaledStarX(t*0.001));
    // console.log('time is ' + t + ', star x is ' + scaledStarX(t));
    photons.forEach( function(photon, i, photonArray) {
        photon.x( scaledPhotonX( photon.time*0.001, photon.x0 ) );
        photon.time += dt;
        if (photon.x() < -100) {
            photonArray.splice(i, 1);
            photon.destroy();
        }
    });
    motionLayer.draw();
}

var anim = new Konva.Animation(updatePositions, motionLayer);
  
//==============================================================================
//           START
//==============================================================================
 
$( document ).ready(function() {
    console.log('Kinematica v' + Kinematica.version);
    init();
});
//************BOILERPLATE
//******************************************************************************
