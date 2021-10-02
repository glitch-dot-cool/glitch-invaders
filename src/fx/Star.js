export class Star {
  constructor(s) {
    this.x = s.random(s.width);
    this.y = s.random(s.height);
    this.radius = s.random(1, 5);
    this.tint = s.map(this.radius, 1, 5, 30, 255);
    this.speed = this.radius;
  }

  show = (s) => {
    s.fill(this.tint);
    s.noStroke();
    s.ellipse(this.x, this.y, this.radius);
  };

  update = () => {
    this.y += this.speed;
  };
}
