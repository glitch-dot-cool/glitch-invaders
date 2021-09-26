export class Powerup {
  constructor({ x, y, sprite, effect, target }) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = sprite.width / 2;
    this.height = sprite.height / 2;
    this.effect = effect;
    this.target = target;
    this.speed = 1;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.width, this.height);
  };

  update = () => {
    this.y += this.speed;
  };

  consume = () => {
    this.target.consume(this.effect);
  };
}
