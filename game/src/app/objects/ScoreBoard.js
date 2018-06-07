/*
 * ScoreBoard
 */


export default class ScoreBoard extends Phaser.Text {
  constructor (game, score) {
    super(game, 300, 20, `fuel:  ${score}`, {font: '20px', fill: '#fff'});
    this.score = score;
    this.isPaused = false;
    this.careerAge = 0;
    this.total = 0;
    //  Create our Timer
    this.timer = game.time.create(false);

    //  Set a TimerEvent to occur after 2 seconds
    this.timer.loop(2000, () => {
      this.total++;
      if (this.total % 8 == 0) {
        this.updateAge();
      }
    }, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    this.timer.start();
  }

  updateAge() {
    this.careerAge += 1;
    this.setText(`${this.careerAge} month(s) in tech!`);
  }

  // Score Updater Method
  updateScore(add)  {
    this.score += add;
    this.setText(`fuel:  ${this.score}`);
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
