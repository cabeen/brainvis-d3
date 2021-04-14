/*
 * matrix.js
 *
 * Generate a matrix visualization of a network.
 * 
 * requires:
 *   math.js
 *   jquery.js
 *   d3.js
 *
 * Ryan Cabeen
 * cabeen@cs.brown.edu
 * September 2012
 */

var DEFAULT_MATRIX_SETTINGS = {
    selection: "#plot",
    top: 150,
    right: 150,
    bottom: 10,
    left: 10,
    width: 1000,
    height: 1000,
    scale: 6,
    background: "rgba(255, 255, 255, 0.75)",
    names: ["a", "b", "c", "d"],
    color: function(x, y) {return "rgb(" + 255 * x / 3 + ", " + 255 * y / 3 + ", 0)";},
    alpha: function(x, y) {return (4.0 * y + x) / 15.0},
    enter: function(x, y) {},
    exit: function(x, y) {}
};

function MatrixPlot(settings) {
    for (var prop in DEFAULT_MATRIX_SETTINGS) {
        if (prop in settings) {
            this[prop] = settings[prop];
        } else {
            this[prop] = DEFAULT_MATRIX_SETTINGS[prop];
        }
    }
}

MatrixPlot.prototype.build = function() {
    console.log("creating matrix plot");
    var names = this.names;
    var width = this.width;
    var scale = this.scale;
    var enter = this.enter;
    var exit = this.exit;

    var n = names.length;
    var matrix = [];
    for (var y = 0; y < n; y++) {
        var row = [];
        for (var x = 0; x < n; x++) {
            row[x] = {x: x, y: y};
        }
        matrix[y] = row;
    }

    this.svg = d3.select(this.selection)
        .append("svg")
        .attr("width", this.width + this.left + this.right)
        .attr("height", this.height + this.top + this.bottom)
        .style("margin-left", -1.0 * this.left + "px")
        .append("g")
        .attr("transform", "translate(" + this.left + "," + this.top + ")");

    this.svg.append("rect")
        .attr("class", "background")
        .attr("width", this.width)
        .attr("height", this.height);

    // define the default ordering
    var byname = d3.range(names.length).sort(function(a, b) {
        var na = names[a];
        var nb = names[b];
        return d3.ascending(na, nb);
    });

    var place = d3.scale.ordinal().rangeBands([0, this.width]);
    place.domain(byname);
    this.place = place;

    // create the row labels
    var rows = this.svg.selectAll(".row")
        .data(matrix)
        .enter()
        .append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) {
            return "translate(0," + place(i) + ")";
        });

    rows.append("text")
        .attr("x", -this.scale)
        .attr("y", place.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("transform", function(d, i) {
            return "translate(" + (width + 2 * scale) + ", 0)";
        })
        .text(function(d, i) { return names[i]; });

    // create the horizontal divisions
    rows.append("line")
        .attr("x2", this.width);

    // create the columns
    var columns = this.svg.selectAll(".column")
        .data(matrix)
        .enter()
        .append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) {
            return "translate(" + place(i) + ")rotate(-90)";
         });

    // create the column labels
    columns.append("text")
        .attr("x", 6)
        .attr("y", place.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) { return names[i]; });

    // create the vertical divisions
    columns.append("line")
        .attr("x1", -this.width);

    // create the cells
    var rows = this.svg.selectAll(".row")
        .data(matrix)
        .each(function (row) {
            d3.select(this).selectAll(".cell")
                .data(function (e) {return e;})
                .enter()
                .append("rect")
                .attr("class", "cell")
                .attr("x", function(e) {return place(e.x);})
                .attr("width", place.rangeBand())
                .attr("height", place.rangeBand())
                .style("fill-opacity", 0)
                .style("fill", function(d) {return this.background;})
                .on("mouseover", function(p) {
                    d3.selectAll(".row text")
                        .classed("active", function(d, i) {
                            return i == p.y;
                        });

                    d3.selectAll(".column text")
                        .classed("active", function(d, i) {
                            return i == p.x;
                        });
                    enter(p.x, p.y);
                })
                .on("mouseout", function(p) {
                    d3.selectAll("text").classed("active", false);
                    exit(p.x, p.y);
                });
    });
    console.log("created matrix plot");
}

MatrixPlot.prototype.reorder = function(ordering) {
    console.log("reordering rows and columns in plot");
    place.domain(ordering);
    var trans = this.svg.transition().duration(2500);

    trans.selectAll(".row")
        .delay(function(d, i) { return place(i) * 4; })
        .attr("transform", function(d, i) {
            return "translate(0," + place(i) + ")";
        })
        .selectAll(".cell")
        .delay(function(d) { return place(d.x) * 4; })
        .attr("x", function(d) { return place(d.x); });

    trans.selectAll(".column")
        .delay(function(d, i) { return place(i) * 4; })
        .attr("transform", function(d, i) {
            return "translate(" + place(i) + ")rotate(-90)";
        });
    console.log("reordered rows and columns in plot");
}

MatrixPlot.prototype.update = function() {
    console.log("updating plot");
    var color = this.color;
    var alpha = this.alpha;
    this.svg.selectAll(".cell")
        .transition()
        .style("fill", function(e) {
            return color(e.x, e.y);
        })
        .style("fill-opacity", function(e) {
            return alpha(e.x, e.y);
        })
        .duration(1000);
    console.log("updated plot");
}
