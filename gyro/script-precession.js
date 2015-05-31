//==============================================================================
//                                  PHYSICS
//==============================================================================
if (width<500) width = 500;

var R = width/10; //RADIUS OF THE GYRO
if (R < 100) R = 100;
// if (R > 250) R = 250;
if (R*1.2 > width/2) R = Math.round(width/2.5);

var wS = {value: 3};  //GYRO ANGULAR VELOCITY
var IS = {value: 1};  //GYRO MOMENT OF INERTIA
var L = {value: IS.value*wS.value, scale: 15};  //ANGULAR MOMENTUM
var Mass = {value: 10, initial: 50, scale: 1};   //GYRO MASS
var wP = {value: (Mass.initial+Mass.value)*0.05 / (IS.value * wS.value)}; //PRECESSION ANGULAR VELOCTY

var angle = {value: 0, initial: 0, value2: 0, initial2: 0}; //ANGLE OF THE PROCESSION POSITION


//----------------------------------VISUALS-------------------------------------

var viewScale = {value: 0.2}; //SCALE PARAMETER TO SHOW THINGS SMALLER AS THEY'RE AWAY
var viewPerspective = {value: 0.1}; //SLANT PARAMETER TO GET SOME PERSPECTIVE


var controls1 = {x:width/2-180, y:70, w:150};
var controls2 = {x:width/2+80, y:70, w:150};

var speedColour = {up: "#8cff69", down: "#ff8268", opacity: "0.5"};
var colours = {bg: "#313131", poleTop: "#acacac", poleBottom: "#919191",
                stroke: "#737373", shadow: "#1f1f1f",
                text: "#ffffff"};
var fonts = "Calibri";

Konva.angleDeg = false; //WE'RE GOING TO WORK IN RADIANS HERE...

//IMAGE SOURCES
var sources = {
  gyro: "img/gyro.png",
  fill: "img/fill2.png"
};

//==============================================================================
//                         INITIATE STAGE AND LAYERS
//==============================================================================

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var staticLayer = new Konva.Layer();
var motionLayer = new Konva.Layer();
var sliderLayer = new Konva.Layer();
var buttonLayer = new Konva.Layer();

//==============================================================================
//                                BUILD THE SCENE
//==============================================================================

//IMAGE LOADER (DO THIS FIRST BEFORE PROCESSING SCENE)
function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}

//WHAT TO DO WITH THE LOADED IMAGES
function draw(images) {
  var wheel = new Konva.Image({
      x: 0,
      y: 0,
      image: images.gyro,
      width: 2*R,
      height: 2*R,
      offset: {x: R, y:R},
      id: 'wheel',
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
      stroke: '#ffffff',
      strokeWidth: 8,
      id: 'wheelRim',
      opacity: 0.5
    });

    var weight = new Konva.Rect({
      x: width/2,
      y: height/2,
      width: 20,
      height: Mass.value*Mass.scale,
      offset: {x: +20, y:-30},
      cornerRadius: 5,
      fillPatternImage: images.fill,
      stroke: '#affffe',
      opacity: 0,
      id: 'weight'
    });

    motionLayer.add(wheelGroup);
    motionLayer.add(wheelRim);
    motionLayer.add(weight);

    //NOW WE CAN BUILD THE REST OF THE SCENE
    buildScene();

    //EVERYTHING'S LOADED - CAN START ANIMATION
    anim.start();

    updateMotion();
}

//LOAD ALL THE IMAGES AND CALL THE SCENE DRAWING FUNCTIONS WITH IT
loadImages(sources, function(images) {
  draw(images);
});

