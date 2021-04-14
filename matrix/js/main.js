/*
 * main.js
 *
 * Generate the matrix view of the connectome data. 
 * 
 * requires:
 *   matrix.js
 *   math.js
 *   load.js
 *   jquery.js
 *   d3.js
 *
 * Ryan Cabeen
 * cabeen@cs.brown.edu
 * September 2012
 */

function main() {
    var cache = new NetworkCache();
    var names = cache.getList();
    var first = cache.getNetwork(names[0]);
    var nodes = first.nodes;
    var metrics = first.weights;
    var scales = getScaleList();

    var tooltip = d3.select("#tooltip");
    $(document).mousemove(function(e){
        tooltip.style("top", (event.pageY - 15) + "px")
            .style("left", (event.pageX + 15) + "px");
    });

    var showtip = function(x, y) {
        var name = $("#name").find(":selected").text();
        var metric = $("#metric").find(":selected").text();
        var network = cache.getNetwork(name);
        var matrix = network.matrices[metric];
        var v = matrix[x][y];
        if (!isNaN(v)) {
            var a = nodes[x];
            var b = nodes[y];
            tooltip.style("visibility", "visible");
            tooltip.text(d3.round(v, 4) + " " + a + " " + b);
        }
   };

   var hidetip = function(x, y) {
        tooltip.style("visibility", "hidden");
   }

    var settings = {
        names: nodes,
        color: function(x, y) {return "blue";},
        alpha: function(x, y) {return 0.0;},
        enter: showtip,
        exit: hidetip
    };

    var plot = new MatrixPlot(settings);
    var update = function() {
        var name = $("#name").find(":selected").text();
        var metric = $("#metric").find(":selected").text();
        var scale = $("#scale").find(":selected").text();
        var a = $("#bounds").slider("values", 0);
        var b = $("#bounds").slider("values", 1);

        var network = cache.getNetwork(name);
        var matrix = network.matrices[metric];
        var min = network.stats[metric].min;
        var max = network.stats[metric].max;
        var delta = max - min;
        var low = min + a * delta;
        var high = min + b * delta;
        var scale = getScale(scale, low, high);

        plot.alpha = function(x, y) {return scale(matrix[x][y]);};
        plot.value = function(x, y) {return matrix[x][y];};
        plot.update();
    };

    $("#bounds").slider({
        range: true,
        min: 0,
        max: 1.0,
        step: 0.01,
        values: [0, 1.0],
        stop: update
    });

    var buildSelect = function(sel, items, callback) {
        var selector = $(sel);
        var options = selector.prop("options");
        $("optionselector", selector).remove();
        items.forEach(function(item) {
            options[options.length] = new Option(item, item);
        });
        // select the first item
        selector.val(items[0]);
        selector.change(callback);
    }

    buildSelect("#name", names, update);
    buildSelect("#metric", metrics, update);
    buildSelect("#scale", scales, update);
    //buildSelect("#order", model.orders, orderCallback);

    plot.build();
    update();
    plot.update();
}

window.onload = main;

/*
var value = this.value;
var name = $("#name").find(":selected").text();
var metric = $("#metric").find(":selected").text();
var ordering = {
    name: byname,
    sum: d3.range(model.nodes.length).sort(function(a, b) {
        var av = model.stats[name][metric][model.nodes[a]].sum;
        var bv = model.stats[name][metric][model.nodes[b]].sum; return bv - av;
    }),
    min: d3.range(model.nodes.length).sort(function(a, b) {
        var av = model.stats[name][metric][model.nodes[a]].min;
        var bv = model.stats[name][metric][model.nodes[b]].min;
        return bv - av;
    }),
    max: d3.range(model.nodes.length).sort(function(a, b) {
        var av = model.stats[name][metric][model.nodes[a]].max;
        var bv = model.stats[name][metric][model.nodes[b]].max;
        return bv - av;
    })
}[value];
*/
