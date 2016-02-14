//////////////////////////////////////////////////////
//////           RELATIVE WEIGHT DEMO           //////  
//////////////////////////////////////////////////////
// Simulation demonstrating the dependence of the   //
// force of gravity between two objects on the      //
// distance between them. In this simulation the    //
// user will be able to vary the height of a penny  //
// to exponentially higher altitudes and see the    //
// resultant  decrease in gravitational force,      //
// which might be displayed as weight for simplicity//
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
//////     WINDOW SIZE AND SCALING FUNCTIONS    //////
//////////////////////////////////////////////////////

// Create functions that record the width and height of the current screen
	var fullWidth = function() {
		return window.innerWidth;
   	 };


    	var fullHeight = function() {
		return window.innerHeight;
	};

	var fullW = fullWidth();
	var fullH = fullHeight();

//////////////////////////////////////////////////////
//////                  GUI                     //////
//////////////////////////////////////////////////////

// Create the object that will contain the GUI parameters
	var params = {

		// The only parameter that the user will 
		// control for now will be the height of 
		// second penny. The scale will be logarithmic
		// between 10^0 and 10^15 meters.
		height: 0.000

	};

// Create and populate the GUI
	var gui = new dat.GUI({width: 710});

	// Use a logarithmic scale for the height slider
	gui.add(params, 'height', 0.000, 6.000, .001).onChange( function() {
	
		penny2.movePenny();
		planet.changeEcc();
		pennyLayer.draw();
		planetLayer.draw();

		$('#penny2Height').text(Math.round(pennyHeight())).toString();
		$('#pennyGrav').text((Math.round(pennyGrav()*100)/100)).toString();
		$('#pennyWeight').text((Math.round(pennyWeight()*100)/100)).toString();


		
	});




/////////////////////////////////////////////////////
//////                   KONVA                 //////
/////////////////////////////////////////////////////

// Create the Konva stage that will contain everything we are doing		
	var stage = new Konva.Stage( {
		container: 'container',
            	width: fullWidth(),
            	height: fullHeight()
	} );

// Create the layer that will contain the planet Earth
	var planetLayer = new Konva.Layer();

// Create the layer that will contain the pennies
	var pennyLayer = new Konva.Layer();

// Create the layer that will contain the points of interest/reference
	var referenceLayer = new Konva.Layer();

// Create the planet using an ellipse so that we can change its curvature
// to give the appearance of zooming out
	var planet = new Konva.Ellipse( {
		
		// The x position of the planet is the center of the screen
		x: fullWidth()/2,

		// The y position of the planet must be far below the bottom of
		// the screen so that we only see the upper edge
		y: fullHeight()*1.5,

		// This is where the eccentricity of the ellipse will be controlled
		// to create the appearance of zooming out. The y radius of the 
		// planet will be constant so that it will peak just above the bottom
		// of the screen. 
		radius: {
			y: 50 + fullHeight()/2,
			x: fullWidth()*12.5
		},

		fill: '#00a0dc'
	});

// This function will change the eccentricity of the planet to increase the curvature when
// the height of penny2 increases. The minimum penny2 height will corresponse to a low
// eccentricity that makes the planet appear flat. At high penny2 height the eccentricity will increase 
// to make the curvature of the planet apparent.
	var changeEcc = function() {
		
		// Scale the x radius of the planet between fullWidth()*12.5 and fullWidth()*12.5/29,
		// which provides a nice curvature for the most zoomed-out position.
		this.radiusX( fullW*12.5/Math.pow(29, params.height/6));

	};

	planet.changeEcc = changeEcc;

// Create the first penny. It will maintain a constant position and altitude above the planet
	var penny1 = new Konva.Circle( {

		// The x position will be the center of the screen
		x: fullWidth()/2-10,

		// The planet peaks up above the bottom edge by 50 pixels. Since 
		// the penny will have a radius of 5, its y position should be
		// 60 pixels above the bottom edge
		y: fullHeight() - 56,
		radius: 5,
		fill: '#B87533'


	});

// Create the second penny. It will have a variable height controlled by the GUI
	var penny2 = new Konva.Circle( {
		
		// The x position will also be the center of the screen
		x: fullWidth()/2,

		// The y position will be variable. For now it will be set to the 
		// value of the GUI
		y: fullHeight() - 56,

		radius: 5,

		fill: '#B87533'

	});

