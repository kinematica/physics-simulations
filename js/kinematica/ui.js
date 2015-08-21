var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

function writeMessage(message) {
    text.text(message);
    layer.draw();
}

var colors = ['#DC3522', '#374140', '#D9CB9E', '#00A388', '#BEEB9F', '#FF6138', '#787746', '#703030', '#2F343B', '#C77966', '#7E827A', '#01B0F0', '#FF358B', '#AEEE00', '#F5A503', '#36B1BF', '#FFEEAD', '#8F8164', '#593325'];

function getRandomColor() {
    return colors[Math.round(Math.random() * (colors.length-1))];
}

//IMAGE LOADER (DO THIS FIRST BEFORE PROCESSING SCENE)
function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}

function makeSlider(variable, callback, minValue, maxValue, units, SliderX, SliderY, length, slidertext, sliderID, colour, output) {
                // var Slider = new Konva.Rect({

                var range = maxValue - minValue;
                var nobRadius = 20;
                var density = length/range;
                var readout = (output == 'active') ? 1 : 0;

                var SliderNobOut = new Konva.Circle({
                    x: 0,
                    y: 0,
                    radius: nobRadius,
                    fill : 'white',
                    opacity : 0.6,
                    stroke: '#dcdcdc',
                    strokeWidth: 1,
                });

                var SliderNobIn = new Konva.Circle({
                    x: 0,
                    y: 0,
                    // radius: 0.6*nobRadius,
                    radius: nobRadius*(0.2+0.7*(variable.value-minValue)/range),
                    fill : colour,
                    opacity : 1,
                    name: 'nobIn',
                });

                var Slider = new Konva.Group({
                    x: Math.round((variable.value-minValue)*density+SliderX),
                    y:SliderY,
                    draggable: true,
                    dragBoundFunc: function(pos) {
                              return {
                                x: (pos.x < (SliderX)) ? (SliderX) : ((pos.x > (SliderX+length)) ? (SliderX+length) : pos.x),
                                y: this.getAbsolutePosition().y
                              }
                            },
                    id: sliderID,
                });

                Slider.add(SliderNobIn);
                Slider.add(SliderNobOut);


                var SliderRange = new Konva.Rect({
                    x: SliderX,
                    y: Math.round(SliderY-nobRadius*0.3/2),
                    width: length,
                    height: nobRadius*0.3,
                    // fill : '#ffffff',
                    // opacity : 0.8,
                    cornerRadius: 3,
                    stroke: '#f1eeee',
                    strokeWidth: 0,
                });
                var SliderProgress = new Konva.Rect({
                    x: SliderX,
                    y: Math.round(SliderY-nobRadius*0.3/2),
                    width: variable.value,
                    height: nobRadius*0.3,
                    fill : colour,
                    // opacity : 0.4,
                    cornerRadius:3,
                    id: (sliderID+'Progress'),
                });
                var SliderBoxBG = new Konva.Rect({
                    x:SliderX-nobRadius,
                    y:SliderY-2.7*nobRadius,
                    width: length+2*nobRadius,
                    height: 3.7*nobRadius,
                    fill : '#a0aec6',
                    // fill : '#000000',
                    opacity : 0,
                    cornerRadius: 5,
                });
                var SliderBG = new Konva.Rect({
                    x:SliderX-nobRadius,
                    y:SliderY-nobRadius,
                    width: length+2*nobRadius,
                    height: 40,
                    fill : '#3d3d3d',
                    opacity : 0,
                    cornerRadius: 4,
                });
                var SliderText = new Konva.Text({
                        x: SliderX-4.1*nobRadius,
                        y: SliderY-(1.4+0.5*readout)*nobRadius,
                        fontSize: 25,
                        fontFamily: 'Calibri',
                        text: (variable.value >= 100) ? variable.value.toFixed(0)+units : variable.value.toFixed(1)+units,
                        fill: '#a8a8a8',
                        padding: 15,
                        id: (sliderID+'Input'),
                });
                var SliderTextActive = new Konva.Text({
                        x: SliderX-4.1*nobRadius,
                        y: SliderY-(1.4-0.5*readout)*nobRadius,
                        fontSize: 25,
                        fontFamily: 'Calibri',
                        text: (variable.value >= 100) ? variable.value.toFixed(0)+units : variable.value.toFixed(1)+units,
                        fill: colour,
                        padding: 15,
                        id: (sliderID+'Readout'),
                });
                var SliderInfo = new Konva.Text({
                        x: SliderX-4.1*nobRadius,
                        y: SliderY-3*nobRadius-5,
                        fontSize: 22,
                        fontFamily: 'Helvetica',
                        text: slidertext,
                        fill: '#888888',
                        id: (sliderID+'Info'),
                        padding: 15,
                });

                // add hover styling
                Slider.on('mouseover', function() {
                  document.body.style.cursor = 'pointer';
                  // Slider.setStroke('#833743');  //'#C8E3F3', //'#006CBF' '#D00017'
                  // sliderLayer.batchDraw();
                });
                Slider.on('mouseout', function() {
                  document.body.style.cursor = 'default';
                  // Slider.setStroke("#cecece");
                  // sliderLayer.batchDraw();
                });
                Slider.on('dragmove', function() {
                    // anim.stop();
                    if ((maxValue-minValue)>10) {
                        variable.value = Math.round((Slider.getX()-SliderX)/density+minValue);
                    }else{
                        variable.value = Math.round(((Slider.getX()-SliderX)/density+minValue)*100)/100;
                    }
                    SliderText.setText(((variable.value >= 100) ? variable.value.toFixed(0)+units : variable.value.toFixed(1)+units));
                    SliderNobIn.setRadius(nobRadius*(0.2+0.7*(variable.value-minValue)/range));
                    if (readout==0) (SliderProgress.setWidth((variable.value-minValue)*density) );
                    // callback(variable);
                    callback();
                    // console.log(window[variable]);
                });

                // sliderLayer.add(SliderBoxBG);
                // sliderLayer.add(SliderBG);
                sliderLayer.add(SliderRange);
                motionLayer.add(SliderProgress);
                sliderLayer.add(SliderInfo);
                sliderLayer.add(SliderText);
                if (readout==1) motionLayer.add(SliderTextActive);
                sliderLayer.add(Slider);
        }


function makeLabel(name, text, textsize, textcolor, fill, opacity, width, height, posx, posy, drawlayer) {
            var ButtonBG = new Konva.Rect({
                width: width,
                height: height,
                fill: fill,
                opacity: opacity,
                cornerRadius: 10,
                offset: {x: 0, y: 0}
            });
            var ButtonText = new Konva.Text({
                // x: 0,
                y: height/2-textsize,
                width: width,
                height: height,
                fontFamily: 'Helvetica Neue',
                fontSize: textsize,
                text: text,
                fill: textcolor,
                padding: 10,
                align: 'center'
            });
            var ButtonSimple = new Konva.Group({
                x: posx,
                y: posy,
                // x: Math.round(stage.width() * 0.7),
                // y: Math.round(stage.height() * 0.2),
                offset: {x: width/2, y: height/2},
                name: name,
            });
            ButtonSimple.add(ButtonBG);
            ButtonSimple.add(ButtonText);
            drawlayer.add(ButtonSimple);
            drawlayer.draw();

            ButtonSimple.on('mouseover mousedown touchstart', function() {
                this.scale({x: 0.98, y: 0.98});
                buttonLayer.batchDraw();
            });

            ButtonSimple.on('mouseout mouseup touchend', function() {
                this.scale({x: 1, y: 1});
                buttonLayer.batchDraw();
            });
        }