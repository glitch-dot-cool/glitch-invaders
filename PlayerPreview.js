export class PlayerPreview {
  constructor(x, y, sprite, size, setSelectedPlayer) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.size = size;
    this.setSelectedPlayer = setSelectedPlayer;
  }

  show = (s) => {
    s.imageMode(s.CENTER);
    s.image(this.sprite, this.x, this.y, this.size, this.size);
  };

  clicked = (s) => {
    const dist = s.dist(s.mouseX, s.mouseY, this.x, this.y);
    if (dist < this.size / 2) {
      console.log(`clicked ${this.sprite}`);
      this.setSelectedPlayer(this.sprite);
    }
  };
}
