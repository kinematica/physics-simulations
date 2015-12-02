////////// ESCAPE VELOCITY VARIABLE-MASS DEMO //////////

// In this demo, the user will be able to change the mass of a fixed-radius planet.
// This will alter the escape velocity of the planet. The user will then be able to launch
// a projectile with a fixed initial velocity and see if it can escape the planet with that
// starting speed or not. The demo will display the planet mass, radius, and the projectile's 
// starting velocity.

//////////////////////////////////////////////////////
/////      WINDOW SIZE AND SCALING FUNCTIONS    /////
//////////////////////////////////////////////////////




// Create functions that record the width and height of the current screen
    var fullWidth = function() {
	return window.innerWidth;
    };


    var fullHeight = function() {
	return window.innerHeight;
    };


// Set the scale for kilometers tp pixels using the height of the screen, since that will dicate planet radius.
// We will divide half of the total height of the screen by the largest allowed radius, 1 million km
    var km_to_pixel_conversion =  (fullHeight()/2)/1000000;


/////////////////////////////////////////////////////////
//////////      GUI PARAMETERS AND CONTROLS     /////////
/////////////////////////////////////////////////////////




// Create the object that we will use to populate the parameters of our GUI
    var obj = {

        // For now the radius of the planet will be in pixels. One pixel will be equal to 100 kilometers.
	// Our upper limit will be 1 million km, and the lower limit will be 1 km
	// We will start will the radius of the sun (696,300 km)
        radius: 696300,

	// Mass of the planet will now replace opacity. It will go from roughly the mass of Earth to roughly 3 solar masses.
	// In kilograms: 5 × 10^24 to 5 × 10^30 (Values on the gui will be in 10^24kg)
	// We will start with the mass of the sun (1.98855 * 10^30kg, or 1.98855*10^6 (10^24 kg))
	mass: 1.98855 * Math.pow(10, 6),

	// Projectile velocity will always be naturally capped at 3*10^8 m/s, or 3*10^5 km/s since we are using kilometers for everything.
	// We will start with the escape velocity of the sun (617.5 km/s)
	projectile_velocity: 617.5
    };



// Create the GUI and populate it with the parameters from obj. These will subesquently alter the properties
// of the planet and the projectile. 
    var gui = new dat.GUI({width: 600});


// When the radius variable is changed in the GUI, update the size and position of the planet and projectile
// as well as the gravitational properties of the planet

// When the mass variable is changed, update the opacity of the planet and its gravitational properties
	gui.add(obj, 'mass', 5, (5 * Math.pow(10,6)), 10).onChange( function() {

		if (launch === false) {

			planet.changeOpacity();
			escVel = escapeVelocity();
			gravAccelTimesDistanceSquared = gravityAccel();
			$('#planetMass').text((Math.round(obj.mass)).toString()+'e^24 kg');
			$('#escapeVelocity').text(Math.round(escapeVelocity()).toString()+'km/s');





		};

	});



///////////////////////////////////////////////////////
/////////////      KONVA STUFF    ////////////////////
///////////////////////////////////////////////////////



// Create the Konva stage that will contain everything we are doing		
    var stage = new Konva.Stage( {
            container: 'container',
            width: fullWidth(),
            height: fullHeight()
    } );


// Create the Konva layer that will contain the planet and projectile
    var backGroundLayer = new Konva.Layer();


//Create the Konva layer that will contain the text
    var textLayer = new Konva.Layer();


// Build the control layer and the launch button it will contain
    var controlLayer = new Konva.Layer();


// This button determines the launch state of the projectile. If the projectile is not currently travelling,
// launch will be set to false. If launch is false then the projectile is ready to launch and the button will
// launch it.
    var launchButton = new Konva.Text( {
    	    // Put the button in the bottom right corner of the screen
    	    x: fullWidth() - 425,
	    y: fullHeight() - 125,
	    fontFamily: 'Calibri',
	    fontStyle: 'bold',
	    fontSize: 120,
	    fill: 'red',
	    text: 'LAUNCH!'
    });


    var launch = false;


// This variable will only be used when we force a new animation to start while the projectile is already in motion.
// It should always be false
    var launchReset = false;


    launchButton.on('click', function() {

    	    if (launch === false) {
	    	
		launch = true;

	    }

	    else {


		planet.changeOpacity();
		projectile.moveProjectile(launchReset);
		escVel = escapeVelocity();
		gravAccelTimesDistanceSquared = gravityAccel();

		$('#planetRadius').text((Math.round(obj.radius)).toString()+'km');
		$('#projectileVelocity').text(Math.round(obj.projectile.velocity).toString()+'km/s');
		$('#planetMass').text((Math.round(obj.mass)).toString()+'e^24 kg');

	    };



    });


