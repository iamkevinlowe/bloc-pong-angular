(function() {

  angular
    .module('app.controllers', [])
    .controller('BlocPongController', [
      '$scope',
      BlocPongController
    ]);

  function BlocPongController($scope) {
    var blocPongCanvas = document.getElementById('bloc-pong');
    var blocPongContext = blocPongCanvas.getContext('2d');

    var WIDTH = blocPongCanvas.width;
    var HEIGHT = blocPongCanvas.height;

    // Shapes
    var leftPaddle = new Paddle(10, HEIGHT / 2 - 50);
    var rightPaddle = new Paddle(WIDTH - 15, HEIGHT / 2 - 50); 
    var ball = new Ball(WIDTH/2, HEIGHT/2);

    // Paddle constructor
    function Paddle(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 100;
      this.speed = 20;
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

    // Ball constructor
    function Ball(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.startingAngle = 0;
      this.endingAngle = 2 * Math.PI;
      this.counterClockwise = false;
      this.xSpeed = Math.random() < 0.5 ? -1 * 5 : 5;
      this.ySpeed = Math.random() < 0.5 ? Math.floor(Math.random() * 4) - 5 : Math.floor(Math.random() * 4) + 1;
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

      collissionCheck();

      ball.x += ball.xSpeed;
      ball.y += ball.ySpeed;
    };

    function collissionCheck() {
      if (ball.x < 0) {                         // Ball hits left wall
        console.log("Player 2 wins");
      } else if (ball.x > WIDTH) {              // Ball hits right wall
        console.log("Player 1 wins");
      } else if (ball.y - ball.radius <= 0 ||   // Ball hits top or bottom of wall
          ball.y + ball.radius >= HEIGHT) {
        ball.ySpeed *= -1;
      } else if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&    // Ball hits left paddle
        ball.y <= leftPaddle.y + leftPaddle.height &&
        ball.y >= leftPaddle.y) {
          paddleHit(leftPaddle);
      } else if (ball.x + ball.radius >= rightPaddle.x &&                      // Ball hits right paddle
        ball.y <= rightPaddle.y + rightPaddle.height &&
        ball.y >= rightPaddle.y) {
          paddleHit(rightPaddle);
      }
    }

    function paddleHit(paddle) {
      var a = 0.0001, b = 0.005, c = 0.5, x = null;
      x = ball.ySpeed < 0 ? paddle.y + paddle.height - ball.y : ball.y - paddle.y;
      
      // Parabolic function
      var speedMultiplier = (a * (x * x)) + (b * x) + c;

      ball.xSpeed *= -1;
      ball.ySpeed *= speedMultiplier;
    }

    function render() {
      blocPongContext.clearRect(0,0,WIDTH,HEIGHT);
      leftPaddle.render();
      rightPaddle.render();
      ball.render();
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