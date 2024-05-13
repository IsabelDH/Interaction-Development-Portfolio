let ball;
let deltaX, deltaY;
const w = window.innerWidth;
const h = window.innerHeight;
const beginX = w / 2;
const beginY = h / 2;
let score = 0;
let round = 1;

function setup() {
  createCanvas(w, h);
  ball = new Ball(beginX, beginY, 25, "  #6e069f");
}

function draw() {
  background(252, 228, 204);

  // Teken de cirkel in het midden
  fill('#a58bbf');
  circle(beginX - 50, beginY, ball.size + 30);


  deltaX = map(rotationX, -30, 30, -5, 5);
  deltaY = map(rotationY, -30, 30, -5, 5);
  ball.move(deltaX, deltaY);
  ball.show();


  if (dist(ball.x, ball.y, beginX - 50, beginY) < ball.size /3 + 10) {
    score++;
    ball.reset();
  }


  fill(0);
  textAlign(CENTER);
  textSize(20);
  text(`Score: ${score} | Round: ${round}`, width / 2, 30);
}

class Ball {
  constructor(x, y, s, c) {
    this.x = x;
    this.y = y;
    this.size = s;
    this.color = c;
  }

  show() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  move(xOff, yOff) {
    this.x += xOff;
    this.y += yOff;


    this.x = constrain(this.x, 0 + this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, 0 + this.size / 2, height - this.size / 2);
  }

  reset() {
  
    this.x = beginX;
    this.y = beginY;

t
    round++;
  }
}
