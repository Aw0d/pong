// Déclaration des variables
// =========================

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Object pour les détections de touches
let keysDown = {};

// Variable pour stocker l'interval ID de la game loop
let intervID = null;

let isPaused = false;

let numBounces = 0;

// Array des input qui gère les settings
const inputs = document.getElementById('settingsMenu').querySelectorAll('input:not([type="checkbox"])');

const useSameSettingsForBothPaddlesCheckbox = document.getElementById('sameSettingsBothPaddles');


// Settings
// --------

const colors = {
    player1: '#0DB387',
    player2: '#D6A11A',
};

const settings = {
    ballRadius: 10,
    ballSpeed: 5,
    ballCoefSpeed: 1.1,
    ballMaxSpeed: 8,
    ballMaxAngle: 140,
    ballColor: "#ababab",

    paddle1Height: 120,
    paddle1Width: 10,
    paddle1Speed: 8,
    paddle1Color: colors.player1,
    paddle1UpKey: "KeyW",
    paddle1DownKey: "KeyS",

    paddle2Height: 120,
    paddle2Width: 10,
    paddle2Speed: 8,
    paddle2Color: colors.player2,
    paddle2UpKey: "ArrowUp",
    paddle2DownKey: "ArrowDown",

    nbBonus: 5,

    fps: 120
};

const bonusTypes = [
    {name: 'SuperSpeed', radius: 20, color: '#ffff00'},
    {name: 'IncreasePaddleSize', radius: 15, color: '#0000ff'}
];

// Construction des classes
// --------------------------

const ball = new Ball(settings.ballRadius, settings.ballSpeed, settings.ballCoefSpeed, settings.ballMaxSpeed, settings.ballMaxAngle, settings.ballColor, canvas);

const paddle1 = new Paddle(settings.paddle1Height, settings.paddle1Width, 0, settings.paddle1Speed, settings.paddle1Color, settings.paddle1UpKey, settings.paddle1DownKey, canvas);
const paddle2 = new Paddle(settings.paddle2Height, settings.paddle2Width, canvas.width - settings.paddle2Width, settings.paddle2Speed, settings.paddle2Color, settings.paddle2UpKey, settings.paddle2DownKey, canvas);

const score = new Score();

let bonusArr = [];

// Fonctions
// =========

// Menu
// ----

function showMenu(menu) {
    document.getElementById(menu).style.display = 'flex';
}
function hideMenu(menu) {
    document.getElementById(menu).style.display = 'none';
}


function startNewGame() {
    // Cache tous les menus
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        hideMenu(menu.id);
    });

    // Reset le jeu
    resetGame(canvas);

    // Lance le jeu
    intervID = setInterval(gameLoop, 1000 / settings.fps);
}

function continueGame() {
    isPaused = false;

    // Cache tous les menus
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        hideMenu(menu.id);
    });

    // lance le jeu
    intervID = setInterval(gameLoop, 1000 / settings.fps);
}

function mainMenu() {
    // Stop le jeu
    clearInterval(intervID);
    intervID = null;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas

    // Cache tous les menus sauf mainMenu
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        if (menu.id === 'mainMenu') {
            showMenu(menu.id);
        } else {
            hideMenu(menu.id);
        }
    });
}

function pauseMenu() {
    isPaused = true;

    // Stop le jeu
    clearInterval(intervID);
    intervID = null;

    showMenu('pauseMenu');
}

function settingsMenu() {
    // Cache tous les menus sauf settingsMenu
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        if (menu.id === 'settingsMenu') {
            showMenu(menu.id);
        } else {
            hideMenu(menu.id);
        }
    });
}


// Settings
// --------

function setInputsDefaultValue(inputs) {
    inputs.forEach(input => {
        input.value = settings[input.id];
    });

    if (useSameSettingsForBothPaddlesCheckbox.checked) {
        sameSettingsPaddles();
    } else {
        differentSettingsPaddles();
    }
}

function updateSettings(e) {
    if (e.target.validity.valid) { // Si la valeur dans input est valide
        if (e.target.type === 'number') {
            settings[e.target.id] = parseFloat(e.target.value);
        } else {
            settings[e.target.id] = e.target.value;
        }

        if (useSameSettingsForBothPaddlesCheckbox.checked) {
            settings.paddle2Height = settings.paddle1Height;
            settings.paddle2Speed = settings.paddle1Speed;
        }

        ball.updateSettings(settings.ballRadius, settings.ballSpeed, settings.ballCoefSpeed, settings.ballMaxSpeed, settings.ballMaxAngle, settings.ballColor);

        paddle1.updateSettings(settings.paddle1Height, settings.paddle1Width, settings.paddle1Speed, settings.paddle1Color, settings.paddle1UpKey, settings.paddle1DownKey);
        paddle2.updateSettings(settings.paddle2Height, settings.paddle2Width, settings.paddle2Speed, settings.paddle2Color, settings.paddle2UpKey, settings.paddle2DownKey);
    } else { // Si la valeur dans input est invalide
        e.target.value = settings[e.target.id]
    }
}


