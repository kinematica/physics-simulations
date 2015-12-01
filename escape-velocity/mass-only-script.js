////////// ESCAPE VELOCITY VARIABLE-MASS DEMO //////////

// In this demo, the user will be able to change the mass of a fixed-radius planet.
// This will alter the escape velocity of the planet. The user will then be able to launch
// a projectile with a fixed initial velocity and see if it can escape the planet with that
// starting speed or not. The demo will display the planet mass, radius, and the projectile's 
// starting velocity.


////////// GUI FOR USER INPUT //////////

// Create functions that record the width and height of the current screen
    var fullWidth = function() {
	return window.innerWidth;
    };
	
    var fullHeight = function() {
	return window.innerHeight;
    };

// Set the scale for kilometers tp pixels using the height of the screen, since in the following demo screen height
// will dicate planet radius. We will divide half of the total height of the screen by the largest allowed radius, 1 million km
    var km_to_pixel_conversion =  (fullHeight()/2)/1000000;

// Create the object that we will use to populate the parameters of our system
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
    var gui = new dat.GUI();
    
// Allow the user to alter the mass of the planet
    gui.add(obj, 'mass', 5, (5 * Math.pow(10,6))).listen();



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

    var launchButton = new Konva.Circle( {
    	    // Put the button in the bottom right corner of the screen
    	    x: fullWidth() - 50,
	    y: fullHeight() - 50,
	    radius: 50,
	    fill: 'green'
    });

// This button determines the launch state of the projectile. If the projectile is not currently travelling,
// launch will be set to false. If launch is false then the projectile is ready to launch and the button will
// launch it.

var launch = false;

    launchButton.on('click', function() {

    	    if (launch === false) {
	    	
		launch = true;

	    };

    });



// This is my planet. It's radius and opacity (toggled indirectly with the mass) are controlled
// via the GUI.
    var planet = new Konva.Circle( {
    	    // The x position of the planet will be half of the full screen height, since this is the maximum 
	    // radius of the planet
            x: fullHeight() / 2,
	    // The y position is also halfway down the screen, for the same reason.
            y: fullHeight() / 2,
	    // The radius will always be determined by the obj.radius value. Multiply the value from the GUI, which
	    // is in km, by the km_to_pixel_conversion.
            radius: obj.radius * km_to_pixel_conversion,
	    // Opacity is also controlled by the GUI, by way of the mass variable. Divide obj.mass by the maximum allowed
	    // value of obj.mass to normalize it between 0 and 1 and allow it to set the opacity.
            opacity: (obj.mass/(5 * Math.pow(10,6))),
	    // It's green
            fill: 'green'
    });

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
    	    var temp = (6.67 * Math.pow(10,-11))*(obj.mass*Math.pow(10,24))/Math.pow((( ((projectile.x()-5)/km_to_pixel_conversion) - 1000000 )*1000),2);
	    // Divide result by 1000 so that it is in km/s^2
	    return temp/1000;
    };


// Our projectile will be a ball sitting on the rightmost edge of the planet. It will have a radius of 5 pixels. 
    var projectile = new Konva.Circle( {
    	    // The x position of the projectile at the start will be the starting planet.x value 
	    // plus the planet.radius, plus the projectile radius.
    	    x: ( fullHeight() / 2 ) + planet.radius() + 5,
	    // The y position of the projectile won't change for now, it will always be the planet.y value
	    y: planet.y(),
	    radius: 5,
	    fill: 'red',
	    stroke: 'black'
    });

