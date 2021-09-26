export class Server {
  constructor() {
    this.maxToxicity = 1_000;
    this.toxicity = 0;
  }

  show = (s) => {
    const oneThird = s.width * 0.334;
    // draw boundary of toxicity range + label
    s.fill(50, 50, 50);
    s.rect(oneThird, s.height - 25, oneThird, 10);
    s.text(
      `server toxicity: ${this.toxicity}/${this.maxToxicity}`,
      s.width * 0.5 - 110,
      s.height - 35
    );

    // draw toxicity
    s.fill(0, 20, 125);
    const toxicityBarWidth = s.map(
      this.toxicity,
      0,
      this.maxToxicity,
      0,
      oneThird
    );
    s.rect(oneThird, s.height - 25, toxicityBarWidth, 10);
  };

  takeDamage = (damage, setGameState, gameStates) => {
    this.toxicity += damage;

    if (this.toxicity >= this.maxToxicity) {
      setGameState(gameStates.DEAD);
    }
  };
}
