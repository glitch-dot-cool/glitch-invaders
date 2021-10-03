import { Particle } from "./Particle.js";

export class ParticleManager {
  constructor() {
    this.particles = [];
    this.particlesPerExplosion = 15;
  }

  emit = (s, particleOptions) => {
    const iterations =
      particleOptions.numParticles || this.particlesPerExplosion;
    for (let i = 0; i < iterations; i++) {
      this.particles.push(new Particle(s, { ...particleOptions }));
    }
  };

  purgeParticles = () => {
    this.particles = this.particles.filter((particle) => !particle.finished());
  };

  renderParticles = (s) => {
    this.purgeParticles();
    this.particles.forEach((particle) => {
      particle.update();
      particle.show(s);
    });
  };
}
