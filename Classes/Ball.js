class Ball {
    constructor(radius, speed, coefSpeed, maxSpeed, maxAngle, color, canvas) {
        this.radius = radius;

        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.speed = speed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * speed;
        this.speedY = Math.sin(45 * (Math.PI / 180)) * speed;
        this.initialSpeed = speed;

        this.coefSpeed = coefSpeed;
        this.maxSpeed = maxSpeed;

        this.maxAngle = maxAngle;

        this.color = color;
    }

    move(canvas) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebondir sur les bords du haut et du bas du canvas
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.speedY = -this.speedY;
        }
        console.log('speed: ' + this.speed + '\nspeedX: ' + this.speedX + '\nspeedY: ' + this.speedY);
    }

    reset(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speed = this.initialSpeed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = Math.sin(45 * (Math.PI / 180)) * this.speed * (Math.random() > 0.5 ? 1 : -1);
    }

    collisionDetection(paddle1, paddle2, score, canvas) {
        // Déterminer l'angle de la balle
        let ballPaddleDiff;
        let angle;

        if (this.x - this.radius < paddle1.width) {
            ballPaddleDiff = this.y - (paddle1.y + paddle1.height / 2);
            angle = 90 - (ballPaddleDiff / (paddle1.height / 2)) * (90 - (180 - this.maxAngle));
        } else if (this.x + this.radius > canvas.width - paddle2.width) {
            ballPaddleDiff = this.y - (paddle2.y + paddle2.height / 2);
            angle = 90 + (ballPaddleDiff / (paddle2.height / 2)) * (90 - (180 - this.maxAngle));
        }

        // Rebondir sur les paddles
        // Paddle 1
        if (this.x - this.radius < paddle1.x + paddle1.width && this.y >= paddle1.y && this.y <= paddle1.y + paddle1.height) {
            this.x = paddle1.x + paddle1.width + this.radius; // On replace la balle sur la paddle

            if (this.speed*this.coefSpeed < this.maxSpeed) { // Si la vitesse est inférieure à la vitesse Max
                this.speed = this.speed * this.coefSpeed;
                this.speedX = Math.sin(angle * (Math.PI / 180)) * this.speed;
                this.speedY = Math.cos(angle * (Math.PI / 180)) * this.speed;
            } else {
                this.speed = this.maxSpeed;
                this.speedX = Math.sin(angle * (Math.PI / 180)) * this.speed;
                this.speedY = Math.cos(angle * (Math.PI / 180)) * this.speed;
            }
        }

        // Paddle 2
        if (this.x + this.radius > paddle2.x && this.y >= paddle2.y && this.y <= paddle2.y + paddle2.height) {
            this.x = paddle2.x - this.radius; // On replace la balle sur la paddle

            if (this.speed*this.coefSpeed < this.maxSpeed) { // Si la vitesse est inférieure à la vitesse Max
                this.speed = this.speed * this.coefSpeed;
                this.speedX = - Math.sin(angle * (Math.PI / 180)) * this.speed;
                this.speedY = - Math.cos(angle * (Math.PI / 180)) * this.speed;
            } else {
                this.speed = this.maxSpeed;
                this.speedX = - Math.sin(angle * (Math.PI / 180)) * this.speed;
                this.speedY = - Math.cos(angle * (Math.PI / 180)) * this.speed;
            }
        }

        // MAJ score
        if (this.x - this.radius < 0) {
            score.player2++;
            score.update();
            this.reset(canvas);
        } else if (this.x + this.radius > canvas.width) {
            score.player1++;
            score.update();
            this.reset(canvas);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updateSettings(radius, speed, coefSpeed, maxSpeed, maxAngle, color) {
        this.radius = radius;

        this.speed = speed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * speed;
        this.speedY = Math.cos(45 * (Math.PI / 180)) * speed;
        this.initialSpeed = speed;

        this.coefSpeed = coefSpeed;
        this.maxSpeed = maxSpeed;

        this.maxAngle = maxAngle;

        this.color = color;
    }
}