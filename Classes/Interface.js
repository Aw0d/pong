class Interface {
    constructor() {
        this.menus = Array.from(document.getElementsByClassName('menu'));

        this.showMainMenu();
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