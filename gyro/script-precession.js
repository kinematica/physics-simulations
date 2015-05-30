var width = window.innerWidth;
var height = window.innerHeight;
//======================================================================
//                             PARAMETERS


// Set the style
stw = 2                     // stroke width

var wP = {value: 0.5};
var wS = {value: 2};
var Mass = {value: 1};

var started = false;        // HAVEN'T STARTED EXPERIMENT YET
var R = width/12;

var imgURL = 'img/gyro.png';

var speedColour = {up: "#8cff69", down: "#ff8268", opacity: "0.5"};
var colours = {bg: "#313131", poleTop: "#acacac", poleBottom: "#919191",
                stroke: "#737373", shadow: "#1f1f1f",
                text: "#ffffff"};
var fonts = "Calibri";
Konva.angleDeg = false; //WE'RE GOING TO WORK IN RADIANS HERE...



var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var staticLayer = new Konva.Layer();
var motionLayer = new Konva.Layer();
var sliderLayer = new Konva.Layer();
var buttonLayer = new Konva.Layer();

//======================================================================
//                            BUILD SCENE
//======================================================================

var imageObj = new Image();
imageObj.onload = function() {
    var wheel = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: 2*R,
      height: 2*R,
      offset: {x: R, y:R},
      id: 'wheel',
      shadowColor: colours.shadow,
      shadowBlur: 5,
      shadowOpacity: 0.3,
      opacity: 0.5
    });

    var wheelGroup = new Konva.Group({
      x: width/2,
      y: height/2,
      id: 'wheelGroup'
    });
    wheelGroup.add(wheel);

    var wheelRim = new Konva.Circle({
      x: width/2,
      y: height/2,
      radius: R,
      // offset: {x: R, y:R},
      // shadowColor: colours.shadow,
      // shadowBlur: 5,
      // shadowOpacity: 0.3,
      // fill: 'red',
      stroke: '#ffffff',
      strokeWidth: 8,
      id: 'wheelRim',
      opacity: 0.5
    });

    // add the shape to the layer
    motionLayer.add(wheelGroup);
    motionLayer.add(wheelRim);


    // line.getPoints()[0].splice(index, 1);
    // var points = motionPath.points();

    anim.start();

    // wheel.on('mousedown touchmove', function() {
    //   var PointerPos = stage.getPointerPosition();
    //   var nodeCon = motionLayer.find("#console")[0];
    //   nodeCon.text("X: " + PointerPos.x + " Y: " + PointerPos.y);
    //   motionLayer.draw();
    //   });
};
imageObj.src = imgURL ;


var motionPath = new Konva.Line({
  points: [],
  stroke: 'white',
  strokeWidth: 2,
  lineJoin: 'round',
  dash: [20, 10],
  lineCap: 'round',
  tension : 0.5,
  id: 'path'
});

var wheelAxis = new Konva.Line({
  points: [],
  stroke: 'white',
  strokeWidth: 4,
  lineCap: 'round',
  tension : 0.5,
  id: 'wheelAxis'
});

var weight = new Konva.Rect({
  x: width/2,
  y: height/2,
  width: 20,
  height: 30,
  offset: {x: +20, y:-30},
  cornerRadius: 5,
  // fill: "#adffe6",
  // fillPatternImage: "img/gyro.png",
  stroke: '#affffe',
  opacity: 1,
  id: 'weight'
});

var weightString = new Konva.Line({
  points: [-10, 0, -10, 30],
  stroke: '#ffdb8b',
  strokeWidth: 1,
  lineCap: 'round',
  id: 'weightString'
});

var string = new Konva.Line({
  points: [width/2, 0, width/2, height/2],
  stroke: '#ffdb8b',
  strokeWidth: 1,
  lineCap: 'round',
  tension : 0.5,
  id: 'string'
});

var arrowW = new Konva.Arrow({
  points: [-10, 0, -10, 80],
  pointerLength: 15,
  pointerWidth : 15,
  // fill: 'white',
  stroke: '#00ff1a',
  strokeWidth: 3,
  opacity: 0.5,
  id: 'arrowW'
});
var arrowT = new Konva.Arrow({
  points: [0, 0, -1.3*R, 0],
  pointerLength: 15,
  pointerWidth : 15,
  // fill: 'white',
  stroke: '#ff0059',
  strokeWidth: 3,
  opacity: 0.8,
  id: 'arrowT'
});
var arrowL = new Konva.Arrow({
  points: [0, 0, -1.3*R, 0],
  pointerLength: 15,
  pointerWidth : 15,
  // fill: 'white',
  stroke: '#0094ff',
  strokeWidth: 3,
  opacity: 0.8,
  id: 'arrowL'
});

motionLayer.add(motionPath);
motionLayer.add(wheelAxis);
motionLayer.add(string);
motionLayer.add(weight);
motionLayer.add(weightString);
motionLayer.add(arrowW);
motionLayer.add(arrowT);
motionLayer.add(arrowL);

var console = new Konva.Text({
      x: 20,
      y: 20,
      text: '<CONSOLE>',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'white',
      id: 'console'
    });
motionLayer.add(console);

//======================================================================
//                          LET'S MAKE CONTROLS
//======================================================================

