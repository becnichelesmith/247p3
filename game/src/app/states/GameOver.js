/*
 * GameOver state
 *
 * game over state
 */


export default class GameOver extends Phaser.State {

  create () {
    this.stage.backgroundColor = '#000';
    let style = { font: 'bold 20px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle', wordWrap: true, wordWrapWidth: 400 };
    this.text = this.add.text(this.world.centerX, this.world.centerY, 'You\'re out of fuel! Unfortunately, after running into so many obstacles, ' +
      'you have to exit your career in technology. You\'re among the 52% of women who leave technology as an industry ' +
      'because they’re made to feel unwelcome and undervalued, and see their careers stagnating.', style);
    this.text.anchor.set(0.5,0.5);
    this.continue = this.add.text(this.world.centerX, this.world.centerY + 300, 'Press spacebar to try again!', style);
    this.continue.anchor.set(0.5,0.5);
  }

  update() {
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.state.start('Game');
    }
  }
}
