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
            fontSize: 30,
            fontFamily: 'Helvetica Neue, Calibri',
            fontWeight: 'lighter',
            fill: colour,
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
        this.addFunction({colour: '#ffffff'});
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
            tension : tension,
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