import { Powerup } from "./Powerup.js";

export class PowerupManager {
  constructor(s, powerupSprites, gun) {
    this.p5 = s;
    this.sprites = powerupSprites;
    this.POWERUPS = { RATE_OF_FIRE: "rateOfFire", BULLET_FAN: "numBullets" };
    this.period = 1; // how many rounds between powerups
    this.activePowerups = [];
    this.lastPowerup = this.POWERUPS.BULLET_FAN;
    this.target = gun;
  }

  show = (s) => {
    this.activePowerups.forEach((powerup) => {
      powerup.update(s);
      powerup.show(s);
    });
  };

  dispatchPowerup = () => {
    const nextPowerup = this.selectNextPowerup();
    this.activePowerups.push(nextPowerup);
  };

  purge = (idx) => {
    this.activePowerups.splice(idx, 1);
  };

  selectNextPowerup = () => {
    if (this.lastPowerup === this.POWERUPS.RATE_OF_FIRE) {
      this.lastPowerup = this.POWERUPS.BULLET_FAN;
      return this.createNextPowerup(this.lastPowerup);
    } else {
      this.lastPowerup = this.POWERUPS.RATE_OF_FIRE;
      return this.createNextPowerup(this.lastPowerup);
    }
  };

  createNextPowerup = (type) => {
    return new Powerup({
      x: this.p5.random(this.p5.width),
      y: this.p5.random(this.p5.height * 0.5),
      sprite: this.sprites[type],
      effect: {
        stat: type,
        value: type === this.POWERUPS.RATE_OF_FIRE ? 0.9 : 1, // +10% RoF or +1 bullet for fan
      },
      target: this.target,
    });
  };
}
