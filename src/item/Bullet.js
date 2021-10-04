export class Bullet {
  constructor(x, y, xOffset = 0, sprite, speed, damage) {
    this.x = x;
    this.y = y;
    this.xOffset = xOffset;
    this.size = 20;
    this.speed = speed;
    this.sprite = sprite;
    this.damage = damage;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.size, this.size);
  };

  move = () => {
    this.y -= this.speed;
    this.x += this.xOffset;
  };
}
