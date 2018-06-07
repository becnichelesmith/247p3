/*
* Game state
* ============================================================================
*
* A sample Game state, displaying the Phaser logo.
*/

import Road from '../objects/Road';
import Player from '../objects/Player';
import Enemies from '../objects/Enemies';
import Boosters from '../objects/Boosters';
import ScoreBoard from '../objects/ScoreBoard';
import HealthBar from '../objects/HealthBar';

export default class Game extends Phaser.State {
  makeOverlay(title, message, color) {
    this.stage.backgroundColor = color;
    let style = { font: 'bold 20px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'top', wordWrap: true, wordWrapWidth: 400 };
    this.text = this.add.text(this.world.centerX, 150, (message.title), style);
    this.text2 = this.add.text(this.world.centerX, 200, (message.body), style);
    this.text.anchor.set(0.5,0.5);
    this.text2.anchor.set(0.5,0.5);
    // this.text2.x = this.text2.x + 50;
    this.text2.y = this.text2.y + 150;
    //
    // var image = this.game.add.image(100, 100, title);
    let style2 = { font: 'bold 20px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'top', wordWrap: true, wordWrapWidth: 400 };

    this.continue = this.add.text(this.world.centerX, this.world.centerY + 300, 'Press spacebar to continue!', style2);
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
    //var HealthBar = require('../objects/HealthBar.js');

    //Load objects
    this.road = this.add.existing(new Road(this.game, x, y));
    this.player = this.add.existing(new Player(this.game, x, 500));
    this.enemies = this.add.existing(new Enemies(this.game));
    this.boosters = this.add.existing(new Boosters(this.game));
    //this.scoreBoard = this.add.existing(new ScoreBoard(this.game, 100));

    this.healthValue = 100;
    var barConfig = {x:200, y: 100, bg: {color: '#AFADAD'}, bar: {color: '#2BC000'}};
    this.myHealthBar = new HealthBar(this.game, barConfig);

    this.game.camera.follow(this.player);

    this.isPaused = false;
    this.seenObstacles = [];
    this.seenBoosters = [];

    this.obstacleMessages = {
      'awareness': {title: 'Awareness', body: 'Roughly ⅓ of men (32%) say discrimination against women is not a problem. However, 90% of women witnessed sexist behavior at company offsites and/or industry conferences. \n \n One day, you are walking to the snack bar in your office, when you overhear a group of your male colleagues talking about how discrimination against women is not a problem.'},
      'harassment': {title: 'Harassment', body: '60% of women in tech reported unwanted sexual advances. \n \n At some point in your career, you have a significant other, yet one of your male counterparts continues to ask you out for dinner - even after you have made it clear you are not interested.'},
      'mentorship-promotions': {title: 'Mentorship & Promotions', body: '1 in 3 women find themselves stalled in tech careers. \n \n A few years into your career, you have been working hard towards a promotion and when the time comes, you see that you have been passed up for the position you wanted by one of your male counterparts that has achieved similar ratings, yet has worked in the role for a shorter amount of time.'},
      'pay': {title: 'Pay', body: 'Just 1 year out of college, women make 77% of what men do in computer and information science. \n \n Early on in your career, you find some friends from your company that you like and you all become roommates. When it comes time fill out the rental agreement, you all must list your salary - you can’t help but notice that a man with your same title listed that his yearly income is more than yours.'},
      'workplace_culture': {title: 'Workplace Culture', body: '66% of women felt excluded from key social/networking opportunities because of gender. \n '},
      'maternity_leave': {title: 'Maternity Leave', body: '75% of women were asked about family life, marital status, and children in interviews. \n \n “At one point in your career, you have a baby boy and your company generously gives you 6 weeks of maternity leave. However, after about 3 weeks, you start receiving notes from your boss about “how much easier things will be on him once you get back”.'}
    };

    this.boosterMessages = {
      'flexible_hours': {title: 'BOOSTER: Flexible Work Hours', body: 'Your boss encourages you to create your own schedule and take time to work from home! \n\n 69% of women who left tech would have stayed at their companies if they’d had flexible work options'},
      'network': {title: 'BOOSTER: Networking Opportunities', body: 'Creating networking opportunities for women and employee resource groups are initiatives that are highly valued by women. When 23% of womenfeel stalled in their careers, forums to facilitate sharing experiences and giving advice encourage women to continue in tech.'},
      'eliminate_bias': {title: 'BOOSTER: Eliminating Bias', body: 'Unconscious biases can affect evaluations and promotions, so when companies eliminate personal identifying information in these evaluations they even the playing field and give women a fair shot at advancement.'}
    };
  }

  pauseGame() {
    this.road.pauseGame();
    this.player.pauseGame();
    this.enemies.pauseGame();
    this.boosters.pauseGame();
    //this.scoreBoard.pauseGame();
    this.isPaused = true;
  }

  resumeGame() {
    this.road.resumeGame();
    this.player.resumeGame();
    this.enemies.resumeGame();
    this.boosters.resumeGame();
    //this.scoreBoard.resumeGame();
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
      });
      this.boosters.forEach((booster) => {
        this.game.physics.arcade.overlap(this.player, booster, this.boosted, null, this);
      });
    }
  }

  accident(player, enemy) {
    //Accident? You are doomed :(
    this.enemies.carReset(enemy);
    if (!this.seenObstacles.includes(enemy.key)) {
      this.pauseGame();
      this.makeOverlay(enemy.key, this.obstacleMessages[enemy.key], '#900C3F');
      this.seenObstacles.push(enemy.key);
    }
    this.healthValue = this.healthValue -10;
    this.myHealthBar.setPercent(this.healthValue);
    // this.scoreBoard.updateScore(-5);
    // if (this.scoreBoard.getScore() <= 0) {
    //   this.state.start('GameOver');
    // }
    if(this.healthValue <= 0) {
      this.state.start('GameOver');
    } 
    else if(this.healthValue <= 30) {
      this.myHealthBar.setBarColor('#C70039');
    }
    else if(this.healthValue <= 70) {
      this.myHealthBar.setBarColor('#FFFF00');
    }
  }

  boosted(player, booster) {
    this.boosters.carReset(booster);
    if (!this.seenBoosters.includes(booster.key)) {
      this.pauseGame();
      this.makeOverlay(booster.key, this.boosterMessages[booster.key], '#197000');
      this.seenBoosters.push(booster.key);
    }
    this.healthValue = this.healthValue + 5;
    this.myHealthBar.setPercent(this.healthValue);
    if(this.healthValue > 70) {
      this.myHealthBar.setBarColor('#2BC000');
    }
    else if(this.healthValue > 30) {
      this.myHealthBar.setBarColor('#FFFF00');
    }

    //this.scoreBoard.updateScore(5);
  }
}
