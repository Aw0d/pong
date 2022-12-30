// =======
// Classes
// =======

class Ball {
  constructor(settings, canvas) {
    this.radius = settings.radius;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    this.speedX = settings.speed;
    this.speedY = settings.speed;

    this.coefSpeed = settings.coefSpeed;
    this.maxSpeed = settings.maxSpeed;
    this.maxAngle = settings.maxAngle;

    this.couleur = settings.couleur;

    this.initialSpeed = settings.speed;
  }

  move(canvas) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebondir sur les bords du haut et du bas du canvas
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
      this.speedY = -this.speedY;
    }
  }

  resetBall(canvas) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.speedX = this.initialSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = this.initialSpeed * (Math.random() > 0.5 ? 1 : -1);
  }

  collisionDetection(paddle1, paddle2, score, canvas) {
    // Déterminer l'angle de la balle
    let ballPaddleDiff;
    let angle;

    if (this.x - this.radius < paddle1.width) {
      ballPaddleDiff = this.y - (paddle1.y + paddle1.height / 2);
      angle = 90 - (ballPaddleDiff/(paddle1.height / 2)) * (90 - (180 - this.maxAngle));
      
      this.speedY = (1/Math.tan((Math.PI/180) * angle)) * Math.abs(this.speedX);    
    } else if (this.x + this.radius > canvas.width - paddle2.width) {
      ballPaddleDiff = this.y - (paddle2.y + paddle2.height / 2);
      angle = 90 + (ballPaddleDiff/(paddle2.height / 2)) * (90 - (180 - this.maxAngle));

      this.speedY = -(1/Math.tan((Math.PI/180) * angle)) * Math.abs(this.speedX);
    }

    // Rebondir sur les paddles
    // Paddle 1
    if (this.x - this.radius < paddle1.x + paddle1.width && this.y >= paddle1.y && this.y <= paddle1.y + paddle1.height) {
      this.x = paddle1.x + paddle1.width + this.radius; // On replace la balle sur la paddle

      if (this.speedX > -this.maxSpeed && this.speedX < this.maxSpeed) {
        this.speedX = -this.speedX * this.coefSpeed;
      } else {
        this.speedX = -this.speedX;
      }
    }

    // Paddle 2
    if (this.x + this.radius > paddle2.x && this.y >= paddle2.y && this.y <= paddle2.y + paddle2.height) {
      this.x = paddle2.x - this.radius; // On replace la balle sur la paddle

      if (this.speedX > -this.maxSpeed && this.speedX < this.maxSpeed) {
        this.speedX = -this.speedX * this.coefSpeed;
      } else {
        this.speedX = -this.speedX;
      }
    }

    // MAJ score
    if (this.x - this.radius < 0) {
      score.player2 ++;
      score.update();
      this.resetBall(canvas);
    } else if (this.x + this.radius > canvas.width) {
      score.player1 ++;
      score.update();
      this.resetBall(canvas);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.couleur;
    ctx.fill();
    ctx.closePath();
  }
}

class Paddle {
  constructor(settings, x, canvas) {
    this.height = settings.height;
    this.width = settings.width;

    this.x = x;
    this.y = (canvas.height - this.height) / 2;

    this.speed = settings.speed;

    this.couleur = settings.couleur;

    this.upKey = settings.upKey;
    this.downKey = settings.downKey;
  }

  move(keysDown, canvas) {
    if (this.upKey in keysDown && this.y > 0) { // Touche W
      this.y -= this.speed;
    }
    if (this.downKey in keysDown && this.y + this.height < canvas.height) { // Touche S
      this.y += this.speed;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.couleur;
    ctx.fill();
    ctx.closePath();
  }
}

class Score {
  constructor(couleurJ1, couleurJ2) {
    this.player1 = 0;
    this.player2 = 0;

    this.couleurJ1 = couleurJ1;
    this.couleurJ2 = couleurJ2;

    this.player1Score = document.getElementById('player-1-score');
    this.player2Score = document.getElementById('player-2-score');

    this.update();
  }

