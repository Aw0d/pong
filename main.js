// Déclaration des variables
// =========================

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Object pour les détections de touches
let keysDown = {};

// Entier indiquant l'état
let state = 0;

// Array des input qui gère les settings
const inputs = document.getElementById('settingsMenu').querySelectorAll('input:not([type="checkbox"])');

const SameSettingsPaddlesCheckbox = document.getElementById('sameSettingsBothPaddles');


// Settings
// --------

const colors = {
    blue: '#3DC7AD',
    red: '#F3522C',
    darkGrey: '#222222',
    lightGrey: '#2E2E2E',
    text: '#e3e3e3'
}

const settings = {
    ballRadius: 10,
    ballSpeed: 3,
    ballCoefSpeed: 1.1,
    ballMaxSpeed: 8,
    ballMaxAngle: 140,
    ballColor: "#ababab",

    p1Height: 120,
    p1Width: 10,
    p1Speed: 8,
    p1Color: colors.blue,
    p1UpKey: "KeyW",
    p1DownKey: "KeyS",

    p2Height: 120,
    p2Width: 10,
    p2Speed: 8,
    p2Color: colors.red,
    p2UpKey: "ArrowUp",
    p2DownKey: "ArrowDown"
}

// Construction des classes
// --------------------------

const ball = new Ball(settings.ballRadius, settings.ballSpeed, settings.ballCoefSpeed, settings.ballMaxSpeed, settings.ballMaxAngle, settings.ballColor, canvas);

const paddle1 = new Paddle(settings.p1Height, settings.p1Width, 0, settings.p1Speed, settings.p1Color, settings.p1UpKey, settings.p1DownKey, canvas);
const paddle2 = new Paddle(settings.p2Height, settings.p2Width, canvas.width - settings.p2Width, settings.p2Speed, settings.p2Color, settings.p2UpKey, settings.p2DownKey, canvas);

const score = new Score();

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


function startGame() {
    // Cache tous les menus
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        hideMenu(menu.id);
    });

    // Reset le jeu
    resetGame(canvas);

    // Lance le jeu
    state = 1;
}

function continueGame() {
    // Cache tous les menus
    const menus = Array.from(document.getElementsByClassName('menu'));
    menus.forEach(menu => {
        hideMenu(menu.id);
    });

    // lance le jeu
    state = 1;
}

function mainMenu() {
    state = 0;

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
    state = 2;

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

    if (SameSettingsPaddlesCheckbox.checked) {
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

        if (SameSettingsPaddlesCheckbox.checked) {
            settings.p2Height = settings.p1Height;
            settings.p2Speed = settings.p1Speed;
        }

        ball.updateSettings(settings.ballRadius, settings.ballSpeed, settings.ballCoefSpeed, settings.ballMaxSpeed, settings.ballMaxAngle, settings.ballColor);

        paddle1.updateSettings(settings.p1Height, settings.p1Width, settings.p1Speed, settings.p1Color, settings.p1UpKey, settings.p1DownKey);
        paddle2.updateSettings(settings.p2Height, settings.p2Width, settings.p2Speed, settings.p2Color, settings.p2UpKey, settings.p2DownKey);
    } else { // Si la valeur dans input est invalide
        e.target.value = settings[e.target.id]
    }
}


function sameSettingsPaddles() {
    document.getElementById('p2Settings').style.display = 'none'; // On rend invisible les settings pour la paddle 2
    document.getElementById('paddlesSettingsLegend').textContent = 's'; // On écrit 'Paddles' dans le titre des settings

    // On met à jour les settings de la Paddle 2 pour qu'ils correspondent aux settings de la Paddle 1
    settings.p2Height = settings.p1Height;
    settings.p2Speed = settings.p1Speed;
    paddle2.updateSettings(settings.p2Height, settings.p2Width, settings.p2Speed, settings.p2Color, settings.p2UpKey, settings.p2DownKey);
}
function differentSettingsPaddles() {
    document.getElementById('p2Settings').style.display = 'flex'; // On affiche les settings pour la paddle 2
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
}

function drawGame() {
    ball.draw(ctx);
    paddle1.draw(ctx);
    paddle2.draw(ctx);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas

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


    } else if (state === 3) { // Settings


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
        if (state === 1) {
            pauseMenu();
        } else if (state === 2) {
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
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('settingsButton').addEventListener('click', settingsMenu);

// pauseMenu
document.getElementById('continueButton').addEventListener('click', continueGame);
document.getElementById('restartButton').addEventListener('click', startGame);
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

    setInterval(mainLoop, 1000 / 144);
};