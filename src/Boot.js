var Pokeball = {
	_WIDTH: 320,
	_HEIGHT: 480
};
Pokeball.Boot = function(game) {};
Pokeball.Boot.prototype = {
	create: function() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.state.start('Preload');
	}
};