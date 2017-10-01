
//********************* DIMENSIONS ************************************

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


//********************* SINE CHART ************************************

var xScaleSine = d3.scaleLinear().range([0, width]);
var yScaleSine = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
    .x(function(d) { return xScaleSine(d.a); })
    .y(function(d) { return yScaleSine(d.sine); })
    .curve(d3.curveBasis);

//appends canvas to html
var svg = d3.select("#sine").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")");

var yAxis = svg.append("g");
var xMax;

//reads data & renders chart
d3.csv("data/sin.csv", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
      d.a = +d.a;
      d.sine = +d.sine;
  });

  xMax = d3.max(data, function(d) { return d.a; });

  xScaleSine.domain(d3.extent(data, function(d) { return d.a; }));
  yScaleSine.domain([d3.min(data, function(d) { return d.sine; }), d3.max(data, function(d) { return d.sine; })]);

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("fill", "none")
      .attr("stroke", "black");

  xAxis.call(d3.axisBottom(xScaleSine));
  yAxis.call(d3.axisLeft(yScaleSine));

  renderSlider("#slider1", xMax);

});

function offsetSin(sliderValue) {
    xScaleSine.domain([0, xMax - sliderValue + 1]);
    var t = svg.transition().duration(0);
    t.select('.line').attr("d", valueline);
    xAxis.call(d3.axisBottom(xScaleSine));
  }


//********************* COSINE CHART ************************************

var xScaleCosine = d3.scaleLinear().range([0, width]);
var yScaleCosine = d3.scaleLinear().range([height, 0]);

var valueline2 = d3.line()
    .x(function(d) { return xScaleCosine(d.a); })
    .y(function(d) { return yScaleCosine(d.cosine); })
    .curve(d3.curveBasis);

var svg2 = d3.select("#cosine").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var xAxis2 = svg2.append("g")
    .attr("transform", "translate(0," + height + ")");

var yAxis2 = svg2.append("g");
var xMax2;
var data1;
d3.csv("data/cos.csv", function(error, data) {
  if (error) throw error;
  data1 = data;
  data.forEach(function(d) {
      d.a = +d.a;
      d.cosine = +d.cosine;
  });

  xMax2 = d3.max(data, function(d) { return d.a; });

  xScaleCosine.domain(d3.extent(data, function(d) { return d.a; }));
  yScaleCosine.domain([d3.min(data, function(d) { return d.cosine; }), d3.max(data, function(d) { return d.cosine; })]);

  svg2.append("path")
      .data([data])
      .attr("class", "line2")
      .attr("d", valueline2)
      .attr("fill", "none")
      .attr("stroke", "black");

  xAxis2.call(d3.axisBottom(xScaleCosine));
  yAxis2.call(d3.axisLeft(yScaleCosine));

  renderSlider("#slider2", xMax2);

});

function offsetCos(sliderValue) {
    xScaleCosine.domain([d3.min(data1, function(d) { return d.a-sliderValue; }), d3.max(data1, function(d) { return d.a-sliderValue; })]);
    var t = svg2.transition().duration(0);
    t.select('.line2').attr("d", valueline2);
  }


//************* SLIDER CONTROL *****************************

function renderSlider(id, maxVal) {
  $( id ).slider({
      min: 0,
      max: maxVal,
      value: 0,
      slide: function( event, ui ) {
        id.indexOf("1") > 0 ? offsetSin(ui.value) : offsetCos(ui.value)
      }
  });
}
