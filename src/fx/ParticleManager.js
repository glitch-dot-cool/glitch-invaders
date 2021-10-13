import { Particle } from "./Particle.js";

export class ParticleManager {
  constructor({ particleDensity }) {
    this.particles = [];
    this.particlesPerExplosion = 15;
    this.particleDensity = particleDensity;
  }

  emit = (s, particleOptions) => {
    const iterations = Math.floor(
      (particleOptions.numParticles || this.particlesPerExplosion) *
        this.particleDensity
    );
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
