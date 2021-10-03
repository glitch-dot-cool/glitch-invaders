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
    this.playerHitSounds = playerHitSounds;
  }

  show = (s) => {
    this.enemies.forEach((enemy) => enemy.show(s));
  };

  killEnemy = (s, index) => {
    const enemy = this.enemies[index];
    if (enemy) {
      this.particleManager.emit(s, { x: enemy.x, y: enemy.y });
      this.enemies.splice(index, 1);
      this.p5
        .random(this.playerHitSounds)
        .play(undefined, this.p5.random(0.5, 1.5));
    }
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
