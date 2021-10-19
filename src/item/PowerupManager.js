import { Powerup } from "./Powerup.js";
import { initPowerupCounter } from "../utils/initPowerupCounter.js";

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
      },
      {
        name: "BULLET_FAN",
        value: 1,
        target: gun,
        description: "+bullet spread, -damage, -bullet size",
        iconScale: 0.5,
      },
      {
        name: "BATTERY",
        value: null,
        target: player,
        description: "+battery regen, +max battery",
        iconScale: 0.5,
      },
      {
        name: "DAMAGE",
        value: 1.4,
        target: gun,
        description: "+damage",
        iconScale: 1,
      },
      {
        name: "SHIELD",
        value: null,
        target: player,
        description: "+shield",
        iconScale: 0.75,
      },
      {
        name: "BOMB",
        value: null,
        target: player,
        description: "+bomb",
        iconScale: 0.75,
      },
    ];
    this.period = 2; // how many rounds between powerups
    this.activePowerups = [];
    this.collectedPowerups = initPowerupCounter(this.powerups, this.sprites);
    this.currentPowerup = -1;
    this.powerupSequence = [
      "BATTERY",
      "DAMAGE",
      "SHIELD",
      "RATE_OF_FIRE",
      "BATTERY",
      "DAMAGE",
      "BOMB",
      "BULLET_FAN",
      "RATE_OF_FIRE",
      "SHIELD",
    ];
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
      s.textAlign(s.CENTER);
      s.text(powerup.count, 50 + idx * scale, 100);
    });
  };

  createNextPowerup = () => {
    if (this.currentPowerup < this.powerupSequence.length - 1) {
      this.currentPowerup++;
    } else this.currentPowerup = 0;
    const nextPowerup = this.powerupSequence[this.currentPowerup];
    const [powerup] = this.powerups.filter(
      (powerup) => powerup.name === nextPowerup
    );
    return new Powerup({
      x: this.p5.random(this.p5.width * 0.15, this.p5.width * 0.85),
      y: this.p5.random(this.p5.height * 0.35),
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
