/*
  A WIP port of the Processing version
*/

var angle = 0;
var r = 200;
var table;
var cnv;
var earth;
var globe;
var markers = [];
var zoomLevel = 1.00;
var minZoom = 0.5;
var maxZoom = 3.00;
var sensitivity = 0.005;
var rotationX = 0;
var rotationY = 0;

function preload() {
  table = loadTable("capitalcities_less.csv", "csv", "header"); // 10 capitals
  //table = loadTable("capitalcities.csv", "csv", "header"); // alternative file with over 200 capitals, pretty cpu intensive
  earth = loadImage("theworld.jpg");
}

function setup() {
  cnv = createCanvas(1000, 600, WEBGL);
}

function draw() {
  background(50);

  // some form of camera control with mouse, not ideal
  //orbitControl();

  // optional camera control with mouse, works quite well but i like the arrow keys better
  /*if (mouseIsPressed) {
    rotateY(mouseX * 0.02);
    rotateX(mouseY * 0.02);
  }*/

  // arrow keys for rotating globe
  if (keyIsDown(LEFT_ARROW)) {
    rotationX -= 0.02;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    rotationX += 0.02;
  }

  if (keyIsDown(UP_ARROW)) {
    rotationY += 0.02;
  }

  if (keyIsDown(DOWN_ARROW)) {
    rotationY -= 0.02;
  }

  rotateX(rotationY);
  rotateY(rotationX);
  scale(zoomLevel);
  texture(earth);
  sphere(r);

  for (var row = 0; row < table.getRowCount(); row++) {
    var lat = table.getNum(row, "Latitude");
    var lon = table.getNum(row, "Longitude");

    //convert to spherical coordinates
    var theta = radians(lat) + PI/2;
    var phi = radians(-lon) + PI;

    var x = r * sin(theta) * cos(phi);
    var y = r * cos(theta);
    var z = r * sin(theta) * sin(phi);

    var markerData = {
      "x": x,
      "y": y,
      "z": z,
      "country": table.getString(row, "Country"),
      "capital": table.getString(row, "Capital")
    };

    var marker = new GlobeMarker(markerData);
    markers.push(marker);
    marker.display();
  }

}

// zoom globe with mousewheel
function mouseWheel(event) {
  zoomLevel += sensitivity * event.delta;
  zoomLevel = constrain(zoomLevel, minZoom, maxZoom);
  //uncomment to block page scrolling
  return false;
}

// really no other way to implement click events on individual elements?
/*function mousePressed() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].clicked();
  }
}*/

function GlobeMarker(data) {
  this.x = data.x;
  this.y = data.y;
  this.z = data.z;
  this.country = data.country;
  this.capital = data.capital;

  //console.log(this.x, this.y, this.z);

  this.display = function() {
    push();
    // something goes wrong here & the marker is not placed in the correct spot.
    // the xyz values are correct though
    translate(this.x,this.y,this.z);
    fill(255,0,0);
    sphere(1);
    pop();
  }

  // tried to implement a click event on individual markers to print the country & capital somewhere,
  // currently d calculation is incorrect due to markers not being where they're supposed to.
  this.clicked = function() {
    var d = dist(mouseX, mouseY, this.x, this.y);
    if ((d) < 5) {
      console.log(table.getString(this.id, "Country"));
      console.log(table.getString(this.id, "Capital"));
    }
  }

}
