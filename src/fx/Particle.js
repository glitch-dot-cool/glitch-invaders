export class Particle {
  constructor(
    s,
    {
      x,
      y,
      spread = 10,
      accelleration = 0.5,
      minSize = 4,
      maxSize = 8,
      lifetime = 255,
    }
  ) {
    this.pos = s.createVector(
      x + s.random(-spread, spread),
      y + s.random(-spread, spread)
    );
    this.vel = s.createVector(0, 0);
    this.acc = s.createVector(
      s.random(-accelleration, accelleration),
      s.random(-accelleration, accelleration)
    );
    this.r = s.random(minSize, maxSize);
    this.lifetime = lifetime;
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
