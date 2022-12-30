class Score {
    constructor() {
        this.player1 = 0;
        this.player2 = 0;

        this.player1Score = document.getElementById('player1Score');
        this.player2Score = document.getElementById('player2Score');

        this.update();
    }

    update() {
        this.player1Score.textContent = this.player1;
        this.player2Score.textContent = this.player2;
    }

    reset() {
        this.player1 = 0;
        this.player2 = 0;
    }
}