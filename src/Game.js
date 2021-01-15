Pokeball.Game = function(game) {};
Pokeball.Game.prototype = {
	create: function() {
		const modalEl = document.querySelector('#modalEl');
		const givePermissionBtn = document.querySelector('#givePermissionBtn');

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
		this.movementForce = 1.5;
		this.ballStartPos = { x: Pokeball._WIDTH*0.5, y: 450 };
		this.counter = 0;

		this.pauseButton = this.add.button(Pokeball._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.timerText = this.game.add.text(6, 10, "Time: "+this.timer, this.fontBig);
		this.levelText = this.game.add.text(195, 7, "Level: "+this.level+" / "+this.maxLevels, this.fontSmall);
		this.totalTimeText = this.game.add.text(195, 27, "Total time: "+this.totalTimer, this.fontSmall);
		this.pointsText = this.game.add.text(98, 10, "Points: "+this.points, this.fontBig);

		this.bonus1 = this.add.sprite(160, 290, 'bonus');
		this.physics.enable(this.bonus1, Phaser.Physics.ARCADE);
		this.bonus1.anchor.set(0.5);
		this.bonus1.body.setSize(2, 2);

		this.hole = this.add.sprite(Pokeball._WIDTH*0.5, 90, 'hole');
		this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.hole.anchor.set(0.5);
		this.hole.body.setSize(22, 22);

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
				{ x: 20, y: 50, t: 'h' },
				{ x: 20, y: 150, t: 'w' },
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
		this.physics.arcade.collide(this.ball, this.bomb4, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb5, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb6, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb7, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb8, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb9, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb10, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb11, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb12, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bomb13, this.bombCollision, null, this);
		this.physics.arcade.collide(this.ball, this.bonus1, this.bonusCollision1, null, this);
		this.physics.arcade.collide(this.ball, this.bonus2, this.bonusCollision2, null, this);
		this.physics.arcade.collide(this.ball, this.bonus3, this.bonusCollision3, null, this);
		this.physics.arcade.collide(this.ball, this.bonus4, this.bonusCollision4, null, this);
		this.physics.arcade.collide(this.ball, this.bonus5, this.bonusCollision5, null, this);
		this.physics.arcade.collide(this.ball, this.bonus6, this.bonusCollision6, null, this);
		this.physics.arcade.collide(this.ball, this.bonus7, this.bonusCollision7, null, this);
		this.physics.arcade.collide(this.ball, this.bonus8, this.bonusCollision8, null, this);
		this.physics.arcade.collide(this.ball, this.bonus9, this.bonusCollision9, null, this);
		this.physics.arcade.collide(this.ball, this.bonus10, this.bonusCollision10, null, this);
		this.physics.arcade.collide(this.ball, this.bonus11, this.bonusCollision11, null, this);
		this.physics.arcade.collide(this.ball, this.bonus12, this.bonusCollision12, null, this);
		this.physics.arcade.collide(this.ball, this.bonus13, this.bonusCollision13, null, this);
		this.physics.arcade.collide(this.ball, this.bonus14, this.bonusCollision14, null, this);
		this.physics.arcade.collide(this.ball, this.bonus15, this.bonusCollision15, null, this);
		this.physics.arcade.collide(this.ball, this.bonus16, this.bonusCollision16, null, this);
		this.physics.arcade.collide(this.ball, this.bonus17, this.bonusCollision17, null, this);
		this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		this.physics.arcade.collide(this.ball, this.levels[this.level-1], this.wallCollision, null, this);
		this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
	},
	bonusCollision1: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus1.destroy();
	},
	bonusCollision2: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus2.destroy();
	},
	bonusCollision3: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus3.destroy();
	},
	bonusCollision4: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus4.destroy();
	},
	bonusCollision5: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus5.destroy();
	},
	bonusCollision6: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus6.destroy();
	},
	bonusCollision7: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus7.destroy();
	},
	bonusCollision8: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus8.destroy();
	},
	bonusCollision9: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus9.destroy();
	},
	bonusCollision10: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus10.destroy();
	},
	bonusCollision11: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus11.destroy();
	},
	bonusCollision12: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus12.destroy();
	},
	bonusCollision13: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus13.destroy();
	},
	bonusCollision14: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus14.destroy();
	},
	bonusCollision15: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus15.destroy();
	},
	bonusCollision16: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus16.destroy();
	},
	bonusCollision17: function () {
		this.points+= 5;
		this.pointsText.setText("Points: "+this.points);
		this.bonus17.destroy();
	},
	bombCollision: function() {
		this.game.state.start('Game');
		alert('You are dead.\n'+ 'Total points : '+this.points);
	},
	wallCollision: function() {
		// Wibracje
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
			alert('Congratulations, game completed!\nTotal time of play: '+this.totalTimer+' seconds!\n'+
			'Total points : '+this.points);
			this.game.state.start('Game');
		}
		else {
			this.points++;
			this.pointsText.setText("Points: "+this.points);
			this.counter++;
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

			if(this.counter == 1) {
				this.bonus1.destroy();
				this.bomb1 = this.add.sprite(140, 195, 'bomb');
				this.physics.enable(this.bomb1, Phaser.Physics.ARCADE);
				this.bomb1.anchor.set(0.5);
				this.bomb1.body.setSize(2, 2);

				this.bonus2 = this.add.sprite(160, 290, 'bonus');
				this.physics.enable(this.bonus2, Phaser.Physics.ARCADE);
				this.bonus2.anchor.set(0.5);
				this.bonus2.body.setSize(2, 2);
			}
			if(this.counter == 2) {
				this.bonus2.destroy();
				this.bomb1.destroy();

				this.bomb4 = this.add.sprite(170, 300, 'bomb');
				this.physics.enable(this.bomb4, Phaser.Physics.ARCADE);
				this.bomb4.anchor.set(0.5);
				this.bomb4.body.setSize(2, 2);

				this.bonus3 = this.add.sprite(220, 90, 'bonus');
				this.physics.enable(this.bonus3, Phaser.Physics.ARCADE);
				this.bonus3.anchor.set(0.5);
				this.bonus3.body.setSize(2, 2);
			}
			if(this.counter == 3) {
				this.bonus3.destroy();
				this.bomb4.destroy();

				this.bomb5 = this.add.sprite(80, 205, 'bomb');
				this.physics.enable(this.bomb5, Phaser.Physics.ARCADE);
				this.bomb5.anchor.set(0.5);
				this.bomb5.body.setSize(2, 2);
				this.bomb6 = this.add.sprite(80, 320, 'bomb');
				this.physics.enable(this.bomb6, Phaser.Physics.ARCADE);
				this.bomb6.anchor.set(0.5);
				this.bomb6.body.setSize(2, 2);

				this.bonus4 = this.add.sprite(60, 80, 'bonus');
				this.physics.enable(this.bonus4, Phaser.Physics.ARCADE);
				this.bonus4.anchor.set(0.5);
				this.bonus4.body.setSize(2, 2);

				this.bonus5 = this.add.sprite(20, 380, 'bonus');
				this.physics.enable(this.bonus5, Phaser.Physics.ARCADE);
				this.bonus5.anchor.set(0.5);
				this.bonus5.body.setSize(2, 2);
			}
			if(this.counter == 4) {
				this.bonus4.destroy();
				this.bonus5.destroy();
				this.bomb5.destroy();
				this.bomb6.destroy();

				this.bomb7 = this.add.sprite(50, 290, 'bomb');
				this.physics.enable(this.bomb7, Phaser.Physics.ARCADE);
				this.bomb7.anchor.set(0.5);
				this.bomb7.body.setSize(2, 2);

				this.bonus6 = this.add.sprite(160, 290, 'bonus');
				this.physics.enable(this.bonus6, Phaser.Physics.ARCADE);
				this.bonus6.anchor.set(0.5);
				this.bonus6.body.setSize(2, 2);
				this.bonus7 = this.add.sprite(20, 380, 'bonus');
				this.physics.enable(this.bonus7, Phaser.Physics.ARCADE);
				this.bonus7.anchor.set(0.5);
				this.bonus7.body.setSize(2, 2);
			}
			if(this.counter == 5) {
				this.bonus6.destroy();
				this.bonus7.destroy();
				this.bomb7.destroy();
				
				this.bomb8 = this.add.sprite(40, 290, 'bomb');
				this.physics.enable(this.bomb8, Phaser.Physics.ARCADE);
				this.bomb8.anchor.set(0.5);
				this.bomb8.body.setSize(2, 2);

				this.bonus8 = this.add.sprite(60, 300, 'bonus');
				this.physics.enable(this.bonus8, Phaser.Physics.ARCADE);
				this.bonus8.anchor.set(0.5);
				this.bonus8.body.setSize(2, 2);
			}
			if(this.counter == 6) {
				this.bonus8.destroy();
				this.bomb8.destroy();

				this.bomb9 = this.add.sprite(270, 300, 'bomb');
				this.physics.enable(this.bomb9, Phaser.Physics.ARCADE);
				this.bomb9.anchor.set(0.5);
				this.bomb9.body.setSize(2, 2);
				this.bomb10 = this.add.sprite(305, 365, 'bomb');
				this.physics.enable(this.bomb10, Phaser.Physics.ARCADE);
				this.bomb10.anchor.set(0.5);
				this.bomb10.body.setSize(2, 2);

				this.bonus9 = this.add.sprite(240, 300, 'bonus');
				this.physics.enable(this.bonus9, Phaser.Physics.ARCADE);
				this.bonus9.anchor.set(0.5);
				this.bonus9.body.setSize(2, 2);

				this.bonus10 = this.add.sprite(200, 300, 'bonus');
				this.physics.enable(this.bonus10, Phaser.Physics.ARCADE);
				this.bonus10.anchor.set(0.5);
				this.bonus10.body.setSize(2, 2);

				this.bonus11 = this.add.sprite(150, 300, 'bonus');
				this.physics.enable(this.bonus11, Phaser.Physics.ARCADE);
				this.bonus11.anchor.set(0.5);
				this.bonus11.body.setSize(2, 2);

				this.bonus12 = this.add.sprite(100, 364, 'bonus');
				this.physics.enable(this.bonus12, Phaser.Physics.ARCADE);
				this.bonus12.anchor.set(0.5);
				this.bonus12.body.setSize(2, 2);

				this.bonus13 = this.add.sprite(200, 364, 'bonus');
				this.physics.enable(this.bonus13, Phaser.Physics.ARCADE);
				this.bonus13.anchor.set(0.5);
				this.bonus13.body.setSize(2, 2);
			}
			if(this.counter == 7) {
				this.bonus9.destroy();
				this.bonus10.destroy();
				this.bonus11.destroy();
				this.bonus12.destroy();
				this.bonus13.destroy();
				this.bomb9.destroy();
				this.bomb10.destroy();
				
				this.bomb11 = this.add.sprite(71, 330, 'bomb');
				this.physics.enable(this.bomb11, Phaser.Physics.ARCADE);
				this.bomb11.anchor.set(0.5);
				this.bomb11.body.setSize(2, 2);
				this.bomb12 = this.add.sprite(307, 150, 'bomb');
				this.physics.enable(this.bomb12, Phaser.Physics.ARCADE);
				this.bomb12.anchor.set(0.5);
				this.bomb12.body.setSize(2, 2);
				this.bomb13 = this.add.sprite(188, 250, 'bomb');
				this.physics.enable(this.bomb13, Phaser.Physics.ARCADE);
				this.bomb13.anchor.set(0.5);
				this.bomb13.body.setSize(2, 2);

				this.bonus14 = this.add.sprite(128, 240, 'bonus');
				this.physics.enable(this.bonus14, Phaser.Physics.ARCADE);
				this.bonus14.anchor.set(0.5);
				this.bonus14.body.setSize(2, 2);
				this.bonus15 = this.add.sprite(306, 240, 'bonus');
				this.physics.enable(this.bonus15, Phaser.Physics.ARCADE);
				this.bonus15.anchor.set(0.5);
				this.bonus15.body.setSize(2, 2);

				this.bonus16 = this.add.sprite(306, 300, 'bonus');
				this.physics.enable(this.bonus16, Phaser.Physics.ARCADE);
				this.bonus16.anchor.set(0.5);
				this.bonus16.body.setSize(2, 2);
				this.bonus17 = this.add.sprite(306, 380, 'bonus');
				this.physics.enable(this.bonus17, Phaser.Physics.ARCADE);
				this.bonus17.anchor.set(0.5);
				this.bonus17.body.setSize(2, 2);
			}

		}
	}
};