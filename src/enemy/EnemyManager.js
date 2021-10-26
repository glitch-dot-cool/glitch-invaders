import { Enemy } from "./Enemy.js";
import { Boss } from "./Boss.js";

export class EnemyManager {
  constructor(s, powerupManager, particleManager, sprites, playerHitSounds) {
    this.p5 = s;
    this.enemies = [];
    this.wave = 0;
    this.sprites = sprites;
    this.particleManager = particleManager;
    this.powerupManager = powerupManager;
    this.playerHitSounds = playerHitSounds;
    this.isPaused = false;
    this.isBossRound = false;
  }

  show = (s) => {
    this.purgeDeadEnemies();
    if (!this.enemies.length) this.spawnEnemies(s);
    this.displayCurrentWave(s);
    this.enemies.forEach((enemy) => enemy.show(s));
  };

  hitEnemy = (s, index, damage, bullet) => {
    const enemy = this.enemies[index];
    if (enemy) {
      enemy.hit(damage);

      if (enemy.health <= 0) {
        if (enemy.type === "BOSS") {
          this.isBossRound = false;
          this.powerupManager.dispatchPowerup(enemy.x, enemy.y);
        }
        this.particleManager.emit(s, {
          x: bullet?.x || enemy.x,
          y: bullet?.y || enemy.y,
          accelleration: enemy.type === "REGULAR" ? 2 : 10,
          numParticles: enemy.type === "REGULAR" ? null : 100, // default for regular enemies
        });
        this.p5
          .random(this.playerHitSounds)
          .play(undefined, this.p5.random(0.1, 0.25));
      } else {
        this.particleManager.emit(s, {
          x: bullet?.x || enemy.x,
          y: bullet?.y || enemy.y,
          numParticles: 10,
          colorRanges: {
            r: { low: 175, high: 255 },
            g: { low: 100, high: 200 },
            b: { low: 25, high: 75 },
          },
        });
        this.p5
          .random(this.playerHitSounds)
          .play(undefined, this.p5.random(2, 4));
      }
    }
  };

  purgeDeadEnemies = () => {
    this.enemies = this.enemies.filter((enemy) => enemy.health > 0);
  };

  spawnEnemies = (s) => {
    this.wave++;
    if (!this.isPaused) {
      if (!this.isBossRound) {
        if (this.wave % 10 === 0) {
          const bossXPos = s.random(s.width * 0.25, s.width * 0.75);
          this.enemies.push(
            new Boss(s, this.sprites, this.wave, bossXPos, -200),
            new Boss(
              s,
              this.sprites,
              this.wave,
              bossXPos - 150,
              -200,
              "LEFT",
              0.5
            ), // left
            new Boss(
              s,
              this.sprites,
              this.wave,
              bossXPos + 150,
              -200,
              "RIGHT",
              0.5
            ), // right
            new Boss(s, this.sprites, this.wave, bossXPos, -350, "BOTTOM", 0.5), // bottom
            new Boss(s, this.sprites, this.wave, bossXPos, -50, "TOP", 0.5) // top
          );
          this.isBossRound = true;
        } else {
          const enemiesThisRound = Math.floor(this.wave * 1.35);
          for (let i = 0; i < enemiesThisRound; i++) {
            this.enemies.push(new Enemy(s, this.sprites, this.wave));
          }
        }

        if (this.wave % this.powerupManager.period === 0) {
          this.powerupManager.dispatchPowerup();
          this.powerupManager.dispatchPowerup();
          this.powerupManager.dispatchPowerup();
        }
      }
    }
  };

  displayCurrentWave = (s) => {
    s.fill(100, 100, 200);
    s.textAlign(s.RIGHT);
    s.textSize(18);
    s.text(`wave #${this.wave}`, s.width - 65, s.height - 60);
  };
}