function buildScene() {
    var motionPath = new Konva.Line({
      points: [],
      stroke: 'white',
      strokeWidth: 2,
      lineJoin: 'round',
      dash: [10, 10],
      lineCap: 'round',
      tension : 0.3,
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

    var weightString = new Konva.Line({
      points: [-10, 0, -10, 30],
      stroke: '#ffdb8b',
      strokeWidth: 1,
      lineCap: 'round',
      opacity: 0,
      id: 'weightString'
    });

    var string = new Konva.Line({
      points: [width/2, height/2-1*R, width/2, height/2],
      stroke: '#ffdb8b',
      strokeWidth: 1,
      lineCap: 'round',
      tension : 0.5,
      shadowColor: "#ffdb8b",
      shadowBlur: 5,
      shadowOpacity: 0.8,
      id: 'string'
    });

    var arrowW = new Konva.Arrow({
      points: [0, 0, 0, (Mass.initial+Mass.value)*Mass.scale],
      pointerLength: 15,
      pointerWidth : 15,
      // fill: '#00ff1a',
      stroke: '#00ff1a',
      strokeWidth: 5,
      opacity: 0.6,
      shadowColor: "#00ff1a",
      shadowBlur: 5,
      shadowOpacity: 0.8,
      id: 'arrowWmain'
    });
    var arrowWText = new Konva.Text({
      x: 0,
      y: (Mass.initial+Mass.value)*Mass.scale,
      offset: {x:15, y:0},
      text: 'W',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: '#00ff1a',
      id: 'arrowWText',
    });
    var arrowWGroup = new Konva.Group({
      x: 0,
      y: 0,
      id: 'arrowW'
    });
    arrowWGroup.add(arrowW, arrowWText);

    var arrowL = new Konva.Arrow({
      points: [0, 0, -1.3*R, 0],
      pointerLength: 15,
      pointerWidth : 15,
      stroke: '#0094ff',
      strokeWidth: 5,
      opacity: 0.6,
      shadowColor: "#0094ff",
      shadowBlur: 5,
      shadowOpacity: 0.8,
      id: 'arrowLmain'
    });
    var arrowLText = new Konva.Arrow({
      x: 0,
      y: 0,
      offset: {x:15, y:15},
      text: 'L',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: '#0094ff',
      id: 'arrowLText'
    });
    var arrowT = new Konva.Arrow({
      points: [0, 0, -(Mass.initial+Mass.value)*Mass.scale, 0],
      pointerLength: 15,
      pointerWidth : 15,
      // fill: 'white',
      // fill: '#ff0059',
      stroke: '#ff0059',
      strokeWidth: 5,
      opacity: 0.6,
      shadowColor: "#ff0059",
      shadowBlur: 5,
      shadowOpacity: 0.8,
      id: 'arrowTmain'
    });
    var arrowTText = new Konva.Text({
      x: -(Mass.initial+Mass.value)*Mass.scale-10,
      y: 0,
      offset: {x:15, y:15},
      text: 'T',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: '#ff0059',
      id: 'arrowTText'
    });
    var arrowTGroup = new Konva.Group({
      x: 0,
      y: 0,
      id: 'arrowT'
    });
    arrowTGroup.add(arrowT, arrowTText);

    var console = new Konva.Text({
      x: 20,
      y: 20,
      text: '',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'white',
      id: 'console'
    });

    // motionLayer.add(console);
    motionLayer.add(motionPath);
    motionLayer.add(wheelAxis);
    motionLayer.add(string);
    motionLayer.add(weightString);
    motionLayer.add(arrowWGroup);
    motionLayer.add(arrowTGroup);
    motionLayer.add(arrowL);


    buildControls();

    stage.add(staticLayer);
    stage.add(motionLayer);
    stage.add(sliderLayer);
}

//==============================================================================
//                                    CONTROLS
//==============================================================================

function buildControls() {
    makeSlider(Mass, updateMotion, 0, 100, '', controls1.x, controls1.y, controls1.w, 'Additional Mass (g):', "sliderMass", '#00ff1a', 'passive');
    makeSlider(wS, updateMotion, 3, 10, '', controls2.x, controls2.y, controls2.w, 'Gyro Spin Rate (rad/s):', "sliderSpin", '#0094ff', 'passive');
}

//==============================================================================
//                           RECALCULATE PARAMETERS
//==============================================================================

function updateMotion(){
  var nodeArrowW = motionLayer.find("#arrowWmain")[0];
  var nodeArrowT = motionLayer.find("#arrowTmain")[0];
  var nodeArrowL = motionLayer.find("#arrowLmain")[0];
  var nodeArrowWText = motionLayer.find("#arrowWText")[0];
  var nodeArrowTText = motionLayer.find("#arrowTText")[0];
  var nodeWeight = motionLayer.find("#weight")[0];
  var nodeWeightString = motionLayer.find("#weightString")[0];

  //NEW ANGULAR MOMENTUM (L = MOMENT OF INERTIA x ANGULAR VELOCITY)
  L.value = IS.value * wS.value;

  //UPDATE THE PRECESSION ANGULAR VELOCITY
  //wP = (Mass * g * R) / (Inertia * Angular velocity of gyro);
  wP.value = (Mass.initial+Mass.value)*0.05 / (IS.value * wS.value)

  //UPDATE SOME VISUALS
  nodeArrowTText.x(-(Mass.initial+Mass.value)*Mass.scale-10);
  nodeArrowT.points([0, 0, -(Mass.initial+Mass.value)*Mass.scale, 0]);
  nodeArrowW.points([0, 0, 0, (Mass.initial+Mass.value)*Mass.scale]);
  nodeArrowWText.y((Mass.initial+Mass.value)*Mass.scale);
  nodeWeight.height(5+Mass.value*Mass.scale);
  nodeWeight.opacity((Mass.value>0) ? 1 : 0);
  nodeWeightString.opacity((Mass.value>0) ? 1 : 0);

  //SAVE THE CURRENT ANGLE SO THAT THE GYRO DOESN'T CHANGE POSITION
  angle.initial = angle.value;
  anim.frame.time=0;  //RESET THE ANIMATION TIME

}

//==============================================================================
//                                  ANIMATION
//==============================================================================

var anim = new Konva.Animation(function(frame) {
    var time = frame.time,
        timeDiff = frame.timeDiff,
        frameRate = frame.frameRate;

    //LET'S FIND ALL WE NEED IN THE MOTION LAYER
    var nodeGroup = motionLayer.find("#wheelGroup")[0];
    var nodeWheel = motionLayer.find("#wheel")[0];
    var nodeWheelRim = motionLayer.find("#wheelRim")[0];
    var nodeWheelAxis = motionLayer.find("#wheelAxis")[0];
    var nodeString = motionLayer.find("#string")[0];
    var nodeWeight = motionLayer.find("#weight")[0];
    var nodeWeightString = motionLayer.find("#weightString")[0];
    var nodePath = motionLayer.find("#path")[0];
    // var nodeCon = motionLayer.find("#console")[0];
    var nodeArrowW = motionLayer.find("#arrowW")[0];
    var nodeArrowT = motionLayer.find("#arrowT")[0];
    var nodeArrowL = motionLayer.find("#arrowLmain")[0];
    // var nodeArrowLbase = motionLayer.find("#arrowLbase")[0];
    // var nodeArrowWmain = motionLayer.find("#arrowWmain")[0];
    // var nodeArrowWText = motionLayer.find("#arrowWText")[0];

    angle.value = angle.initial + wP.value*time/1000;

    //FIND THE POSITION OF THE GYRO CENTER
    var posX = width/2 + R*Math.cos(angle.value);
    var posY = height/2 + viewPerspective.value*R*Math.sin(angle.value);
    //THIS IS ESSENTIALLY A SCALE PARAMETER TO MAKE THINGS LOOK SMALLER AS THEY'RE AWAY
    var scale = (1-viewScale.value)+viewScale.value*Math.sin(angle.value);

    //FIRST TRANSFORM PARAMETERS
    var scaleX = scale*1*Math.sin(angle.value);
    var scaleY = scale;

    //SECOND TRANSFORM PARAMETERS
    var scaleXRim = scale*1*Math.cos(angle.value);
    var scaleYRim = scale;

    //ROTATE THE GYRO AROUND IT'S AXIS (THIS IS NOT PRECESSION)
    nodeWheel.rotate(-wS.value*timeDiff/1000);

    //LOTS OF POSITIONING AND SCALING
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


    var x = posX-width/2;
    var y = height/2-posY;
    //THIS ANGLE IS ESSENTIALLY ANGLE.VALUE, BUT MORE PRECISE AFTER TRANSFORMS
    angle.value2 = angle.initial2+Math.atan(y / x * scaleXRim/scaleYRim);
    // angle.value2 = 0; //TO-DO: GET RID OF THIS REDUNDANT ANGLE

    //CALCULATE THE POSITION OF THE MOST OUTWARD POINT ON THE GYRO AXIS
    //    (ESSENTIALY R AWAY FROM ORIGIN, BUT WITH TRANSFORMS APPLIED)
    var EndX = posX + R*1.3*scaleXRim*Math.cos(angle.value2);
    var EndY = posY - R*1.3*scaleYRim*Math.sin(angle.value2);

    var LX = posX - L.value*L.scale*scaleXRim*Math.cos(angle.value2);
    var LY = posY + L.value*L.scale*scaleYRim*Math.sin(angle.value2);

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

    //THE L-VECTOR NEEDS TO BE DRAWN MORE CAREFULLY - IT'S ON HORIZONTAL AXIS
    nodeArrowL.points([posX, posY, LX, LY]);
    nodeWheelAxis.points([width/2, height/2, EndX, EndY]);

    //PATH OUTLINE OF PRECESSION
    if (nodePath.points().length>300) nodePath.getPoints().splice(0, 2); //TRASH FIRST POINT
    nodePath.points(nodePath.points().concat([posX, posY]));  //ADD NEW POINT

}, motionLayer);
