export class Enemy {
  constructor(s, enemySprites, speedModifier = 1, health = 10) {
    this.size = 28;
    this.x = s.random(s.width * 0.1, s.width * 0.9);
    this.y = 0;
    this.pointValues = [5, 10, 15, 20];
    this.pointValue = s.random(this.pointValues);
    this.maxHealth = this.pointValue * 2;
    this.health = this.maxHealth;
    this.speed = this.pointValue * 0.075 * speedModifier;
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
    // s.text(this.pointValue, this.x - 8, this.y - 10);
    s.image(this.sprite, this.x, this.y, this.size, this.size);
    this.move(Math.floor(s.millis() * 0.001));

    const healthbarWidth = s.map(this.health, 0, this.maxHealth, 0, 50);
    const red = s.map(this.health, this.maxHealth, 0, 0, 255);
    const green = s.map(this.health, 0, this.maxHealth, 0, 200);

    s.fill(50, 50, 50);
    s.rect(this.x - 25, this.y - 35, 50, 6);
    s.fill(red, green, 50);
    s.rect(this.x - 25, this.y - 35, healthbarWidth, 6);
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
