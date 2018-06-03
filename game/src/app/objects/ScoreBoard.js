/*
 * ScoreBoard
 */


export default class ScoreBoard extends Phaser.Text {
  constructor (game, score) {
    super(game, 300, 20, `Fuel:  ${score}`, {font: '30px', fill: '#fff'});
    this.score = score;
    this.isPaused = false;
  }

  // Score Updater Method
  updateScore(add)  {
    this.score += add;
    this.setText(`Fuel:  ${this.score}`);
  }

  pauseGame() {
    this.isPaused = true;
  }

  resumeGame() {
    this.isPaused = false;
  }

  getScore() {
    return this.score;
  }

}
