// vs computer or another player
let computer = window.confirm("Press 'Ok' to play against the computer. Press cancel to play against a friend.");

if (computer) {
    alert("Use the W and S keys or up and down arrow keys to move your paddle.");
} else {
    alert("Player1 use the W and S keys to move your paddle, Player2 use the up and down arrow keys to move your paddle.");
}

// Setup canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Setup variables
let playerScore = 0, computerScore = 0;
let level = 1;

let ballX = Math.round(canvas.width / 2);
let ballY = Math.round(canvas.height / 2);
let ballSpeed = 0.75;
let ballXdir, ballYdir;

let paddleX = 75;
let paddleY = Math.round(canvas.height / 2);
let paddleDir = 0;

let enemyX = canvas.width - 75;
let enemyY = Math.round(canvas.height / 2);
let enemyDir = 0;

// Random number generation
function randomInt(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Randomise ball position
ballX += randomInt(-Math.round(canvas.width / 5), Math.round(canvas.width / 5));
ballY += randomInt(-Math.round(canvas.height / 5), Math.round(canvas.height / 5));

// Randomise ball direction
ballXdir = randomInt(0, 1);
if (ballXdir === 0) {
    ballXdir = -1;
}
ballYdir = randomInt(0, 1);
if (ballYdir === 0) {
    ballYdir = -1;
}

// Function to reset variables
function reset() {
    ballX = Math.round(canvas.width / 2);
    ballY = Math.round(canvas.height / 2);
    ballXdir, ballYdir;

    paddleX = 75;
    paddleY = Math.round(canvas.height / 2);
    paddleDir = 0;

    enemyX = canvas.width - 75;
    enemyY = Math.round(canvas.height / 2);
    enemyDir = 0;

    enemyAimY = ballY;

    ballX += randomInt(-Math.round(canvas.width / 4), Math.round(canvas.width / 4));
    ballY += randomInt(-Math.round(canvas.height / 4), Math.round(canvas.height / 4));

    ballXdir = randomInt(0, 1);
    if (ballXdir === 0) {
        ballXdir = -1;
    }
    ballYdir = randomInt(0, 1);
    if (ballYdir === 0) {
        ballYdir = -1;
    }
}

// Setup input
if (computer) {
    document.onkeydown = function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            // Up and down arrow keys
            case 38:
                paddleDir = 1;
                break;
            case 40:
                paddleDir = -1;
                break;
            // W and S keys
            case 87:
                paddleDir = 1;
                break;
            case 83:
                paddleDir = -1;
                break;
        }
    }
    document.onkeyup = function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            // Up and down arrow keys
            case 38:
                if (paddleDir === 1) {
                    paddleDir = 0;
                }
                break;
            case 40:
                if (paddleDir === -1) {
                    paddleDir = 0;
                }
                break;
            // W and S keys
            case 87:
                if (paddleDir === 1) {
                    paddleDir = 0;
                }
                break;
            case 83:
                if (paddleDir === -1) {
                    paddleDir = 0;
                }
                break;
        }
    }
} else {
    document.onkeydown = function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            // Up and down arrow keys
            case 38:
                enemyDir = 1;
                break;
            case 40:
                enemyDir = -1;
                break;
            // W and S keys
            case 87:
                paddleDir = 1;
                break;
            case 83:
                paddleDir = -1;
                break;
        }
    }
    document.onkeyup = function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            // Up and down arrow keys
            case 38:
                if (enemyDir === 1) {
                    enemyDir = 0;
                }
                break;
            case 40:
                if (enemyDir === -1) {
                    enemyDir = 0;
                }
                break;
            // W and S keys
            case 87:
                if (paddleDir === 1) {
                    paddleDir = 0;
                }
                break;
            case 83:
                if (paddleDir === -1) {
                    paddleDir = 0;
                }
                break;
        }
    }
}

// Move ball
function moveBall(xDistance, yDistance) {
    ballX += xDistance;
    ballY -= yDistance;
}

// Move paddle
function movePaddle(distance) {
    paddleY -= distance;
}

// Move enemy
function moveEnemy(distance) {
    enemyY -= distance;
}