// This is the planet. It's radius and opacity (toggled indirectly with the mass) are controlled
// via the GUI.
    var planet = new Konva.Circle( {
    	    // The x position of the planet will be 10000km, converted to pixels. This was only half of the planet is visible,
	    // allowing for more room for the animation
            x: 10000 * km_to_pixel_conversion,
	    // The y position is also halfway down the screen, for the same reason.
            y: fullHeight() / 2,
	    // The radius will always be determined by the obj.radius value. Multiply the value from the GUI, which
	    // is in km, by the km_to_pixel_conversion.
            radius: obj.radius * km_to_pixel_conversion,
	    // Opacity is also controlled by the GUI, by way of the mass variable. Divide obj.mass by the maximum allowed
	    // value of obj.mass to normalize it between 0 and 1 and allow it to set the opacity.
            opacity: (obj.mass/(5 * Math.pow(10,6))),
	    // It's green
            fill: '#00a0dc'
    });


// The projectile will be a ball sitting on the rightmost edge of the planet. It will have a radius of 5 pixels. 
    var projectile = new Konva.Circle( {
    	    // The x position of the projectile at the start will be the starting planet.x value 
	    // plus the planet.radius, plus the projectile radius.
    	    x: planet.x() + planet.radius() + 5,
	    // The y position of the projectile won't change for now, it will always be the planet.y value
	    y: planet.y(),
	    radius: 5,
	    fill: 'red',
	    stroke: 'black'
    });


// Set the projectile velocity to the GUI value
    projectile.velocity = obj.projectile_velocity;


// Also set the initial projectile velocity. This is slightly different because, while .velocity will always give a real-time value of the projectile's speed
// during launch, this value will simply hold the starting projectile velocity in any scenario.
   projectile.init_velocity = obj.projectile_velocity;


   var textFour = new Konva.Text( {
    	    x: 20,
	    y: 110,
	    fontFamily: 'Calibri',
	    fontSize: 20,
	    text: '_',
	    fill: 'white'
    });



// This function will be added to planet to change its opacity using the GUI
    var changeOpacity = function() {

	    this.opacity(obj.mass/(5 * Math.pow(10,6)));
    };



    planet.changeOpacity = changeOpacity;


// This function will govern the function of the projectile. If launch is false, then the projectile will be fixed to
// the surface of the planet. If launch is true, it flies up relative to the now-fixed surface of the planet and either
// escapes the pull of the planet or comes back down.

// Make some variables that will temporarily contain the projectile's velocity and position while updating them.
    var currentPos;
    var currentVel;

    var moveProjectile = function(launch) {

	// Get the time difference from the last frame
	//var timeDiff = frame.timeDiff/1000;

    	// For now make the timeDiff 20 seconds per frame to speed things up
	var timeDiff = 20;
	
	if (launch === false)
	{
    	    this.x( planet.x() + planet.radius() + 5);
	    
	}
	else if (launch === true)
	{

	// First update the projectile position using its velocity value, then update the velocity using the acceleration value

	    currentPos = this.x();

	    // Convert the velocity, which is in km/s, to pixels/s
	    currentVel = this.velocity * km_to_pixel_conversion;
	    
	    currentPos += currentVel*timeDiff;

	    // Don't forget to multiply the acceleration due to gravity by the conversion factor, since it is in km/s^2
	    currentVel -= (gravAccelTimesDistanceSquared/Math.pow((( ((projectile.x()-5)/km_to_pixel_conversion) - 10000 )*1000),2))* km_to_pixel_conversion * timeDiff;

	    // Check that the projectile has reached the right edge of the screen. If it has, two things can happen:
	    // - It disappears because its initial velocity was larger than the escape velocity
	    // - It returns to the planet because its initial velocity was too low
	    if (currentPos > (fullWidth()-5)) {

	        if (this.init_velocity >= Math.round(escVel)) {

			currentPos = fullWidth() + 10;
			currentVel = 0;

		}

		else {

	    		currentPos = fullWidth() -5;
			currentVel *= -1;

		}

	    }

	    

	    // Check to see if the current position is close to the surface of the planet, and if so set it there
	    if ( currentPos <= planet.x() + planet.radius() + 5 ) {

	    	currentPos = planet.x() + planet.radius() + 5;
		currentVel = 0;
		projectile.x(currentPos);
		projectile.velocity = currentVel;

	    }
		
	    // Otherwise just update the values
	    else {

	 	projectile.x(currentPos);
		projectile.velocity = currentVel/km_to_pixel_conversion;

	    }


	    
	}
    };


    // This function will change the velocity of the projectile based on the GUI
    var changeVelocity = function() {

        this.velocity = obj.projectile_velocity;
	this.init_velocity = obj.projectile_velocity;

    };


    projectile.changeVelocity = changeVelocity;
    projectile.moveProjectile = moveProjectile;