makeSlider(Mass, updateMotion, 0, 100, '', width/2, 100, 200, 'Hanging Mass:', "sliderMass", '#b0ffe7', 'passive');
// makeSlider(wP, updateMotion, 0.1, 2, '', width/2, 100, 200, 'Angular Velocity:', "sliderVelocity", '#7cff55', 'passive');
makeSlider(wS, updateMotion, 2, 10, '', width/2, 200, 200, 'Spin Rate:', "sliderSpin", '#7cff55', 'passive');

// // RESET BUTTON
// makeLabel('reset', 'Reset', 20, '#bdbdbd', '#484848', 0.9, 80, 50, width/2-150, 100, buttonLayer);
// buttonLayer.find('.reset').on('mousedown touchstart', function() {
//         anim.stop();
//         destroyPhotons();
//         initializePositions();
//         buildPhotons();
//         updateMotion();
//         lightsOut();
//         setTimeout(lightsOut, 200);
//         anim.start();
// });

//======================================================================
//                      ANIMATION/PARAMETER UPDATE
//======================================================================

function updateMotion(){
  wP.value = 0.5+Mass.value/100 + wS.value/10;
}

//======================================================================
//                                STAGE READY
//======================================================================
stage.add(staticLayer);
stage.add(motionLayer);
stage.add(sliderLayer);
// stage.add(buttonLayer);


//======================================================================
//                                  ANIMATION
//======================================================================

var anim= new Konva.Animation(function(frame) {
    var time = frame.time,
        timeDiff = frame.timeDiff,
        frameRate = frame.frameRate;

    var nodeGroup = motionLayer.find("#wheelGroup")[0];
    var nodeWheel = motionLayer.find("#wheel")[0];
    var nodeWheelRim = motionLayer.find("#wheelRim")[0];
    var nodeWheelAxis = motionLayer.find("#wheelAxis")[0];
    var nodeString = motionLayer.find("#string")[0];
    var nodeWeight = motionLayer.find("#weight")[0];
    var nodeWeightString = motionLayer.find("#weightString")[0];
    var nodePath = motionLayer.find("#path")[0];
    var nodeCon = motionLayer.find("#console")[0];
    var nodeArrowW = motionLayer.find("#arrowW")[0];
    var nodeArrowT = motionLayer.find("#arrowT")[0];
    var nodeArrowL = motionLayer.find("#arrowL")[0];

    var posX = width/2+R*Math.cos(wP.value*time/1000);
    var posY = height/2+0.1*R*Math.sin(wP.value*time/1000);

    var scaleX = (0.8+0.2*Math.sin(wP.value*time/1000))*1*Math.sin(wP.value*time/1000);
    var scaleY = 0.8+0.2*Math.sin(wP.value*time/1000);

    var scaleXRim = (0.8+0.2*Math.sin(wP.value*time/1000))*1*Math.cos(wP.value*time/1000);
    var scaleYRim = 0.8+0.2*Math.sin(wP.value*time/1000);

    nodeWheel.rotate(wS.value*timeDiff/1000);

    nodeGroup.scale({
      x: scaleX,
      y: scaleY
    });

    nodeWheelRim.scale({
      x: scaleXRim,
      y: scaleYRim
    });

    nodeGroup.position({
      x: posX,
      y: posY
    });

    nodeWheelRim.position({
      x: posX,
      y: posY
    });

    nodeWeight.scale({
      x: scaleXRim,
      y: scaleYRim
    });

    nodeWeightString.scale({
      x: scaleXRim,
      y: scaleYRim
    });
    nodeArrowW.scale({
      x: scaleXRim,
      y: scaleYRim
    });
    nodeArrowT.scale({
      x: scaleX,
      y: scaleY
    });
      nodeArrowT.scale({
      x: scaleX,
      y: scaleY
    });

    if (nodePath.points().length>100) nodePath.getPoints().splice(0, 2);

    var x = posX-width/2;
    var y = height/2-posY;
    var length = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    //GET THE ANGLE CORRESPONDING TO THE MOUSE POSITION & ROTATE
    var angle = Math.atan(y / x * scaleXRim/scaleYRim);
    if (x < 0) angle += 2*Math.PI;

    var EndX = posX + R*1.3*scaleXRim*Math.cos(angle);
    var EndY = posY - R*1.3*scaleYRim*Math.sin(angle);

    var LX = posX - R*1.3*scaleXRim*Math.cos(angle);
    var LY = posY + R*1.3*scaleYRim*Math.sin(angle);

    // var centerX = posX + length*Math.cos(angle);
    // var centerY = posY - length*Math.sin(angle);


    nodeWeight.height(Mass.value*2);
    nodeWeight.position({
      x: EndX,
      y: EndY
    });
    nodeWeightString.position({
      x: EndX,
      y: EndY
    });
    nodeArrowW.position({
      x: posX,
      y: posY
    });
    nodeArrowT.position({
      x: posX,
      y: posY
    });

    nodeArrowL.points([posX, posY, LX, LY]);
    nodeWheelAxis.points([width/2, height/2, EndX, EndY]);
    nodePath.points(nodePath.points().concat([posX, posY]));



}, motionLayer);
