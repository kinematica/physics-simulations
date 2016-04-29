

//////////////////////////////////////////////
// THIS SCRIPT WILL DEMONSTRATE THE BASIC   //
// PRINICPLES INTERFEROMETRY. USERS WILL BE //
// ABLE TO ALTER THE PATH LENGTH OF ONE OR  //
// BOTH ARMS OF A MICHELSON INTERFEROMETER  //
// AND OBSERVE THE CHANGE IN THE RESULTING  //
// INTERFERENCE PATTERN.                    //
//////////////////////////////////////////////



//////////////////////////////////////////////
//         WINDOW SIZE FUNCTIONS            //
//////////////////////////////////////////////

// First create the fullWidth and fullHeight functions

var fullWidth = function(){
	return window.innerWidth;
};

var fullHeight = function(){
	return window.innerHeight;
};

// Set the fullHeight and fullWidth variables
// so that the dimensions stay the same even 
// if the screen size changes
var fullW = fullWidth();

var fullH = fullHeight();

/////////////////////////////////////////////
//       GUI PARAMETERS AND CONTROLS       //
/////////////////////////////////////////////


// These will be the parameters populaing the gui. 
// We only want to change the two path lengths of
// the interferometer.
var params = {

	// Change in length of path one in nm. 
	deltaPathOne: 0,

	// Change in length of path two in nm.
	deltaPathTwo: 0

};

var gui = new dat.GUI();

gui.add(params, 'deltaPathOne', 0, 316);

gui.add(params, 'deltaPathTwo', 0, 316);





/////////////////////////////////////////////
//       KONVA STUFF - INTERFEROMETER      //
/////////////////////////////////////////////


// Create the Konva stage and layers

var stage = new Konva.Stage({
	container: 'container',
	width: fullWidth(),
	height: fullHeight()
});

// This layer will contain anything that doesn't move
// like the source and the beam splitter
var staticLayer = new Konva.Layer();

// This layer will contain anything that moves like
// the laser beams and the mirrors
var dynamicLayer = new Konva.Layer();


// Create all the STATIC OBJECTS in the demo

// Source beam
var beamSource = new Konva.Arrow({
	
	// x and y are the origins of the arrow. 
	x: fullW / 8,
      	y: fullH / 1.5,

	// These points are the trajectory of the line. 0,0 is the same 
	// as the x and y points above. If you put 0,0 as the first two 
	// points the line will start where you specify in x and y. All
	// points entered here are relative to those origin points.
      	points: [0, 0, 500, 0],
      	pointerLength: 10,
      	pointerWidth : 5,
      	fill: 'red',
      	stroke: 'red',
	opacity: 1,
      	strokeWidth: 2
});

// Source
var source = new Konva.Rect({

	x: (fullW / 8) - 100,
	y: fullH / 1.5 - 25,
	width: 200,
	height: 50,
	// Grey fill
	fill: '#a7a7a7',
	stroke: 'black',
	srokeWidth: 1
});

// Source text
var sourceText = new Konva.Text({
	x: (fullW / 8) - 90,
	y: (fullH / 1.5) - 20,
	fontfamily: 'Calibri',
	fontSize: 40,
	fontStyle: 'bold',
	fill: 'black',
	opacity: 0.75,
	text: 'SOURCE'
});

// Beam splitter
var splitter = new Konva.Rect({

	x: (fullW / 8) + 500,
	y: (fullH / 1.5) - 20,
	width: 100,
	height: 10,
	// Light blue fill to give appearance of glass
	fill: '#AEEEEE',
	stroke: '#AEEEEE',
	strokeWidth: 1
});

// Rotate the splitter 45 degrees 
splitter.rotate(45);

