import { Bullet } from "./Bullet.js";

export class Gun {
  constructor(p5, sprite, sound) {
    this.p5 = p5;
    this.bulletSize = 20;
    this.bullets = [];
    this.sprite = sprite;
    this.rateOfFire = 15;
    this.bulletSpeed = 25;
    this.numBullets = 1;
    this.sound = sound;
    this.initialDamage = 10;
    this.damage = this.initialDamage;
  }

  show = (s) => {
    this.bullets.forEach((bullet, idx) => {
      bullet.show(s);
      bullet.move();
      this.clearOffscreenBullet(bullet, idx);
    });
  };

  shoot = (x, y) => {
    for (let i = 0; i < this.numBullets; i++) {
      this.bullets.push(
        new Bullet(
          x,
          y,
          (i % this.numBullets) - Math.floor(this.numBullets / 2), // fan bullets out
          this.sprite,
          this.bulletSpeed,
          this.damage,
          this.bulletSize
        )
      );
    }
    this.sound.play(null, this.p5.random(0.8, 1.2));
  };

  clearOffscreenBullet = (bullet, index) => {
    if (bullet.y < 0) this.bullets.splice(index, 1);
  };

  deleteBullet = (index) => {
    this.bullets.splice(index, 1);
  };

  consumePowerup = (effect) => {
    if (effect.stat === "RATE_OF_FIRE") {
      this.rateOfFire = Math.max(Math.floor(this.rateOfFire * effect.value), 1);
    } else if (effect.stat === "BULLET_FAN") {
      this.numBullets += effect.value;
      this.bulletSize = Math.max(this.bulletSize - 1, 8);
      this.damage = Math.max(
        Math.floor(this.damage * 0.8),
        this.initialDamage / 2
      );
    } else if (effect.stat === "DAMAGE") {
      this.damage = Math.ceil(this.damage * effect.value);
    }
  };
}
