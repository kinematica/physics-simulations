var width = window.innerWidth;
var height = window.innerHeight;


// Set the style
stw = 2                     // stroke width

// Set scales
w = 80;                     // screen width, in m
ppm = width / w;            // pixels / m
tscale = 1e-8;              // timescale

//======================================================================
//                             PARAMETERS
//======================================================================
var b = {value: 0};       // Boost

// Set params (should be user adjustable soon)
c = 299792458;              // speed of light in m/s
v = b.value * c;                  // velocity
g = 1 / Math.sqrt(1-Math.pow(b.value,2));   // lorrentz factor gamma
l0 = 20;                    // train length
h0 = l0/4;                  // train height
l = l0 / g;                 // train length, lab frame
plank_sep = h0/2;           // rail plank seperatrion in LAB frame
x0 = width/2/ppm;           // starting x position
y1 = height/2/ppm - h0;     // y position for Train 1
y2 = height/2/ppm + h0;     // y position for Train 2
var started = false;        // START EXPERIMENT?

var photon = new Array();
var tracks = new Array();
var trains = new Array();
var detectors = new Array();

// 1 - Car seen in momentarily comoving reference frame
// 2 - Car seen from lab frame, that is, from outside

function initialize_positions(){

    tracks =    [{x: 0},
                 {x: 0}];

    trains =    [{x: x0, y:y1, w:l0, h:h0, v: 0, id: 'train1', info:'TRAIN REFERENCE FRAME'},
                 {x: x0, y:y2, w:l0, h:h0, v: v, id: 'train2', info:'GROUND REFERENCE FRAME'}];

    detectors = [{x: -l0/2, y:0, w: l0/50, h:l0/4, group: 'train1', id: 'left'},
                 {x:  l0/2, y:0, w: l0/50, h:l0/4, group: 'train1', id: 'right'},
                 {x: -l0/2, y:0, w: l0/50, h:l0/4, group: 'train2', id: 'left'},
                 {x:  l0/2, y:0, w: l0/50, h:l0/4, group: 'train2', id: 'right'}];

    photon = [{x:x0, y:y1, v: c, dir: -1, node: 'train1', bound1: 'left', bound2: 'right', name: 'photon0'},
              {x:x0, y:y1, v: c, dir:  1, node: 'train1', bound1: 'left', bound2: 'right', name: 'photon1'},
              {x:x0, y:y2, v: c, dir: -1, node: 'train2', bound1: 'left', bound2: 'right', name: 'photon2'},
              {x:x0, y:y2, v: c, dir:  1, node: 'train2', bound1: 'left', bound2: 'right', name: 'photon3'}];
};

initialize_positions();

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var staticLayer = new Konva.Layer();
var motionLayer = new Konva.Layer();
var sliderLayer = new Konva.Layer();
var buttonLayer = new Konva.Layer();


// FUNCTION FOR ADDING RAILS
function addRails(y, h) {
    lineUp = new Konva.Line({
        points: [0, (y+h/2)*ppm, width, (y+h/2)*ppm],
        stroke: '#666666',
        strokeWidth: stw
    });
    lineDown = new Konva.Line({
        points: [0, (y-h/2)*ppm, width, (y-h/2)*ppm],
        stroke: '#666666',
        strokeWidth: stw
    });
    staticLayer.add(lineUp);
    staticLayer.add(lineDown);
}

function addPlank(x, y, h, obj) {
    var plank = new Konva.Line({
        points: [x*ppm, (y-h/2)*ppm, x*ppm, (y+h/2)*ppm],
        stroke: '#393939',
        strokeWidth: 4*stw
    });
    obj.add(plank);
}

var plank_num = width/plank_sep/ppm*2.4;    //2.4 - max g-factor (~0.9c)
var planks = new Konva.Group({
    x: 0*ppm,
    y: y1*ppm
});
for (var n=0; n<=plank_num; n++) {
    addPlank(plank_sep*n, 0, h0*1.2, planks);
}
motionLayer.add(planks);
//Cache to image to save resources
planks.cache({
        x: 100,
        y: 100,
        width: width*2.4,
        height: h0*1.2*ppm,
        drawBorder: false
      });

for (var i = 0; i <= (trains.length-1); i++) {
    addRails(trains[i].y, trains[i].h);
    var planks = planks.clone({
        x: 0,
        y: trains[i].y*ppm,
        id: 'planks'+i
    });
    var rail_text = new Konva.Text({
        x: 0,
        y: (trains[i].y-trains[i].h*1.1)*ppm,
        fontFamily: 'Calibri',
        fontSize: trains[i].h*4,
        text: trains[i].info,
        fill: '#9f9f9f',
        padding: 5,
        align: 'left'
    });
    motionLayer.add(planks);
    staticLayer.add(rail_text);
}


