/*
 * load.js
 *
 * Retrieve data from the server 
 * 
 * requires:
 *   math.js
 *   jquery.js
 *
 * Ryan Cabeen
 * cabeen@cs.brown.edu
 * September 2012
 */

/** Fetch a JSON object and wait for it to be received */
function getJsonSync(url) {
    return JSON.parse($.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function() {},
        data: {},
        async: false
    }).responseText);
};

/** Fetch a JSON object and process it in the background */
function getJsonAsync(url, callback) {
    $.getJSON(url, callback);
}

function NetworkCache() {
    this.index = loadIndex("data/index.json");
    this.cache = {};
    this.list = [];

    for (var prop in this.index) {
        this.list[this.list.length] = prop;
        this.cache[prop] = null;
    }
}

NetworkCache.prototype.getList = function() {
    return this.list;
}

NetworkCache.prototype.getNetwork = function(name) {
    if (this.cache[name] == null) {
        this.cache[name] = loadNetwork(this.index[name]); 
    }

    return this.cache[name];
}

function loadIndex(url) {
    return getJsonSync(url);
}

function loadNetwork(url) {
    console.log("downloading network");
    var source = getJsonSync(url);

    console.log("building network");
    var idx = {};
    var network = {
        weights: [],
        nodes: [],
        matrices: {},
        stats: {}
    };

    // define the weights
    for (var prop in source.links[0]) {
        if (prop != "a" && prop != "b") {
            network.weights[network.weights.length] = prop;
        }
    }

    // define the node names
    source.nodes.forEach(function(node, n) {
        var hasName = node.hasOwnProperty("name");
        network.nodes[network.nodes.length] = hasName ? node.name : "node_" + n;
        idx[node.index] = n;
    });

    // map the link weights 
    var num = source.nodes.length; 
    network.weights.forEach(function(metric) {
        var matrix = createFilledMatrix(num, num, null); 

        // set the off diagonal elements
        source.links.forEach(function(link) {
            if (metric in link && !isNaN(link[metric])) {
                var aidx = idx[link.a];
                var bidx = idx[link.b];
                var val = link[metric];

                matrix[aidx][bidx] = val;
                matrix[bidx][aidx] = val;
            }
        });

        // set the diagonal elements
        source.nodes.forEach(function(node) {
            if (metric in node && !isNaN(node[metric])) {
                var nidx = idx[node.index];
                var val = node[metric];
                
                matrix[nidx][nidx] = val;
            }
        });
        
        var stats = getMatrixStats(matrix);
       
        network.matrices[metric] = matrix; 
        network.stats[metric] = stats;
    });

    console.log("loaded network");

    return network;
}
