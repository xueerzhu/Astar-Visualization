/// Author: Xueer Zhu

"use strict";

/* global
  CLOSE
  background
  beginShape
  ellipse
  endShape
  fill
  line
  noFill
  noStroke
  noiseSeed
  pop
  push
  randomSeed
  stroke
  text
  translate
  vertex
  XXH
  loadImage
  image
  texture
  quad
  cylinder
  strokeWeight
*/

// A* for shortest path
var graph = new window.Graph([
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1,1],
  
]);
var start = graph.grid[0][0];
var end = graph.grid[9][9];

//var result = window.astar.search(graph, start, end);

// tiles data
let tiles = [];
// equals to half of the array size
// this offset the p2 base cord with graph search cord
let graphOffset = 5;   

function p2_preload() {}

function p2_setup() {
  //driven[[5, 0]] = 1;
}

let worldSeed;

function p2_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p2_tileWidth() {
  return 32;
}
function p2_tileHeight() {
  return 16;
}

let [tw, th] = [p2_tileWidth(), p2_tileHeight()];

let clicks = {};
let walls = {};

function p2_tileClicked(i, j) {
  // check validity
  if(i <= (graphOffset - 1) && i >= (0- graphOffset) && j <= (graphOffset - 1) && j >= (0- graphOffset)){
      end = graph.grid[i + graphOffset][j + graphOffset];
  }
  clicks[key] = 1 + (clicks[key] | 0);
  
}

function p2_drawBefore() {}
function p2_populateWorld(i, j) {
  // driven tiles turn black
  let currentTile = [i, j];
    
    if (XXH.h32("tile:" + [i, j], worldSeed) % 7 == 0) {
      
       // if wall is within test bound 
      if(i <= (graphOffset - 1) && i >= (0- graphOffset) && j <= (graphOffset - 1) && j >= (0- graphOffset)){
          graph.grid[i + graphOffset][j + graphOffset].weight = 0;
      }
      
      walls[currentTile] = 1;
  
    }
}

function p2_drawTile(i, j) {
  //noStroke();
  strokeWeight(1);
  stroke("black");

  // driven tiles turn black
  let currentTile = [i, j];
  
 // if tile is wall
    if (walls[currentTile] == 1) {
         drawWall();
     
    } else {
      push();
      fill("#B7E3E4"); //ground
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape(CLOSE);
      pop();
    }

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1 && walls[currentTile] != 1) {
    push();
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
    pop();
  }
}

function p2_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function drawStart() {
  push();
  fill("yellow");
  ellipse(0, 0, 20, 10);
  pop();
}

function drawEnd() {
  push();
  fill("green");
  ellipse(0, 0, 20, 10);
  pop();
}

let result;
function p2_drawTrail(i,j) {
   result = window.astar.search(graph, start, end);
  
  let trailIndex = 0;
  let bread;

  while (trailIndex < result.length) {
    bread = result[trailIndex];
    if (i == bread.x - graphOffset && j == bread.y - graphOffset) {
       push();
    fill("#3545E8");
    ellipse(0, 0, 20, 10);
    pop();
      //delayTime(1);
    }
    trailIndex++;
  }
  
   // an additional layer of wall if the trail is covered by walls
  // so to mimic drawing wall after trails for isometric effect 
   let currentTile = [i, j];
    if (walls[currentTile] == 1) {
         drawWall();
    }
  
      if (i == start.x - graphOffset && j == start.y - graphOffset) {
    drawStart();
  } else if (i == end.x - graphOffset && j == end.y - graphOffset) {
    drawEnd();
  }
  
  
 
}

function drawWall() {
  
      push();
      fill("#ED4634"); //wall
      let wallHeight = -45;

      // wall-groud
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape();
      // wall-left
      beginShape();
      vertex(-tw, 0);
      vertex(-tw, 0 + wallHeight);
      vertex(0, +th + wallHeight);
      vertex(0, +th);
      endShape();
      // wall-right
      beginShape();
      vertex(tw, 0);
      vertex(tw, 0 + wallHeight);
      vertex(0, +th + wallHeight);
      vertex(0, +th);
      endShape();
      // wall-top
      beginShape();
      vertex(-tw, 0 + wallHeight);
      vertex(0, th + wallHeight);
      vertex(tw, 0 + wallHeight);
      vertex(0, -th + wallHeight);
      endShape();

      endShape(CLOSE);
      pop();
}

function p2_drawAfter() {}
