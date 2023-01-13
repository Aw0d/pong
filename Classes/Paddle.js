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

  move(keysDown, canvas, elapsedTime) {
    if (this.upKey in keysDown && this.y > 0) {
      this.y -= this.speed * elapsedTime;
    }
    if (this.downKey in keysDown && this.y + this.height < canvas.height) {
      this.y += this.speed * elapsedTime;
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
