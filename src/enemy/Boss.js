import { Enemy } from "./Enemy.js";

export class Boss extends Enemy {
  constructor(s, sprites, wave, x, y, position, scale = 1) {
    super(s, sprites, wave);
    this.p5 = s;
    this.type = scale === 1 ? "BOSS" : "MINIBOSS";
    this.position = position;
    this.x = x;
    this.y = y;
    this.maxHealth = 50 * scale + wave * (150 * scale);
    this.health = this.maxHealth;
    this.width = sprites.boss.width * 0.5 * scale;
    this.height = sprites.boss.height * 0.5 * scale;
    this.sprite = sprites.boss;
    this.pointValue = 200 * scale + wave * (5 * scale);
    this.speed = 0.4;
    this.healthBarWidth = 200 * scale;
  }

  show = (s) => {
    this.move(Math.floor(s.millis() * 0.0005));
    s.image(this.sprite, this.x, this.y, this.width, this.height);
    this.drawHealth(s);
  };

  move = (seconds) => {
    this.y += this.speed;
    if (seconds % 2 === 0) {
      this.x += this.speed * 8;
    } else this.x -= this.speed * 8;

    const miniBossSpeed = this.speed * 4;
    if (this.position === "LEFT") {
      if (seconds % 2 === 0) {
        this.y += miniBossSpeed;
      } else this.y -= miniBossSpeed;
    } else if (this.position === "RIGHT") {
      if (seconds % 2 === 0) {
        this.y -= miniBossSpeed;
      } else this.y += miniBossSpeed;
    } else if (this.position === "BOTTOM") {
      if (seconds % 2 === 0) {
        this.x += miniBossSpeed;
      } else this.x -= miniBossSpeed;
    } else if (this.position === "TOP") {
      if (seconds % 2 === 0) {
        this.x -= miniBossSpeed;
      } else this.x += miniBossSpeed;
    }
  };
}
