export class Powerup {
  constructor({ x, y, sprite, effect, target, scale = 0.5 }) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = sprite.width * scale;
    this.height = sprite.height * scale;
    this.effect = effect;
    this.target = target;
    this.speed = 4;
    this.textOpacity = 255;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.width, this.height);
  };

  update = () => {
    this.y += this.speed;
  };

  consume = () => {
    this.target.consumePowerup(this.effect);
  };
}
