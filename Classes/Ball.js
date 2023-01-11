class Ball {
    constructor(radius, speed, acceleration, maxSpeed, maxAngle, color, canvas) {
        this.radius = radius;

        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.speed = speed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * speed;
        this.speedY = Math.sin(45 * (Math.PI / 180)) * speed;
        this.initialSpeed = speed;

        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;

        this.maxAngle = maxAngle;

        this.color = color;

        this.boost = false;
    }

    move(canvas, elapsedTime, executionTime) {
        this.updateSpeed(executionTime);
        
        this.x += this.speedX * this.speed * elapsedTime;
        this.y += this.speedY * this.speed * elapsedTime;

        // Rebondir sur les bords du haut et du bas du canvas
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    updateSpeed(time) {
        if (!this.boost) {
            this.speed = this.initialSpeed + (this.maxSpeed - this.initialSpeed) * (1 - Math.exp(-this.acceleration/100*time));
        } else {
            this.speed = this.initialSpeed + (this.maxSpeed - this.initialSpeed) * (1 - Math.exp(-this.acceleration*time));
        }
    }    

    reset(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speed = this.initialSpeed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = Math.sin(45 * (Math.PI / 180)) * (Math.random() > 0.5 ? 1 : -1);

        this.boost = false;
    }

    paddleCollisionDetection(paddle1, paddle2, canvas) {
        let collision = null;
        const round = (num) => {
            return Math.round(num * 10) / 10;
        }
        
        const bounce = (angle) => {
            this.speedX = Math.sin(angle * (Math.PI / 180)) * (-this.speedX/Math.abs(this.speedX));
            this.speedY = Math.cos(angle * (Math.PI / 180));
        }

        // Si on touche une paddle
        if (this.x - this.radius < paddle1.x + paddle1.width && (this.y + this.radius > paddle1.y && this.y - this.radius < paddle1.y + paddle1.height)) { // Si la balle touche la paddle 1
            const ballPaddleDiff = round(this.y-this.radius - (paddle1.y + paddle1.height / 2));
            const angle = round(90 - (ballPaddleDiff / (paddle1.height / 2 + this.radius)) * (90 - (180 - this.maxAngle)));
            
            this.x = paddle1.x + paddle1.width + this.radius; // On remet la balle sur la paddle
            bounce(angle);

            this.boost = false;
            collision = 1;
        } else if (this.x + this.radius > canvas.width - paddle2.width && (this.y + this.radius > paddle2.y && this.y - this.radius < paddle2.y + paddle2.height)) { // Si la balle touche la paddle 2
            const ballPaddleDiff = round(this.y-this.radius - (paddle2.y + paddle2.height / 2));
            const angle = round(90 - (ballPaddleDiff / (paddle2.height / 2 + this.radius)) * (90 - (180 - this.maxAngle)));
            
            this.x = paddle2.x - this.radius; // On remet la balle sur la paddle
            bounce(angle);

            this.boost = false;
            collision = 2;
        }

        return collision;
    }

    borderCollisionDetection(score, canvas) {
        // MAJ score
        let borderCollision = null;
        if (this.x - this.radius < 0) {
            borderCollision = 2;
        } else if (this.x + this.radius > canvas.width) {
            borderCollision = 1;
        }
        return borderCollision;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updateSettings(radius, speed, acceleration, maxSpeed, maxAngle, color) {
        this.radius = radius;

        this.speed = speed;
        this.speedX = Math.sin(45 * (Math.PI / 180)) * speed;
        this.speedY = Math.cos(45 * (Math.PI / 180)) * speed;
        this.initialSpeed = speed;

        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;

        this.maxAngle = maxAngle;

        this.color = color;
    }
}