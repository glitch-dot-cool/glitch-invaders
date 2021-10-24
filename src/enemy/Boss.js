import { Enemy } from "./Enemy.js";

export class Boss extends Enemy {
  constructor(s, sprites, wave, x, y, scale = 1) {
    super(s, sprites, wave);
    this.p5 = s;
    this.type = scale === 1 ? "BOSS" : "MINIBOSS";
    this.x = x;
    this.y = y;
    this.maxHealth = 250 * scale + wave * (100 * scale);
    this.health = this.maxHealth;
    this.width = sprites.boss.width * 0.5 * scale;
    this.height = sprites.boss.height * 0.5 * scale;
    this.sprite = sprites.boss;
    this.pointValue = 200 * scale + wave * (5 * scale);
    this.speed = 0.6;
    this.healthBarWidth = 200 * scale;
  }

  show = (s) => {
    this.move(Math.floor(s.millis() * 0.0005));
    s.image(this.sprite, this.x, this.y, this.width, this.height);
    this.drawHealth(s);
  };
}
