document.getElementById('motion').onclick = requestMotionPermission;
let deltaX = 0;
const w = window.innerWidth;
const h = window.innerHeight /1.2;
const beginX = w / 2;
const beginY = h / 2;
let ball;
let paddle;
let bricks = [];
let rows = 5;
let cols = 8;
let brickWidth = w / cols;
let brickHeight = 45;
let score = 0;
let gameStarted = false;

function setup() {
    createCanvas(w, h);
    ball = new Ball(beginX, beginY, 40, "#6e069f");
    paddle = new Paddle(w / 2, h  - 30, 180, 35);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            bricks.push(new Brick(j * brickWidth, i * brickHeight));
        }
    }
}

function draw() {
    background(236, 229, 220);
    if (gameStarted) {
        ball.show();
        paddle.show();
        paddle.move(deltaX);

        for (let i = bricks.length - 1; i >= 0; i--) {
            if (bricks[i].hits(ball)) {
                bricks.splice(i, 1);
                ball.bounce();
                score++;
            } else {
                bricks[i].show();
            }
        }

        ball.move();
        ball.checkEdges();

        if (ballHitsPaddle(ball, paddle)) {
            ball.bounce();
        }

        if (ball.y + ball.size / 2 > height) {
            textSize(42);
            fill('#9520D0');
            textAlign(CENTER);
            text('Game Over!', width / 2, height / 2);
            noLoop();  
        }
        

        textSize(29);
        fill('#9520D0');
        text(`Score: ${score}`, width / 2, 310);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#start').addEventListener('click', startGame);
    window.addEventListener('deviceorientation', handleOrientation);
});

function startGame() {
    gameStarted = true;
    document.querySelector('#start').style.display = 'none';
    loop();
}


function handleOrientation(event) {
    deltaX = map(event.gamma, -30, 30, -10, 10);
}

class Ball {
    constructor(x, y, s, c) {
        this.x = x;
        this.y = y;
        this.size = s;
        this.color = c;
        this.xSpeed = 5;
        this.ySpeed = -5;
    }

    show() {
        push();
        noStroke();
        fill(this.color);
        circle(this.x, this.y, this.size);
        pop();
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    checkEdges() {
        let r = this.size / 2;
        if (this.x - r < 0 || this.x + r > width) {
            this.xSpeed *= -1;
        }
        if (this.y - r < 0) {
            this.ySpeed *= -1;
        }
    }

    bounce() {
        this.ySpeed *= -1;
    }
}

class Paddle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    show() {
        push();
        fill('#9520D0');
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height);
        pop();
    }

    move(deltaX) {
        this.x += deltaX;
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
        }
        if (this.x + this.width / 2 > width) {
            this.x = width - this.width / 2;
        }
    }
}

class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = brickWidth;
        this.height = brickHeight;
        this.color = "#d9c9e1";
    }

    show() {
        push();
        fill(this.color);
        rect(this.x, this.y, this.width, this.height);
        pop();
    }

    hits(ball) {
        return ball.x + ball.size / 2 > this.x &&
               ball.x - ball.size / 2 < this.x + this.width &&
               ball.y + ball.size / 2 > this.y &&
               ball.y - ball.size / 2 < this.y + this.height;
    }
}

function ballHitsPaddle(ball, paddle) {
    return ball.y + ball.size / 2 > paddle.y - paddle.height / 2 &&
           ball.x > paddle.x - paddle.width / 2 &&
           ball.x < paddle.x + paddle.width / 2;
}
