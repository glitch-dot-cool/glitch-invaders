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
    this.isHidden = false;
    this.isConsumed = false;
    this.textOpacity = 255;
  }

  show = (s) => {
    if (!this.isHidden) {
      s.image(this.sprite, this.x, this.y, this.width, this.height);
    } else if (this.isConsumed) {
      this.showPowerupEffect(s);
    }
  };

  showPowerupEffect = (s) => {
    this.speed = -1; // invert speed so description text floats up
    this.textOpacity -= 3;
    const textOffset = this.effect.description.length * 4;
    s.fill(200, 200, 200, this.textOpacity);
    s.textSize(12);
    s.text(this.effect.description, this.x - textOffset, this.y - 50);
  };

  update = () => {
    this.y += this.speed;
  };

  hide = () => {
    this.isHidden = true;
  };

  consume = () => {
    this.isConsumed = true;
    this.target.consumePowerup(this.effect);
  };
}
