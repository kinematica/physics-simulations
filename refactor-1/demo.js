function demo(config) {
    this.c = config || {};

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

    // TODO: flesh this out later; shapes go here
    this.shapes = c.shapes || {};
}

Demo.prototype = {
    browserHeight: function(){},
    browserWidth: function(){}
}
