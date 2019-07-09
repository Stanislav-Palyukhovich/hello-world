BasicGame.Preloader = function(game) {
  this.ready = false;
};

BasicGame.Preloader.prototype = {

  preload: function() {
    this.setGameConfig();
    this.game.load.image('debug', 'images/debug-grid-1920x1920.png');
    this.game.load.image('btn', 'images/btn.png');
    this.game.load.image('wall', 'images/wall.png');
    this.game.load.image('path', 'images/path.png');
    this.game.load.image('pathWin', 'images/pathWin.png');
    this.game.load.image('wallFinish', 'images/wallFinish.png');
    this.game.load.image('wallStart', 'images/wallStart.png');
    this.game.load.image('pathFinish', 'images/pathFinish.png');
    this.game.load.image('pathPreFinish', 'images/pathPreFinish.png');
    this.game.load.image('pathStart', 'images/pathStart.png');
    this.game.load.image('pathPreStart', 'images/pathPreStart.png');
    this.game.load.image('men', 'images/men4.png');

    if (this.game.device.desktop) {
      // console.log('desktop')
    } else {
      // console.log('non desktop')
    }
  },

  create: function() {

  },

  update: function() {
    this.ready = true;
    this.state.start('Game');
  },

  setGameConfig: function() {
    this.scale.setGameSize(BasicGame.width, BasicGame.height)
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; //EXACT_FIT  SHOW_ALL

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignVertically = true;
    this.scale.scaleMode = 2;
    this.scale.pageAlignHorizontally = true;
    this.stage.disableVisibilityChange = true;
  }

};