// Create the function that will move penny2 when the slider is adjusted
	var movePenny = function() 
	{

// 		Old method from script.js
//		penny2.y( (fullH - 56)*Math.exp(-params.height/1.5));

		penny2.y( fullH - 56 - (fullH - 56)*(params.height/6));


	};

// Create the arrow showing the location of the ISS at 410km 
	var referenceISS = new Konva.RegularPolygon( {

		x: fullW/2-22,

		y: fullH - 56 - (fullH - 56)*(5.60206/6),

		sides: 3,

		radius: 15,

		fill: '#FF4040',

		stroke: 'black'

	});

// Rotate the referenceISS 270 degrees
	referenceISS.rotate(90);

// Create the text for the ISS
	var textISS = new Konva.Text( {

		x: fullW/2-345,

		y: fullH - 56 - (fullH - 56)*(5.60206/6) - 11,

		text: 'International Space Station - 400000m',

		fontSize: 20,

		fontFamily: 'Calibri',

		fill: '#FF4040'

	} );

// Create a reference arrow for Mt Everest
	var referenceMtEverest = new Konva.RegularPolygon({

		x: fullW/2-22,

		y: fullH - 56 - (fullH - 56)*(3.94694/6),

		sides: 3,

		radius: 15,

		fill: '#FFA812',

		stroke: 'black'

	});

// Rotate 270
	referenceMtEverest.rotate(90);

// Create the text for Mt Everest
	var textMtEverest = new Konva.Text( {

		x: fullW/2-225,

		y: fullH - 56 - (fullH - 56)*(3.94694/6) - 11,

		text: 'Mount Everest - 8488m',

		fontSize: 20,

		fontFamily: 'Calibri',

		fill: '#FFA812'

	} );

// Create a reference arrow for the Empire State Building
	var referenceESB = new Konva.RegularPolygon({

		x: fullW/2-22,

		y: fullH - 56 - (fullH - 56)*(2.6466/6),

		sides: 3,

		radius: 15,

		fill: '#BDB76B',

		stroke: 'black'

	});

// Rotate 270
	referenceESB.rotate(90);

// Create the text for the Empire State Building
	var textESB = new Konva.Text( {

		x: fullW/2 - 268,

		y: fullH - 56 - (fullH - 56)*(2.6466/6) - 11,

		text: 'Empire State Building - 443m',

		fontSize: 20,

		fontFamily: 'Calibri',

		fill: '#BDB76B'

	} );



	penny2.movePenny = movePenny;

	penny1.cache();
	penny2.cache();
	planetLayer.add(planet);
	pennyLayer.add(penny1);
	pennyLayer.add(penny2);
	referenceLayer.add(referenceISS);
	referenceLayer.add(referenceMtEverest);
	referenceLayer.add(referenceESB);
	referenceLayer.add(textISS);
	referenceLayer.add(textMtEverest);
	referenceLayer.add(textESB);
	stage.add(planetLayer);
	stage.add(pennyLayer);
	stage.add(referenceLayer);

//////////////////////////////////////////////////////////////////
//////               VALUES FOR THE .HTML CODE              //////
//////////////////////////////////////////////////////////////////

// Create the function that will determine penny2's height in meters
	var pennyHeight = function() {

		return Math.pow(10, params.height);

	};

// Calculate the acceleration due to gravity for penny2, using 9.8 m/s^2 as our g0
	var pennyGrav = function() {

		return 9.8*Math.pow((6371000/(6371000 + Math.pow(10, params.height))),2);

	};

// Calculate the weight of penny2 using the same equation from pennyGrav
	var pennyWeight = function() {

		return 22.05*Math.pow((6371000/(6371000 + Math.pow(10, params.height))),2);

	};

	var pennyHeightGUI = pennyHeight();
	var pennyGravGUI = pennyGrav();
	var pennyWeightGUI = pennyWeight();

	$('#penny2Height').text(Math.round(pennyHeightGUI)).toString();
	$('#pennyGrav').text((Math.round(pennyGravGUI*100)/100)).toString();
	$('#pennyWeight').text((Math.round(pennyWeightGUI*100)/100)).toString();






























