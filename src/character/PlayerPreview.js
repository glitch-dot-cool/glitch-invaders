export class PlayerPreview {
  constructor(x, y, sprite, size, setSelectedPlayer, s) {
    this.x = x;
    this.y = y;
    this.sprite = sprite.file;
    this.name = sprite.name;
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

  showTooltip = (s) => {
    const width = this.name.length * 8;
    const x = this.x - width * 0.5;
    const y = this.y - this.size;

    s.fill(35, 35, 35);
    s.rect(x, y, width, 15);

    s.fill(255);
    s.textSize(12);
    s.textAlign(s.LEFT);
    s.text(this.name, x + width * 0.05, y + 12);
  };

  clicked = (s, isPaused) => {
    if (!isPaused) {
      const dist = s.dist(s.mouseX, s.mouseY, this.x, this.y);
      if (dist < this.size / 2) {
        this.setSelectedPlayer(this.sprite);
        // hide title, controls button, controls modal when game starts
        document.querySelector("#toggle-instructions").style.display = "none";
        document.querySelector(".title").style.display = "none";
        document.querySelector(".instructions-container").style.display =
          "none";
      }
    }
  };
}
