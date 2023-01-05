class Bonus {
    constructor(canvas) {
        this.radius = 20;

        let minDistanceFromPaddle = 200;

        this.x = Math.floor(Math.random() * ((canvas.width - minDistanceFromPaddle - this.radius) - (minDistanceFromPaddle + this.radius))) + minDistanceFromPaddle + this.radius;
        this.y = Math.floor(Math.random() * ((canvas.height - this.radius) - this.radius)) + this.radius;


        this.color = '#FFFFFF'
    }

    collisionDetection(ball) {
        let distance = Math.round(Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)));
        console.log('Distance: ' + distance + ', ' + (distance < this.radius + ball.radius))
        return distance < this.radius + ball.radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}