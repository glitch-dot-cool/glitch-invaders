export class TextFade {
  constructor({
    x,
    y,
    text,
    textSize = 12,
    speed = 1,
    color = { r: 125, g: 125, b: 175 },
  }) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.opacity = 255;
    this.duration = 2;
    this.text = text;
    this.textSize = textSize;
    this.color = color;
    this.expiry = Date.now() + 1_000 * this.duration;
  }

  update = () => {
    this.y -= this.speed;
    this.opacity -= 2;
  };

  show = (s) => {
    this.update();
    s.fill(this.color.r, this.color.g, this.color.b, this.opacity);
    s.text(this.text, this.x, this.y);
  };
}
