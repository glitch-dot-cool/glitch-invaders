import { Bullet } from "./Bullet.js";

export class Gun {
  constructor(sprite) {
    this.bullets = [];
    this.sprite = sprite;
  }

  show = (s) => {
    this.bullets.forEach((bullet, idx) => {
      bullet.show(s);
      bullet.move();
      this.clearOffscreenBullet(bullet, idx);
    });
  };

  shoot = (keyCode, x, y) => {
    if (keyCode === 32) {
      this.bullets.push(new Bullet(x, y, 0, this.sprite));
      this.bullets.push(new Bullet(x, y, -1, this.sprite));
      this.bullets.push(new Bullet(x, y, 1, this.sprite));
    }
  };

  clearOffscreenBullet = (bullet, index) => {
    if (bullet.y < 0) this.bullets.splice(index, 1);
  };

  deleteBullet = (index) => {
    this.bullets.splice(index, 1);
  };
}
