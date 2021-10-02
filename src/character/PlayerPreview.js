export class PlayerPreview {
  constructor(x, y, sprite, size, setSelectedPlayer, s) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.size = size;
    this.setSelectedPlayer = setSelectedPlayer;
    this.renderer = s;
    this.xRatio = this.x / this.renderer.width;
  }

  show = (s) => {
    s.imageMode(s.CENTER);
    s.image(this.sprite, this.x, this.y, this.size, this.size);
    this.x = this.renderer.width * this.xRatio;
  };

  clicked = (s) => {
    const dist = s.dist(s.mouseX, s.mouseY, this.x, this.y);
    if (dist < this.size / 2) {
      this.setSelectedPlayer(this.sprite);
    }
  };
}
