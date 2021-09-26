export class Enemy {
  constructor(s, enemySprites) {
    this.size = 20;
    this.scale = 4;
    this.x = Math.random() * s.width;
    this.y = 0;
    this.pointValues = [5, 10, 15, 20];
    this.pointValue = s.random(this.pointValues);
    this.speed = this.pointValue * 0.075;
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
  };

  move = (seconds) => {
    this.y += this.speed;
    if (seconds % 2 === 0) {
      this.x += this.speed;
    } else this.x -= this.speed;
  };
}
