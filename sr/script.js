var width = window.innerWidth;
var height = window.innerHeight;

// Set the style
stw = 4                     // stroke width

// Set scales
w = 80;                     // screen width, in m
ppm = width / w;            // pixels / m
tscale = 2e-8;              // timescale

// Set params (should be user adjustable soon)
c = 299792458;              // speed of light in m/s
b = 0.3;                    // boost
v = b * c;                  // velocity
g = 1 / Math.sqrt(1-b^2);   // lorrentz factor gamma
l0 = 20;                    // train length, mcrf
l = l0 / g;                 // train length, lab frame
x0 = 20;                    // starting x position

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var motionLayer = new Konva.Layer();
var staticLayer = new Konva.Layer();

// function for adding rails
function addRails(y) {
    line = new Konva.Line({
        points: [0, y, width, y],
        stroke: '#666666',
        strokeWidth: stw
    });

    staticLayer.add(line);
}

// Add rails
for (var n=1; n<8; n+=2) addRails(height*n/8);

// Car seen in momentarily comoving reference frame
var mcrf = new Konva.Rect({
    x: x0*ppm - (l0*ppm / 2),
    y: height * 1 / 8,
    width: l0*ppm,
    height: height / 4,
    stroke: 'black',
    strokeWidth: stw
});

staticLayer.add(mcrf);

// Car seen from lab frame, that is, from outside
var labframe = new Konva.Rect({
    x: x0*ppm - (l0*ppm / 2),
    y: height * 5 / 8,
    width: l0*ppm,
    height: height / 4,
    stroke: 'black',
    strokeWidth: stw
});

motionLayer.add(labframe);

// Add lamps
var mcrfLamp = new Konva.Circle({
    x: x0*ppm,
    y: height / 4,
    radius: height / 16,
    stroke: 'black',
    fill: 'yellow',
    strokeWidth: stw
});

staticLayer.add(mcrfLamp);

var labLamp = new Konva.Circle({
    x: x0*ppm,
    y: height * 3 / 4,
    radius: height / 16,
    stroke: 'black',
    fill: 'yellow',
    strokeWidth: stw
});

motionLayer.add(labLamp);

// Add photons
var mcrfForwardPhoton = new Konva.Circle({
    x: x0*ppm,
    y: height * 1 / 4,
    radius: height / 64,
    fill: 'yellow',
});
motionLayer.add(mcrfForwardPhoton);

var mcrfReversePhoton = new Konva.Circle({
    x: x0*ppm,
    y: height * 1 / 4,
    radius: height / 64,
    fill: 'yellow',
});
motionLayer.add(mcrfReversePhoton);

var labForwardPhoton = new Konva.Circle({
    x: x0*ppm,
    y: height * 3 / 4,
    radius: height / 64,
    fill: 'yellow',
});
motionLayer.add(labForwardPhoton);

var labReversePhoton = new Konva.Circle({
    x: x0*ppm,
    y: height * 3 / 4,
    radius: height / 64,
    fill: 'yellow',
});
motionLayer.add(labReversePhoton);

// Stage everything
stage.add(staticLayer);
stage.add(motionLayer);

// Animate the lamps and trains
var animLab = new Konva.Animation(function(frame) {
    labLamp.setX( v*ppm * (frame.time/1000)*tscale + x0*ppm );
    labframe.setX( v*ppm * (frame.time/1000)*tscale + x0*ppm - l0*ppm/2 );
}, motionLayer);

// Animate the photons
var animLabForwardPhoton = new Konva.Animation(function(frame) {
    labForwardPhoton.setX( c*ppm * (frame.time/1000)*tscale + x0*ppm );
}, motionLayer);

var animLabReversePhoton = new Konva.Animation(function(frame) {
    labReversePhoton.setX( -c*ppm * (frame.time/1000)*tscale + x0*ppm );
}, motionLayer);

var animMcrfForwardPhoton = new Konva.Animation(function(frame) {
    mcrfForwardPhoton.setX( c*ppm * (frame.time/1000)*tscale + x0*ppm );
}, motionLayer);

var animMcrfReversePhoton = new Konva.Animation(function(frame) {
    mcrfReversePhoton.setX( -c*ppm * (frame.time/1000)*tscale + x0*ppm );
}, motionLayer);


animLab.start();
animMcrfForwardPhoton.start();
animMcrfReversePhoton.start();
animLabForwardPhoton.start();
animLabReversePhoton.start();