//////////////////////////////////////////////
//////     KINEMATIC FUNCTIONS     //////////
//////////////////////////////////////////////


// Write functions to find the current escape velocity and acceleration due to gravity

// Escape velocity uses the gravitational constant G in units of ---> 6.67*10^-11 m^3 / (kg s^2) 
    var escapeVelocity = function() {
            var temp = Math.sqrt(2*(6.67 * Math.pow(10,-11))*(obj.mass*Math.pow(10,24))/(obj.radius*1000));
	    // Divide result by 1000 so that it is in km/s
	    return temp/1000;
    };


// Write a function to find the current acceleration due to gravity
    var gravityAccel = function() {
    	    // G*M/(r^2) 													// Use 1 mill here since the planet.x() should always
	    //															// be 1000000 km from the left edge of the screen 
    	    //var temp = (6.67 * Math.pow(10,-11))*(obj.mass*Math.pow(10,24))/Math.pow((( ((projectile.x()-5)/km_to_pixel_conversion) - 1000000 )*1000),2);

	    // This is just the gravitational constant times the mass of the planet. Since this value will not change while the animation runs, it can be stored
	    // while the projectile is moving and simply divided by the distance squared, preventing unnecessary calls to this function
	    var temp = (6.67 * Math.pow(10,-11))*(obj.mass*Math.pow(10,24));
	    // Divide result by 1000 so that it is in km/s^2
	    return temp/1000;
    };


// Create a gravity acceleration variable that will store the constantly changing value of gravityAccel while launch is false, and then store it when launch is true.
    var gravAccelTimesDistanceSquared = gravityAccel();


// Do the same for escape velocity, since we only want the escape velocity calculated when the projectile launched.
    var escVel = escapeVelocity();


    
    
    controlLayer.add(launchButton);
    stage.add(controlLayer);


    projectile.cache();
    backGroundLayer.add(projectile); 
    backGroundLayer.add(planet);
    stage.add(backGroundLayer);


    $('#planetRadius').text((Math.round(obj.radius)).toString()+'km');
    $('#projectileVelocity').text(Math.round(obj.projectile_velocity).toString()+'km/s');
    $('#planetMass').text((Math.round(obj.mass)).toString()+'e^24 kg');


///////////////////////////////////////////////////////////
////////////////        ANIMATION       ///////////////////
//////////////////////////////////////////////////////////


    var anim = new Konva.Animation( function(frame) {

	if (launch === true) {

		projectile.moveProjectile(launch);	

		if (Math.round(projectile.x()) <= Math.round(planet.x() + planet.radius() + 5)) {

			launch = false;
			planet.changeOpacity();
			projectile.changeVelocity();
			projectile.moveProjectile(launch);
			escVel = escapeVelocity();
			gravAccelTimesDistanceSquared = gravityAccel();

			$('#planetRadius').text((Math.round(obj.radius)).toString()+'km');
			$('#projectileVelocity').text(Math.round(obj.projectile_velocity).toString()+'km/s');
			$('#planetMass').text((Math.round(obj.mass)).toString()+'e^24 kg');



		}

		else if (Math.round(projectile.x()) >= Math.round(fullWidth() + 10)) {

			launch = false;
			planet.changeOpacity();
			projectile.changeVelocity();
			projectile.moveProjectile(launch);
			escVel = escapeVelocity();
			gravAccelTimesDistanceSquared = gravityAccel();

			$('#planetRadius').text((Math.round(obj.radius)).toString()+'km');
			$('#projectileVelocity').text(Math.round(obj.projectile_velocity).toString()+'km/s');
			$('#planetMass').text((Math.round(obj.mass)).toString()+'e^24 kg');


		};

	};

	
    }, backGroundLayer);

    anim.start();



