import { Enemy } from "./Enemy.js";

export class Boss extends Enemy {
  constructor(s, sprites, wave) {
    super(s, sprites, wave);
    this.type = "BOSS";
    this.maxHealth = 500 + wave * 100;
    this.health = this.maxHealth;
    this.width = sprites.boss.width * 0.5;
    this.height = sprites.boss.height * 0.5;
    this.sprite = sprites.boss;
    this.pointValue = 200 + wave * 5;
    this.speed = 0.6;
    this.healthBarWidth = 200;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.width, this.height);
    this.move(Math.floor(s.millis() * 0.001));
    this.drawHealth(s);
  };
}
