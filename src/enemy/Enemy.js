export class Enemy {
  constructor(s, sprites, wave) {
    this.type = "REGULAR";
    this.wave = wave;
    this.x = s.random(s.width * 0.1, s.width * 0.9);
    this.y = s.random(-30, -300);
    this.pointValues = [5, 10, 15, 20];
    this.pointValue =
      wave === 1 ? this.pointValues[3] : s.random(this.pointValues);
    this.maxHealth = Math.ceil(this.pointValue + wave * 2.75);
    this.health = this.maxHealth;
    this.baselineScreenHeight = 1067; // window.innerHeight of 1080p display
    this.speed =
      (this.pointValue * 0.04 * 1 + Math.min(wave, 40) * 0.025) *
      (s.height / this.baselineScreenHeight);
    this.sprite =
      sprites.enemies[
        Math.floor(
          s.map(
            this.pointValue,
            this.pointValues[0],
            this.pointValues[this.pointValues.length - 1],
            0,
            sprites.enemies.length - 1
          )
        )
      ].file;
    this.spriteAspectRatio = this.sprite.width / this.sprite.height;
    this.height = 48;
    this.width = this.height * this.spriteAspectRatio;
    this.healthBarWidth = 60;
  }

  show = (s) => {
    // update speed if window is resized vertically
    this.speed =
      (this.pointValue * 0.075 * 1 + this.wave * 0.0525) *
      (s.height / this.baselineScreenHeight);

    s.image(this.sprite, this.x, this.y, this.width, this.height);
    this.move(Math.floor(s.millis() * 0.001));
    this.drawHealth(s);
  };

  drawHealth = (s) => {
    const currentHealthWidth = s.map(
      this.health,
      0,
      this.maxHealth,
      0,
      this.healthBarWidth
    );
    const halfHealthWidth = this.healthBarWidth * 0.5;
    const red = s.map(this.health, this.maxHealth, 0, 0, 255);
    const green = s.map(this.health, 0, this.maxHealth, 0, 200);

    // health bar
    const yPos = this.y - this.height * 0.5 - 30;
    s.fill(50, 50, 50);
    s.rect(this.x - halfHealthWidth, yPos, this.healthBarWidth, 10);
    s.fill(red, green, 0);
    s.rect(this.x - halfHealthWidth, yPos, currentHealthWidth, 10);
    // health text
    s.fill(s.map(this.health, this.maxHealth * 0.5, this.maxHealth, 255, 0));
    s.textSize(10);
    s.textAlign(s.LEFT);
    s.text(
      `${this.health}/${this.maxHealth}`,
      this.x - halfHealthWidth,
      yPos + 9
    );
  };

  move = (seconds) => {
    this.y += this.speed;
    if (seconds % 2 === 0) {
      this.x += this.speed;
    } else this.x -= this.speed;
  };

  hit = (damage) => {
    this.health -= damage;
  };
}
