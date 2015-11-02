//==============================================================================
//           CONSTRUCT A DEMO OBJECT, BUT DON'T INITIALIZE IT YET
//==============================================================================

function Demo(config) {
    var c = config || {};

    // determine sizing of the virtual plot space; positive y direction is DOWN.
    this.yMin = c.yMin || 0;                    // yMin of plot window
    this.yMax = c.yMax || this.yMin + 1;        // yMax of plot window
    this.xMin = c.xMin || 0;                    // xMin of plot window
    this.xMax = c.xMax || this.xMin + 1;        // xMax of plot window

    // make sure the sizing makes sense
    if (this.yMax - this.yMin < 0) throw new RangeError('yMin must be less than yMax in a demo!');

    // pick which dimension is actually fixed.
    // prefer height definitions and prefer mins if all are specified.
    if (c.yMax && c.yMin) {
        // if they picked y, fix the height
        this.fixedDimension = y;
        this.height = c.yMax - c.yMin;
    } else if (c.xMax && c.xMin) {
        // if they didn't pick y and picked x, fix the width
        this.fixedDimension = x;
        this.width = c.xMax - c.xMin;
    } else {
        // if they didn't specify either, favor y
        this.fixedDimension = y;
        this.height = c.yMax - c.yMin;
    }

    // set bounds on the acceptable aspect ratios
    this.aspectRatioMin = c.aspectRatioMin || 0.2;
    this.aspectRatioMax = c.aspectRatioMax || 3;

    // set the unit scales to be used in terms of meters and seconds
    this.scale.length   = c.scale.length || '1';
    this.scale.time     = c.scale.time   || '1';

    // set the id of the div which should contain the demo
    this.container      = c.container || 'container';

    // calculate width or height of the div whose id is container
    this.fullWidth = function(){
        return $('#' + this.container).innerWidth();
    }
    this.fullHeight = function(){
        return $('#' + this.container).innerHeight();
    }

    // set metrics, which are functions that can be recomputed every frame
    this.metrics        = c.metrics || {};

    // set editable parameters that will appear in the gui
    this.parameters     = c.parameters || {}

    // TODO: Provide a dictionary of shapes, including their sizes and positions.
    this.shapes = c.shapes || {};

    // a container for the konva shape objects corresponding to the above shapes
    this.konvaShapes = {};

    // some state variables
    this.oldFullWidth = this.fullWidth();
    this.oldFullHeight = this.fullHeight();
    this.lastResize = new Date();
}

//==============================================================================
//              PROTOTYPE
//==============================================================================

// a function for initializing the konva, dat.gui, and other components
Demo.prototype.initialize       = function(){
    // FULLSCREEN
    $('.fs-button').on('click', function(){
            var elem = document.getElementById(this.container);
            if(document.webkitFullscreenElement) {
                document.webkitCancelFullScreen();
            } else {
                elem.webkitRequestFullScreen();
            };
    });

    // TODO: Calculate parameters
    // Build the scene
    buildScene();

}
Demo.prototype.browserHeight    = function(){};
Demo.prototype.browserWidth     = function(){};
Demo.prototype.resize           = function(){
    throw new Error('Resize not yet implemented');
}

/**
 * Create the conva stage and generate responsive konva shapes
 */
Demo.prototype.buildScene       = function(){
    stage = new Konva.Stage({
        container: container,
        width: fullWidth(),
        height: fullHeight()
    });

    bgLayer = new Konva.Layer();
    motionLayer = new Konva.Layer();

    var ks = this.konvaShapes;
    this.shapes.forEach( function(e, i, a) {
        var newShape;
        /* TODO: finish this
        switch(e.type) {
            case 'Circle':
                newShape = new Konva.Circle({
                    x: 
        */
    });
}

// TODO:
Demo.pix.scale = function(){};
Demo.pix.x = function(x){};
Demo.pix.y = function(y){};

//==============================================================================
//           CONSTRUCT A SHAPE OBJECT, BUT DON'T MAKE THE KONVA OBJECT YET
//==============================================================================

/**
 * Specify type; height; width; x; y; radius; points; color; etc.
 * TODO
 * 
 * By default, handle the above as dynamically calculated quantities given
 * in physical units rather than pixels, since the latter will not account
 * for the size of the demo in the end user's browser.
 * 
 * @this {Shape}
 * @return {Shape}
 */
Demo.Shape = function(config) {
    var c = config || {};

    // Check whether this type is supported; if it is, define the constructor
    this.initialize = this.Constructors[c.type] || throw new Error('Type ' + c.type + ' not supported.');
    this.type = c.type; 
}

// TODO
Demo.Shape.prototype.initialize() {}

//==============================================================================
//           CONSTRUCT A SHAPE OBJECT, BUT DON'T MAKE THE KONVA OBJECT YET
//==============================================================================
