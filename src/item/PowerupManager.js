import { Powerup } from "./Powerup.js";
import { buildPowerupCounter } from "../utils/buildPowerupCounter.js";

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
        iconScale: 0.5,
        probability: 0.25,
      },
      {
        name: "BULLET_FAN",
        value: 1,
        target: gun,
        description: "+bullet spread, -damage, -bullet size",
        iconScale: 0.5,
        probability: 0.125,
      },
      {
        name: "BATTERY",
        value: null,
        target: player,
        description: "+battery regen, +max battery",
        iconScale: 0.5,
        probability: 0.65,
      },
      {
        name: "DAMAGE",
        value: 1.35,
        target: gun,
        description: "+damage",
        iconScale: 1,
        probability: 0.5,
      },
    ];
    this.period = 2; // how many rounds between powerups
    this.activePowerups = [];
    this.collectedPowerups = buildPowerupCounter(this.powerups, this.sprites);
  }

  show = (s) => {
    this.activePowerups.forEach((powerup) => {
      powerup.update(s);
      powerup.show(s);
    });
    this.displayCollectedPowerups(s);
  };

  dispatchPowerup = () => {
    const nextPowerup = this.createNextPowerup();
    this.activePowerups.push(nextPowerup);
  };

  purge = (idx) => {
    this.activePowerups.splice(idx, 1);
  };

  addToCollectedPowerups = (powerup) => {
    this.collectedPowerups[powerup.effect.stat].count++;
  };

  displayCollectedPowerups = (s) => {
    Object.keys(this.collectedPowerups).forEach((key, idx) => {
      const powerup = this.collectedPowerups[key];
      const scale = 75;
      // display the image
      s.image(
        powerup.sprite,
        50 + idx * scale,
        50,
        powerup.sprite.width * (powerup.iconScale * 0.6),
        powerup.sprite.height * (powerup.iconScale * 0.6)
      );
      // display the count
      s.textSize(18);
      s.fill(255);
      const xOffset = String(powerup.count).length * 5;
      s.text(powerup.count, 50 + idx * scale - xOffset, 100);
    });
  };

  createNextPowerup = () => {
    const filteredPowerups = this.powerups.filter(
      (powerup) => powerup.probability > Math.random()
    );
    const pullRandomPowerupFrom = filteredPowerups.length
      ? filteredPowerups
      : this.powerups;
    const powerup = this.p5.random(pullRandomPowerupFrom);
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
