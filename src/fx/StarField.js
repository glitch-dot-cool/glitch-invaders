import { Star } from "./Star.js";
import { perfModeSpecs } from "../constants.js";

export class StarField {
  constructor(s) {
    this.renderer = s;
    this.maxStars = perfModeSpecs.medium.stars.density;
    this.stars = Array(this.maxStars)
      .fill()
      .map((_) => new Star(s));
  }

  updateGraphicsOptions = (graphicsOptions) => {
    const numStars = graphicsOptions.density;
    this.maxStars = numStars;
    this.stars = this.stars.slice(0, numStars);
  };

  update = () => {
    // respawn new stars if graphics options increased
    if (this.stars.length < this.maxStars) {
      this.stars.push(new Star(this.renderer));
    }

    this.stars.forEach((star) => {
      star.show(this.renderer);
      star.update();
      this.resetStar(star);
    });
  };

  resetStar = (star) => {
    if (star.y > this.renderer.height) {
      star.y = -10;
      star.x = Math.random() * this.renderer.width;
    }
  };
}