// BUILD THE TRAINS WITH DETECTORS
(function() {
        var d=0;    //detector number
        for (var i = 0; i <= (trains.length-1); i++) {
            var train = new Konva.Group({
                x: trains[i].x*ppm,
                y: trains[i].y*ppm,
                id: trains[i].id
            });
            var body = new Konva.Rect({
                offset: {x: trains[i].w/2*ppm, y: trains[i].h/2*ppm},
                width: trains[i].w*ppm,
                height: trains[i].h*ppm,
                cornerRadius: 2,
                fill: '#1e1e1e',
                stroke: 'white',
                strokeWidth: stw,
                id: trains[i].id+'body',
            });
            var lamp = new Konva.Circle({
                radius: trains[i].w/30*ppm,
                fill: '#3f3f00',
                shadowColor: '#515100',
                shadowBlur: 20,
                shadowOffset: {x : 0, y : 0},
                shadowOpacity: 0.5,
                id: 'lamp'+i
            });
            lamp.tween = new Konva.Tween({
                    node: lamp,
                    fill: 'yellow',
                    easing: Konva.Easings.StrongEeaseIn,
                    duration: 0.2
            });
            train.add(body);
            train.add(lamp);
            for (var j = 0; j <= 1; j++) {
                var detector = new Konva.Rect({
                    x: detectors[d].x*ppm,
                    y: detectors[d].y*ppm,
                    width: detectors[d].w*ppm,
                    height: detectors[d].h*ppm,
                    cornerRadius: 2,
                    offset: {x: detectors[d].w/2*ppm, y: detectors[d].h/2*ppm},
                    fill: '#ffffff',
                    stroke: 'white',
                    strokeWidth: stw,
                    id: String(detectors[d].group + detectors[d].id)
                });
                detector.tween = new Konva.Tween({
                    node: detector,
                    // scaleX: 1.1,
                    fill: '#ff0000',
                    easing: Konva.Easings.EaseOut,
                    duration: 0.01
                });
                train.add(detector);
                d++;
            }
            motionLayer.add(train);
        }
})();


// ADD PHOTONS TO LAYERS
function buildPhotons(start) {
    if (!start) start=0;
    for (var i = start; i <= (photon.length-1); i++) {
        var node = new Konva.Circle({
            x: photon[i].x*ppm,
            y: photon[i].y*ppm,
            radius: l0/60*ppm,
            fill: 'yellow',
            shadowColor: '#ffff00',
            shadowBlur: 20,
            shadowOffset: {x : 0, y : 0},
            shadowOpacity: 0.5,
            id: String(photon[i].name),
        });
        motionLayer.add(node);
    };
}
function destroyPhotons() {
    for (var i = 0; i <= (photon.length-1); i++) {
        var node = motionLayer.find("#"+photon[i].name)[0];
        node.remove();
    };
}

buildPhotons();
//======================================================================
//                          LET'S MAKE CONTROLS
//======================================================================

//WHAT TO DO WHEN PARAMETERS CHANGE
function updateMotion(){
    v = b.value * c;
    g = 1 / Math.sqrt(1-Math.pow(b.value,2));   // lorrentz factor gamma
    l = l0 / g;

    trains[1].v = v;
    motionLayer.find("#planks0")[0].setScaleX(1/g);
    motionLayer.find("#train2body")[0].setWidth(l*ppm);
    motionLayer.find("#train2body")[0].setOffset({x:l*ppm/2, y:trains[1].h/2*ppm});
    motionLayer.find("#train2left")[0].setX(-l*ppm/2);
    motionLayer.find("#train2right")[0].setX(l*ppm/2);
    // graphLayer.find('#hal9000ID').fill('#a5ff80');
}

function lightsout(){
    motionLayer.find("#lamp0")[0].tween.reverse();
    motionLayer.find("#lamp1")[0].tween.reverse();
}

makeSlider(b, updateMotion, 0, 0.9, '', width/2, 100, 200, 'Train Speed (units of c):', "sliderVelocity", '#7cff55', 'passive');

