import { perfModes } from "../constants.js";

export class TextFadeManager {
  constructor(perfMode) {
    this.textQueue = [];
    this.perfMode = perfMode;
  }

  show = (s, now) => {
    this.textQueue = this.textQueue.filter((text) => text.expiry > now);
    this.textQueue.forEach((text) => text.show(s));
  };

  add = (textFade) => {
    if (this.perfMode !== perfModes.LOW) {
      this.textQueue.push(textFade);
    }
  };
}
