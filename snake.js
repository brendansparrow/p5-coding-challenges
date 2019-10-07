// Challenge #3
// A snake game using P5.js

// constants
const snake;
const food;
const gridscale = 20;

// P5.js setup
function setup() {
  createCanvas(600,400);
  snake = new Snake();
  frameRate(12);
  spawnFood();
}

// P5.js draw
function draw() {
  background(50);
  
  // Snake
  snake.kill();
  snake.update();
  snake.show();
  
  // Food
  if (snake.eat(food)) {
    newFoodLocation();
  }
  fill(255,0,100)
  rect(food.x, food.y, gridscale, gridscale)
}

// Controls
function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.dir(0,-1);
  } else if (keyCode === DOWN_ARROW) {
    snake.dir(0,1);
  } else if (keyCode === RIGHT_ARROW) {
    snake.dir(1,0);
  } else if (keyCode === LEFT_ARROW) {
    snake.dir(-1,0);
  }
}

function newFoodLocation() {
  var cols = floor(width/gridscale);
  var rows = floor(height/gridscale);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(gridscale);
}

// Snake constructor

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];

  this.eat = function(pos) {
    var d = dist(this.x,this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }
  
  this.dir = function(x,y) {
    this.xspeed = x;
    this.yspeed = y;
  }
  
  this.kill = function() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total = 0;
        this.tail = [];
      }
    }
  }
  
  this.update = function() {
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length-1; i++) {
        this.tail[i] = this.tail[i+1];
      } 
    }
    this.tail[this.total-1] = createVector(this.x, this.y, gridscale, gridscale);
    
    this.x = this.x + this.xspeed * gridscale;
    this.y = this.y + this.yspeed * gridscale;
    
    this.x = constrain(this.x, 0, width-gridscale);
    this.y = constrain(this.y, 0, height-gridscale);
  }
  
  this.show = function() {
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, gridscale, gridscale)
    }
    rect(this.x, this.y, gridscale, gridscale)
  }
}