// Detect if rectangle is touching ball
function rectTouchingBall(x, y, w, h) {
    const x2 = x + w,
	  y2 = y + h;
    return ballX - 8 >= x && ballY - 8 >= y && ballX - 8 <= x2 && ballY - 8 <= y2
	|| ballX + 8 >= x && ballY - 8 >= y && ballX + 8 <= x2 && ballY - 8 <= y2
	|| ballX - 8 >= x && ballY + 8 >= y && ballX - 8 <= x2 && ballY + 8 <= y2
	|| ballX + 8 >= x && ballY + 8 >= y && ballX + 8 <= x2 && ballY + 8 <= y2;
}

// Enemy AI
function enemyAI() {
	if (ballXdir > 0) {
		if (ballY > enemyY + 25) {
			moveEnemy(-3.25);
		} else if (ballY < enemyY - 25) {
			moveEnemy(3.25);
		}
	}
}

// Physics
function physics() {
    if (level !== "Game Over!") {
        // Move paddle
        if (paddleDir !== 0) {
            movePaddle(paddleDir * 10);
        }

        // Move enemy
        if (computer) {
            enemyAI();
        } else {
            if (enemyDir !== 0) {
                moveEnemy(enemyDir * 10);
            }
        }

        // Move ball
        moveBall(ballXdir * 5 * ballSpeed, ballYdir * 5 * ballSpeed);

        // Ball collisions
        if (rectTouchingBall(paddleX - 15, paddleY - 50, 30, 100)) {
            if (ballXdir === 1) {
                ballXdir = -1;
            } else {
                ballXdir = 1;
            }
        } else if (rectTouchingBall(enemyX - 15, enemyY - 50, 30, 100)) {
            if (ballXdir === 1) {
                ballXdir = -1;
            } else {
                ballXdir = 1;
            }
        }

        // Bind paddle to borders
        if (paddleY + 50 > canvas.height) {
            paddleY = Math.round(canvas.height - 50);
        } else if (paddleY - 50 < 60) {
            paddleY = 110;
        }

        // Bind enemy to borders
        if (enemyY + 50 > canvas.height) {
            enemyY = Math.round(canvas.height - 50);
        } else if (enemyY - 50 < 60) {
            enemyY = 110;
        }

        // Bind ball to borders
        if (ballX - 8 < 0) {
            ballX = 8;
            if (ballXdir === 1) {
                ballXdir = -1;
            } else {
                ballXdir = 1;
            }
            computerScore++;
            reset();
        } else if (ballX + 8 > Math.round(canvas.width)) {
            ballX = Math.round(canvas.width - 8);
            if (ballXdir === 1) {
                ballXdir = -1;
            } else {
                ballXdir = 1;
            }
            playerScore++;
            reset();
        } else if (ballY - 8 < 60) {
            ballY = 68;
            if (ballYdir === 1) {
                ballYdir = -1;
            } else {
                ballYdir = 1;
            }
        } else if (ballY + 8 > Math.round(canvas.height)) {
            ballY = Math.round(canvas.height - 8);
            if (ballYdir === 1) {
                ballYdir = -1;
            } else {
                ballYdir = 1;
            }
        }

        // level
        if (computer && playerScore >= 5) {
            level++;
            playerScore = 0, computerScore = 0;
            ballSpeed += 0.25;
            reset();
        } else if (computer && computerScore >= 5) {
            level = "Game Over!";
        }
    }
}

// Clear screen
function clear(colour) {
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
}

// Render
function render() {
    // Clear screen (change black to whatever colour you prefer)
    clear("black");

    // Begin path
    ctx.beginPath();

    // Set fill colour to white
    ctx.fillStyle = "white";

    // Render ball
    ctx.rect(ballX - 8, ballY - 8, 16, 16);

    // Render player's paddle
    ctx.rect(paddleX - 15, paddleY - 50, 30, 100);

    // Render enemy's paddle
    ctx.rect(enemyX - 15, enemyY - 50, 30, 100);

    // Render score counters
    ctx.font = "20px Georgia";
    if (computer) {
        ctx.fillText("Your score: " + playerScore + " Computer's score: " + computerScore, 10, 25);
    } else {
        ctx.fillText("Player1's score: " + playerScore + " Player2's score: " + computerScore, 10, 25);
    }
    ctx.fillText("Level: " + level, 10, 50);

    // Fill shapes
    ctx.fill();

    // Close path
    ctx.closePath();
}

// Game loop
let previousFrame = Date.now();
function run() {
    // Prevent the game from running too fast
    if (Date.now() - previousFrame > 15) {
        physics();
        render();
        previousFrame = Date.now();
    }

    // Repeat
    window.requestAnimationFrame(run);
}

// Run game
run();
