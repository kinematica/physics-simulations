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
		height: 0

	};

// Create and populate the GUI
	var gui = new dat.GUI({width: 710});

	// Use a logarithmic scale for the height slider
	gui.add(params, 'height', 0, 8).onChange( function() {
	
		penny2.movePenny();
		planet.changeEcc();
		pennyLayer.draw();
		planetLayer.draw();

		$('#penny2Height').text(Math.round(pennyHeight())).toString();
		$('#pennyGrav').text((Math.round(pennyGrav()*100)/100)).toString();



		
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
		this.radiusX( fullW*12.5/Math.pow(29, params.height/8));

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
		y: fullHeight() - 55 - Math.pow(10,params.height),

		radius: 5,

		fill: '#B87533'

	});

// Create the function that will move penny2 when the slider is adjusted
	var movePenny = function() {
		penny2.y( fullH - 54 - (fullH - 55)/Math.pow(10,(8 - params.height)/3) );

	};

	penny2.movePenny = movePenny;

	penny1.cache();
	penny2.cache();
	planetLayer.add(planet);
	pennyLayer.add(penny1);
	pennyLayer.add(penny2);
	stage.add(planetLayer);
	stage.add(pennyLayer);

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

	var pennyHeightGUI = pennyHeight();
	var pennyGravGUI = pennyGrav();

	$('#penny2Height').text(Math.round(pennyHeightGUI)).toString();
	$('#pennyGrav').text((Math.round(pennyGravGUI*100)/100)).toString();































