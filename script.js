var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
	container: 'container',      // Seems to be the div that we defined in the body
	width: width,
	height: height                  // Guess we're defining the size of the container? And we're gonna populate it?
});

var layer = new Konva.Layer();

var circle = new Konva.Circle({
	x: stage.getWidth() / 2,
	y: stage.getHeight() / 2,
	radius: 70,
	fill: 'red',
	stroke: 'black',
	strokeWidth: 4
});


var hexagon = new Konva.RegularPolygon({
	x: 200,
	y: 200,
	sides: 7,
	radius: 80,
	fill: '#808080',            // Gotta put the hex values in quotes
	stroke: 'orange',
	strokeWidth: 3
})

// Ya, here we go with the new rectangle

var rect = new Konva.Rect({
	x: 50,
	y: 50,
	width: 100,
	height: 50,
	fill: 'green',
	stroke: 'black',
	strokeWidth: 4
});

var arrow = new Konva.Arrow({
	x: stage.getWidth() / 4,
	y: stage.getHeight() / 4,
	radius: 70,
	points: [0,0, width / 2, height / 2],
	pointerLength: 20,
	pointerWidth: 20,
	fill: 'black',
	stroke: 'black',
	strokeWidth: 4
});

/* Time to make ourselves a good ole' image! 
 * Looks like we do this by, first and foremost, loading an image object
 * of some sort.
 */

var imageObj = new Image();    // Is this a Konva specific thing? Or JS? I'm guessing JS.
imageObj.onload = function() {

	// So we make the Konva image within a function specifying what to do with the
	// image once we load it; gorgeous.
	var yoda = new Konva.Image({
		x: 50,
		y: 50,
		image: imageObj, // Duh it should be this image object?
		width: 106,
		height: 118
	});

	// Add the shape to the layer, once we've loaded it (naturally)
	layer.add(yoda);

	// Seems like this is necessary every time? Is it like a refresh?
	stage.add(layer);
};

/*
 * create a triangle shape by defining a drawing function which 
 * draws a triangle
 */

var shape = new Konva.Shape({

	drawFunc: function(context) {
		context.beginPath();
		context.moveTo(20, 180);
		context.lineTo(220,80);
		// Seems that the first two give the coordinate of an intermediate point,
		// and the last two give the coordinate of the ending point.
		context.quadraticCurveTo(150, 220, 260, 170);
		context.closePath();

		// KineticJS specific method
		context.fillStrokeShape(this);
	},
	fill: '#00D2FF',
	stroke: 'black',
	strokeWidth: 4
});

// add the shape to the layer

layer.add(shape);
layer.add(arrow);
// layer.add(hexagon);
layer.add(rect);
layer.add(circle);

// add the layer to the Stage; will the above image be dynamically added?
stage.add(layer);

imageObj.src = 'http://konvajs.github.io/assets/yoda.jpg';
