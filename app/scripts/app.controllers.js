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
    var leftPaddle = new Paddle(10, 250);
    var rightPaddle = new Paddle(785, 250); 
    var ball = new Ball(WIDTH/2, HEIGHT/2);

    // Paddle constructor
    function Paddle(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 100;
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

    // Ball constructor
    function Ball(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.startingAngle = 0;
      this.endingAngle = 2 * Math.PI;
      this.counterClockwise = false;
    }

    Ball.prototype.render = function() {
      blocPongContext.fillStyle = 'rgb(255,255,255)';
      blocPongContext.arc(
        this.x,
        this.y,
        this.radius,
        this.startingAngle,
        this.endingAngle,
        this.counterClockwise
      );
      blocPongContext.fill();
    };

    function render() {
      leftPaddle.render();
      rightPaddle.render();
      ball.render();
    }

    window.onload = render;

  }
  
})();