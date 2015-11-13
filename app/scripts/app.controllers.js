(function() {

  angular
    .module('app.controllers', [])
    .controller('BlocPongController', [
      '$scope',
      BlocPongController
    ]);

  function BlocPongController($scope) {
    var playerOneScore = 0;
    var playerTwoScore = 0;

    var p1ScoreElement = document.getElementById('player-one-score');
    var p2ScoreElement = document.getElementById('player-two-score');

    var blocPongCanvas = document.getElementById('bloc-pong');
    var blocPongContext = blocPongCanvas.getContext('2d');
    var WIDTH = blocPongCanvas.width;
    var HEIGHT = blocPongCanvas.height;

    // Paddle constructor
    function Paddle(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 100;
      this.speed = 50;
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
      if (keycode == 38 && this.y > 0) {
        this.y -= this.speed;
      } else if (keycode == 40 && this.y + this.height < HEIGHT) {
        this.y += this.speed;
      }
    };

    // Computer constructor
    function Computer(x, y) {
      Paddle.call(this, x, y);
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
      if (this.x - this.radius <= 0 || this.x + this.radius >= WIDTH) {       // Ball hits left or right wall
        this.wallHit();
      } else if (this.y - this.radius <= 0 ||   // Ball hits top or bottom of wall
          this.y + this.radius >= HEIGHT) {
        this.ySpeed *= -1;
      } else if (this.x - this.radius <= leftPaddle.x + leftPaddle.width &&    // Ball hits left paddle
        this.y <= leftPaddle.y + leftPaddle.height &&
        this.y >= leftPaddle.y) {
          this.paddleHit(leftPaddle);
      } else if (this.x + this.radius >= rightPaddle.x &&                      // Ball hits right paddle
        this.y <= rightPaddle.y + rightPaddle.height &&
        this.y >= rightPaddle.y) {
          this.paddleHit(rightPaddle);
      }
    };

    Ball.prototype.wallHit = function() {
      var position = this.x;

      if (position < WIDTH / 2) {
        p2ScoreElement.innerHTML = ++playerTwoScore;
      } else {
        p1ScoreElement.innerHTML = ++playerOneScore;
      }
      
      this.x = WIDTH / 2;
      this.y = HEIGHT / 2;
      this.xSpeed = 0;
      this.ySpeed = 0;

      setTimeout(reset(position), 3000);
    };

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

    // Shapes
    var leftPaddle = new Paddle(20, HEIGHT / 2 - 50);
    // var rightPaddle = new Paddle(WIDTH - 15, HEIGHT / 2 - 50); 
    var rightPaddle = new Computer(WIDTH - 25, HEIGHT / 2 - 50);
    var ball = new Ball(WIDTH/2, HEIGHT/2);

    function render() {
      blocPongContext.clearRect(0,0,WIDTH,HEIGHT);
      leftPaddle.render();
      rightPaddle.render();
      ball.render();
      if (rightPaddle instanceof Computer) {
        rightPaddle.update();
      }
    }

    var animate = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     ||
            function(callback) { window.setTimeout(callback, 1000/60) };

    function step() {
      render();
      animate(step);
    }

    window.onload = step;
    window.addEventListener('keydown', function(e) {
      e.preventDefault();
      leftPaddle.move(e.keyCode);
    });

  }

})();