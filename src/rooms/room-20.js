/***********************************************
room-20.js
***********************************************/

// room 20
Crafty.scene('room-20', function() {
	
	// init room
	// see _shared.js
	initRoom(20);
	
	// player creation at init position
	var initX = 30;
	var initY = 96;
	var player = Crafty.e('Player').place(initX, initY);
	
	// stop time attack mode because last level
	var finalTime = 0;
	if(Game.mode == 'timeAttack'){
		finalTime = Game.timeAttack.timer;
		Game.timeAttack.stop();
	}
	
	// closing door with its platform
	Crafty.e('Door').place(16, 77).close();
	Crafty.e('Platform').place(16, 127).size(54, 20);
	
	// ground
	Crafty.e('Platform').place(0, Game.height-16).size(Game.width, 16);
	
	// Create completion overlay
	var overlay = Crafty.e('2D, DOM, Color')
		.attr({x: 0, y: 0, w: Game.width, h: Game.height, z: 900})
		.color('#000000')
		.css({opacity: 0.8});
	
	var congratsText = Crafty.e('CustomText')
		.text('CONGRATULATIONS!')
		.place(0, 80)
		.textFont({size: '28px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	var completionText = Crafty.e('CustomText')
		.text('YOU COMPLETED ALL LEVELS')
		.place(0, 120)
		.textFont({size: '20px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	var scoreText = Crafty.e('CustomText')
		.text('YOUR SCORE: ' + finalTime.toFixed(1))
		.place(0, 160)
		.textFont({size: '20px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Simple message about leaderboard
	var leaderboardMsg = Crafty.e('CustomText')
		.text('LEADERBOARD COMING SOON!')
		.place(0, 220)
		.textFont({size: '18px'})
		.textColor('#FFFF55')
		.textAlign('center')
		.attr({z: 901});
	
	// Return to menu button
	var menuButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 100, y: 300, w: 200, h: 40, z: 901})
		.color('rgba(53, 81, 87, 0.8)')
		.css({
			'border': '2px solid #FFFFFF', 
			'text-align': 'center', 
			'padding-top': '10px',
			'border-radius': '4px',
			'cursor': 'pointer'
		})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('RETURN TO MENU')
		.bind('MouseOver', function() {
			this.color('rgba(73, 101, 107, 0.8)');
		})
		.bind('MouseOut', function() {
			this.color('rgba(53, 81, 87, 0.8)');
		})
		.bind('Click', function() {
			Crafty.scene('startMenu');
		});
	
	// Play again button
	var playAgainButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 100, y: 360, w: 200, h: 40, z: 901})
		.color('rgba(53, 81, 87, 0.8)')
		.css({
			'border': '2px solid #FFFFFF', 
			'text-align': 'center', 
			'padding-top': '10px',
			'border-radius': '4px',
			'cursor': 'pointer'
		})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('PLAY AGAIN')
		.bind('MouseOver', function() {
			this.color('rgba(73, 101, 107, 0.8)');
		})
		.bind('MouseOut', function() {
			this.color('rgba(53, 81, 87, 0.8)');
		})
		.bind('Click', function() {
			Crafty.scene('room-1');
		});
});