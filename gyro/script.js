//==============================================================================
//                               PARAMETERS
//==============================================================================

    // var R = 140;    //RADIUS OF THE WHEEL
    var R = Math.round(width/5);    //RADIUS OF THE WHEEL
    if (R < 150) R = 150;
    if (R > 250) R = 250;
    if (R > width/2) R = Math.round(width/2);
    var poleR = Math.round(R/30);
    var poleH = 0.9*R;
    var lastRotation = 0;
    var currentRotation = 0;
    var angularVelocity = 6;
    var angularVelocityPrev = 0;
    var angularFriction = 0.005;
    var maxAngularVel = 70; //MAX ANGULAR VELOCITY FOR SAFETY
    var controlled = false; //IS THE WHEEL ENGAGED?

    var scale = {x:1.2, y:0.7}; //FOR SLANTED PLANE EFFECT

    var imgURL = 'img/wheel.png';

    var speedColour = {up: "#8cff69", down: "#ff8268", opacity: "0.5"};
    var colours = {bg: "#313131", poleTop: "#acacac", poleBottom: "#919191",
                    stroke: "#737373", shadow: "#1f1f1f",
                    text: "#ffffff"};
    var fonts = "Calibri";

    Konva.angleDeg = false; //WE'RE GOING TO WORK IN RADIANS HERE...

//==============================================================================
//                         INITIALIZE STAGE AND LAYERS
//==============================================================================

    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    var motionLayer = new Konva.Layer();
    var staticLayer = new Konva.Layer();
    var staticLayer2 = new Konva.Layer();

//==============================================================================
//                             BUILD THE SCENE
//==============================================================================

    //HUGE BACKGROUND SHAPE FOR MOUSE POSITION PURPOSES
    var stageBG = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: colours.bg,
        opacity: 0
    });
    var poleBottom = new Konva.Rect({
        x: width/2,
        y: height/2,
        width: 2*poleR,
        height: poleH,
        offset: {x: poleR, y: 0},
        fill: colours.poleBottom,
        stroke: colours.stroke,
        strokeWidth: 1,
        shadowColor: colours.shadow,
        shadowBlur: 10,
        shadowOffset: {x : 3, y : 3},
        shadowOpacity: 0.2,
        cornerRadius: poleR
    });
    var poleTop = new Konva.Rect({
        x: width/2,
        y: height/2,
        width: 2*poleR,
        height: 1.1*poleH,
        offset: {x: poleR, y: 1.1*poleH},
        fill: colours.poleTop,
        stroke: colours.stroke,
        strokeWidth: 1,
        shadowColor: colours.shadow,
        shadowBlur: 10,
        shadowOffset: {x : 3, y : 3},
        shadowOpacity: 0.2,
        cornerRadius: poleR
    });

    var console = new Konva.Text({
        x: 20,
        y: 20,
        text: '<CONSOLE1>',
        fontSize: 30,
        fontFamily: fonts,
        fill: colours.text,
        id: 'console'
    });
    var console2 = new Konva.Text({
        x: 20,
        y: 70,
        text: '<CONSOLE2>',
        fontSize: 30,
        fontFamily: fonts,
        fill: colours.text,
        id: 'console2'
    });

    motionLayer.add(console);
    motionLayer.add(console2);
    staticLayer.add(stageBG);
    staticLayer.add(poleBottom);
    staticLayer2.add(poleTop);

    //LOAD THE WHEEL IMAGE AND EXTRA IN THE SLANTED PLANE
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
        });

        var wheelGroup = new Konva.Group({
          x: width/2,
          y: height/2,
          id: 'wheelGroup'
        });

        wheelGroup.scale({  //SCALE AXIS FOR A SLANTED PLANE EFFECT
              x: scale.x,
              y: scale.y
        });

        wheel.on('mousedown touchmove', function() {
            controlled = true;  //THE WHEEL IS ENGAGED
        });

        wheel.on('mouseover', function() {
            document.body.style.cursor = 'pointer';
        });

        wheel.on('mouseleave', function() {
            document.body.style.cursor = 'default';
        });

        var center = new Konva.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: poleR*2,
            fill: colours.poleTop,
        });

        var speedBG = new Konva.Circle({    //CIRCLE TO SHOW THE SPEED (TEMP!)
          x: 0,
          y: 0,
          radius: 1,
          fill: speedColour.up,
          id: 'speedWheel',
          opacity: speedColour.opacity,
          shadowColor: speedColour.up,
          shadowBlur: 20,
          shadowOffset: {x : 0, y : 0},
          shadowOpacity: 0.5,
        });

        wheelGroup.add(speedBG, wheel, center);
        motionLayer.add(wheelGroup);
        anim.start();
    };
    imageObj.src = imgURL;

