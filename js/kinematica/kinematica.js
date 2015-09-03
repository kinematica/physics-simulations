/*
 * Kinematica Physics JavaScript Framework v0.1
 * http://kinematica.github.io/
 * Licensed under the MIT license.
 * Date: 2015-07-24
 *
 * Copyright (C) 2015 by Liutauras Rusaitis, Stefan Countryman
 */
/**
 * @namespace Kinematica
 */
 /*jshint -W079, -W020*/

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function getMod(x, y) {
  return Math.floor(x/y);
}

// Kinematica = new Object();
var Kinematica = {
    // public
    version: '0.1',
};


Kinematica.Graph = function(config) {
    this._init(config);
}

Kinematica.Graph.prototype = {
    _init: function(config) {
        var conf = config || {};
        this.x = conf.x || 100;
        this.y = conf.y || 100;
        this.w = conf.w || 400;
        this.h = conf.h || 400;
        var style = conf.style || 1;
        var bgColour = conf.bg || "#000000";
        var bgOpacity = conf.bgOp || 0.15;
        var colour = conf.colour || "#ffffff";
        var axis = conf.axis || "linear";
        var titleColour = conf.titleColour || "#ffffff";
        var title = conf.title || "TITLE GOES HERE";
        this.id = conf.title || "graph" + (Math.round(Math.random() * 100));
        this.points = conf.points || 100;
        this.xmin = conf.xmin || 0;
        this.xmax = conf.xmax || 0.1;
        this.ymin = conf.ymin || 0;
        this.ymax = conf.ymax || 10;
        this.xrange = this.xmax - this.xmin;
        this.yrange = this.ymax - this.ymin;
        this.pointSep = this.w / this.points;
        this.xdensity = this.xrange / this.w;
        this.ydensity = this.yrange / this.h;
        this.lineSep = 40; //separation (in px) between helper graph lines
        this.xTicks = conf.xTicks || [];
        this.yTicks = conf.yTicks || [];

        var staticNode = new Konva.Group({
            x: this.x,
            y: this.y
        });
        var titleNode = new Konva.Text({
            x: 0,
            y: -30,
            text: title,
            fontSize: 25,
            fontFamily: 'Calibri',
            fontWeight: 'lighter',
            fill: titleColour,
            id: 'title'
        });
        var bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.w,
            height: this.h,
            fill: bgColour,
            opacity: bgOpacity,
            cornerRadius: 5,
            // shadowColor: "#666666",
            // shadowBlur: 20,
            // shadowOffset: {x : 5, y : 5},
            // shadowOpacity: 0.5
        });
        staticNode.add(titleNode, bg);
        // ADD THE GRAPH BACKGROUND
        this.BGnode = staticNode; //bg;
        // INITIATE THE FUNCTION ARRAY
        this.node = [];
        // ADD AN INITIAL TEMPLATE FUNCTION TO MANIPULATE
        this.addFunction({colour: colour});
        // this.addFunction({colour: '#ffffff'});

    },
    draw: function(array, index) {
        this.node[index].points(array);
        return this;
    },

    addFunction: function(config) {
        var conf = config || {};
        var colour = conf.colour || '#ff6fcf';
        var strokeWidth = conf.strokeWidth || 1;
        var dash = conf.dash || 0;
        var tension = conf.tension || 0;
        var points = conf.points || [0, -this.h/2, this.w, -this.h/2];
        var node = new Konva.Line({
            x: this.x,
            y: this.y+this.h,
            points: points,
            stroke: colour,
            strokeWidth: strokeWidth,
            dash: dash,
            tension : tension
        });
        this.node.push(node);
        // this.node[0] = node;
        // return this;
    },

    mapPointToGraph: function(elem) {
        // console.log((elem.x - this.xmin) / this.xdensity);
        return {x: (elem.x - this.xmin) / this.xdensity, y: -(elem.y - this.ymin) / this.ydensity};
    },

    withinBounds: function(elem) {
        if ((elem.x >= this.xmin) && (elem.x <= this.xmax) &&
            (elem.y >= this.ymin) && (elem.y <= this.ymax))
            return true;
        else
            return false;
    },

    //SEPERATE
    // graphFunc: function(xi, t) {
    //     return Math.sin(k * xi + this.w * t);
    // },

    mapToGraph: function(array, index, flag) {
        var newPoints = [];
        var nextPoint = [];
        var index = index || 0;
        var flag = flag || '';
        for (var i = 0; i < array.length; i+=1) {
            // nextPoint = this.mapPointToGraph(array[i]);
            // console.log(nextPoint.x);
            if (this.withinBounds(array[i])) {
                nextPoint = this.mapPointToGraph(array[i]);
                // console.log('hello');
                newPoints.push(nextPoint.x);
                newPoints.push(nextPoint.y);
            }
        };
        // console.log(newPoints[0].x);
        // IF SILENT FLAG IS PASSED, DON'T DRAW ON THE GRAPH
        if (flag !== 'silent') this.draw(newPoints, index);
        // } else {
            // console.log('PROBLEM: The Passed Array is of a different size than the Kinematica Graph Object is expecting (' + this.points + ')');
        // }
        return newPoints;
    },

    getTicks: function() {

        var xTicksMax = getMod(this.w, this.lineSep);
        var xTicksSep = (this.xrange/xTicksMax);
        var yTicksMax = getMod(this.h, this.lineSep);
        var yTicksSep = (this.yrange/yTicksMax);

        // X-AXIS TICKS
        var linearTicks = [1, 2, 5, 10];
        var orderDiff = Math.round(getBaseLog(10, xTicksSep));
        var ticksSepOpt = Math.round(xTicksSep * Math.pow(10, orderDiff * (-1)));
        var ticksDiff = linearTicks.map(function(num) { return Math.abs(num - ticksSepOpt); });
        var indexOfMinValue = ticksDiff.reduce(function(iMin,x,i,a) {return x < a[iMin] ? i : iMin;}, 0);
        this.xTickSep = linearTicks[indexOfMinValue] * Math.pow(10, orderDiff);
        // Y-AXIS TICKS
        var linearTicks = [1, 2, 5, 10];
        var orderDiff = Math.round(getBaseLog(10, yTicksSep));
        var ticksSepOpt = Math.round(yTicksSep * Math.pow(10, orderDiff * (-1)));
        var ticksDiff = linearTicks.map(function(num) { return Math.abs(num - ticksSepOpt); });
        var indexOfMinValue = ticksDiff.reduce(function(iMin,x,i,a) {return x < a[iMin] ? i : iMin;}, 0);
        this.yTickSep = linearTicks[indexOfMinValue] * Math.pow(10, orderDiff);

        for (var i = this.xmin; i <= this.xmax; i+=this.xTickSep) {
            this.xTicks.push({value: i, label:String(i)});
        };
        for (var i = this.ymin; i <= this.ymax; i+=this.yTickSep) {
            this.yTicks.push({value: i, label:String(i)});
        };
    }


}

