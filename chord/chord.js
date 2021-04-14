console.log(data)

var chord = d3.layout.chord()
  .padding(.05)
  .matrix(data.x);

var w = 640,
    h = 640,
    r0 = Math.min(w, h) * .25,
    r1 = r0 * 1.1;

var chord_fill = d3.scale.ordinal()
    .domain(d3.range(data.chord_colors.length))
    .range(data.chord_colors)

var roi_fill = d3.scale.ordinal()
    .domain(d3.range(10))
    .range(data.roi_colors)

var svg = d3.select("#chart")
  .append("svg")
    .attr("width", w)
    .attr("height", h)
  .append("g") .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")"); 
svg.append("g")
  .selectAll("path")
    .data(chord.groups)
  .enter().append("path")
    .style("fill", function(d) { return roi_fill(d.index); })
    .style("stroke", function(d) { return "#000000"; })
    .attr("d", d3.svg.arc().innerRadius(r0).outerRadius(r1))
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

svg.append("g")
  .selectAll("g")
    .data(chord.groups)
  .enter().append("g").append("text")
    .each(function(d) { console.log(d); d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + (r0 + 30) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .text(function(d) { return data.rois[d.index]; })
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

svg.append("g")
    .attr("class", "chord")
  .selectAll("path")
    .data(chord.chords)
  .enter().append("path")
    .style("fill", function(d) { return chord_fill(data.y[d.source.index][d.target.index]); })
    .attr("d", d3.svg.chord().radius(r0))
    .style("opacity", 1);

function fade(opacity) {
  return function(g, i) {
    svg.selectAll("g.chord path")
        .filter(function(d) {
          return d.source.index != i && d.target.index != i;
        })
      .transition()
        .style("opacity", opacity);
  };
}