//==============================================================================
//                                 LISTENERS
//==============================================================================

    stage.on('contentMouseup touchend', function() {
        controlled = false; //THE WHEEL IS NO LONGER ENGAGED
    });

    stage.on('contentMousemove touchmove', function() {
        if(controlled) {    //IF THE WHEEL IS ENGAGED
            var node = motionLayer.find("#wheel")[0];
            var mousePos = stage.getPointerPosition();
            var x = node.getAbsolutePosition().x - mousePos.x;
            var y = node.getAbsolutePosition().y - mousePos.y;
            //GET THE ANGLE CORRESPONDING TO THE MOUSE POSITION & ROTATE
            node.rotation(0.5 * Math.PI + Math.atan(y / x));

            //FLIP THE WHEEL FOR LEFT QUADRANTS SO ANGLES GO FROM 0 TO 2PI
            if(mousePos.x <= stage.getWidth() / 2) {
                node.rotate(Math.PI);
            }
        }
    });

//==============================================================================
//                               BUILD THE STAGE
//==============================================================================

    stage.add(staticLayer);
    stage.add(motionLayer);
    stage.add(staticLayer2);
    stage.batchDraw();

//==============================================================================
//                                  ANIMATION
//==============================================================================

    var anim = new Konva.Animation(function(frame) {
        var node = motionLayer.find("#wheel")[0];
        var nodeSpeed = motionLayer.find("#speedWheel")[0];
        var nodeCon = motionLayer.find("#console")[0];
        var nodeCon2 = motionLayer.find("#console2")[0];

        angularVelocity *= (1-angularFriction); //REDUCE SPEED
        currentRotation = node.getRotation();

        if(controlled) {    // THE WHEEL IS IN TOUCH
            var Dtheta = currentRotation - lastRotation;
            if (Dtheta > Math.PI)  Dtheta -= 2*Math.PI; //FIX FOR 1-2nd QUADRANT
            if (Dtheta < -Math.PI) Dtheta += 2*Math.PI; //FIX FOR 1-2nd QUADRANT
            angularVelocity = Dtheta * 1000 / frame.timeDiff;
            if (Math.abs(angularVelocity) > maxAngularVel) {
                angularVelocity = angularVelocityPrev;  //PROTECT AGAINST LARGE VELOCITIES
            }
                else angularVelocityPrev = angularVelocity;
        }
        else {              // THE WHEEL IS LET SPIN LOOSE
            currentRotation += angularVelocity * frame.timeDiff / 1000;
            //THETA BECOMES > 2PI AFTER ONE PERIOD
            if (currentRotation > 2*Math.PI)  {currentRotation -= 2*Math.PI}
            if (currentRotation < -2*Math.PI) {currentRotation += 2*Math.PI}
            node.rotation(currentRotation);
        }

        lastRotation = node.getRotation();  //FOR SPEED CALCULATION

        //PRINT INFO AND READINGS
        nodeSpeed.radius(Math.abs(angularVelocity)*5);
        nodeSpeed.shadowColor((angularVelocity>0) ? speedColour.up : speedColour.down);
        nodeSpeed.fill((angularVelocity>0) ? speedColour.up : speedColour.down);
        nodeCon.text("Angular Speed: " + angularVelocity.toFixed(2));
        nodeCon2.text("Rotation: " + lastRotation.toFixed(2));

    }, motionLayer);

    //DON'T PLAY THE ANIMATION YET UNTIL THE IMAGES LOADED!
