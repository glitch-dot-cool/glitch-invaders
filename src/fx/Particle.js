export class Particle {
  constructor(s, x, y) {
    this.pos = s.createVector(x + s.random(-10, 10), y + s.random(-10, 10));
    this.vel = s.createVector(0, 0);
    this.acc = s.createVector(s.random(-0.5, 0.5), s.random(-0.5, 0.5));
    this.r = s.random(4, 8);
    this.lifetime = 255;
  }

  applyForce = (force) => {
    this.acc.add(force);
  };

  update = () => {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.lifetime -= 2;
    this.r *= 0.96;
  };

  show = (s) => {
    s.strokeWeight(2);
    s.fill(
      s.random(100, 255),
      s.random(0, 100),
      s.random(0, 50),
      this.lifetime
    );
    s.rect(this.pos.x, this.pos.y, this.r * 2);
  };

  finished = () => {
    return this.lifetime < 0;
  };
}
