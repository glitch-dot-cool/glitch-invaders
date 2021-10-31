export class Player {
  constructor(s, sprite, gun, audio) {
    this.p5 = s;
    this.size = 50;
    this.shootingMovementPenalty = 8.5 / 10;
    this.inverseShootingMovementPenalty = 10 / 8.5;
    this.movementWidthRatio = 0.0046875;
    this.baseSpeed = this.movementWidthRatio * s.width;
    this.speed = this.baseSpeed;
    this.sprintModifier = 2.5;
    this.x = s.width * 0.5;
    this.y = s.height - this.size * 3;
    this.score = 0;
    this.multiplier = 1;
    this.maxBattery = 100;
    this.battery = 100;
    this.batteryLock = false;
    this.batteryRechargeRate = 0.125;
    this.isSprinting = false;
    this.sprite = sprite;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.gun = gun;
    this.hitSound = audio.playerHit;
    this.deathSounds = audio.playerDeaths;
    this.bombSound = audio.bomb;
    this.shieldSound = audio.shield;
    this.shield = {
      maxCapacity: 0,
      capacity: 0,
      isActive: false,
    };
    this.bombs = 0;
  }

  show = (s) => {
    // update baseSpeed if window is resized
    this.baseSpeed = this.movementWidthRatio * s.width;
    s.image(this.sprite, this.x, this.y, this.size, this.size);
    this.showHealth(s);
    this.showBattery(s);

    // recharge battery when not sprinting
    if (!this.isSprinting && this.battery < this.maxBattery) {
      this.battery += this.batteryRechargeRate;
    }

    // render shield if active
    if (this.shield.isActive) {
      s.fill(70, 23, 209, 100);
      s.circle(this.x, this.y, this.size * 1.5);
      s.textSize(18);
      s.textAlign(s.CENTER);
      s.fill(255);
      s.text(this.shield.capacity, this.x, this.y + 5);
    }
  };

  showHealth = (s) => {
    const oneThird = s.width * 0.334;
    const y = s.height - 65;
    s.fill(50, 50, 50);
    s.rect(oneThird, y, oneThird, 10);
    s.fill(0, 125, 20);
    const healthBarWidth = s.map(this.health, 0, this.maxHealth, 0, oneThird);
    s.rect(oneThird, y, healthBarWidth, 10);
    s.textSize(16);
    s.textAlign(s.CENTER);
    s.text(
      `moderator sanity: ${this.health}/${this.maxHealth}`,
      s.width * 0.5,
      s.height - 75
    );

    if (this.shield.capacity && !this.shield.isActive) {
      s.fill(70, 23, 209);
      s.textSize(14);
      s.textAlign(s.CENTER);
      s.text("shield available!", s.width * 0.5, y - 30);
    }
  };

  hit = (enemy, gameState, setGameState, gameStates, saveScore) => {
    this.health -= enemy.pointValue * 2;
    if (this.health <= 0 && gameState !== gameStates.DEAD) {
      setGameState(gameStates.DEAD, "YOU ARE DEAD");
      saveScore();
      this.p5.random(this.deathSounds).play();
    } else {
      this.hitSound.play();
    }
  };

  controls = (s) => {
    // shoot
    if (s.keyIsDown(32)) {
      if (s.frameCount % this.gun.rateOfFire === 0) {
        this.gun.shoot(this.x, this.y);
      }
      this.speed = this.baseSpeed * this.shootingMovementPenalty;
    } else {
      this.speed = Math.floor(
        this.baseSpeed * this.inverseShootingMovementPenalty
      );
    }

    // sprint
    if (s.keyIsDown(s.SHIFT) && this.battery && !this.batteryLock) {
      this.isSprinting = true;
    } else {
      this.isSprinting = false;
    }

    // shield
    if (s.keyIsDown(90) || s.keyIsDown(83)) {
      if (this.shield.capacity > 0) {
        this.useShield();
      }
    }

    this.movementContols(s);
  };

  movementContols = (s) => {
    if (s.keyIsDown(s.LEFT_ARROW)) {
      this.move(s, "LEFT");
    }
    if (s.keyIsDown(s.RIGHT_ARROW)) {
      this.move(s, "RIGHT");
    }
    if (s.keyIsDown(s.UP_ARROW)) {
      this.move(s, "UP");
    }
    if (s.keyIsDown(s.DOWN_ARROW)) {
      this.move(s, "DOWN");
    }
  };

  move = (s, direction) => {
    this.batteryCheck();

    switch (direction) {
      case "LEFT":
        if (this.x > this.size * 0.5) {
          if (this.isSprinting) this.x -= this.speed * this.sprintModifier;
          else this.x -= this.speed;
        }
        break;
      case "RIGHT":
        if (this.x < s.width - this.size * 0.5) {
          if (this.isSprinting) this.x += this.speed * this.sprintModifier;
          else this.x += this.speed;
        }
        break;
      case "UP":
        if (this.y > s.height - s.height * 0.334) {
          this.y -= this.speed;
        }
        break;
      case "DOWN":
        if (this.y < s.height - 120) {
          this.y += this.speed;
        }
        break;
    }

    // consume battery when sprinting
    if (this.isSprinting && this.battery > 0) {
      this.battery -= 0.75;
    }
  };

  updateScore = (points) => {
    this.multiplier += points * 0.05;
    this.score += Math.floor(points * this.multiplier);
  };

  applyPenalty = (points) => {
    this.score -= Math.floor(points * Math.max(this.multiplier, 2));
    this.multiplier = 1;
  };

  showBattery = (s) => {
    const greenAmount = s.map(this.battery, 0, this.maxBattery, 30, 125);
    const maxWidth = 120;
    const barWidth = s.map(this.battery, 0, this.maxBattery, 0, maxWidth);
    s.noStroke();
    s.fill(0, greenAmount, 20);
    s.rect(s.width - maxWidth - 20, s.height - 50, barWidth, 30);
    s.fill(50, this.battery * 2.55);
    s.textAlign(s.LEFT);
    s.text("battery", s.width - maxWidth - 10, s.height - 30);
  };

  batteryCheck = () => {
    // cancel sprint when out of battery
    if (this.battery <= 0) {
      this.isSprinting = false;
      this.batteryLock = true;
    }

    // unlock sprinting when battery recharges to > 20% it's max capacity
    if (this.battery > this.maxBattery * 0.2) {
      this.batteryLock = false;
    }
  };

  consumePowerup = (effect) => {
    if (effect.stat === "BATTERY") {
      this.batteryRechargeRate *= 1.25;
      this.maxBattery += 25;
      this.battery = this.maxBattery;
    } else if (effect.stat === "SHIELD") {
      this.shield.maxCapacity++;
      this.shield.capacity = this.shield.maxCapacity;
    } else if (effect.stat === "BOMB") {
      this.bombs++;
    }
  };

  takeShieldDamage = (damage) => {
    this.shield.capacity -= damage;
    if (this.shield.capacity < 1) this.shield.isActive = false;
  };

  useShield = () => {
    this.shieldSound.play();
    this.shield.isActive = true;
  };

  deployBomb = (s, powerupManager, enemyManager) => {
    if (this.bombs > 0) {
      this.bombs--;
      this.bombSound.play();
      setTimeout(() => {
        this.multiplier = 1;
        powerupManager.collectedPowerups.BOMB.count = this.bombs;
        enemyManager.enemies.forEach((_, idx) => {
          enemyManager.hitEnemy(s, idx, Infinity);
        });
      }, 500);
    }
  };
}
