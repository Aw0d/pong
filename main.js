// Déclaration des variables
// =========================

// Object pour les détections de touches
window.keysDown = {}

// Settings
// --------

const colors = {
    player1: '#0DB387',
    player2: '#D6A11A',
};

// Construction des classes
// --------------------------

const settingsManager = new SettingsManager();
const interface = new Interface();
const game = new Game(settings);

function startNewGame() {
    game.reset();
    game.score.reset();
    interface.hideAllMenu();
    game.start();
}

function continueGame() {
    interface.hideAllMenu();
    game.start();
}

function mainMenu() {
    game.stop();
    interface.showMainMenu();
}

function pauseGame() {
    game.pause();
    interface.showPauseMenu();
}

function settingsMenu() {
    interface.showSettingsMenu();
}

// Event Listener
// ==============

// Détection des touches
document.addEventListener('keydown', (e) => {
    window.keysDown[e.code] = true; // Ajout de la touche appuyée dans keysDown

    // Empêche le défilement de la page lorsque l'on appuie sur les flèches
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
    }

    // Mettre pause quand on appuie sur Echap
    if (e.code === 'Escape') {
        if (game.isStarted && !game.isPaused) {
            pauseGame();
        } else if (game.isStarted && game.isPaused) {
            continueGame()
        }
    }

});

document.addEventListener('keyup', (e) => {
    delete keysDown[e.code]; // Suppression de la touche relevé dans keysDown
});

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


window.onload = () => {
    settingsManager.init();
}