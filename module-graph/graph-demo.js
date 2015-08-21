//IMAGE SOURCES
var sources = {
  // bg: "img/fill.png",
};

var myGraph;


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
}

function init() {
  //LOAD ALL THE IMAGES AND CALL THE SCENE DRAWING FUNCTIONS WITH IT
  loadImages(sources, function(images) {
    draw(images);
  });

  buildScene();

  //EVERYTHING'S LOADED - CAN START ANIMATION
  anim.start();
}


function buildScene() {
    myGraph = new Kinematica.Graph({
        id: "mygraph",
        title: "Entropy",
        x: 100,
        y: 100,
        w: 400,
        h: 400,
        points: 200,
        xmin: 0,
        xmax: 10,
        ymin: 0,
        ymax: 10,
        lineSep: 40, //separation (in px) between helper graph lines
        xTicks: [2, 4, 6, 8],
        yTicks: [2, 4, 6, 8]
    });

    myGraph.getTicks();
    myGraph.addFunction();

    staticLayer.add(myGraph.BGnode);
    motionLayer.add(myGraph.node[0]);
    motionLayer.add(myGraph.node[1]);

    stage.add(staticLayer);
    stage.add(motionLayer);
    stage.add(sliderLayer);
    stage.batchDraw();
}

//==============================================================================
//                                  ANIMATION
//==============================================================================

var anim = new Konva.Animation(function(frame) {
    var time = frame.time,
        timeDiff = frame.timeDiff,
        frameRate = frame.frameRate;
    var points = [];
    var points2 = [];
    for (var i = 0; i < 100; i++) {
        points.push({x: i * 0.05, y: 2 + 2 * Math.sin(i * 3 / 10 + time / 1000 )});
        points2.push({x: i * 0.05, y: 3 + 3 * Math.sin(i * 1 / 10 + time / 1000 )});
    };
    // myGraph.draw(myGraph.mapToGraph(points), 0);

    myGraph.mapToGraph(points, 0);
    myGraph.mapToGraph(points2, 1);
    // myGraph.draw(points2, 1);
}, motionLayer);

init();