// Recombined beam
var beamRecombined = new Konva.Arrow({

	// Add 5 more to the x correction to make sure the beam looks like it 
	// is coming right off of the splitter.
	x: (fullW / 8) + 545,
	y: fullH / 1.5 + 40,

	points: [0, 0, 0, 75],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// Photodiode
var diode = new Konva.Rect({
	x: (fullW / 8) + 480,
	y: fullH / 1.5 + 115,

	width: 110,
	height: 25,
	fill: '#a7a7a7',
	stroke: 'black',
	srokeWidth: 1
});

// Photodiode Text
var diodeText = new Konva.Text({
	x: (fullW / 8) + 485,
	y: (fullH / 1.5) + 119,
	fontFamily: 'Calibri',
	fontSize: 18,
	fontStyle: 'bold',
	fill: 'black',
	opacity: 0.75,
	text: 'PHOTODIODE'
});

// Now for the parts that will move and change size

// First split beam travelling outward
var beamOneOut = new Konva.Arrow({

	x: (fullW / 8) + 512,
	y: (fullH / 1.5) - 10,

	points: [0, 0, 0, -500],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// First split beam travelling outward that will not move. This
// is so that when the user changes the path lengths no gaps
// appear in the beams themselves.
var beamOneOutStatic = new Konva.Arrow({

	x: (fullW / 8) + 512,
	y: (fullH / 1.5) - 10,

	points: [0, 0, 0, -250],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// First path text label
var pathOneText = new Konva.Text({
	x: (fullW / 3),
	y: (fullH / 3),
	fontFamily: 'Calibri',
	fontSize: 40,
	fontStyle: 'bold',
	opactity: 0.75,
	fill: 'red',
	text: 'Path 1'
});


// Second split beam travelling outward - has the same origin as beamOne
var beamTwoOut = new Konva.Arrow({

	x: (fullW / 8) + 512,
	y: (fullH / 1.5) - 10,

	points: [0, 0, 500, 0],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// Second split beam travelling outward that will not move
var beamTwoOutStatic = new Konva.Arrow({

	x: (fullW / 8) + 512,
	y: (fullH / 1.5) - 10,

	points: [0, 0, 250, 0],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// Second path text label
var pathTwoText = new Konva.Text({
	x: (fullW / 2),
	y: (fullH / 1.4),
	fontFamily: 'Calibri',
	fontSize: 40,
	fontStyle: 'bold',
	opactity: 0.75,
	fill: 'red',
	text: 'Path 2'
});



// First mirror
var mirrorOne = new Konva.Rect({

	x: (fullW / 8) + 490,
	y: (fullH / 1.5) - 520,
	width: 100,
	height: 10,
	fill: '#AEEEEE',
	stroke: '#AEEEEE',
	strokeWidth: 1
});

// Second mirror
var mirrorTwo = new Konva.Rect({

	x: (fullW / 8) + 1015,
	y: (fullH / 1.5) - 30,
	width: 10,
	height: 100,
	fill: '#AEEEEE',
	stroke: '#AEEEEE',
	strokeWidth: 1
});

// First split beam travelling back that will not move
var beamOneBackStatic = new Konva.Arrow({

	x: (fullW / 8) + 545,
	y: (fullH / 1.5) - 509,

	points: [0, 0, 0, 528],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// First split beam travelling back
var beamOneBack = new Konva.Arrow({

	x: (fullW / 8) + 545,
	y: (fullH / 1.5) - 509,

	points: [0, 0, 0, 264],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// Second split beam travelling back that will not move
var beamTwoBackStatic = new Konva.Arrow({

	x: (fullW / 8) + 1014,
	y: (fullH / 1.5) + 22,

	points: [0, 0, -465, 0],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});

// Second split beam travelling back
var beamTwoBack = new Konva.Arrow({

	x: (fullW / 8) + 1014,
	y: (fullH / 1.5) + 22,

	points: [0, 0, -232, 0],
	pointerLength: 10,
	pointerWidth: 5,
	fill: 'red',
	stroke: 'red',
	opacity: 1,
	strokeWidth: 2
});



///////////////////////////////////////////
//   KONVA STUFF - INTERFERENCE PATTERN  //
///////////////////////////////////////////

// There are four interference bands. At the start of the demo
// only three will be visible and there will be darkness in the
// center of the pattern, since LIGO maintains destructive int.
// unless it detects something. The central band will become visible
// when any amount of net path difference is introduced by the user.

// Central band
var interferenceOne = new Konva.Circle({

	x: (fullW / 1.25),
	y: (fullH / 1.25),
	radius: 0,

	// Here we control the radial color pattern of the circle (or arcs, below). Set the start
	// and end points to 0. The start and end radii are what determines how far our the pattern
	// goes within the circle. Always set them equal to the inner and outer radii of the circle
	// or arc.
	fillRadialGradientStartPoint: 0,
	fillRadialGradientStartRadius: 0,
	fillRadialGradientEndPoint: 0,
	fillRadialGradientEndRadius: 5,

	// The center of this circle is assigned #990000, a light red, instead of transparent. This is
	// because a transparent center gives the appearance of another region  of destructive interference.
	// The outer edge can be transparent since we do want a dark band between this light band and the next.
	fillRadialGradientColorStops: [0, '#990000', 0.35, 'red', 0.45, 'red', 1, 'transparent']
});

// Second band
var interferenceTwo = new Konva.Arc({

	x: (fullW / 1.25),
	y: (fullH / 1.25),
	innerRadius: 0,
	outerRadius: 20,
	angle: 360,
	fillRadialGradientStartPoint: 0,
	fillRadialGradientStartRadius: 0,
	fillRadialGradientEndPoint: 0,
	fillRadialGradientEndRadius: 20,
	
	// There are two red settings to ensure that the center of the band is amply red and does
	// not fade too quickly. 
	fillRadialGradientColorStops: [0, 'transparent', 0.35, 'red', 0.55, 'red', 1, 'transparent']
});

// Third band
var interferenceThree = new Konva.Arc({

	x: (fullW / 1.25),
	y: (fullH / 1.25),
	innerRadius: 20,
	outerRadius: 36,
	angle: 360,
	fillRadialGradientStartPoint: 0,
	fillRadialGradientStartRadius: 20,
	fillRadialGradientEndPoint: 0,
	fillRadialGradientEndRadius: 36,
	fillRadialGradientColorStops: [0, 'transparent', 0.35, 'red', 0.55, 'red', 1, 'transparent']
});

// Outermost band
var interferenceFour = new Konva.Arc({

	x: (fullW / 1.25),
	y: (fullH / 1.25),
	innerRadius: 36,
	outerRadius: 47,
	angle: 360,
	fillRadialGradientStartPoint: 0,
	fillRadialGradientStartRadius: 36,
	fillRadialGradientEndPoint: 0,
	fillRadialGradientEndRadius: 47,
	fillRadialGradientColorStops: [0, 'transparent', 0.35, 'red', 0.55, 'red', 1, 'transparent']
});


// Add every object to its proper layer
staticLayer.add(beamSource);
staticLayer.add(source);
staticLayer.add(sourceText);
staticLayer.add(splitter);
staticLayer.add(beamRecombined);
staticLayer.add(diode);
staticLayer.add(diodeText);
staticLayer.add(beamOneOutStatic);
staticLayer.add(beamTwoOutStatic);
staticLayer.add(beamOneBackStatic);
staticLayer.add(beamTwoBackStatic);
staticLayer.add(pathOneText);
staticLayer.add(pathTwoText);

dynamicLayer.add(beamOneOut);
dynamicLayer.add(beamTwoOut);
dynamicLayer.add(mirrorOne);
dynamicLayer.add(mirrorTwo);
dynamicLayer.add(beamOneBack);
dynamicLayer.add(beamTwoBack);
dynamicLayer.add(interferenceOne);
dynamicLayer.add(interferenceTwo);
dynamicLayer.add(interferenceThree);
dynamicLayer.add(interferenceFour);

// Add both layers to the stage
stage.add(staticLayer);
stage.add(dynamicLayer);



//////////////////////////////////////
//             ANIMATION            //
//////////////////////////////////////

// This variable will store the net path difference during use. This is the only
// important variable as far as determining the resultant interferece pattern.
var pathDiff;

var anim = new Konva.Animation( function(frame) {

	// First we need to determine the net path difference 
	// between path one and path two. Use absolute value because
	// the different should always have a positive sign.
	pathDiff = Math.abs(params.deltaPathOne - params.deltaPathTwo);
	
	// Allow all of the mirrors and non-static beams to be
	// altered by the GUI in real time
	mirrorOne.y( (fullH / 1.5) - 520 - params.deltaPathOne/10);
	beamOneOut.y( (fullH / 1.5) - 10 - params.deltaPathOne/10);
	beamOneBack.y( (fullH / 1.5) - 509 - params.deltaPathOne/10);

	mirrorTwo.x( (fullW / 8) + 1015 + params.deltaPathTwo/10);
	beamTwoOut.x( (fullW / 8) + 512 + params.deltaPathTwo/10);
	beamTwoBack.x( (fullW / 8) + 1014 + params.deltaPathTwo/10);

	interferenceOne.setAttrs({
		
		radius: pathDiff/10,
		fillRadialGradientEndRadius: pathDiff/10,



	});

	interferenceTwo.setAttrs({
		
		innerRadius: pathDiff/10,
		outerRadius: 20 + pathDiff/10,
		fillRadialGradientStartRadius: pathDiff/10,
		fillRadialGradientEndRadius: 20 + pathDiff/10

	});

	interferenceThree.setAttrs({
		
		innerRadius: 20 + pathDiff/10,
		outerRadius: 36 + pathDiff/10,
		fillRadialGradientStartRadius: 20 + pathDiff/10,
		fillRadialGradientEndRadius: 36 + pathDiff/10

	});

	interferenceFour.setAttrs({

		innerRadius: 36 + pathDiff/10,
		outerRadius: 47 + pathDiff/10,
		fillRadialGradientStartRadius: 36 + pathDiff/10,
		fillRadialGradientEndRadius: 47 + pathDiff/10
	});

	$('#deltaPathOne').text(Math.round(params.deltaPathOne)).toString();
	$('#deltaPathTwo').text(Math.round(params.deltaPathTwo)).toString();
	$('#pathDiff').text(Math.round(pathDiff)).toString();

	if (Math.round(pathDiff) == 0) {
		$('#detected').text('No event detected');
	}

	else {
		$('#detected').text('Event detected');
	};



}, dynamicLayer);

anim.start();


