function sameSettingsPaddles() {
    document.getElementById('paddle2Settings').style.display = 'none'; // On rend invisible les settings pour la paddle 2
    document.getElementById('paddlesSettingsLegend').textContent = 's'; // On écrit 'Paddles' dans le titre des settings

    // On met à jour les settings de la Paddle 2 pour qu'ils correspondent aux settings de la Paddle 1
    settings.paddle2Height = settings.paddle1Height;
    settings.paddle2Speed = settings.paddle1Speed;
    paddle2.updateSettings(settings.paddle2Height, settings.paddle2Width, settings.paddle2Speed, settings.paddle2Color, settings.paddle2UpKey, settings.paddle2DownKey);
}
function differentSettingsPaddles() {
    document.getElementById('paddle2Settings').style.display = 'flex'; // On affiche les settings pour la paddle 2
    document.getElementById('paddlesSettingsLegend').textContent = ' 1'; // On écrit 'Paddle 1' dans le titre des settings de la paddle 1

    // On met à jour l'affichage des inputs
    inputs.forEach(input => {
        input.value = settings[input.id];
    });
}

function menuSettingsPaddles(e) {
    if (e.target.checked) {
        sameSettingsPaddles();
    } else {
        differentSettingsPaddles();
    }
}

// Game
// ----

function resetGame(canvas) {
    ball.reset(canvas);

    paddle1.reset(canvas);
    paddle2.reset(canvas);

    score.reset();

    numBounces = 0;
    bonusArr = [];
}

function drawGame() {
    ball.draw(ctx);
    paddle1.draw(ctx);
    paddle2.draw(ctx);

    bonusArr.forEach(bonus => {bonus.draw(ctx)});
}

let paddleCollision = null;
let lastHit;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas

    ball.move(canvas);
    paddle1.move(keysDown, canvas);
    paddle2.move(keysDown, canvas);

    paddleCollision = ball.paddleCollisionDetection(paddle1, paddle2, canvas);
    if (paddleCollision != null) {
        lastHit = paddleCollision;
        ++ numBounces;

        if (bonusArr.length < settings.nbBonus) {
            bonusArr.push(new Bonus(bonusTypes, canvas));
        }
    }
    
    ball.borderCollisionDetection(score, canvas);

    let i = 0;
    let bonusName;
    while(i < bonusArr.length) {
        bonusName = bonusArr[i].collisionDetection(ball);
        if (bonusName != null) {
            bonusArr.splice(i, 1);
            bonusEffect(bonusName, lastHit);
        } else {
            ++ i;
        }
    }
    drawGame();
}

function bonusEffect (bonusName, lastHit) {
    if (bonusName === 'SuperSpeed') {
        ball.speedX = ball.speedX * 1.5;
        ball.speedY = ball.speedY * 1.5;
    }
    else if (bonusName === 'IncreasePaddleSize') {
        let tempSize;
        if (lastHit === 1) {
            tempSize = paddle1.height;
            paddle1.height = paddle1.height + 50;
            setTimeout(() => {paddle1.height = tempSize}, 5000);
        } else {
            tempSize = paddle2.height;
            paddle2.height = paddle2.height + 50;
            setTimeout(() => {paddle2.height = tempSize}, 5000);
        }
    }
}

// Event Listener
// ==============

// Détection des touches
document.addEventListener('keydown', (e) => {
    keysDown[e.code] = true; // Ajout de la touche appuyée dans keysDown

    // Empêche le défilement de la page lorsque l'on appuie sur les flèches
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
    }

    // Mettre pause quand on appuie sur Echap
    if (e.code === 'Escape') {
        if (intervID != null) {
            pauseMenu();
        } else if (isPaused) {
            continueGame();
        }
    }

});

document.addEventListener('keyup', (e) => {
    delete keysDown[e.code]; // Suppression de la touche relevé dans keysDown
});

// Détection des changements de settings
inputs.forEach(input => {
    input.addEventListener('change', updateSettings);
});

document.getElementById('sameSettingsBothPaddles').addEventListener('change', menuSettingsPaddles);

// Détection des clics sur les boutons

// mainMenu
document.getElementById('startButton').addEventListener('click', startNewGame);
document.getElementById('settingsButton').addEventListener('click', settingsMenu);

// pauseMenu
document.getElementById('continueButton').addEventListener('click', continueGame);
document.getElementById('restartButton').addEventListener('click', startNewGame);
document.getElementById('leaveButton').addEventListener('click', mainMenu);

// settingsMenu
document.getElementById('menuButton').addEventListener('click', mainMenu);

// Lancement du programme
// ======================

window.onload = function () {
    // Cache tous les menus sauf mainMenu
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        if (menu.id === 'mainMenu') {
            showMenu(menu.id);
        } else {
            hideMenu(menu.id);
        }
    });

    setInputsDefaultValue(inputs);
};