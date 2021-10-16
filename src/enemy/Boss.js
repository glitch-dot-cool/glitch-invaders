import { Enemy } from "./Enemy.js";

export class Boss extends Enemy {
  constructor(s, sprite, wave) {
    super(s, sprite, wave);
    this.type = "BOSS";
    this.maxHealth = 400 + wave * 5;
    this.health = this.maxHealth;
    this.width = sprite.width;
    this.height = sprite.height;
    this.sprite = sprite;
    this.pointValue = 200 + wave * 5;
    this.speed = 1.25;
    this.healthBarWidth = 200;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.width, this.height);
    this.move(Math.floor(s.millis() * 0.001));
    this.drawHealth(s);
  };
}
