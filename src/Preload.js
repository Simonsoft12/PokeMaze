Pokeball.Preloader = function(game) {};
Pokeball.Preloader.prototype = {
	preload: function() {
		this.preloadBg = this.add.sprite((Pokeball._WIDTH-297)*0.5, (Pokeball._HEIGHT-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((Pokeball._WIDTH-158)*0.5, (Pokeball._HEIGHT-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('ball', 'img/pokeball.png');
		this.load.image('hole', 'img/hole.png');
		this.load.image('element-w', 'img/wallX.png');
		this.load.image('element-h', 'img/wallY.png');
		this.load.image('panel', 'img/panel.png');
		this.load.image('title', 'img/title.png');
		this.load.image('button-pause', 'img/button-pause.png');
		this.load.image('screen-bg', 'img/screen-bg.png');
		this.load.image('screen-mainmenu', 'img/screen-mainmenu.png');
		this.load.image('border-horizontal', 'img/border-horizontal.png');
		this.load.image('border-vertical', 'img/border-vertical.png');
		this.load.spritesheet('button-start', 'img/button-start.png', 146, 51);
	},
	create: function() {
		this.game.state.start('Menu');
	}
};