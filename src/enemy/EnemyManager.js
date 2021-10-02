import { Enemy } from "./Enemy.js";

export class EnemyManager {
  constructor(s, powerupManager, particleManager, enemySprites) {
    this.baseEnemiesPerRound = 5;
    this.enemies = Array(this.baseEnemiesPerRound)
      .fill()
      .map((_) => new Enemy(s, enemySprites));
    this.wave = 0;
    this.waveTimer = 10_000;
    this.minWaveTime = 5_000;
    this.enemySprites = enemySprites;
    this.particleManager = particleManager;
    this.powerupManager = powerupManager;
  }

  show = (s) => {
    this.enemies.forEach((enemy) => enemy.show(s));
  };

  killEnemy = (s, index) => {
    const enemy = this.enemies[index];
    this.particleManager.emit(s, enemy);
    this.enemies.splice(index, 1);
  };

  spawnEnemies = (s) => {
    const enemiesThisRound =
      Math.floor((this.wave + 1) ** 1.55) + this.baseEnemiesPerRound;
    for (let i = 0; i < enemiesThisRound; i++) {
      this.enemies.push(
        new Enemy(s, this.enemySprites, 1 + this.wave * 0.0525)
      );
    }

    if (this.wave % this.powerupManager.period === 0) {
      this.powerupManager.dispatchPowerup();
    }

    // retrigger subsequent waves on a shorter and shorter timescale
    setTimeout(this.spawnEnemies.bind(null, s), this.waveTimer);
    this.waveTimer = Math.max(this.waveTimer * 0.96, this.minWaveTime);
    this.wave++;
  };

  displayCurrentWave = (s) => {
    s.fill(100, 100, 200);
    s.text(`wave #${this.wave}`, s.width - 100, s.height - 60);
  };
}
