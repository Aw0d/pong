class Bonus {
    constructor(bonusTypes, canvas) {
        let bonusType = bonusTypes[Math.floor(Math.random() * (bonusTypes.length))];
        
        this.name = bonusType.name;
        this.radius = bonusType.radius;
        this.color = bonusType.color;

        let minDistanceFromPaddle = 200;

        this.x = Math.floor(Math.random() * ((canvas.width - minDistanceFromPaddle - this.radius) - (minDistanceFromPaddle + this.radius))) + minDistanceFromPaddle + this.radius;
        this.y = Math.floor(Math.random() * ((canvas.height - this.radius) - this.radius)) + this.radius;

    }

    collisionDetection(ball) {
        let distance = Math.round(Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)));
        if (distance < this.radius + ball.radius) {
            return this.name;
        } else {
            return null;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}