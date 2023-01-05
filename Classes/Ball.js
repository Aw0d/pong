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
    }

    reset(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speed = this.initialSpeed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = Math.sin(45 * (Math.PI / 180)) * this.speed * (Math.random() > 0.5 ? 1 : -1);
        console.log('Reset -> speedX: ' + this.speedX + ', speedY: ' + this.speedY)
    }

    paddleCollisionDetection(paddle1, paddle2, canvas) {
        let collision = false;
        const round = (num) => {
            return Math.round(num * 10) / 10;
        }
        
        const bounce = (angle) => {
            this.speed = (this.speed * this.coefSpeed < this.maxSpeed)
                ? this.speed * this.coefSpeed
                : this.maxSpeed;
            this.speedX = Math.sin(angle * (Math.PI / 180)) * this.speed * (-this.speedX/Math.abs(this.speedX));
            this.speedY = Math.cos(angle * (Math.PI / 180)) * this.speed;
            console.log('Bounce -> speedX: ' + this.speedX + ', speedY: ' + this.speedY)
        }

        // Si on touche une paddle
        if (this.x - this.radius < paddle1.x + paddle1.width && (this.y + this.radius > paddle1.y && this.y + this.radius < paddle1.y + paddle1.height)) { // Si la balle touche la paddle 1
            const ballPaddleDiff = round(this.y-this.radius - (paddle1.y + paddle1.height / 2));
            const angle = round(90 - (ballPaddleDiff / (paddle1.height / 2 + this.radius)) * (90 - (180 - this.maxAngle)));
            
            this.x = paddle1.x + paddle1.width + this.radius; // On remet la balle sur la paddle
            bounce(angle);

            collision = true;
        } else if (this.x + this.radius > canvas.width - paddle2.width && (this.y + this.radius > paddle2.y && this.y + this.radius < paddle2.y + paddle2.height)) { // Si la balle touche la paddle 2
            const ballPaddleDiff = round(this.y-this.radius - (paddle2.y + paddle2.height / 2));
            const angle = round(90 - (ballPaddleDiff / (paddle2.height / 2 + this.radius)) * (90 - (180 - this.maxAngle)));
            
            this.x = paddle2.x - this.radius; // On remet la balle sur la paddle
            bounce(angle);

            collision = true;
        }

        return collision;
    }

    borderCollisionDetection(score, canvas) {
        // MAJ score
        if (this.x - this.radius < 0) {
            score.player2++;
            this.reset(canvas);
            score.update();
        } else if (this.x + this.radius > canvas.width) {
            score.player1++;
            this.reset(canvas);
            score.update();
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