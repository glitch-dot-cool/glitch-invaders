export class Player {
  constructor(s, sprite, gun) {
    this.size = 40;
    this.speed = 5;
    this.x = s.width * 0.5;
    this.y = s.height - this.size * 3;
    this.score = 0;
    this.multiplier = 1;
    this.maxBattery = 100;
    this.battery = 100;
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
      this.battery += 0.125;
  };

  showHealth = (s) => {
    s.fill(0, 125, 20);
    const healthBarWidth = s.map(
      this.health,
      0,
      this.maxHealth,
      0,
      s.width * 0.334
    );
    s.rect(s.width * 0.334, s.height - 65, healthBarWidth, 10);
    s.text(
      `moderator sanity: ${this.health}/${this.maxHealth}`,
      s.width * 0.5 - 125,
      s.height - 75
    );
  };

  hit = (enemy, setGameState, gameStates) => {
    this.health -= enemy.pointValue * 2;
    if (this.health <= 0) {
      setGameState(gameStates.DEAD);
    }
  };

  controls = (s) => {
    // sprint
    if (s.keyIsDown(s.SHIFT) && this.battery) {
      this.speed = 15;
      this.isSprinting = true;
    } else {
      this.speed = 5;
      this.isSprinting = false;
    }

    if (s.keyIsDown(s.LEFT_ARROW)) {
      this.move(s, "LEFT");
    } else if (s.keyIsDown(s.RIGHT_ARROW)) {
      this.move(s, "RIGHT");
    }

    if (s.keyIsDown(32) && s.frameCount % this.gun.rateOfFire === 0) {
      this.gun.shoot(this.x, this.y);
    }
  };

  move = (s, direction) => {
    this.batteryCheck();

    if (direction === "LEFT" && this.x > 0) {
      this.x -= this.speed;
    } else if (direction === "RIGHT" && this.x < s.width - this.size) {
      this.x += this.speed;
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
    const greenAmount = s.map(this.battery, 0, 100, 30, 125);
    s.noStroke();
    s.fill(0, greenAmount, 20);
    s.rect(s.width - this.maxBattery - 20, s.height - 50, this.battery, 30);
    s.fill(50, this.battery * 2.55);
    s.text("battery", s.width - this.maxBattery - 10, s.height - 30);
  };

  batteryCheck = () => {
    // cancel sprint when out of battery
    if (this.battery <= 0) {
      this.isSprinting = false;
      this.speed = 5;
    }
  };
}
