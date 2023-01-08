class Game {
    constructor() {
        // Canvas
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Objets
        const settings = window.settings;
        this.ball = new Ball(settings.ballRadius, settings.ballSpeed, settings.ballCoefSpeed, settings.ballMaxSpeed, settings.ballMaxAngle, settings.ballColor, this.canvas);

        this.paddle1 = new Paddle(settings.paddle1Height, settings.paddle1Width, 0, settings.paddle1Speed, settings.paddle1Color, settings.paddle1UpKey, settings.paddle1DownKey, this.canvas);
        this.paddle2 = new Paddle(settings.paddle2Height, settings.paddle2Width, this.canvas.width - settings.paddle2Width, settings.paddle2Speed, settings.paddle2Color, settings.paddle2UpKey, settings.paddle2DownKey, this.canvas);

        this.score = new Score();

        // animationFrame
        this.animationFrameId = null;

        this.lastTime = 0;
        this.pauseTime = 0;
        this.timeSpentPaused = 0;

        this.isStarted = false;
        this.isPaused = false;

        this.numBounces = 0;
    }

    reset() {
        this.ball.reset(this.canvas);

        this.paddle1.reset(this.canvas);
        this.paddle2.reset(this.canvas);

        this.score.reset();

        this.numBounces = 0;
    }

    draw() {
        this.ball.draw(this.ctx);
        this.paddle1.draw(this.ctx);
        this.paddle2.draw(this.ctx);
    }

    updateItems(elapsedTime) {
        this.ball.move(this.canvas, elapsedTime);
        this.paddle1.move(window.keysDown, this.canvas, elapsedTime)
        this.paddle2.move(window.keysDown, this.canvas, elapsedTime)
    }

    update(time) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear Canvas

        let elapsedTime = (time - this.lastTime - this.timeSpentPaused) / 1000;

        this.updateItems(elapsedTime);

        this.ball.paddleCollisionDetection(this.paddle1, this.paddle2, this.canvas);
        this.ball.borderCollisionDetection(this.score, this.canvas)

        this.draw()

        this.lastTime = time;
        this.timeSpentPaused = 0

        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    }

    start() {
        this.isStarted = true;
        this.isPaused = false;

        this.timeSpentPaused = performance.now() - this.pauseTime;
        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    }

    pause() {
        this.isPaused = true;
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;

        this.pauseTime = performance.now();
    }

    stop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear Canvas
        this.isStarted = false;
        this.isPaused = false;
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }
}