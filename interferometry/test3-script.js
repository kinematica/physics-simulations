

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

gui.add(params, 'deltaPathOne', -316, 316);

gui.add(params, 'deltaPathTwo', -316, 316);





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

// Button to send simulated gravitational wave
var launchButton = new Konva.Circle({

	x: (fullW / 1.25),
	y: (fullH / 1.25),
	radius: 15,
	fill: 'red',
	stroke: 'black',
	strokeWidth: 2
});

// launch variable
var launch = false;

launchButton.on('click', function() {

	if (launch === false) {
		
		totalTime = 0;
		launch = true;

	};
});

// Now for the parts that will move and change size

// First split beam travelling outward
var beamOneOut = new Konva.Arrow({

	x: (fullW / 8) + 512,
	y: (fullH / 1.5) - 110,

	points: [0, 0, 0, -400],
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

	x: (fullW / 8) + 612,
	y: (fullH / 1.5) - 10,

	points: [0, 0, 400, 0],
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
	y: (fullH / 1.5) - 409,

	points: [0, 0, 0, 428],
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

	x: (fullW / 8) + 914,
	y: (fullH / 1.5) + 22,

	points: [0, 0, -365, 0],
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

// Interference will be demonstrated by the overlaying of two
// sine waves. They will slide past each other as the user
// toggles the controls, and the brightness (opacity) of the resultant
// beam will be displayed as a red circle.

// First beam

// First create the image object. This is the object whose position we will manipulate later.
var beamOneIntImage = new Konva.Image({

	x: fullW / 1.25,
	y: fullH / 2,

	width: 300,
	height: 100

});

// This stores the actual image, but after this bit we don't need to touch imageObj anymore.
var imageObjOne = new Image();
imageObjOne.onload =  function() {

	beamOneIntImage.image(imageObjOne);
};

// load the image
imageObjOne.src = 'sine_transparent_red.png';

// Second beam
var beamTwoIntImage = new Konva.Image({

	x: fullW / 1.25,
	y: fullH / 2,

	width: 300,
	height: 100


});

var imageObjTwo = new Image();
imageObjTwo.onload =  function() {

	beamTwoIntImage.image(imageObjTwo);
};

// load the image
imageObjTwo.src = 'sine_transparent_red_mirror.png';









// Add all the objects to their layers
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
staticLayer.add(launchButton);

dynamicLayer.add(beamOneOut);
dynamicLayer.add(beamTwoOut);
dynamicLayer.add(mirrorOne);
dynamicLayer.add(mirrorTwo);
dynamicLayer.add(beamOneBack);
dynamicLayer.add(beamTwoBack);
dynamicLayer.add(beamOneIntImage);
dynamicLayer.add(beamTwoIntImage);


// Add both layers to the stage
stage.add(staticLayer);
stage.add(dynamicLayer);



//////////////////////////////////////
//             ANIMATION            //
//////////////////////////////////////

// This variable will store the net path difference during use. This is the only
// important variable as far as determining the resultant interferece pattern.
var pathDiff;

// This variable will always store the last pathDiff fromthe previous frame. In
// this way the animation will be able to tell if the user has changed the inputs.
// If not, then the animation will not redraw anything.
var oldPathDiff;

// This variable will store the time difference between animation frames so that
// our simulated gravitational waves can evolve in time
var deltaTime;

// This variable will store the total time elapsed since launch
var totalTime;

var anim = new Konva.Animation( function(frame) {

	// First check to see if the user has launched a gravity wave
	if (launch === true) {
	
		// totalTime is in seconds
		totalTime = totalTime + frame.timeDiff/1000;
		
		// Simulated wave will only last 5 seconds
		if (totalTime < 5) {
			
			// This is deltaPathOne. We call it this way so that
			// the gui also changes with time.
			gui.__controllers[0].setValue(200*Math.sin(2*Math.PI*.15*Math.pow(totalTime, 2)));

			// This is deltaPathTwo.
			gui.__controllers[1].setValue(-200*Math.sin(2*Math.PI*.15*Math.pow(totalTime, 2)));
			
	
			// To get the EFFECTIVE difference in path length, which for the purposes of this demonstration only has a range from 0 to 1/2 wavelength, we use this formula. In this demo the wavelength of light s 632nm.
			pathDiff = Math.abs(params.deltaPathOne - params.deltaPathTwo) - 2*( Math.abs( params.deltaPathOne - params.deltaPathTwo) % 316 )*Math.floor( (Math.abs(params.deltaPathOne - params.deltaPathTwo) - 1)/316) - 632*Math.floor( Math.abs(params.deltaPathOne - params.deltaPathTwo)/632);




			// Allow all of the mirrors and non-static beams to be
			// altered by the GUI in real time
			mirrorOne.y( (fullH / 1.5) - 520 - params.deltaPathOne/10);
			beamOneOut.y( (fullH / 1.5) - 110 - params.deltaPathOne/10);
			beamOneBack.y( (fullH / 1.5) - 509 - params.deltaPathOne/10);
	
			mirrorTwo.x( (fullW / 8) + 1015 + params.deltaPathTwo/10);
			beamTwoOut.x( (fullW / 8) + 612 + params.deltaPathTwo/10);
			beamTwoBack.x( (fullW / 8) + 1014 + params.deltaPathTwo/10);
			
			// The wavelength in pixels of these waveforms is 49, so we will scale that 49 by our pathDiff
			beamOneIntImage.x( (fullW / 1.25) + (66 * (params.deltaPathOne/316)));
			beamTwoIntImage.x( (fullW / 1.25) + (66 * (params.deltaPathTwo/316)));


			$('#deltaPathOne').text(Math.round(params.deltaPathOne)).toString();
			$('#deltaPathTwo').text(Math.round(params.deltaPathTwo)).toString();
			$('#pathDiff').text(Math.round(Math.abs(params.deltaPathOne - params.deltaPathTwo))).toString();

			if (Math.round(pathDiff) == 0) {
				$('#detected').text('No event detected');
			}

			else {
				$('#detected').text('Event detected');
			};

		}

		else { 
			
			deltaTime = totalTime;
			totalTime = 0;
			launch = false;
			gui.__controllers[0].setValue(0);
			gui.__controllers[1].setValue(0);

		};
	};



		


	// To get the EFFECTIVE difference in path length, which for the purposes of this demonstration only has a range from 0 to 1/2 wavelength, we use this formula. In this demo the wavelength of light s 632nm.
	pathDiff = Math.abs(params.deltaPathOne - params.deltaPathTwo) - 2*( Math.abs( params.deltaPathOne - params.deltaPathTwo) % 316 )*Math.floor( (Math.abs(params.deltaPathOne - params.deltaPathTwo) - 1)/316) - 632*Math.floor( Math.abs(params.deltaPathOne - params.deltaPathTwo)/632);


	// Allow all of the mirrors and non-static beams to be
	// altered by the GUI in real time
	mirrorOne.y( (fullH / 1.5) - 520 - params.deltaPathOne/10);
	beamOneOut.y( (fullH / 1.5) - 110 - params.deltaPathOne/10);
	beamOneBack.y( (fullH / 1.5) - 509 - params.deltaPathOne/10);

	mirrorTwo.x( (fullW / 8) + 1015 + params.deltaPathTwo/10);
	beamTwoOut.x( (fullW / 8) + 612 + params.deltaPathTwo/10);
	beamTwoBack.x( (fullW / 8) + 1014 + params.deltaPathTwo/10);
	
	// The wavelength in pixels of these waveforms is 49, so we will scale that 49 by our pathDiff
	beamOneIntImage.x( (fullW / 1.25) + (49 * (params.deltaPathOne/316)));
	beamTwoIntImage.x( (fullW / 1.25) + (49 * (params.deltaPathTwo/316)));


	$('#deltaPathOne').text(Math.round(params.deltaPathOne)).toString();
	$('#deltaPathTwo').text(Math.round(params.deltaPathTwo)).toString();
	$('#pathDiff').text(Math.round(Math.abs(params.deltaPathOne - params.deltaPathTwo))).toString();

	if (Math.round(pathDiff) == 0) {
		$('#detected').text('No event detected');
	}

	else {
		$('#detected').text('Event detected');
	};



}, dynamicLayer);

anim.start();









