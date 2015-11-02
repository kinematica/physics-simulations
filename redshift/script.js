//==============================================================================
//           DAT.GUI: SET UP BASIC CONTROLS
//==============================================================================

// we're just including Hubble constant for now
var GuiParams = function() {
  this.hubbleConstantOverC = 0.5;
};

// instantiate the params object and the gui; add the former to the latter later
params = new GuiParams();
var gui = new dat.GUI();

//==============================================================================
//           STUFF FOR RESPONSIVE RESIZING AND FULLSCREEN
//==============================================================================

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
//           COLORS
//==============================================================================

var earth_color = 'blue';
var sun_color = 'yellow';
var photon_color  = '#cccccc';
var line_color  = '#cccccc';
var highlight_line_color = '#cc9999';

//==============================================================================
//           'TRUE' POSITIONS/SCALES (BEFORE SCALING)
//==============================================================================

var earthX          = 0.1;
var earthY          = 0.1;
var earthRadius     = 0.025;
var starY           = 0.1;
var starInnerR      = 0.008;
var starOuterR      = 0.016;
var wavefrontX      = 0.1;
var wavefrontR      = 0.1;

//==============================================================================
//           'TRUE' POSITIONS/SCALES, TIME VARYING (BEFORE SCALING)
//==============================================================================

function starX(t)           { return [ 0.2 + 0.1*t, 0.1 ];          }
function wavefrontPos(t,t0) { throw new Error('wavefrontPos not yet implemented') }

//==============================================================================
//           SCALED LENGTHS
//==============================================================================

function scaledEarthX(t)        { return earthX             * fullWidth() }
function scaledEarthY(t)        { return earthY             * fullWidth() }
function scaledEarthR(t)        { return earthRadius        * fullWidth() }
function scaledStarX(t)         { return starX(t)           * fullWidth() }
function scaledStarY(t)         { return starY              * fullWidth() }
function scaledStarInnerR(t)    { return starInnerR         * fullWidth() }
function scaledStarInnerR(t)    { return starOuterR         * fullWidth() }

//==============================================================================
//           KONVA SETUP: BUILD THE SCENE
//==============================================================================
