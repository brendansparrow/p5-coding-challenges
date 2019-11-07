// model
let imageModel = '';
// Video
let video;
let flipVideo;

// Classifier
let classifier;

// store classification
let label = 'thinking...';

// Step 1: Load the model
function preload() {
  classifier = ml5.imageClassifier(imageModel + 'model.json');
}



let snake;
let resolution = 20;
let food;
let w;
let h;

function setup() {
  createCanvas(640, 480);

  // create the video
  video = CreateCapture(VIDEO);
  video.hide();
  flipVideo = ml5.flipImage(video);

  // Step 2: Start classifying
  classifyVideo();

  w = floor(width / resolution);
  h = floor(width / resolution);
  frameRate(5);
  snake = new Snake();
  foodLocation();
}


function draw() {
  background(50);
  image(flipVideo, 0, 0);
  textSize(32);
  fill(255);
  text(label, 10, 50);

  // Snake
  snake.kill();
  snake.update();
  snake.show();

  // Food
  if (snake.eat(food)) {
    newFoodLocation();
  }
  fill(255, 0, 100)
  rect(food.x, food.y, gridscale, gridscale)
}


function classifyVideo() {
  flipVideo = ml5.flipImage(video);
  classifier.classify(flipVideo, resultsAdded);
}

// Step 3: Get the classification!
function resultsAdded(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  webcamControls();
  classifyVideo();
}


// Controls
function webcamControls() {
  if (label === 'up') {
    snake.dir(0, -1);
  } else if (label === 'down') {
    snake.dir(0, 1);
  } else if (label === 'right') {
    snake.dir(1, 0);
  } else if (label === 'left') {
    snake.dir(-1, 0);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    snake.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    snake.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    snake.dir(-1, 0);
  }
}

function newFoodLocation() {
  var cols = floor(width / gridscale);
  var rows = floor(height / gridscale);
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

  this.eat = function (pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.kill = function () {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total = 0;
        this.tail = [];
      }
    }
  }

  this.update = function () {
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y, gridscale, gridscale);

    this.x = this.x + this.xspeed * gridscale;
    this.y = this.y + this.yspeed * gridscale;

    this.x = constrain(this.x, 0, width - gridscale);
    this.y = constrain(this.y, 0, height - gridscale);
  }

  this.show = function () {
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, gridscale, gridscale)
    }
    rect(this.x, this.y, gridscale, gridscale)
  }
}

