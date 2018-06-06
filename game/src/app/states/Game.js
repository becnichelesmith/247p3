/*
* Game state
* ============================================================================
*
* A sample Game state, displaying the Phaser logo.
*/

import Road from '../objects/Road';
import Player from '../objects/Player';
import Enemies from '../objects/Enemies';
import ScoreBoard from '../objects/ScoreBoard';

export default class Game extends Phaser.State {

  makeOverlay(title) {
    this.stage.backgroundColor = '#000';
    let style = { font: 'bold 20px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle', wordWrap: true, wordWrapWidth: 400 };
    this.text = this.add.text(this.world.centerX, this.world.centerY, (this.obstacleMessages[title].title), style);
    this.text2 = this.add.text(this.world.centerX, this.world.centerY, (this.obstacleMessages[title].body), style);
    this.text.anchor.set(0.5,0.5);
    this.text2.anchor.set(0.5,0.5);
    // this.text2.x = this.text2.x + 50;
    this.text2.y = this.text2.y + 150;
    //
    // var image = this.game.add.image(100, 100, title);

    this.continue = this.add.text(this.world.centerX, this.world.centerY + 300, 'Press spacebar to continue!', style);
    this.continue.anchor.set(0.5,0.5);
  }

  destroyOverlay() {
    this.stage.destroy();
    this.text.destroy();
    this.text2.destroy();
    this.continue.destroy();
  }

  create() {
    const { centerX: x, centerY: y } = this.world;

    this.game.world.setBounds(0, 0, 480, 640);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Load objects
    this.road = this.add.existing(new Road(this.game, x, y));
    this.player = this.add.existing(new Player(this.game, x, 500));
    this.enemies = this.add.existing(new Enemies(this.game));
    this.scoreBoard = this.add.existing(new ScoreBoard(this.game, 100));
    this.game.camera.follow(this.player);

    this.isPaused = false;
    this.seenObstacles = [];

    // this.game.load.image('awareness', 'assets/awareness.png');
    // this.game.load.image('hiring', 'assets/hiring.png');
    // this.game.load.image('language', 'assets/language.png');
    // this.game.load.image('mentorship-promotions', 'assets/mentorship-promotions.png');
    // this.game.load.image('pay', 'assets/pay.png');
    // this.game.load.image('pipeline', 'assets/pipeline.png');
    // this.game.load.image('work-life-balance', 'assets/work-life-balance.png');

    this.obstacleMessages = {
      'awareness': {title: 'Awareness', body: 'One day, you are walking to the snack bar in your office, when you overhear a group of your male colleagues talking about how discrimination against women is not a problem.'},
      'harassment': {title: 'Hiring', body: 'TODO'},
      'language': {title: 'Language', body: 'At some point in your career, you have a significant other, yet one of your male counterparts continues to ask you out for dinner - even after you have made it clear you are not interested.'},
      'mentorship-promotions': {title: 'Mentorship & Promotions', body: 'A few years into your career, you have been working hard towards a promotion and when the time comes, you see that you have been passed up for the position you wanted by one of your male counterparts that has achieved similar ratings, yet has worked in the role for a shorter amount of time.'},
      'pay': {title: 'Pay', body: 'Early on in your career, you find some friends from your company that you like and you all become roommates. When it comes time fill out the rental agreement, you all must list your salary - you can’t help but notice that a man with your same title listed that his yearly income is more than yours.'},
      'workplace_culture': {title: 'Workplace Culture', body: 'TODO'},
      'maternity_leave': {title: 'Maternity Leave', body: '75% of women were asked about family life, marital status, and children in interviews.'}
    };
  }

  pauseGame() {
    this.road.pauseGame();
    this.player.pauseGame();
    this.enemies.pauseGame();
    this.scoreBoard.pauseGame();
    this.isPaused = true;
  }

  resumeGame() {
    this.road.resumeGame();
    this.player.resumeGame();
    this.enemies.resumeGame();
    this.scoreBoard.resumeGame();
    this.isPaused = false;
  }

  update() {
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.destroyOverlay();
      this.resumeGame();
    }

    if (!this.isPaused) {
      this.enemies.forEach((enemy) => {
        this.game.physics.arcade.overlap(this.player, enemy, this.accident, null, this);

        //Checking if this car was already scored
        // if (!enemy.scored) {
        //   //We passed it or not
        //   if ((this.player.y - enemy.y) < 10 && (this.player.y - enemy.y) > 0) {
        //     enemy.scored = true;
        //     //Increase the score
        //     this.scoreBoard.updateScore(5);
        //   }
        // }
      });
    }
  }

  accident(player, enemy) {
    //Accident? You are doomed :(
    this.enemies.carReset(enemy);
    if (!this.seenObstacles.includes(enemy.key)) {
      this.pauseGame();
      this.makeOverlay(enemy.key);
      this.seenObstacles.push(enemy.key);
    }
    this.scoreBoard.updateScore(-5);
    if (this.scoreBoard.getScore() <= 0) {
      this.state.start('GameOver');
    }
    // this.state.start('GameOver');
  }
}
