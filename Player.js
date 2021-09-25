export class Player {
  constructor(s, sprite) {
    this.size = 32;
    this.speed = 5;
    this.x = s.width * 0.5;
    this.y = s.height - this.size * 2;
    this.score = 0;
    this.multiplier = 1;
    this.maxBattery = 100;
    this.battery = 100;
    this.isSprinting = false;
    this.sprite = sprite;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.size, this.size);

    // recharge battery when not sprinting
    if (!this.isSprinting && this.battery < this.maxBattery)
      this.battery += 0.125;
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
    const greenAmount = s.map(this.battery, 0, 100, 30, 255);
    s.noStroke();
    s.fill(30, greenAmount, 30);
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
