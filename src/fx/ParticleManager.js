import { Particle } from "./Particle.js";

export class ParticleManager {
  constructor() {
    this.particles = [];
    this.particlesPerExplosion = 15;
  }

  emit = (s, enemy) => {
    if (enemy) {
      for (let i = 0; i < this.particlesPerExplosion; i++) {
        this.particles.push(new Particle(s, enemy.x, enemy.y));
      }
    }
  };

  purgeParticles = () => {
    this.particles = this.particles.filter((particle) => !particle.finished());
  };

  renderParticles = (s) => {
    this.particles.forEach((particle) => {
      particle.update();
      particle.show(s);
    });
  };
}
