import { Ball, Paddle, Score } from "./game-objects";

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let ball = new Ball(settings.ball, canvas, ctx);

let paddle1 = new Paddle(settings.joueur1, 0, canvas, ctx);
let paddle2 = new Paddle(settings.joueur2, canvas.width - settings.joueur2.width, canvas, ctx);

let score = new Score(settings.joueur1.couleur, settings.joueur2.couleur, canvas, ctx);

let keysDown = {};

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.move();
  paddle1.move(keysDown);
  paddle2.move(keysDown);
  ball.collisionDetection(paddle1, paddle2);
  ball.draw();
  paddle1.draw();
  paddle2.draw();
  score.draw();
}

document.addEventListener('keydown', function (e) {
  keysDown[e.code] = true;
});
document.addEventListener('keyup', function (e) {
  delete keysDown[e.code];
});

window.onload = function () {
  setInterval(gameLoop, 1000 / 240);
};