// Define logs of first 100 logs of factorials.
Kinematica.log_factorials=[0.0,0.0,0.6931471805599453,1.791759469228055,3.1780538303479453,4.787491742782046,6.579251212010101,8.525161361065415,10.60460290274525,12.80182748008147,15.104412573075518,17.502307845873887,19.98721449566189,22.552163853123425,25.191221182738683,27.899271383840894,30.671860106080675,33.50507345013689,36.39544520803305,39.339884187199495,42.335616460753485,45.38013889847691,48.47118135183523,51.60667556776438,54.784729398112326,58.003605222980525,61.26170176100201,64.55753862700634,67.88974313718154,71.25703896716801,74.65823634883017,78.09222355331532,81.55795945611504,85.05446701758153,88.5808275421977,92.13617560368711,95.71969454214322,99.33061245478744,102.96819861451382,106.63176026064347,110.3206397147574,114.0342117814617,117.77188139974507,121.53308151543864,125.3172711493569,129.12393363912722,132.95257503561632,136.80272263732638,140.67392364823428,144.5657439463449,148.47776695177305,152.40959258449737,156.3608363030788,160.33112821663093,164.3201122631952,168.32744544842768,172.35279713916282,176.39584840699737,180.45629141754378,184.5338288614495,188.6281734236716,192.7390472878449,196.86618167288998,201.00931639928152,205.1681994826412,209.34258675253685,213.53224149456327,217.73693411395422,221.95644181913033,226.1905483237276,230.43904356577696,234.70172344281826,238.97838956183432,243.2688490029827,247.57291409618688,251.8904022097232,256.22113555000954,260.5649409718632,264.92164979855283,269.29109765101987,273.67312428569375,278.0675734403662,282.47429268763045,286.89313329542705,291.32395009427034,295.76660135076065,300.22094864701415,304.6868567656687,309.16419358014696,313.6528299498791,318.15263962020936,322.6634991267262,327.18528770377526,331.71788719692853,336.2611819791985,340.8150588707991,345.3794070622669,349.9541180407703,354.5390855194409,359.1342053695755,363.7393755555636];
Kinematica.log_binomial=function(n,k){return (this.log_factorials[n] - this.log_factorials[k] - this.log_factorials[(n-k)]);}