
// https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5
// https://www.youtube.com/watch?v=BrFZ5RkywcY
// https://p5js.org/examples/3d-sine-cosine-in-3d.html
// https://en.wikipedia.org/wiki/Spherical_coordinate_system

var cnv;
var size = 0;
var total = 20;
var globe = Create2DArray(total+1);
var rotation = 0;
var angle = 0;

function preload() {

}

function setup(){
  cnv = createCanvas(1280, 960, WEBGL);
  //noLoop();
}

function draw(){
  background(0);

  rotateY(angle);
  angle += 0.02;
  noStroke();
  var r = 200;
  for (var i = 0; i < total+1; i++) {
    var lat = map(i, 0, total, 0, PI);
    for (var j = 0; j < total+1; j++) {
      var lon = map(j, 0, total, 0, TWO_PI);
      var x = r * sin(lat) * cos(lon);
      var y = r * sin(lat) * sin(lon);
      var z = r * cos(lat);
      globe[i][j] = new p5.Vector(x,y,z);
    }
  }

  for (var i = 0; i < total; i++) {

    if (i % 2 == 0) {
      fill(0);
    } else {
      fill(255);
    }

    beginShape(TRIANGLE_STRIP);
    for (var j = 0; j < total+1; j++) {
      var v1 = globe[i][j];
      stroke(120);
      strokeWeight(2);
      vertex(v1.x, v1.y, v1.z);
      var v2 = globe[i+1][j];
      vertex(v2.x, v2.y, v2.z);
    }
    endShape();
  }


}

function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}
