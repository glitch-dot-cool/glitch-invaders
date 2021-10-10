import { Enemy } from "./Enemy.js";

export class EnemyManager {
  constructor(
    s,
    powerupManager,
    particleManager,
    enemySprites,
    playerHitSounds
  ) {
    this.p5 = s;
    this.baseEnemiesPerRound = 1;
    this.enemies = Array(this.baseEnemiesPerRound)
      .fill()
      .map((_) => new Enemy(s, enemySprites, 1));
    this.wave = 0;
    this.waveTimer = 10_000;
    this.minWaveTime = 5_000;
    this.enemySprites = enemySprites;
    this.particleManager = particleManager;
    this.powerupManager = powerupManager;
    this.playerHitSounds = playerHitSounds;
  }

  show = (s) => {
    this.displayCurrentWave(s);
    this.purgeDeadEnemies();
    this.enemies.forEach((enemy) => enemy.show(s));
  };

  hitEnemy = (s, index, damage) => {
    const enemy = this.enemies[index];
    if (enemy) {
      enemy.hit(damage);

      if (this.enemies[index].health <= 0) {
        this.particleManager.emit(s, {
          x: enemy.x,
          y: enemy.y,
          accelleration: 2,
        });
        this.p5
          .random(this.playerHitSounds)
          .play(undefined, this.p5.random(0.1, 0.25));
      } else {
        this.particleManager.emit(s, {
          x: enemy.x,
          y: enemy.y,
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
    const enemiesThisRound = Math.floor((this.wave + 1) ** 1.2);
    for (let i = 0; i < enemiesThisRound; i++) {
      this.enemies.push(new Enemy(s, this.enemySprites, this.wave + 1));
    }

    if (this.wave % this.powerupManager.period === 0) {
      this.powerupManager.dispatchPowerup();
      this.powerupManager.dispatchPowerup();
      this.powerupManager.dispatchPowerup();
    }

    // retrigger subsequent waves on a shorter and shorter timescale
    setTimeout(this.spawnEnemies.bind(null, s), this.waveTimer);
    this.waveTimer = Math.max(this.waveTimer * 0.96, this.minWaveTime);
    this.wave++;
  };

  displayCurrentWave = (s) => {
    s.fill(100, 100, 200);
    s.textAlign(s.RIGHT);
    s.text(`wave #${this.wave}`, s.width - 65, s.height - 60);
  };
}
