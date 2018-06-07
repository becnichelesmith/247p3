/*
 * Boosters
 * ============================================================================
 */



//
//
export default class Boosters extends Phaser.Group {
  constructor(game) {

    super(game, null, 'boosters', false, true, Phaser.Physics.ARCADE);
    this.speed = 5;
    this.spawnPoints = [[70, 0], [180, 0], [310, 0], [390, 0]];
    this.enableBody = true;
    this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.spawner, this).timer.start();

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
      this.game.physics.arcade.collide(this);
      this.children.forEach((booster) => {
        booster.y += this.speed;
      });
    }
  }

  spawner() {
    if (!this.isPaused) {
      let point = this.game.rnd.integerInRange(0, 3);
      let [x, y] = this.spawnPoints[point];
      let boosters = ['network', 'flexible_hours', 'eliminate_bias'];
      var randBooster = boosters[Math.floor(Math.random() * boosters.length)];
      let booster = this.create(x, y, randBooster);
      booster.scored = false;
      booster.scale.x = 0.2;
      booster.scale.y = 0.2;
      booster.anchor.x = 0.5;
      booster.anchor.y = 0.5;
      booster.checkWorldBounds = true;
    }
  }

  carReset(booster) {
    booster.destroy();
  }
}
