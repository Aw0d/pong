class Paddle {
    constructor(height, width, xPos, speed, color, upKey, downKey, canvas) {
        this.height = height;
        this.width = width;

        this.x = xPos;
        this.y = (canvas.height - this.height) / 2;

        this.speed = speed;

        this.color = color;

        this.upKey = upKey;
        this.downKey = downKey;
    }

    move(keysDown, canvas) {
        if (this.upKey in keysDown && this.y > 0) { // Touche W
            this.y -= this.speed;
        }
        if (this.downKey in keysDown && this.y + this.height < canvas.height) { // Touche S
            this.y += this.speed;
        }
    }

    reset(canvas) {
        this.y = (canvas.height - this.height) / 2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updateSettings(height, width, speed, color, upKey, downKey) {
        this.height = height;
        this.width = width;

        this.speed = speed;

        this.color = color;

        this.upKey = upKey;
        this.downKey = downKey;
    }
}