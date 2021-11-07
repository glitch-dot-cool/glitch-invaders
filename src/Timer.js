export class Timer {
  constructor(gameStates, setGameState, saveScore) {
    this.time = 60 * 5;
    this.timerID = null;
    this.gameStates = gameStates;
    this.setGameState = setGameState;
    this.saveScore = saveScore;
  }

  run = () => {
    this.timerID = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        this.saveScore();
        this.setGameState(this.gameStates.DEAD, "TIME'S UP");
        clearInterval(this.timerID);
      }
    }, 1000);
  };

  pause = () => {
    clearInterval(this.timerID);
  };

  show = (s) => {
    s.textSize(24);
    s.fill(255);
    s.text(`time left: ${this.secondsToMinutes()}`, s.width - 150, 50);
  };

  secondsToMinutes = () => {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.formatSeconds(this.time - minutes * 60);
    return `${minutes}:${seconds}`;
  };

  formatSeconds = (seconds) => {
    const s = seconds.toString();
    return s.length == 2 ? s : `0${s}`;
  };

  consumePowerup = (effect) => {
    this.time += effect.value;
  };
}
