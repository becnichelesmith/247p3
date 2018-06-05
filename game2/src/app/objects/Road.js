/*
 * Road background
 * ============================================================================
 *
 */


export default class Road extends Phaser.Image {

  constructor(game, x, y) {
    super(game, x, y, 'road');
    this.anchor.set(0.5);
    this.isPaused = false;
  }

  pauseGame() {
    this.isPaused = true;
  }

  resumeGame() {
    this.isPaused = false;
  }

  update() {
    if (!this.isPaused) {
      this.y += 3;
      if (this.y > 640) {
        this.y = 0;
      }
    }
  }

}
