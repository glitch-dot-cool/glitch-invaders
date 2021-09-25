export class Bullet {
  constructor(x, y, xOffset = 0, sprite) {
    this.x = x;
    this.y = y;
    this.xOffset = xOffset;
    this.size = 10;
    this.speed = 10;
    this.sprite = sprite;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.size, this.size);
  };

  move = () => {
    this.y -= this.speed;
    this.x += this.xOffset;
  };
}
