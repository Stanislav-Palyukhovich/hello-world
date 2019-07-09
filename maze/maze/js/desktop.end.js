(function() {
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('Game', BasicGame.Game);

  game.state.start('Preloader');

})();