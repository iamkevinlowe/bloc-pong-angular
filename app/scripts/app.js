var blocPongCanvas = document.getElementById('bloc-pong');
var blocPongContext = blocPongCanvas.getContext('2d');
var WIDTH = blocPongCanvas.width;
var HEIGHT = blocPongCanvas.height;

var p1ScoreElement = document.getElementById('player-one-score');
var p2ScoreElement = document.getElementById('player-two-score');
var p1DescriptionElement = document.getElementById('player-one-description');
var p2DescriptionElement = document.getElementById('player-two-description');
var startMenuElement = document.getElementById('start-menu');
var gameOverElement = document.getElementById('game-over');
var gameOverMessageElement = document.getElementById('game-over-message');

var playerDescriptions = {
  pvp1: "Use the 'W' & 'S' keys to move your paddle.",
  pvp2: "Use the 'Up' & 'Down' arrows to move your paddle.",
  pvc1: "Use the 'W' & 'S' keys or 'Up' & 'Down' arrows to move your paddle.",
  pvc2: "Good luck!"
}

var gameConfig = {
  vs: 'computer'
}

var playerOneScore = 0;
var playerTwoScore = 0;

function onLoad() {
  p1DescriptionElement.innerHTML = playerDescriptions.pvc1;
  p2DescriptionElement.innerHTML = playerDescriptions.pvc2;
  render();
}

function changePlayerTwo(e, elem) {
  e.preventDefault();
  if (elem.innerHTML == 'COM') {
    rightPaddle = new Paddle(2, WIDTH - 25, HEIGHT / 2 - 50);
    gameConfig.vs = 'human';
    elem.innerHTML = 'P2';
    p1DescriptionElement.innerHTML = playerDescriptions.pvp1;
    p2DescriptionElement.innerHTML = playerDescriptions.pvp2;
  } else if (elem.innerHTML == 'P2') {
    rightPaddle = new Computer(2, WIDTH - 25, HEIGHT / 2 - 50);
    gameConfig.vs = 'computer';
    elem.innerHTML = 'COM';
    p1DescriptionElement.innerHTML = playerDescriptions.pvc1;
    p2DescriptionElement.innerHTML = playerDescriptions.pvc2;
  }
}

function startGame(e) {
  e.preventDefault();
  startMenuElement.style.display = 'none';
  step();
}

function resetGame(e) {
  e.preventDefault();
  gameOverElement.style.display = 'none';
  p1ScoreElement.innerHTML = playerOneScore;
  p2ScoreElement.innerHTML = playerTwoScore;
  setTimeout(reset(Math.random() * WIDTH), 2000);
}

function gameOver(winner) {
  playerOneScore = 0;
  playerTwoScore = 0;

  winnerMessages = {
    pvp1: "Congratulations, Player 1 won the game!",
    pvp2: "Congratulations, Player 2 won the game!",
    pvc1: "The computer beat you this time. Try again!"
  };
  
  if (winner == 'p1') {
    gameOverMessageElement.innerHTML = winnerMessages.pvp1;
  } else if (winner == 'p2') {
    gameOverMessageElement.innerHTML = gameConfig.vs == 'human' ? winnerMessages.pvp2 : winnerMessages.pvc1;
  }

  gameOverElement.style.display = 'block';
}

// Shapes
var leftPaddle = new Paddle(1, 20, HEIGHT / 2 - 50);
var rightPaddle = new Computer(2, WIDTH - 25, HEIGHT / 2 - 50);
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

window.onload = onLoad;
window.addEventListener('keydown', function(e) {
  e.preventDefault();
  leftPaddle.move(e.keyCode);
  if (rightPaddle instanceof Paddle) {
    rightPaddle.move(e.keyCode);
  }
});