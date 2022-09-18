// Check whether the player wants to vs the computer or another player
const computer = window.confirm("Press 'Ok' to play against the computer. Press cancel to play against a friend.");
if (computer) {
	alert("Use the W and S keys or up and down arrow keys to move your paddle.");
} else {
	alert("Player1 use the W and S keys to move your paddle, Player2 use the up and down arrow keys to move your paddle.");
}
// Setup canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();
// Setup variables
let level = 1;
const player = {
	score: 0,
	x: 75,
	y: Math.round(canvas.height / 2),
	dir: 0
};
const enemy = {
	score: 0,
	x: canvas.width - 75,
	y: Math.round(canvas.height / 2),
	dir: 0,
	aim: canvas.height / 2
};
const ball = {
	x: Math.round(canvas.width / 2),
	y: Math.round(canvas.height / 2),
	size: 8,
	dir: {
		x: null,
		y: null
	},
	speed: 3.75
};
// Setup font
ctx.font = "20px Georgia";
// Random number generation
function randomInt(min = 1, max = 100) {
	return Math.floor(Math.random() * (max - min)) + min;
}
// Randomise ball position
ball.x += randomInt(-Math.round(canvas.width / 5), Math.round(canvas.width / 5));
ball.y += randomInt(-Math.round(canvas.height / 5), Math.round(canvas.height / 5));
// Randomise ball direction
ball.dir.x = randomInt(0, 1);
if (ball.dir.x === 0) {
	ball.dir.x = -1;
}
ball.dir.y = randomInt(0, 1);
if (ball.dir.y === 0) {
	ball.dir.y = -1;
}
// Function to reset variables
function reset() {
	ball.x = Math.round(canvas.width / 2);
	ball.y = Math.round(canvas.height / 2);
	player.x = 75;
	player.y = Math.round(canvas.height / 2);
	player.dir = 0;
	enemy.x = canvas.width - 75;
	enemy.y = Math.round(canvas.height / 2);
	enemy.dir = 0;
	enemy.aim = ballY;
	ball.x += randomInt(-Math.round(canvas.width / 4), Math.round(canvas.width / 4));
	ball.y += randomInt(-Math.round(canvas.height / 4), Math.round(canvas.height / 4));
	// 0 evaluates to truthy and 1 evaluates to falsy
	ball.dir.x = randomInt(0, 1) ? 1 : -1;
	ballYdir = randomInt(0, 1) ? 1 : -1;
}
// Setup input
if (computer) {
	window.addEventListener("keydown", function (e) {
		e = e || window.event;
		switch (e.key.toString().toUpperCase()) {
			// Up and down arrow keys
			case "ARROWUP":
				player.dir = 1;
				break;
			case "ARROWDOWN":
				player.dir = -1;
				break;
			// W and S keys
			case "W":
				player.dir = 1;
				break;
			case "S":
				player.dir = -1;
				break;
		}
	});
	window.addEventListener("keyup", function (e) {
		e = e || window.event;
		switch (e.key.toString().toUpperCase()) {
			// Up and down arrow keys
			case "ARROWUP":
				if (player.dir === 1) {
					player.dir = 0;
				}
				break;
			case "ARROWDOWN":
				if (player.dir === -1) {
					player.dir = 0;
				}
				break;
			// W and S keys
			case "W":
				if (player.dir === 1) {
					player.dir = 0;
				}
				break;
			case "S":
				if (player.dir === -1) {
					player.dir = 0;
				}
				break;
		}
	});
} else {
	window.addEventListener("keydown", function (e) {
		e = e || window.event;
		switch (e.key.toString().toUpperCase()) {
			// Up and down arrow keys
			case "ARROWUP":
				enemy.dir = 1;
				break;
			case "ARROWDOWN":
				enemy.dir = -1;
				break;
			// W and S keys
			case "W":
				player.dir = 1;
				break;
			case "S":
				player.dir = -1;
				break;
		}
	});
	window.addEventListener("keyup", function (e) {
		e = e || window.event;
		switch (e.key.toString().toUpperCase()) {
			// Up and down arrow keys
			case "ARROWUP":
				if (enemy.dir === 1) {
					enemy.dir = 0;
				}
				break;
			case "ARROWDOWN":
				if (enemy.dir === -1) {
					enemy.dir = 0;
				}
				break;
			// W and S keys
			case "W":
				if (player.dir === 1) {
					player.dir = 0;
				}
				break;
			case "S":
				if (player.dir === -1) {
					player.dir = 0;
				}
				break;
		}
	});
}
// Move ball
function moveBall(xDist, yDist) {
	ball.x += xDist;
	ball.y -= yDist;
}
// Move paddle
function movePaddle(dist) {
	player.y -= dist;
}
// Move enemy
function moveEnemy(dist) {
	enemy.y -= dist;
}
// Detect if rectangle is touching ball
function rectTouchingBall(x, y, w, h) {
	return x <= ball.x + ball.size && x + w >= ball.x && y <= ball.y + ball.size && y + h >= ball.y;
}
// Enemy AI
function enemyAI() {
	if (ball.dir.x > 0) {
		if (ball.y > enemy.y + 25) {
			moveEnemy(-3.25);
		} else if (ball.y < enemy.y - 25) {
			moveEnemy(3.25);
		}
	}
}
// Physics
function physics() {
	if (level !== "Game Over!") {
		// Move paddle
		if (player.dir !== 0) {
			movePaddle(player.dir * 10);
		}
		// Move enemy
		if (computer) {
			enemyAI();
		} else {
			if (enemy.dir !== 0) {
				moveEnemy(enemy.dir * 10);
			}
		}
		// Move ball
		moveBall(ball.dir.x * ball.speed, ball.dir.y * ball.speed);
		// Ball collisions
		if (rectTouchingBall(player.x - 15, player.y - 50, 30, 100)) {
			ball.dir.x = -ball.dir.x;
		} else if (rectTouchingBall(enemy.x - 15, enemy.y - 50, 30, 100)) {
			ball.dir.x = -ball.dir.x;
		}
		// Bind paddle to borders
		if (player.y + 50 > canvas.height) {
			player.y = canvas.height - 50;
		} else if (player.y - 50 < 60) {
			player.y = 110;
		}
		// Bind enemy to borders
		if (enemy.y + 50 > canvas.height) {
			enemy.y = canvas.height - 50;
		} else if (enemy.y - 50 < 60) {
			enemy.y = 110;
		}
		// Bind ball to borders
		if (ball.x - ball.size < 0) {
			ball.x = ball.size;
			ball.dir.x = -ball.dir.x;
			enemy.score++;
			reset();
		} else if (ball.x + ball.size > canvas.width) {
			ball.x = canvas.width - ball.size;
			if (ball.dir.x === 1) {
				ball.dir.x = -1;
			} else {
				ball.dir.x = 1;
			}
			player.score++;
			reset();
		} else if (ball.y - ball.size < 60) {
			ball.y = 60 + ball.size;
			ball.dir.y = -ball.dir.y;
		} else if (ball.y + ball.size > canvas.height) {
			ball.y = canvas.height - ball.size;
			ball.dir.y = -ball.dir.y;
		}
		// level
		if (computer && player.score >= 5) {
			level++;
			player.score = 0;
			enemy.score = 0;
			ball.speed += 1.25;
			reset();
		} else if (computer && enemy.score >= 5) {
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
	ctx.rect(ball.x - ball.size, ball.y - ball.size, 2 * ball.size, 2 * ball.size);
	// Render player's paddle
	ctx.rect(player.x - 15, player.y - 50, 30, 100);
	// Render enemy's paddle
	ctx.rect(enemy.x - 15, enemy.y - 50, 30, 100);
	// Render score counters
	ctx.fillText("Your score: " + player.score + (computer ? " Computer's score: " : " Player 2's score: ") + enemy.score, 10, 25);
	ctx.fillText("Level: " + level, 10, 50);
	// Fill shapes
	ctx.fill();
	// Close path
	ctx.closePath();
}
// Game loop
let previousFrame = Date.now();
// 
function run() {
	// Prevent the game from running too fast (Date.now() - previous > 15 is approximately 60 frames per second)
	if (Date.now() - previousFrame > 15) {
		// Run physics
		physics();
		// Render frame
		render();
		// Reset previous frame time
		previousFrame = Date.now();
	}
	// Repeat
	window.requestAnimationFrame(run);
}
// Run game
run();
