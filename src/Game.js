Pokeball.Game = function(game) {};
Pokeball.Game.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(0, 0, 'panel');
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.fontSmall = { font: "12px Arial", fill: "#fff" };
		this.fontBig = { font: "20px Arial", fill: "#fff" };
		this.fontMessage = { font: "24px Arial", fill: "#fff",  align: "center", stroke: "black", strokeThickness: 4 };
		this.timer = 0;
		this.points = 0;
		this.totalTimer = 0;
		this.level = 1;
		this.maxLevels = 8;
		this.movementForce = 10;
		this.ballStartPos = { x: Pokeball._WIDTH*0.5, y: 450 };
		this.counter = 0;

		this.pauseButton = this.add.button(Pokeball._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.timerText = this.game.add.text(6, 10, "Time: "+this.timer, this.fontBig);
		this.levelText = this.game.add.text(195, 7, "Level: "+this.level+" / "+this.maxLevels, this.fontSmall);
		this.totalTimeText = this.game.add.text(195, 27, "Total time: "+this.totalTimer, this.fontSmall);
		this.pointsText = this.game.add.text(98, 10, "Points: "+this.points, this.fontBig);

		this.bomb1 = this.add.sprite(Pokeball._WIDTH*0.5, 190, 'bomb');
		this.physics.enable(this.bomb1, Phaser.Physics.ARCADE);
		this.bomb1.anchor.set(0.5);
		this.bomb1.body.setSize(2, 2);


		this.hole = this.add.sprite(Pokeball._WIDTH*0.5, 90, 'hole');
		this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.hole.anchor.set(0.5);
		this.hole.body.setSize(2, 2);

		this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.ball.anchor.set(0.5);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		this.ball.body.setSize(18, 18);
		this.ball.body.bounce.set(0.3, 0.3);

		this.initLevels(this.bomb1);
		this.showLevel(1);
		this.keys = this.game.input.keyboard.createCursorKeys();

		Pokeball._player = this.ball;
		window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Pokeball._HEIGHT-2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Pokeball._WIDTH-2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
	},
	initLevels: function(bomb1) {
		this.levels = [];
		this.levelData = [
			[
				{ x: 96, y: 324, t: 'w' },
				{ x: 96, y: 224, t: 'w' }
			],
			[
				{ x: 72, y: 320, t: 'w' },
				{ x: 200, y: 320, t: 'h' },
				{ x: 72, y: 150, t: 'w' }
			],
			[
				{ x: 25, y: 224, t: 'w' },
				{ x: 150, y: 224, t: 'w' },
				{ x: 100, y: 320, t: 'h' },
				{ x: 200, y: 320, t: 'h' },
			],
			[
				{ x: 64, y: 352, t: 'h' },
				{ x: 224, y: 352, t: 'h' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 200, y: 52, t: 'h' },
				{ x: 85, y: 52, t: 'h' }
			],
			[
				{ x: 78, y: 352, t: 'h' },
				{ x: 78, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 192, y: 240, t: 'w' },
				{ x: 30, y: 150, t: 'w' },
				{ x: 158, y: 150, t: 'w' }
			],
			[
				{ x: 188, y: 352, t: 'h' },
				{ x: 92, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 256, y: 240, t: 'h' },
				{ x: 180, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			],
			[
				{ x: 25, y: 50, t: 'h' },
				{ x: 25, y: 150, t: 'w' },
				{ x: 175, y: 150, t: 'w' },
				{ x: 25, y: 246, t: 'w' },
				{ x: 170, y: 246, t: 'w' },
				{ x: 90, y: 246, t: 'w' },
				{ x: 120, y: 320, t: 'w' },
				{ x: 200, y: 320, t: 'w' },
				{ x: 25, y: 275, t: 'h' },
				{ x: 271, y: 150, t: 'h' },
				{ x: 25, y: 390, t: 'w' },
				{ x: 145, y: 390, t: 'w' },
			],
			[
				{ x: 25, y: 70, t: 'h' },
				{ x: 25, y: 175, t: 'h' },
				{ x: 25, y: 300, t: 'h' },
				{ x: 80, y: 50, t: 'h' },
				{ x: 80, y: 150, t: 'h' },
				{ x: 80, y: 300, t: 'h' },
				{ x: 140, y: 175, t: 'h' },
				{ x: 140, y: 245, t: 'h' },
				{ x: 200, y: 80, t: 'h' },
				{ x: 200, y: 150, t: 'h' },
				{ x: 200, y: 300, t: 'h' },
				{ x: 260, y: 50, t: 'h' },
				{ x: 260, y: 200, t: 'h' },
				{ x: 260, y: 300, t: 'h' },
				{ x: 95, y: 175, t: 'w' },
				{ x: 104, y: 396, t: 'w' },
				{ x: 200, y: 320, t: 'w' },
				{ x: 25, y: 396, t: 'w' },
			]
		];
		for(var i=0; i<this.maxLevels; i++) {
			var newLevel = this.add.group();
			newLevel.enableBody = true;
			newLevel.physicsBodyType = Phaser.Physics.ARCADE;
			for(var e=0; e<this.levelData[i].length; e++) {
				var item = this.levelData[i][e];
				newLevel.create(item.x, item.y, 'element-'+item.t);
			}
			newLevel.setAll('body.immovable', true);
			newLevel.visible = false;
			this.levels.push(newLevel);
		}
	},
	showLevel: function(level) {
		var lvl = level | this.level;
		if(this.levels[lvl-2]) {
			this.levels[lvl-2].visible = false;
		}
		this.levels[lvl-1].visible = true;
	},
	updateCounter: function() {
		this.timer++;
		this.timerText.setText("Time: "+this.timer);
		this.totalTimeText.setText("Total time: "+(this.totalTimer+this.timer));
	},
	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(Pokeball._WIDTH*0.5, 250, "Game paused,\ntap to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},
	update: function() {
		if(this.keys.left.isDown) {
			this.ball.body.velocity.x -= this.movementForce;
		}
		else if(this.keys.right.isDown) {
			this.ball.body.velocity.x += this.movementForce;
		}
		if(this.keys.up.isDown) {
			this.ball.body.velocity.y -= this.movementForce;
		}
		else if(this.keys.down.isDown) {
			this.ball.body.velocity.y += this.movementForce;
		}
		this.physics.arcade.collide(this.ball, this.bomb1, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		this.physics.arcade.collide(this.ball, this.levels[this.level-1], this.wallCollision, null, this);
		this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
		
	},
	bombCollision: function() {
		alert('You are dead.');
			this.game.state.start('Menu');
	},
	wallCollision: function() {
		// Wibracje
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}
	},
	handleOrientation: function(e) {
		// Device Orientation
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		Pokeball._player.body.velocity.x += x;
		Pokeball._player.body.velocity.y += y*0.5;
	},
	finishLevel: function() {
		if(this.level >= this.maxLevels) {
			this.totalTimer += this.timer;
			alert('Congratulations, game completed!\nTotal time of play: '+this.totalTimer+' seconds!');
			this.game.state.start('Menu');
		}
		else {
			this.totalTimer += this.timer;
			this.timer = 0;
			this.level++;
			this.timerText.setText("Time: "+this.timer);
			this.totalTimeText.setText("Total time: "+this.totalTimer);
			this.levelText.setText("Level: "+this.level+" / "+this.maxLevels);
			this.ball.body.x = this.ballStartPos.x;
			this.ball.body.y = this.ballStartPos.y;
			this.ball.body.velocity.x = 0;
			this.ball.body.velocity.y = 0;
			this.showLevel();

			if(this.counter == 0) {
				this.bomb1.destroy();
			}
		}
	}
};