import { Star } from "./Star.js";

export class StarField {
  constructor(s) {
    this.renderer = s;
    this.maxStars = 500;
    this.updateRate = 1;
    this.stars = Array(this.maxStars)
      .fill()
      .map((_) => new Star(s));
  }

  updateGraphicsOptions = (graphicsOptions) => {
    const numStars = Math.floor(this.maxStars * graphicsOptions.density);
    this.updateRate = graphicsOptions.updateRate;
    this.stars = this.stars.slice(0, numStars);
  };

  update = () => {
    if (this.renderer.frameCount % this.updateRate === 0) {
      this.stars.forEach((star) => {
        star.show(this.renderer);
        star.update();
        this.resetStar(star);
      });
    }
  };

  resetStar = (star) => {
    if (star.y > this.renderer.height) {
      star.y = -10;
      star.x = Math.random() * this.renderer.width;
    }
  };
}
