const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');


const GRID_SIZE = 20;
const SNAKE_COLOR = 'lime';
const FOOD_COLOR = 'red';
const GAME_SPEED = 250;


let snake;
let food;
let dx;
let dy;
let score;
let changingDirection;
let gameLoopTimeout;


function start() {

    snake = [
        { x: 10 * GRID_SIZE, y: 10 * GRID_SIZE },
        { x: 9 * GRID_SIZE, y: 10 * GRID_SIZE },
        { x: 8 * GRID_SIZE, y: 10 * GRID_SIZE }
    ];

    dx = GRID_SIZE;
    dy = 0;
    score = 0;

    scoreElement.textContent = 'Score: ' + score;
    gameOverScreen.style.display = 'none';

    generateFood();

    if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
    gameLoopTimeout = setTimeout(updateGame, GAME_SPEED);
}


function updateGame() {
    if (isGameOver()) {
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'block';
        return;
    }

    changingDirection = false; 
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();

    gameLoopTimeout = setTimeout(updateGame, GAME_SPEED);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}

function moveSnake() {

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const ateFood = snake[0].x === food.x && snake[0].y === food.y;
    if (ateFood) {
        score += 10;
        scoreElement.textContent = 'Score: ' + score;
        generateFood();
    } else {

        snake.pop();
    }
}


function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = SNAKE_COLOR;
        ctx.strokeStyle = 'darkgreen';
        ctx.fillRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
        ctx.strokeRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
    });
}

function generateFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE;
        foodY = Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE;
    } while (snake.some(part => part.x === foodX && part.y === foodY)); 

    food = { x: foodX, y: foodY };
}


function isGameOver() {
    // Check for collision with self
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

 
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    }
}

document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', start);

start();
