/*
 * math.js
 *
 * Math for statistics and scaling
 *
 * Ryan Cabeen
 * cabeen@cs.brown.edu
 * September 2012
 */

/** Create an array filled with the given value */
function createFilledArray(length, value) {
    var out = [];
    for (var i = 0; i < length; i++) {
        out[i] = value;
    }
    return out;
}

/** Create a matrix filled with the given value */
function createFilledMatrix(width, height, value) {
    var out = [];
    for (var i = 0; i < height; i++) {
        out[i] = createFilledArray(width);
    }
    return out;
}

/** Update (or initialize) statistics with an online algorithm*/
function Stats() {
    this.init = false;
}

Stats.prototype.update = function(value) {
    if (this.init) {
        this.sum += value;
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        this.num += 1;

        var delta = value - this.mean;
        this.mean += delta / this.num;
        this.m2 += delta * (value - this.mean); 
        this.std = Math.sqrt(this.m2 / this.num);
    } else {
        this.min = value;
        this.max = value;
        this.sum = value;
        this.mean = 0;
        this.std = 0;
        this.num = 1;
        this.m2 = 0;
        this.init = true;
    }
};

/** Compute stats of an array of numbers */
function getVectorStats(vector) {
    var stats = new Stats();
    var n = vector.length;
    for (var i = 0; i < n; i++) { 
        var value = vector[i];
        if (value != null) {
            stats.update(value);
        }
    }
    return stats;
}

function getMatrixStats(matrix) {
    var stats = new Stats();
    var m = matrix.length;
    var n = matrix[0].length;
    for (var i = 0; i < m; i++) { 
        for (var j = 0; j < n; j++) { 
            var value = matrix[i][j];
            if (value != null) {
                stats.update(value);
            }
        }
    }
    return stats;
}

function getMatrixColumnStats(matrix) {
    var stats = [];
    var m = matrix.length;
    var n = matrix[0].length;
    for (var i = 0; i < m; i++) { 
        var col = new Stats();
        for (var j = 0; j < n; j++) { 
            var value = matrix[i][j];
            if (value != null) {
                col.update(value);
            }
        }
        stats[i] = col;
    }
    return stats;
}

/** Return a list of supported scales */
function getScaleList() {
    return [
        "linear",
        "log",
        "exp",
        "invlinear",
        "invlog",
        "invexp",
        "binary"
        ];
}

/** Return a function mapping the interval [low,high] to [0,1] */
function getScale(name, low, high) {
    return {
        linear: getLinearScale(low, high),
        log: getLogScale(getLinearScale(low, high)),
        exp: getExpScale(getLinearScale(low, high)),
        invlinear: getInverseScale(getLinearScale(low, high)),
        invlog: getInverseScale(getLogScale(getLinearScale(low, high))),
        invexp: getInverseScale(getExpScale(getLinearScale(low, high))),
        binary: getBinaryScale(low)
    }[name];
}

function getLinearScale(low, high) {
    return function(value) {
        if (value < low) {
            return 0.0;
        } else if (value > high) {
            return 1.0;
        } else {
            var delta = high == low ? 1.0 : high - low;
            return (value - low) / delta;
        }
    };
}

function getBinaryScale(thresh) {
    return function(value) {
        return value > thresh ? 1.0 : 0.0;
    }
}

function getExpScale(scale) {
    return function(value) {
        return Math.pow(10, scale(value)) / 10.0;
    };
}

function getLogScale(scale) {
    return function(value) {
        return Math.log(1 + 9 * scale(value)) / Math.LN10;
    };
}

function getInverseScale(scale) {
    return function(value) {
        return 1.0 - scale(value);
    }
}

function updateMax(prev, next) {
    if (prev == null)
        return next;
    else
        return Math.max(prev, next);
}

function updateMax(prev, next) {
    if (prev == null)
        return next;
    else
        return Math.max(prev, next);
}
