// Paddle constructor
function Paddle(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 100;
  this.speed = 25;
}

Paddle.prototype.render = function() {
  blocPongContext.fillStyle = 'rgb(255,255,255)';
  blocPongContext.fillRect(
    this.x,
    this.y,
    this.width,
    this.height
  );
};

Paddle.prototype.move = function(keycode) {
  if (this.id == 1) {
    if (this.y > 0 && 
      (keycode == 87 || keycode == 38 && gameConfig.vs == 'computer')) {
      this.y -= this.speed;
    } else if (this.y + this.height < HEIGHT &&
      (keycode == 83 || keycode == 40 && gameConfig.vs == 'computer')) {
      this.y += this.speed;
    }
  } else if (this.id == 2) {
    if (this.y > 0 && keycode == 38) {
      this.y -= this.speed;
    } else if ( this.y + this.height < HEIGHT && keycode == 40) {
      this.y += this.speed;
    }
  }
};

// Computer constructor
function Computer(id, x, y) {
  Paddle.call(this, id, x, y);
  this.speed = 5;
}

Computer.prototype = new Paddle();
Computer.prototype.constructor = Computer;

Computer.prototype.update = function () {
  var yCenter = this.y + this.height / 2;

  if (ball.y < yCenter - this.speed) {
    this.move(38);
  } else if (ball.y > yCenter + this.speed) {
    this.move(40);
  }
}

// Ball constructor
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.startingAngle = 0;
  this.endingAngle = 2 * Math.PI;
  this.counterClockwise = false;
  this.xSpeed = Math.random() < 0.5 ? -1 * 4 : 4;
  this.ySpeed = Math.random() < 0.5 ? Math.floor(Math.random() * 3) - 4 : Math.floor(Math.random() * 4) + 1;
}

Ball.prototype.collisionCheck = function() {
  var ballRect = {
    top: this.y - this.radius,
    bottom: this.y + this.radius,
    left: this.x - this.radius,
    right: this.x + this.radius
  };
  var leftRange = {
    top: leftPaddle.y,
    bottom: leftPaddle.y + leftPaddle.height,
    left: leftPaddle.x,
    right: leftPaddle.x + leftPaddle.width
  };
  var rightRange = {
    top: rightPaddle.y,
    bottom: rightPaddle.y + rightPaddle.height,
    left: rightPaddle.x,
    right: rightPaddle.x + rightPaddle.height
  };

  if (ballRect.left <= 0 || ballRect.right >= WIDTH) {
    wallHit(this);
  } else if (this.xSpeed < 0 && intersectRect(ballRect, leftRange)) {
    paddleReflect(this, leftRange);
  } else if (this.xSpeed > 0 && intersectRect(ballRect, rightRange)) {
    paddleReflect(this, rightRange);
  }

  if (ballRect.top <= 0 || ballRect.bottom >= HEIGHT) {
    this.ySpeed *= -1;
  }
};

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function paddleReflect(ball, paddle) {
  var a = 0.0001, b = 0.005, c = 0.5, x = null;
  x = ball.ySpeed < 0 ? paddle.bottom - ball.y : ball.y - paddle.top;

  ball.xSpeed *= -1.1;
  ball.ySpeed *= (a * (x * x)) + (b * x) + c;
}

function wallHit(ball) {
  var position = ball.x

  if (position < WIDTH / 2) {
    p2ScoreElement.innerHTML = ++playerTwoScore;
  } else {
    p1ScoreElement.innerHTML = ++playerOneScore;
  }

  ball.x = WIDTH / 2;
  ball.y = HEIGHT / 2;
  ball.xSpeed = 0;
  ball.ySpeed = 0;

  if (playerOneScore == 11) {
    gameOver('p1')
  } else if (playerTwoScore == 11) {
    gameOver('p2');
  } else {
    setTimeout(reset(position), 2000);
  }
}

function reset(position) {
  return function() {
    ball.xSpeed = position < WIDTH / 2 ? -4 : 4;
    ball.ySpeed = Math.random() < 0.5 ? Math.floor(Math.random() * 3) - 4 : Math.floor(Math.random() * 4) + 1;
  };
}

Ball.prototype.render = function() {
  blocPongContext.fillStyle = 'rgb(255,255,255)';
  blocPongContext.beginPath();
  blocPongContext.arc(
    this.x,
    this.y,
    this.radius,
    this.startingAngle,
    this.endingAngle,
    this.counterClockwise
  );
  blocPongContext.fill();

  this.collisionCheck();

  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;
};