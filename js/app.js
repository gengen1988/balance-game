var game = new Phaser.Game(320, 480, Phaser.AUTO, 'phaser-example');
game.state.add('Game', PhaserGame);
game.state.add('GameOver', GameOver);
game.state.add('GameMenu', GameMenu);
game.state.add('Splash', GameMenu, true);

function PhaserGame() {
}

var queue = [];
var queueLimit = 3;

var acc = 0;
var cursors;
var marker;

var input = 0;

var counter = 0;
var text;
var force = 300;
var refresh = 0.05;
var tick = 0;
var acc = 0;
var mouseSpeed = 0;

var da = 1000;

PhaserGame.prototype.create = function() {
  counter = 0;
  cursors = game.input.keyboard.createCursorKeys();
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
  player.checkWorldBounds = true;
  player.events.onOutOfBounds.add(onOutOfBounds);

  text = game.add.text(0, 0, 'score: 0', {
    font: '20px Arial',
    fill: '#ffffff'
  });

  game.input.addMoveCallback(onMove);

  game.physics.enable(player, Phaser.Physics.ARCADE);
  game.time.events.loop(500, updateCounter, this);
};

function onMove(pointer, x, y, click) {
  queuepush({
    x: x,
    y: y,
    t: Date.now()
  });
  mouseSpeed = getMouseSpeed();
  // console.log(getMouseSpeed());
}

function onOutOfBounds() {
  game.state.start('GameOver');
}

function updateCounter() {
  counter++;
  text.setText('score: ' + counter);
}

PhaserGame.prototype.update = function() {
  tick++;
  var accModifier = Math.cos(tick * refresh) * force;

  if (cursors.left.isDown) {
    accModifier -= da;
  }

  if (cursors.right.isDown) {
    accModifier += da;
  }

  // console.log(game.world.centerX);

  player.body.acceleration.x = mouseSpeed * da;
};

function GameOver() {
}

GameOver.prototype.create = function() {
  game.add.text(80, 64, 'Game Over', {
    font: '32px Arial',
    fill: '#ffffff'
  });

  game.add.text(120, 120, 'scope: ' + counter, {
    font: '20px Arial',
    fill: '#ffffff'
  });

  game.add.button(
    game.world.centerX - 95,
    200,
    'button',
    actionOnClick,
    this, 2, 1, 0
  );

  console.log('game over');
};

function actionOnClick() {
  console.log('action');
  game.state.start('Game');
}

function GameMenu() {
}

GameMenu.prototype.create = function() {
  game.add.button(
    game.world.centerX - 95,
    200,
    'button',
    actionOnClick,
    this, 2, 1, 0
  );
};

function Splash() {
}

Splash.prototype.create = function() {
  game.state.start('GameMenu');
};

function queuepush(item) {
  if (queue.length > queueLimit) {
    queue.shift();
  }
  queue.push(item);
}

function getMouseSpeed() {
  var prev;

  var alld = queue.reduce(function(memo, pos) {
    if (!prev) {
      prev = pos;
      return memo;
    }

    // var d = Math.sqrt(
    //   Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2)
    // );

    var d = pos.x - prev.x;

    return memo + d;
  }, 0);

  var allt = Math.abs(queue[0].t - queue[queue.length - 1].t);

  var v = alld / allt;
  return v;

}
