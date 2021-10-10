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
    s.textAlign(s.CENTER);
    s.text(
      `server toxicity: ${this.toxicity}/${this.maxToxicity}`,
      s.width * 0.5,
      s.height - 35
    );

    // draw toxicity
    const toxicityColor = s.color(
      s.map(this.toxicity, 0, this.maxToxicity, 0, 200),
      20,
      s.map(this.toxicity, 0, this.maxToxicity, 125, 0)
    );
    s.fill(toxicityColor);
    const toxicityBarWidth = s.map(
      this.toxicity,
      0,
      this.maxToxicity,
      0,
      oneThird
    );
    s.rect(oneThird, s.height - 25, toxicityBarWidth, 10);
  };

  takeDamage = (damage, gameState, setGameState, gameStates, saveScore) => {
    this.toxicity += damage;

    if (this.toxicity >= this.maxToxicity && gameState !== gameStates.DEAD) {
      setGameState(gameStates.DEAD);
      saveScore();
    }
  };
}
