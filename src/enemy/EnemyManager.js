import { Enemy } from "./Enemy.js";
import { Boss } from "./Boss.js";

export class EnemyManager {
  constructor(s, powerupManager, particleManager, sprites, playerHitSounds) {
    this.p5 = s;
    this.baseEnemiesPerRound = 1;
    this.enemies = Array(this.baseEnemiesPerRound)
      .fill()
      .map((_) => new Enemy(s, sprites, 1));
    this.wave = 0;
    this.waveTimer = 10_000;
    this.minWaveTime = 5_000;
    this.sprites = sprites;
    this.particleManager = particleManager;
    this.powerupManager = powerupManager;
    this.playerHitSounds = playerHitSounds;
    this.isPaused = false;
    this.isBossRound = false;
  }

  show = (s) => {
    this.displayCurrentWave(s);
    this.purgeDeadEnemies();
    this.enemies.forEach((enemy) => enemy.show(s));
  };

  hitEnemy = (s, index, damage, bullet) => {
    const enemy = this.enemies[index];
    if (enemy) {
      enemy.hit(damage);

      if (enemy.health <= 0) {
        if (enemy.type === "BOSS") {
          this.isBossRound = false;
          this.spawnEnemies(s);
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
    if (!this.isPaused) {
      if (!this.isBossRound) {
        const enemiesThisRound = Math.floor((this.wave + 1) * 1.35);

        if ((this.wave + 1) % 10 === 0) {
          const bossXPos = s.random(s.width * 0.1, s.width * 0.9);
          this.enemies.push(
            new Boss(s, this.sprites, this.wave + 1, bossXPos, -200),
            new Boss(s, this.sprites, this.wave + 1, bossXPos - 150, -200, 0.5),
            new Boss(s, this.sprites, this.wave + 1, bossXPos + 150, -200, 0.5),
            new Boss(s, this.sprites, this.wave + 1, bossXPos, -350, 0.5),
            new Boss(s, this.sprites, this.wave + 1, bossXPos, -50, 0.5)
          );
          this.isBossRound = true;
        } else {
          for (let i = 0; i < enemiesThisRound; i++) {
            this.enemies.push(new Enemy(s, this.sprites, this.wave + 1));
          }
        }

        if ((this.wave + 1) % this.powerupManager.period === 0) {
          this.powerupManager.dispatchPowerup();
          this.powerupManager.dispatchPowerup();
          this.powerupManager.dispatchPowerup();
        }
        // retrigger subsequent waves on a shorter and shorter timescale
        setTimeout(this.spawnEnemies.bind(null, s), this.waveTimer);
        this.waveTimer = Math.max(this.waveTimer * 0.96, this.minWaveTime);
        this.wave++;
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
