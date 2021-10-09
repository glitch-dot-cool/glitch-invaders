export class TextFadeManager {
  constructor() {
    this.textQueue = [];
  }

  show = (s, now) => {
    this.textQueue = this.textQueue.filter((text) => text.expiry > now);
    this.textQueue.forEach((text) => text.show(s));
  };

  add = (textFade) => {
    this.textQueue.push(textFade);
  };
}
