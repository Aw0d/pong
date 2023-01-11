class Interface {
    constructor() {
        this.menus = Array.from(document.getElementsByClassName('menu'));

        this.showMainMenu();
        this.hidePlayerScored();
    }

    showMenu(menu) {
        document.getElementById(menu).style.display = 'flex';
    }
    hideMenu(menu) {
        document.getElementById(menu).style.display = 'none';
    }


    hideAllMenu() {
        this.menus.forEach(menu => {
            this.hideMenu(menu.id);
        });
        this.hidePlayerScored();
    }

    showMainMenu() {
        this.menus.forEach(menu => {
            if (menu.id === 'mainMenu') {
                this.showMenu(menu.id);
            } else {
                this.hideMenu(menu.id);
            }
        });
    }

    showPauseMenu() {
        this.menus.forEach(menu => {
            if (menu.id === 'pauseMenu') {
                this.showMenu(menu.id);
            } else {
                this.hideMenu(menu.id);
            }
        });
    }

    showPlayerScored(numPlayer) {
        const textElement = document.getElementById('playerScored');
        const spanElement = document.getElementById('playerNumber');

        spanElement.textContent = numPlayer;
        textElement.style.display = 'block';

        if (numPlayer === 1) {
            spanElement.style.color = colors.player1;
        } else {
            spanElement.style.color = colors.player2
        }
    }

    hidePlayerScored() {
        const textElement = document.getElementById('playerScored');
        textElement.style.display = 'none';
    }

    showScoredMenu(numPlayer) {
        this.showPlayerScored(numPlayer);
        this.showPauseMenu();
    }

    showSettingsMenu() {
        this.menus.forEach(menu => {
            if (menu.id === 'settingsMenu') {
                this.showMenu(menu.id);
            } else {
                this.hideMenu(menu.id);
            }
        });
    }
}