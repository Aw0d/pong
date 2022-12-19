class Ball {
    constructor (settings, canvas, ctx) {
        this.radius = settings.radius;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.speedX = settings.speedX;
        this.speedY = settings.speedY;

        this.coefAngle = settings.coefAngle;
        this.coefSpeed = settings.coefSpeed;
        this.maxSpeed = settings.maxSpeed;

        this.couleur = settings.couleur;
        this.canvas = canvas;
        this.ctx = ctx;
    }

    move () {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebondir sur les bords du haut et du bas du canvas
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    resetBall () {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    }

    collisionDetection (paddle1, paddle2) {
        // Déterminer l'angle de la balle
        let ballPaddleDiff;

        if (this.x - this.radius < paddle1.width) {
            ballPaddleDiff = this.y - (paddle1.y + paddle.height / 2);
        } else if (this.x + this.radius > this.canvas.width - paddle2.width) {
            ballPaddleDiff = this.y - (paddle2.y + paddle2.height / 2);
        }
        if (this.x - this.radius < paddle1.width) {
            this.speedY = ballPaddleDiff * this.coefAngle;
        } else if (this.x + this.radius > this.canvas.width - paddle2.width) {
            this.speedY = ballPaddleDiff * this.coefAngle;
        }

        // Rebondir sur les paddles
        // Paddle 1
        if (this.x - this.radius < paddle1.x + paddle1.width && this.y >= paddle1.y && this.y <= paddle1.y + paddle1.height) {
            this.x = paddle1.x + paddle1.width; // On replace la balle sur la paddle

            if (this.speedX > -this.maxSpeed && this.speedX < this.maxSpeed) {
                this.speedX = -this.speedX * this.coefSpeed;
            } else {
                this.speedX = -this.speedX;
            }
        }

        // Paddle 2
        if (this.x - this.radius < paddle2.x && this.y >= paddle2.y && this.y <= paddle2.y + paddle2.height) {
            this.x = paddle2.x; // On replace la balle sur la paddle

            if (this.speedX > -this.maxSpeed && this.speedX < this.maxSpeed) {
                this.speedX = -this.speedX * this.coefSpeed;
            } else {
                this.speedX = -this.speedX;
            }
        }
    }

    draw () {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.couleur;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class Paddle {
    constructor (settings, x, canvas, ctx) {
        this.height = settings.height;
        this.width = settings.width;

        this.x = x;
        this.y = (canvas.height - this.height) / 2;

        this.speed = settings.speed;

        this.couleur = settings.couleur;
        this.canvas = canvas;
        this.ctx = ctx;

        this.upKey = settings.upKey;
        this.downKey = settings.downKey;
    }

    move (keysDown) {
        if (this.upKey in keysDown && this.y > 0) { // Touche W
            this.y -= this.speed;
        }
        if (this.downKey in keysDown && this.y + this.height < this.canvas.height) { // Touche S
            this.y += this.speed;
        }
    }

    draw () {
        this.ctx.beginPath();
        this.ctx.rect(0, this.y, this.width, this.height);
        this.ctx.fillStyle = this.couleur;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class Score {
    constructor (couleurJ1, couleurJ2, canvas, ctx) {
        this.joueur1 = 0;
        this.joueur2 = 0;

        this.couleurJ1 = couleurJ1;
        this.couleurJ2 = couleurJ2;

        this.canvas = canvas;
        this.ctx = ctx;
    }

    drawScore () {
        this.ctx.font = '48px Arial';
        this.ctx.fillStyle = this.couleurJ1;
        this.ctx.fillText(this.joueur1, this.canvas.width / 4, 50);
        this.ctx.fillStyle = this.couleurJ2;
        this.ctx.fillText(this.joueur2, (this.canvas.width / 4) * 3, 50);
    }
}

export { Ball, Paddle, Score }
