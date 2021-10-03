export class Player {
  constructor(s, sprite, gun) {
    this.size = 40;
    this.shootingMovementPenalty = 8.5 / 10;
    this.inverseShootingMovementPenalty = 10 / 8.5;
    this.baseSpeed = 5;
    this.speed = this.baseSpeed;
    this.sprintModifier = 3;
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
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.size, this.size);
    this.showHealth(s);

    // recharge battery when not sprinting
    if (!this.isSprinting && this.battery < this.maxBattery)
      this.battery += this.batteryRechargeRate;
  };

  showHealth = (s) => {
    const oneThird = s.width * 0.334;
    const y = s.height - 65;
    s.fill(50, 50, 50);
    s.rect(oneThird, y, oneThird, 10);
    s.fill(0, 125, 20);
    const healthBarWidth = s.map(this.health, 0, this.maxHealth, 0, oneThird);
    s.rect(oneThird, y, healthBarWidth, 10);
    s.text(
      `moderator sanity: ${this.health}/${this.maxHealth}`,
      s.width * 0.5 - 125,
      s.height - 75
    );
  };

  hit = (enemy, gameState, setGameState, gameStates, saveScore) => {
    this.health -= enemy.pointValue * 2;
    if (this.health <= 0 && gameState !== gameStates.DEAD) {
      setGameState(gameStates.DEAD);
      saveScore();
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

    // move
    if (s.keyIsDown(s.LEFT_ARROW)) {
      this.move(s, "LEFT");
    } else if (s.keyIsDown(s.RIGHT_ARROW)) {
      this.move(s, "RIGHT");
    }
  };

  move = (s, direction) => {
    this.batteryCheck();

    if (direction === "LEFT" && this.x > this.size * 0.5) {
      if (this.isSprinting) this.x -= this.speed * this.sprintModifier;
      else this.x -= this.speed;
    } else if (direction === "RIGHT" && this.x < s.width - this.size * 0.5) {
      if (this.isSprinting) this.x += this.speed * this.sprintModifier;
      else this.x += this.speed;
    }

    // consume battery when sprinting
    if (this.isSprinting && this.battery > 0) {
      this.battery -= 1;
    }
  };

  updateScore = (points) => {
    this.multiplier += 0.125;
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
    }
  };
}
