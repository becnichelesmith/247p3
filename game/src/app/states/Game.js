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
    let style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.text = this.add.text(this.world.centerX, this.world.centerY, (this.obstacleMessages[title].title), style);
    this.text2 = this.add.text(this.world.centerX, this.world.centerY, (this.obstacleMessages[title].body), style);
    this.text.anchor.set(0.5,0.5);
    this.text2.anchor.set(0.5,0.5);
    // this.text2.x = this.text2.x + 50;
    this.text2.y = this.text2.y + 50;
    //
    // var image = this.game.add.image(100, 100, title);

    this.continue = this.add.text(this.world.centerX, this.world.centerY + 250, "Press spacebar to continue!", style);
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
        'awareness': { title: "Awareness", body: "Roughly 1 in 3 men (32%) say that discrimination against women in tech is *not* a problem" },
        'workplace_culture': { title: "Workplace Culture", body: "66% of women felt excluded from key social/networking opportunities because of gender" },
        'language': { title: "Language", body: "TODO3" },
        'mentorship-promotions': { title: "Mentorship & Promotions", body: "TODO4" },
        'pay': { title: "Pay", body: "Just 1 year out of college, women make 77% of what men do in computer and information science." },
        'harassment': { title: "Sexual Harassment", body: "60% of women in tech reported unwanted sexual advances." },
        'maternity_leave': { title: "Maternity Leave", body: "More than 80% of women say they feel pressure to return early from parental leave and nearly ⅓ worry about losing their jobs" }
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
        if (!enemy.scored) {
          //We passed it or not
          if ((this.player.y - enemy.y) < 10 && (this.player.y - enemy.y) > 0) {
            enemy.scored = true;
            //Increase the score
            this.scoreBoard.updateScore(1);
          }
        }
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
