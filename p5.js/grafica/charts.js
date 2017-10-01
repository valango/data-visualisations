//**************  CONSTANTS ************************************

var SAMPLES = 200;              // Number of data samples.
var RANGE   = 100;              // Slider values range.
//  I kept this just for comparision;
//  In real applications we'd prefer CSS styling instead.
var MARGINS = [50, 50, 40, 20]; // bottom, left, top, right

//**************  Utility functions specific to this demo.

// Generate sample data.
function sinPoints (x0, count, periods) {
  var points = [], r = (periods || 4) * Math.PI, d = r / ((count - 1) || 1);
  for (var i = 0, x = x0; i < count; i++, x += d) {
    points[i] = [i, Math.sin(x)];
  }
  return points;
}

// Change x-magnification.
function driver1 (data, ctrlValue) {
  var res  = {v0: 0, v1: 0, points: []};
  var last = Math.floor(SAMPLES * (1 - ctrlValue / (2 * RANGE)));

  for (var i = 0; i < last; ++i) {
    res.points.push(new GPoint(res.v1 = data[i][0], data[i][1]));
  }
  return res;
}

// Change x-bias.
function driver2 (data, ctrlValue) {
  var res   = {v0: 0, v1: SAMPLES, points: []};
  var shift = ctrlValue * SAMPLES / RANGE;
  for (var i = 0; i < (SAMPLES - shift); ++i) {
    res.points.push(new GPoint(res.v1 = data[i][0] + shift, data[i][1]));
  }
  return res;
}

// Fin d min/max values - just out of politeness here ;)
function yRange (data) {
  var min, max;
  data.forEach(function (d) {
    if (min === undefined) {
      min = max = d[1];
    } else if (d[1] < min) {
      min = d[1];
    } else if (d[1] > max) max = d[1];
  })
  return [Math.round(min), Math.round(max)];
}

//**************  Actual Graphics housekeeping is below here.

// Factory pattern makes the code reusable.
function factory (domId, title, data, driver) {
  var sliderValue = 0;

  function renderSlider (id) {
    $(id).slider({
      min:   0,
      max:   RANGE,
      value: 0,
      slide: function (event, ui) {
        sliderValue = ui.value * 1
      }
    });
  }

  // Actual definitions for P5 constructor.
  function graphics (p5instance) {
    var plot;

    p5instance.setup = function () {  // Lifecycle hook.
      var gId    = domId + '-graphics';
      var el     = document.getElementById(gId);
      var w      = el.clientWidth, h = el.clientHeight || Math.floor(w * 2 / 5);

      p5instance.createCanvas(w, h).parent(gId);
      renderSlider('#' + domId + '-slider');
      plot = new GPlot(p5instance);
      plot.setDim(w - MARGINS[1] - MARGINS[3], h - MARGINS[0] - MARGINS[2]);
      plot.setMar(MARGINS);
      plot.setTitleText(title);
      plot.getXAxis().setNTicks(10);
      plot.getYAxis().setNTicks(2);
      plot.setYLim(yRange(data));
      plot.setLineColor(p5instance.color(10, 100, 100));
      plot.setAxesOffset(10);
    };

    p5instance.draw = function () {  // Lifecycle hook.
      var ctl = driver(data, sliderValue);

      plot.setPoints(ctl.points);
      plot.setXLim(ctl.v0, ctl.v1);
      // The following code could be replaced by just `plot.defaultDraw()`,
      // but this would result points being plotted too...
      // Todo: figure out how to control point style.
      plot.beginDraw();
      plot.drawBackground();
      plot.drawBox();
      plot.drawXAxis();
      plot.drawYAxis();
      plot.drawTitle();
      plot.drawGridLines(GPlot.BOTH);
      plot.drawLabels();
      plot.drawLines();
      plot.endDraw();
    };
  }

  return new p5(graphics);  // p5 is a global!
}

factory('section-1', 'sin(x)', sinPoints(0, SAMPLES, 4), driver1);
factory('section-2', 'cos(x)', sinPoints(Math.PI / 2, SAMPLES, 4), driver2);

