// =======
// Classes
// =======

class Ball {
  constructor(settings, canvas) {
    this.radius = settings.radius;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    this.speedX = settings.speedX;
    this.speedY = settings.speedY;

    this.maxAngle = settings.maxAngle;
    this.coefSpeed = settings.coefSpeed;
    this.maxSpeed = settings.maxSpeed;

    this.couleur = settings.couleur;

    this.settings = settings;
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
    this.speedX = this.settings.speedX * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = this.settings.speedY * (Math.random() > 0.5 ? 1 : -1);
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
      score.joueur2++;
      this.resetBall(canvas);
    } else if (this.x + this.radius > canvas.width) {
      score.joueur1++;
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
    this.joueur1 = 0;
    this.joueur2 = 0;

    this.couleurJ1 = couleurJ1;
    this.couleurJ2 = couleurJ2;
  }

  draw(canvas, ctx) {
    ctx.font = '48px Arial';
    ctx.fillStyle = this.couleurJ1;
    ctx.fillText(this.joueur1, canvas.width / 4, 50);
    ctx.fillStyle = this.couleurJ2;
    ctx.fillText(this.joueur2, (canvas.width / 4) * 3, 50);
  }
}

class Button {
  constructor(x, y, width, height, borderRadius, bgCouleur, txtCouleur, txtSize, content, callback) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;
    this.borderRadius = borderRadius;

    this.bgCouleur = bgCouleur;
    this.txtCouleur = txtCouleur;
    this.txtSize = txtSize;
    this.font = 'sans-serif';

    this.content = content;

    this.callback = callback;
  }

  checkClick(mouseX, mouseY) {
    if (mouseX >= this.x && mouseX <= this.x + this.width &&
      mouseY >= this.y && mouseY <= this.y + this.height) {
      this.callback();
    }
  }

  draw(ctx) {
    // Bouton
    ctx.fillStyle = this.bgCouleur;

    // Dessin des contours du bouton
    ctx.beginPath();
    // dessine un arc de cercle pour le coin supérieur gauche du bouton
    ctx.arc(this.x + this.borderRadius, this.y + this.borderRadius, this.borderRadius, Math.PI, Math.PI * -0.5);
    // dessine un arc de cercle pour le coin supérieur droit du bouton
    ctx.arc(this.x + this.width - this.borderRadius, this.y + this.borderRadius, this.borderRadius, Math.PI * -0.5, 0);
    // dessine un arc de cercle pour le coin inférieur droit du bouton
    ctx.arc(this.x + this.width - this.borderRadius, this.y + this.height - this.borderRadius, this.borderRadius, 0, Math.PI * 0.5);
    // dessine un arc de cercle pour le coin inférieur gauche du bouton
    ctx.arc(this.x + this.borderRadius, this.y + this.height - this.borderRadius, this.borderRadius, Math.PI * 0.5, Math.PI);
    ctx.closePath();

    ctx.fill(); // remplit le bouton avec la couleur de remplissage

    // Texte
    ctx.fillStyle = this.txtCouleur;
    ctx.font = this.txtSize + ' ' + this.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.content, this.x + this.width / 2, this.y + this.height / 2);
  }
}

// ========
// Settings
// ========

const colors = {
  blue: '#3366FF',
  red: '#FF3333',
  darkGrey: '#222222',
  lightGrey: '#2E2E2E',
  text: '#e3e3e3'
}

const settings = {
  ball: {
    radius: 10,
    speedX: 2,
    speedY: 2,
    maxAngle: 120,
    coefSpeed: 1.1,
    maxSpeed: 8,
    couleur: "#ababab"
  },
  joueur1: {
    height: 120,
    width: 10,
    speed: 8,
    couleur: colors.blue,
    upKey: "KeyW",
    downKey: "KeyS"
  },
  joueur2: {
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

// Constructions des boutons
// -------------------------

// Menu principal
let mainMenuButtons = [
  new Button(canvas.width / 2 - 100, 200, 200, 80, 5, colors.blue, colors.text, '26px', 'Jouer', (() => {
    resetGame();
    state = 1;
  })),
  new Button(canvas.width / 2 - 100, 300, 200, 80, 5, colors.red, colors.text, '26px', 'Settings', (() => state = 3))
];

// Menu pause
let pauseMenuButtons = [
  new Button(canvas.width / 2 - 100, 200, 200, 80, 5, colors.blue, colors.text, '26px', 'Jouer', (() => state = 1)),
  new Button(canvas.width / 2 - 100, 300, 200, 80, 5, colors.blue, colors.text, '26px', 'Recommencer', (() => {
    resetGame();
    state = 1;
  })),
  new Button(canvas.width / 2 - 100, 400, 200, 80, 5, colors.red, colors.text, '26px', 'Quitter', (() => state = 0))
];

// Fonctions
// =========

// Menus
// -----

function mainMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  mainMenuButtons.forEach(button => {
    button.draw(ctx);
  });
}

function pauseMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGame();
  pauseMenuButtons.forEach(button => {
    button.draw(ctx);
  });
}

// Game
// ----

function drawGame() {
  ball.draw(ctx);
  paddle1.draw(ctx);
  paddle2.draw(ctx);

  score.draw(canvas, ctx);
}

function resetGame() {
  ball = new Ball(settings.ball, canvas);

  paddle1 = new Paddle(settings.joueur1, 0, canvas);
  paddle2 = new Paddle(settings.joueur2, canvas.width - settings.joueur2.width, canvas);

  score = new Score(settings.joueur1.couleur, settings.joueur2.couleur);
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
  if (state == 0) { // Menu du jeu
    mainMenu();
  } else if (state == 1) { // Jeu
    gameLoop();

    if ('Escape' in keysDown) { // Si on doit mettre pause
      state = 2;
    }
  } else if (state == 2) { // Menu pause en Jeu
    pauseMenu();
  } else if (state == 3) { // Settings
    // Draw menu settings
  }
}

// Event Listener
// ==============

// Détection des touches
document.addEventListener('keydown', (e) => {
  keysDown[e.code] = true;
});
document.addEventListener('keyup', (e) => {
  delete keysDown[e.code];
});

// Boutons
canvas.addEventListener('click', (event) => {
  // récupère les coordonnées de la souris sur le canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // vérifie si la position de la souris est située à l'intérieur du bouton
  if (state == 0) { // Main menu
    mainMenuButtons.forEach(button => {
      button.checkClick(mouseX, mouseY);
    });
  } else if (state == 2) { // Pause menu
    pauseMenuButtons.forEach(button => {
      button.checkClick(mouseX, mouseY);
    });
  }

});

// Lancement du programme
// ======================

window.onload = function () {
  setInterval(mainLoop, 1000 / settings.fps);
};