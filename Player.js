export class Player {
  constructor(s, sprite) {
    this.size = 32;
    this.speed = 5;
    this.x = s.width * 0.5;
    this.y = s.height - this.size * 2;
    this.score = 0;
    this.multiplier = 1;
    this.maxGas = 100;
    this.gas = 100;
    this.isSprinting = false;
    this.sprite = sprite;
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.size, this.size);

    // refill gas when not sprinting
    if (!this.isSprinting && this.gas < this.maxGas) this.gas += 0.125;
  };

  controls = (s) => {
    // sprint
    if (s.keyIsDown(s.SHIFT) && this.gas) {
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
    this.gasCheck();

    if (direction === "LEFT" && this.x > 0) {
      this.x -= this.speed;
    } else if (direction === "RIGHT" && this.x < s.width - this.size) {
      this.x += this.speed;
    }

    // consume gas when sprinting
    if (this.isSprinting && this.gas > 0) {
      this.gas -= 1;
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

  showGas = (s) => {
    const greenAmount = s.map(this.gas, 0, 100, 30, 255);
    s.noStroke();
    s.fill(30, greenAmount, 30);
    s.rect(s.width - this.maxGas - 20, s.height - 50, this.gas, 30);
    s.fill(50, this.gas * 2.55);
    s.text("gas", s.width - this.maxGas - 10, s.height - 30);
  };

  gasCheck = () => {
    // cancel sprint when out of gas
    if (this.gas <= 0) {
      this.isSprinting = false;
      this.speed = 5;
    }
  };
}
