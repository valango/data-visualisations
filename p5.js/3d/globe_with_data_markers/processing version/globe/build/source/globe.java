import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import peasy.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class globe extends PApplet {

/*
  Creates a globe & adds position markers to every capital city in the world.
  Based on: https://www.youtube.com/watch?v=dbs4IYGfAXc&t=15s
*/



PeasyCam cam; //all you need for camera control, wish something like this was in p5

float angle;
float r = 200;
Table table;

PImage earth;
PShape globe;

public void setup() {
  
  cam = new PeasyCam(this, 500);
  table = loadTable("../../p5 version(wip)/capitalcities.csv", "header");
  earth = loadImage("../../p5 version(wip)/theworld.jpg");

  noStroke();
  globe = createShape(SPHERE,r);
  globe.setTexture(earth);
}

public void draw() {
  //noLoop();
  background(51);
  //translate(width*0.5, height*0.5);
  //rotateY(angle);
  //angle += 0.02;

  fill(200);
  noStroke();
  shape(globe);

  for (TableRow row : table.rows()) {
    float lat = row.getFloat("Latitude");
    float lon = row.getFloat("Longitude");

    float theta = radians(lat) + PI/2;
    float phi = radians(-lon) + PI;

    float x = r * sin(theta) * cos(phi);
    float y = r * cos(theta);
    float z = r * sin(theta) * sin(phi);

    //println(x,y,z);
    pushMatrix();
    translate(x,y,z);
    fill(255,0,0);
    sphere(1);
    popMatrix();
  }
}
  public void settings() {  size(600, 600, P3D); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "globe" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