// Set the initial projectile velocity to the GUI value
    projectile.velocity = obj.projectile_velocity;
    
    var writeMessages = function(message1, message2, message3) {
    	    textOne.setText(message1);
    	    textTwo.setText(message2);
	    textThree.setText(message3);
	    
    };

   // Tell them if the projectile escaped
   var writeEscape = function(message) {

   	    textFour.setText(message);

    };

    // This function will be added to planet to change its opacity using mass value on the GUI
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

    var moveProjectile = function(launch, frame) {

	// Get the time difference from the last frame
	//var timeDiff = frame.timeDiff/1000;

    	// For now make the timeDiff 10 seconds per frame to speed things up
	var timeDiff = 10;
	
	if (launch === false)
	{
    	    this.x( planet.x() + planet.radius() + 5);
	    
	}
	else if (launch === true)
	{

	// First update the projectile position using its velocity value, then update the velocity using the acceleration value

	    currentPos = this.x();

	    // Convert the velocity, which is in km/s, to pixels/s
	    // Fix some values for now just to see if it works
	    currentVel = this.velocity * km_to_pixel_conversion;

	    //currentVel = this.velocity;
	    
	    currentPos += currentVel*timeDiff;

	    currentVel -= gravityAccel() * km_to_pixel_conversion * timeDiff;

	    // Check that the projectile has reached the right edge of the screen. If it has, two things can happen:
	    // - It disappears because its initial velocity was larger than the escape velocity
	    // - It returns to the planet because its initial velocity was too low
	    if (currentPos > (fullWidth()-5)) {

	        if (obj.projectile_velocity >= escapeVelocity()) {

			currentPos = fullWidth() + 10;
			currentVel = 0;

		}

		else {

	    		currentPos = fullWidth() -5;
			currentVel *= -1;

		}

	    }

	    // Set the new values of projectile
	    //projectile.x(currentPos);
	    //projectile.velocity = currentVel/km_to_pixel_conversion;

	    // Check to see if the current position is close to the surface of the planet, and if so set it there
	    if ( currentPos <= planet.x() + planet.radius() + 5 ) {

	    	currentPos = planet.x() + planet.radius() + 5;
		currentVel = 0;
		projectile.x(currentPos);
		projectile.velocity = currentVel;

	    }

	    else {

	 	projectile.x(currentPos);
		projectile.velocity = currentVel/km_to_pixel_conversion;

	    }


	    
	}
    };

    // This function will change the velocity of the projectile based on the GUI
    var changeVelocity = function() {

        this.velocity = obj.projectile_velocity;

    };

    projectile.changeVelocity = changeVelocity;
    projectile.moveProjectile = moveProjectile;

    var textOne = new Konva.Text( {
    	    x: 20,
	    y: 20,
	    fontFamily: 'Calibri',
	    fontSize: 20,
	    text: 'Radius is ' + Math.round(obj.radius).toString() + 'kilometers',
	    fill: 'white'
    });

    var textTwo = new Konva.Text( {
    	    x: 20,
	    y: 50,
	    fontFamily: 'Calibri',
	    fontSize: 20,
	    text: 'Mass!',
	    fill: 'white'
    });

    var textThree = new Konva.Text( {
    	    x: 20,
	    y: 80,
	    fontFamily: 'Calibri',
	    fontSize: 20,
	    text: 'Escape Velocity!',
	    fill: 'white'
    });

    var textFour = new Konva.Text( {
    	    x: 20,
	    y: 110,
	    fontFamily: 'Calibri',
	    fontSize: 20,
	    text: '_',
	    fill: 'white'
    });

    controlLayer.add(launchButton);
    stage.add(controlLayer);


    projectile.cache();
    backGroundLayer.add(projectile); 
    backGroundLayer.add(textTwo);
    backGroundLayer.add(textOne);
    backGroundLayer.add(textThree);
    backGroundLayer.add(textFour);
    backGroundLayer.add(planet);
    stage.add(backGroundLayer);

    var anim = new Konva.Animation( function(frame) {

	// If launch is false, allow the GUI to alter the planet and projectile
	if (launch === false) {

		planet.changeOpacity();
		projectile.changeVelocity();
		projectile.moveProjectile(launch, frame);
		writeMessages('Radius is '+(Math.round(obj.radius/100)*100).toString()+'km','Planet mass is '+(Math.round(obj.mass/100)*Math.pow(10,26)).toString()+'kg','Escape velocity is '+Math.round(escapeVelocity())+'km/s');
		writeEscape('Stuck');
		$('#planetRadius').text((Math.round(obj.radius/100)*100).toString()+'km');
		$('#planetMass').text((Math.round(obj.mass/100)*Math.pow(10,26)).toString()+'kg');
		$('#escapeVelocity').text(Math.round(escapeVelocity()).toString()+'km/s');



	}

	else if (launch === true) {

		projectile.moveProjectile(launch, frame);

		if (obj.projectile_velocity > escapeVelocity()) {

			writeEscape('Escaped!');

		}

		if (Math.round(projectile.x()) <= Math.round(planet.x() + planet.radius() + 5)) {

			launch = false;

		}

		else if (Math.round(projectile.x()) >= Math.round(fullWidth() + 10)) {

			launch = false;

		};

	};

	
    }, backGroundLayer);

    anim.start();

