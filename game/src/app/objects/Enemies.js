/*
 * Enemies
 * ============================================================================
 */



//
//
export default class Enemies extends Phaser.Group {
  constructor(game) {

    super(game, null, 'enemies', false, true, Phaser.Physics.ARCADE);
    this.speed = 2;
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
      this.children.forEach((enemy) => {
        enemy.y += this.speed;
      });
    }
  }

  spawner() {
    if (!this.isPaused) {
      let point = this.game.rnd.integerInRange(0, 3)
      let [x, y] = this.spawnPoints[point];
      let obstacles = ['awareness', 'workplace_culture', 'language', 
      'mentorship-promotions', 'pay', 'harassment', 'maternity_leave'];
      var randObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      let enemycar = this.create(x, y, randObstacle);
      enemycar.scored = false;
      enemycar.scale.x = 0.2;
      enemycar.scale.y = 0.2;
      enemycar.anchor.x = 0.5;
      enemycar.anchor.y = 0.5;
      enemycar.checkWorldBounds = true
    }
  }

  carReset(enemy) {
    enemy.destroy();
  }
}
