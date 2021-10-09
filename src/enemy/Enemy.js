export class Enemy {
  constructor(s, enemySprites, wave) {
    this.size = 32;
    this.x = s.random(s.width * 0.1, s.width * 0.9);
    this.y = 0;
    this.pointValues = [5, 10, 15, 20];
    this.pointValue = s.random(this.pointValues);
    this.maxHealth = Math.ceil(this.pointValue + wave * 1.85);
    this.health = this.maxHealth;
    this.speed = this.pointValue * 0.075 * 1 + wave * 0.0525;
    this.sprite =
      enemySprites[
        Math.floor(
          s.map(
            this.pointValue,
            this.pointValues[0],
            this.pointValues[this.pointValues.length - 1],
            0,
            enemySprites.length - 1
          )
        )
      ];
  }

  show = (s) => {
    s.image(this.sprite, this.x, this.y, this.size, this.size);
    this.move(Math.floor(s.millis() * 0.001));
    this.drawHealth(s);
  };

  drawHealth = (s) => {
    const healthbarWidth = s.map(this.health, 0, this.maxHealth, 0, 50);
    const red = s.map(this.health, this.maxHealth, 0, 0, 255);
    const green = s.map(this.health, 0, this.maxHealth, 0, 200);

    // health bar
    s.fill(50, 50, 50);
    s.rect(this.x - 25, this.y - 35, 50, 10);
    s.fill(red, green, 0);
    s.rect(this.x - 25, this.y - 35, healthbarWidth, 10);
    // health text
    s.fill(s.map(this.health, this.maxHealth * 0.5, this.maxHealth, 255, 0));
    s.textSize(10);
    s.text(`${this.health}/${this.maxHealth}`, this.x - 25, this.y - 26);
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
