var percentageOnLeftPredicted;
var percentageOnLeftActual;
var timeOnLeft;
var timeTotal;
var ballCount;

// DO THIS WHEN ADDING A BALL
//

function updateMetrics(frame) {
    var timediff = frame.timediff;

    timeTotal += timediff;
    if (onLeft) { timeOnLeft += timediff; }
    percentageOnLeftActual = 100 * timeOnLeft / timeTotal;
}


var buttonLayer = new Konva.Layer();

// add ball
makeLabel('add', 'Emit', 20, '#ffeb32', '#484848', 0.9, 80, 50, width/2-250, 100, buttonLayer);
buttonLayer.find('.add').on('mousedown touchstart', function() {
    createBall();
    ballCount++;
    percentageOnLeftPredicted = 100 * Math.pow(0.5, ballCount);
    percentageOnLeftActual = 0;
    timeOnLeft = 0;
    timeTotal = 0;
});

stage.add(buttonLayer);
