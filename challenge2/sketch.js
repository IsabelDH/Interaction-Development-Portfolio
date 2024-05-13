let handpose;
let video;
let predictions = [];
let modelLoaded = false;
let balloons = []; // Array voor de objecten van ballonnen
let numBalloons = 7; // Hoeveelheid ballonnen
let score = 0;
let gameStarted = false;
let timerDuration = 30; // Duur van de timer in seconden
let timer;
let showEndScreen = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });

  video.hide();
  createStartScreen();

  // Ballonnen maken
  for (let i = 0; i < numBalloons; i++) {
    balloons.push(new Balloon(random(width), random(height)));
  }
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function videoReady() {
  console.log("Video ready!");
}

function startGame() {
  gameStarted = true;
  timer = setInterval(countdown, 1000); // Start de timer
}

function countdown() {
  timerDuration--;
  if (timerDuration <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(timer); // Stop de timer
  gameStarted = false;
  showEndScreen = true;

  setTimeout(() => {
    showEndScreen = false;
    resetGame();
    createStartScreen();
  }, 3000);
}

function resetGame() {
  score = 0;
  timerDuration = 30;
  balloons = [];
  for (let i = 0; i < numBalloons; i++) {
    balloons.push(new Balloon(random(width), random(height)));
  }
}

function displayEndScreen() {
  background(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(110, 6, 159);
  text(`Game over! Score: ${score}`, width / 2, height / 2);
}

function createStartScreen() {
  background(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(110, 6, 159);
  text("Hand Balloon Popper", width / 2, height / 2 - 50);

  // Play Game button
  rectMode(CENTER);
  fill(138, 43, 226);
  rect(width / 2, height / 2 + 50, 200, 80);

  fill(255, 255, 255);
  textSize(24);
  text("Play Game", width / 2, height / 2 + 50);
}

function draw() {
  if (!gameStarted) {
    if (showEndScreen) {
      displayEndScreen();
    } else {
      createStartScreen();
    }
  } else {
    if (modelLoaded) {
      scale(-1, 1);
      translate(-width, 0);
      image(video, 0, 0, width, height);
      drawFingers();
    }
    for (let i = 0; i < balloons.length; i++) {
      balloons[i].update();
      balloons[i].display();
    }
    resetMatrix();
    fill(110, 6, 159);
    textSize(24);
    textAlign(LEFT);
    text(`Score: ${score}`, 20, 40);
    textAlign(RIGHT);
    text(`Timer: ${timerDuration}`, width - 20, 40);
  }
}


function mousePressed() {
  if (!gameStarted && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 10 && mouseY < height / 2 + 90) {
    startGame();
  }

  if (!gameStarted && showEndScreen) {
    resetGame();
    showEndScreen = false;
    createStartScreen();
  }
}


function drawFingers() {
  push();
  rectMode(CORNERS);
  noStroke();
  fill(255, 0, 255);
  if (predictions[0] && predictions[0].hasOwnProperty('annotations')) {
    let index4 = predictions[0].annotations.indexFinger[3];
    circle(index4[0], index4[1], 10);
  }
  pop();
}

class Balloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.popped = false;
    this.isCorrect = random() > 0.5;
    this.points = this.isCorrect ? 5 : -5;
  }

  update() {
    // Checken of de ballon is gepopt
    if (!this.popped) {
      for (let i = 0; i < predictions.length; i++) {
        const check = predictions[i];
        if (check.annotations) {
          let indexFinger = check.annotations.indexFinger;
          for (let j = 0; j < indexFinger.length; j++) {
            let finger = indexFinger[j];
            let distance = dist(finger[0], finger[1], this.x, this.y);
            if (distance < this.radius && !this.popped) {
              this.popped = true;
              console.log("Balloon popped!");
              score += this.points;
              // Nieuwe ballon toevoegen na poppen
              balloons.push(new Balloon(random(width), random(height)));
            }
          }
        }
      }
    }
  }

  display() {
    if (!this.popped) {
      if (this.isCorrect) {
        fill(245, 215, 255);
      } else {
        fill(255, 0, 0);
      }
      ellipse(this.x, this.y, this.radius * 2);
      noStroke();
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER && !gameStarted) {
    startGame();
  }
}