  update() {
    this.player1Score.textContent = this.player1;
    this.player2Score.textContent = this.player2;
  }
}

// ========
// Settings
// ========

const colors = {
  blue: '#3DC7AD',
  red: '#F3522C',
  darkGrey: '#222222',
  lightGrey: '#2E2E2E',
  text: '#e3e3e3'
}

const settings = {
  ball: {
    radius: 10,
    speed: 2,
    maxAngle: 140,
    coefSpeed: 1.1,
    maxSpeed: 8,
    couleur: "#ababab"
  },
  player1: {
    height: 120,
    width: 10,
    speed: 8,
    couleur: colors.blue,
    upKey: "KeyW",
    downKey: "KeyS"
  },
  player2: {
    height: 120,
    width: 10,
    speed: 8,
    couleur: colors.red,
    upKey: "ArrowUp",
    downKey: "ArrowDown"
  },
  fps: 144
}

// ====
// Main
// ====

// Déclaration des variables
// =========================

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Object pour les détections de touches
let keysDown = {};

// Entier indiquant l'état
let state = 0;

// Variables pour les classes
// --------------------------

let ball;

let paddle1;
let paddle2;

let score;

// Fonctions
// =========

// Game
// ----

function startGame() {
  resetGame();
  state = 1;

  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("pauseMenu").style.display = "none";;
}

function leaveGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  state = 0;

  document.getElementById("pauseMenu").style.display = "none";
  document.getElementById("mainMenu").style.display = "flex";
}

function drawGame() {
  ball.draw(ctx);
  paddle1.draw(ctx);
  paddle2.draw(ctx);
}

function resetGame() {
  ball = new Ball(settings.ball, canvas);

  paddle1 = new Paddle(settings.player1, 0, canvas);
  paddle2 = new Paddle(settings.player2, canvas.width - settings.player2.width, canvas);

  score = new Score(settings.player1.couleur, settings.player2.couleur);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ball.move(canvas);
  paddle1.move(keysDown, canvas);
  paddle2.move(keysDown, canvas);

  ball.collisionDetection(paddle1, paddle2, score, canvas);

  drawGame();
}

// Main
// ----

function mainLoop() {
  if (state === 0) { // Menu du jeu

  } else if (state === 1) { // Jeu
    gameLoop();
  } else if (state === 2) { // Menu pause en Jeu
    drawGame();
  } else if (state === 3) { // Settings
    // Draw menu settings
  }
}

// Event Listener
// ==============

// Détection des touches
document.addEventListener('keydown', (e) => {
  keysDown[e.code] = true;

  // Empêche le défilement de la page lorsque l'on appuie sur les flèches
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    e.preventDefault();
  }

  // Mettre pause si on appui sur Echap et qu'on est en jeu
  if (e.code === "Escape") {
    if (state === 1) {
      state = 2;
      document.getElementById("pauseMenu").style.display = "flex";
    } else if (state === 2) {
      state = 1;
      document.getElementById("pauseMenu").style.display = "none";
    }
  }
});
document.addEventListener('keyup', (e) => {
  delete keysDown[e.code];
});

// Boutons
document.getElementById("startButton").addEventListener("click", () => startGame());
document.getElementById("settingsButton").addEventListener("click", () => {state = 3; document.getElementById("mainMenu").style.display = "none"; document.getElementById("settingsMenu").style.display = "flex"})

document.getElementById("continueButton").addEventListener("click", () => {state = 1; document.getElementById("pauseMenu").style.display = "none";});
document.getElementById("restartButton").addEventListener("click", () => startGame());
document.getElementById("leaveButton").addEventListener("click", () => leaveGame());

// Lancement du programme
// ======================

window.onload = function () {
  setInterval(mainLoop, 1000 / settings.fps);
};