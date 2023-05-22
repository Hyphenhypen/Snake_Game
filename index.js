const gameBoard = document.querySelector(".gameboard");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const livesElement = document.querySelector(".lives");
const timerElement = document.querySelector(".timer");
const controls = document.querySelectorAll(".controls i");
var foodMusic = new Audio('food.mp3');
var snakeMoveMusic = new Audio('snake move.mp3');
// const snakeMove = Audio('snake move.mp3')
let gameOver = false;
let foodX, foodY;
let snakeX = 10,
  snakeY = 10;
let speedX = 0,
  speedY = 0;
let snakeBody = [];
let score = 0;
let lives = 3;
let timer = 120;
let gameLoopInterval = 100;
let gameLoopId;
let timerIntervalId;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
livesElement.innerText = `Lives: ${lives}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 20) + 1;
  foodY = Math.floor(Math.random() * 20) + 1;
  
};

const handleGameOver = () => {
  clearInterval(gameLoopId);
  clearInterval(timerIntervalId);
  const splashScreen = document.createElement("div");
  splashScreen.classList.add("game-over-splash");
  splashScreen.innerHTML = `
    <h2>Game Over!</h2>
    <p>Press Enter to replay!</p>
  `;
  document.body.appendChild(splashScreen);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      location.reload();
    }
  });
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && speedY !== 1) {
    speedX = 0;
    speedY = -1;
  } else if (e.key === "ArrowDown" && speedY !== -1) {
    speedX = 0;
    speedY = 1;
  } else if (e.key === "ArrowLeft" && speedX !== 1) {
    speedX = -1;
    speedY = 0;
  } else if (e.key === "ArrowRight" && speedX !== -1) {
    speedX = 1;
    speedY = 0;
  }
};

controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const updateTimer = () => {
  timerElement.innerText = `Time: ${timer} sec`;
  if (timer === 0) {
    gameOver = true;
  }
};

const updateScore = () => {
  scoreElement.innerText = `Score: ${score}`;
  highScore = score >= highScore ? score : highScore;
  localStorage.setItem("high-score", highScore);
  highScoreElement.innerText = `High Score: ${highScore}`;
};

let obstacles = [];

const generateObstacles = () => {
  obstacles = [];
  for (let i = 0; i < 5; i++) {
    const obstacleX = Math.floor(Math.random() * 20) + 1;
    const obstacleY = Math.floor(Math.random() * 20) + 1;
    obstacles.push({ x: obstacleX, y: obstacleY });
  }
};

const updateRegularMode = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  snakeX += speedX;
  snakeY += speedY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 20) {
    if(confirm('Outch!!! Play Respnsibly. Press OK to Resume'))
    snakeX = 10;
    snakeY = 10;
    lives--;
    livesElement.innerText = `Lives: ${lives}`;
    if (lives === 0) {
      gameOver = true;
    }
  }

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      snakeX = 10;
      snakeY = 10;
      lives--;
      livesElement.innerText = `Lives: ${lives}`;
      if (lives === 0) {
        gameOver = true;
      }
    }
  }

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    updateScore();
    timer += 5;
    gameLoopInterval -= 5;
    clearInterval(gameLoopId);
    gameLoopId = setInterval(updateRegularMode, gameLoopInterval);
  }

  gameBoard.innerHTML = html;
};

const updateMediumMode = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  snakeX += speedX;
  snakeY += speedY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 20) {
    if(confirm('Outch!!! Play Respnsibly. Press OK to Resume'))
    snakeX = 10;
    snakeY = 10;
    lives--;
    livesElement.innerText = `Lives: ${lives}`;
    if (lives === 0) {
      gameOver = true;
    }
  }

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      snakeX = 10;
      snakeY = 10;
      lives--;
      livesElement.innerText = `Lives: ${lives}`;
      if (lives === 0) {
        gameOver = true;
      }
    }
  }

  for (const obstacle of obstacles) {
    html += `<div class="obstacle" style="grid-area: ${obstacle.y} / ${obstacle.x}"></div>`;
    if (snakeX === obstacle.x && snakeY === obstacle.y) {
      snakeX = 10;
      snakeY = 10;
      lives--;
      livesElement.innerText = `Lives: ${lives}`;
      if (lives === 0) {
        gameOver = true;
      }
    }
  }

  if (snakeX === foodX && snakeY === foodY) {
    snakeMoveMusic.pause();
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    updateScore();
    timer += 5;
    gameLoopInterval -= 5;
    foodMusic.play();
    clearInterval(gameLoopId);
    gameLoopId = setInterval(updateMediumMode, gameLoopInterval);
  }
  gameBoard.innerHTML = html;
};

const updateHardMode = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  snakeX += speedX;
  snakeY += speedY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 20) {
    if(confirm('Outch!!! Play Respnsibly. Press OK to Resume'))
    snakeX = 10;
    snakeY = 10;
    lives--;
    livesElement.innerText = `Lives: ${lives}`;
    if (lives === 0) {
      gameOver = true;
    }
  }

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      snakeX = 10;
      snakeY = 10;
      lives--;
      livesElement.innerText = `Lives: ${lives}`;
      if (lives === 0) {
        gameOver = true;
      }
    }
  }

  for (const obstacle of obstacles) {
    html += `<div class="obstacle" style="grid-area: ${obstacle.y} / ${obstacle.x}"></div>`;
    if (snakeX === obstacle.x && snakeY === obstacle.y) {
      snakeX = 10;
      snakeY = 10;
      lives--;
      livesElement.innerText = `Lives: ${lives}`;
      if (lives === 0) {
        gameOver = true;
      }
    }
  }

  if (snakeX === foodX && snakeY === foodY) {
    snakeMoveMusic.pause();
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    updateScore();
    timer += 5;
    gameLoopInterval -= 5;
    clearInterval(gameLoopId);
    gameLoopId = setInterval(updateHardMode, gameLoopInterval);
  }

  gameBoard.innerHTML = html;
};

const startGame = () => {
  updateFoodPosition();
  if (gameLoopInterval === 60) {
    generateObstacles();
  }
  if (gameLoopInterval === 100) {
    gameLoopId = setInterval(updateRegularMode, gameLoopInterval);
  } else if (gameLoopInterval === 60) {
    gameLoopId = setInterval(updateHardMode, gameLoopInterval);
  }
  else if(gameLoopInterval === 80){
    gameLoopId = setInterval(updateMediumMode, gameLoopInterval);
  }
  timerIntervalId = setInterval(() => {
    if (!gameOver) {
      updateTimer();
      snakeMoveMusic.play();
      timer--;
    }
  }, 1000);
  document.addEventListener("keyup", changeDirection);
};

const modeButtons = document.querySelectorAll(".mode-button");
modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedMode = button.dataset.mode;
    if (selectedMode === "normal") {
      // Normal mode settings
      gameLoopInterval = 100;
      timer = 120;
      lives = 3;
    } else if (selectedMode === "medium") {
      // Advanced mode settings
      gameLoopInterval = 80;
      timer = 80;
      lives = 2;

    }
    else{
      // Advanced mode settings
      gameLoopInterval = 60;
      timer = 60;
      lives = 1;

    }
    document.querySelector(".start-screen").style.display = "none";
    document.querySelector(".game-screen").style.display = "block";
    livesElement.innerText = `Lives: ${lives}`;
    timerElement.innerText = `Time: ${timer} sec`;
    startGame();
  });
});