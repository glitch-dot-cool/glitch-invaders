import { Bullet } from "./Bullet.js";

export class Gun {
  constructor(sprite) {
    this.bullets = [];
    this.sprite = sprite;
    this.rateOfFire = 15;
    this.bulletSpeed = 10;
  }

  show = (s) => {
    this.bullets.forEach((bullet, idx) => {
      bullet.show(s);
      bullet.move();
      this.clearOffscreenBullet(bullet, idx);
    });
  };

  shoot = (x, y) => {
    this.bullets.push(new Bullet(x, y, 0, this.sprite, this.bulletSpeed));
    // this.bullets.push(new Bullet(x, y, -1, this.sprite));
    // this.bullets.push(new Bullet(x, y, 1, this.sprite));
  };

  clearOffscreenBullet = (bullet, index) => {
    if (bullet.y < 0) this.bullets.splice(index, 1);
  };

  deleteBullet = (index) => {
    this.bullets.splice(index, 1);
  };

  consumePowerup = (effect) => {
    this[effect.stat] += effect.value;
  };
}