// RESET BUTTON
makeLabel('add', 'Emit', 20, '#ffeb32', '#484848', 0.9, 80, 50, width/2-250, 100, buttonLayer);
makeLabel('reset', 'Go', 20, '#bdbdbd', '#484848', 0.9, 80, 50, width/2-150, 100, buttonLayer);
buttonLayer.find('.reset').on('mousedown touchstart', function() {
    if (!started) {
        motionLayer.find("#lamp0")[0].tween.play();
        motionLayer.find("#lamp1")[0].tween.play();
        this.find('Text')[0].text('Reset');
        this.find('Rect').fill('#323232');
        setTimeout(lightsout, 200);
        // lightsout();
        anim.start();
        started = true;
    } else {
        anim.stop();
        destroyPhotons();
        initialize_positions();
        buildPhotons();
        updateMotion();
        // for (var i = 0; i <= (photon.length-1); i++) {
        //     var node = motionLayer.find("#"+photon[i].name)[0];
        //     // node.setOpacity(1);
        //     node.setX(photon[i].x*ppm);
        // }
        motionLayer.find("#lamp0")[0].tween.play();
        motionLayer.find("#lamp1")[0].tween.play();
        setTimeout(lightsout, 200);
        anim.start();
    }
});
buttonLayer.find('.add').on('mousedown touchstart', function() {
        // anim.stop();
        n = photon.length;
        photon.push([{x:x0, y:y1, v: c, dir: -1, node: 'train1', bound1: 'left', bound2: 'right', name: 'photon'+n},
                     {x:x0, y:y1, v: c, dir:  1, node: 'train1', bound1: 'left', bound2: 'right', name: 'photon'+(n+1)},
                     {x:x0, y:y2, v: c, dir: -1, node: 'train2', bound1: 'left', bound2: 'right', name: 'photon'+(n+2)},
                     {x:x0, y:y2, v: c, dir:  1, node: 'train2', bound1: 'left', bound2: 'right', name: 'photon'+(n+3)}]);
        buildPhotons(n);
});

// STAGE EVERYTHING
stage.add(staticLayer);
stage.add(motionLayer);
stage.add(sliderLayer);
stage.add(buttonLayer);

// ANIMATE
var anim= new Konva.Animation(function(frame) {
    var time = frame.time,
        timeDiff = frame.timeDiff,
        frameRate = frame.frameRate;

    var final_index = photon.length-1;
    var i = 0;
    // for (var i = 0; i <= final_index; i++) {
    while ( i <= final_index) {
        // var node = motionLayer.find("#photon"+i)[0];
        var node = motionLayer.find("#"+photon[i].name)[0];
        // console.log(photon[i].name);
        var nodeBound1 = motionLayer.find("#"+photon[i].node+photon[i].bound1)[0];
        var nodeBound2 = motionLayer.find("#"+photon[i].node+photon[i].bound2)[0];
        var boundX1 = nodeBound1.getAbsolutePosition().x;
        var boundX2 = nodeBound2.getAbsolutePosition().x;

        // node.setX((node.x() <= boundX1) ? boundX1 : ((node.x() >= boundX2) ? boundX2 : next_pos) );

        if (node.x() <= boundX1){
            // node.setOpacity(0);
            // motionLayer.find("#"+photon[i].node+photon[i].bound1)[0].tween.play();
            motionLayer.find("#"+photon[i].node+photon[i].bound1)[0].setFill('#ff0000');
            photon.splice(i,1);
            i--;;
            final_index--;;
            node.remove();
        }
        else if (node.x() >= boundX2){
            // node.setOpacity(0);
            // motionLayer.find("#"+photon[i].node+photon[i].bound2)[0].tween.play();
            motionLayer.find("#"+photon[i].node+photon[i].bound2)[0].setFill('#3bb1ff');
            photon.splice(i,1);
            i--;;
            final_index--;;
            node.remove();
        }
        else {
            photon[i].x = photon[i].x + photon[i].v * photon[i].dir * (timeDiff/1000)*tscale;
            node.setX(photon[i].x*ppm);
        }
        i++

    };

    for (var i = 0; i <= (trains.length-1); i++) {
        var node = motionLayer.find("#train"+(i+1))[0];
        trains[i].x = trains[i].x + trains[i].v * (timeDiff/1000)*tscale;
        node.setX( trains[i].x*ppm);
    }

    //MOVE THE TRACKS (IN THE TRAIN FRAME)
    tracks[0].x = tracks[0].x + (-1)*v*(timeDiff/1000)*tscale;
    if (tracks[0].x <= -plank_sep/g) tracks[0].x = 0;
    motionLayer.find("#planks0")[0].setX(tracks[0].x*ppm);

}, motionLayer);