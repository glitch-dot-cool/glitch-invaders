import { Powerup } from "./Powerup.js";

export class PowerupManager {
  constructor(s, powerupSprites, gun, player) {
    this.p5 = s;
    this.sprites = powerupSprites;
    this.powerups = [
      {
        name: "RATE_OF_FIRE",
        value: 0.9,
        target: gun,
        description: "+rate of fire",
      },
      {
        name: "BULLET_FAN",
        value: 1,
        target: gun,
        description: "+bullet spread, -damage, -bullet size",
      },
      {
        name: "BATTERY",
        value: null,
        target: player,
        description: "+battery regen, +max battery",
      },
      {
        name: "DAMAGE",
        value: 1.35,
        target: gun,
        description: "+damage",
        iconScale: 1,
      },
    ];
    this.period = 2; // how many rounds between powerups
    this.activePowerups = [];
  }

  show = (s) => {
    this.activePowerups.forEach((powerup) => {
      powerup.update(s);
      powerup.show(s);
    });
  };

  dispatchPowerup = () => {
    const nextPowerup = this.createNextPowerup();
    this.activePowerups.push(nextPowerup);
  };

  purge = (idx) => {
    this.activePowerups[idx].hide();
    setTimeout(() => {
      this.activePowerups.splice(idx, 1);
    }, 1500);
  };

  createNextPowerup = () => {
    const powerup = this.p5.random(this.powerups);
    return new Powerup({
      x: this.p5.random(this.p5.width * 0.15, this.p5.width * 0.85),
      y: this.p5.random(this.p5.height * 0.5),
      sprite: this.sprites[powerup.name],
      effect: {
        stat: powerup.name,
        value: powerup.value,
        description: powerup.description,
      },
      target: powerup.target,
      scale: powerup.iconScale,
    });
  };
}
