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

Ball.prototype.collissionCheck = function() {
  if (this.x - this.radius <= leftPaddle.x + leftPaddle.width && withinPaddle(this, leftPaddle)) {
    this.paddleHit(leftPaddle);
  } else if (this.x + this.radius >= rightPaddle.x && withinPaddle(this, rightPaddle)) {
    this.paddleHit(rightPaddle);
  } else if (this.x - this.radius <= 0 || this.x + this.radius >= WIDTH) {
    wallHit(this);
  }

  if (this.y - this.radius <= 0 || this.y + this.radius >= HEIGHT) {
    this.ySpeed *= -1;
  }
};

function withinPaddle(ball, paddle) {
  if (ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height) {
    return true;
  } else {
    return false;
  }
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

  setTimeout(reset(position), 2000);
}

function reset(position) {
  return function() {
    ball.xSpeed = position < WIDTH / 2 ? -4 : 4;
    ball.ySpeed = Math.random() < 0.5 ? Math.floor(Math.random() * 3) - 4 : Math.floor(Math.random() * 4) + 1;
  };
}

Ball.prototype.paddleHit = function(paddle) {
  var a = 0.0001, b = 0.005, c = 0.5, x = null;
  x = this.ySpeed < 0 ? paddle.y + paddle.height - this.y : this.y - paddle.y;
  
  // Parabolic function
  var speedMultiplier = (a * (x * x)) + (b * x) + c;

  this.xSpeed *= -1.1;
  this.ySpeed *= speedMultiplier;
};

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

  this.collissionCheck();

  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;
};