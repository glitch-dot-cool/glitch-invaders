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
      colorRanges = {
        r: { low: 100, high: 255 },
        g: { low: 0, high: 100 },
        b: { low: 0, high: 50 },
      },
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
    this.colorRanges = colorRanges;
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
      s.random(this.colorRanges.r.low, this.colorRanges.r.high),
      s.random(this.colorRanges.g.low, this.colorRanges.g.high),
      s.random(this.colorRanges.b.low, this.colorRanges.b.high),
      this.lifetime
    );
    s.rect(this.pos.x, this.pos.y, this.r * 2);
  };

  finished = () => {
    return this.lifetime < 0;
  };
}
