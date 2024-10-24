const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game");
const gridSize = 20;
const canvasSize = canvas.width;
const snakeColor = "#fff";
const foodColor = "yellow";
const backgroundColor = "green";

let snake = [{ x: 9, y: 9 }];
let food = generateFood();
let direction = { x: 0, y: 0 };
let score = 0;
let gameSpeed = 200;
let isPaused = false;
const pausebtn = document.getElementById("pausebtn");
const scoreElement = document.getElementById("score");
const audio = document.getElementById("audio");
pausebtn.addEventListener("click", togglePause);
setInterval(updateGame, gameSpeed);
// Initialize game loop
document.addEventListener("keydown", changeDirection);
setInterval(updateGame, gameSpeed);
// Change direction with touch controls

function togglePause() {
  isPaused = !isPaused;
  pausebtn.innerText = isPaused ? "Continue" : "Pause";
}
function updateGame() {
  if (isPaused) return;
  if (checkCollision()) {
    resetGame();
  } else {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    checkFoodCollision();
    updateScore();
  }
}

function clearCanvas() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach((part) => {
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
  });
}

function moveSnake() {
  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize,
  };
  snake.unshift(head);
  snake.pop();
}

function changeDirection(event) {
  const key = event.keyCode;
  const LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40;

  switch (key) {
    case LEFT:
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case UP:
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case RIGHT:
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
    case DOWN:
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
  }
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
  };
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function checkFoodCollision() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    audio.play();
    snake.push({ ...snake[snake.length - 1] });
    food = generateFood();
    score++;
    gameSpeed = Math.max(50, gameSpeed - 2); // Increase speed with each food eaten
  }
}

function checkCollision() {
  // Check wall collisions
  if (
    snake[0].x < 0 ||
    snake[0].x >= canvasSize ||
    snake[0].y < 0 ||
    snake[0].y >= canvasSize
  ) {
    return true;
  }
  // Check self-collision
  for (let i = 4; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  alert("Game Over! Your score is " + score);
  snake = [{ x: 100, y: 100 }];
  food = generateFood();
  direction = { x: 0, y: 0 };
  score = 0;
  gameSpeed = 100;
}

function updateScore() {
  document.getElementById("score").innerText = "Score:" + score;
}
function touchControl(event) {
    const touch = event.touches[0];
    const canvasRect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;

    // Determine the direction based on touch position
    if (touchY < canvasRect.height / 3) {
        direction = { x: 0, y: -1 }; // Up
    } else if (touchY > canvasRect.height * 2 / 3) {
        direction = { x: 0, y: 1 }; // Down
    } else if (touchX < canvasRect.width / 3) {
        direction = { x: -1, y: 0 }; // Left
    } else if (touchX > canvasRect.width * 2 / 3) {
        direction = { x: 1, y: 0 }; // Right
    }
}

// Event listeners
setInterval(moveSnake, 100);
canvas.addEventListener("touchstart",touchControl);
