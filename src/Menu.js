Pokeball.MainMenu = function(game) {};
Pokeball.MainMenu.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-mainmenu');
		this.gameTitle = this.add.sprite(Pokeball._WIDTH*0.5, 40, 'title');
		this.gameTitle.anchor.set(0.5,0);
		this.startButton = this.add.button(Pokeball._WIDTH*0.5, 200, 'button-start', this.startGame, this, 2, 0, 1);
		this.startButton.anchor.set(0.5,0);
		this.startButton.input.useHandCursor = true;
	},
	startGame: function() {
		this.game.state.start('Game');
	}
};