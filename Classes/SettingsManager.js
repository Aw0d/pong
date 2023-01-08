class SettingsManager {
    constructor () {
        window.settings = {
            ballRadius: 10,
            ballSpeed: 700,
            ballCoefSpeed: 1.05,
            ballMaxSpeed: 2000,
            ballMaxAngle: 140,
            ballColor: "#ababab",
        
            paddle1Height: 120,
            paddle1Width: 10,
            paddle1Speed: 800,
            paddle1Color: colors.player1,
            paddle1UpKey: "KeyW",
            paddle1DownKey: "KeyS",
        
            paddle2Height: 120,
            paddle2Width: 10,
            paddle2Speed: 800,
            paddle2Color: colors.player2,
            paddle2UpKey: "ArrowUp",
            paddle2DownKey: "ArrowDown",
        
            nbBonus: 5,
        
            fps: 120
        };

        this.inputs = document.getElementById('settingsMenu').querySelectorAll('input:not([type="checkbox"])');

        this.useSameSettingsForBothPaddlesCheckbox = document.getElementById('sameSettingsBothPaddles');
    }

    init() {
        this.refreshInputsValues();
    
        if (this.useSameSettingsForBothPaddlesCheckbox.checked) {
            this.sameSettingsPaddles();
        } else {
            this.differentSettingsPaddles();
        }

        this.inputs.forEach(input => {
            input.addEventListener('change', this.updateSettings.bind(this));
        });        
        document.getElementById('sameSettingsBothPaddles').addEventListener('change', this.menuSettingsPaddles.bind(this));
    }

    refreshInputsValues () {
        this.inputs.forEach(input => {
            input.value = window.settings[input.id];
        });
    }


    updateSettings(e) {
        console.log(window.settings)
        if (e.target.validity.valid) { // Si la valeur dans input est valide
            if (e.target.type === 'number') {
                window.settings[e.target.id] = parseFloat(e.target.value);
            } else {
                window.settings[e.target.id] = e.target.value;
            }
    
            if (this.useSameSettingsForBothPaddlesCheckbox.checked) {
                window.settings.paddle2Height = window.settings.paddle1Height;
                window.settings.paddle2Speed = window.settings.paddle1Speed;
            }
    
            game.ball.updateSettings(settings.ballRadius, settings.ballSpeed, settings.ballCoefSpeed, settings.ballMaxSpeed, settings.ballMaxAngle, settings.ballColor);
    
            game.paddle1.updateSettings(settings.paddle1Height, settings.paddle1Width, settings.paddle1Speed, settings.paddle1Color, settings.paddle1UpKey, settings.paddle1DownKey);
            game.paddle2.updateSettings(settings.paddle2Height, settings.paddle2Width, settings.paddle2Speed, settings.paddle2Color, settings.paddle2UpKey, settings.paddle2DownKey);
        
        } else { // Si la valeur dans input est invalide
            e.target.value = window.settings[e.target.id]
        }
    }
    
    
    sameSettingsPaddles() {
        document.getElementById('paddle2Settings').style.display = 'none'; // On rend invisible les settings pour la paddle 2
        document.getElementById('paddlesSettingsLegend').textContent = 's'; // On écrit 'Paddles' dans le titre des settings
    
        // On met à jour les settings de la Paddle 2 pour qu'ils correspondent aux settings de la Paddle 1
        settings.paddle2Height = settings.paddle1Height;
        settings.paddle2Speed = settings.paddle1Speed;
    }

    differentSettingsPaddles() {
        document.getElementById('paddle2Settings').style.display = 'flex'; // On affiche les settings pour la paddle 2
        document.getElementById('paddlesSettingsLegend').textContent = ' 1'; // On écrit 'Paddle 1' dans le titre des settings de la paddle 1
    
        this.refreshInputsValues();
    }
    
    menuSettingsPaddles(e) {
        if (e.target.checked) {
            this.sameSettingsPaddles();
        } else {
            this.differentSettingsPaddles();
        }
    }
}