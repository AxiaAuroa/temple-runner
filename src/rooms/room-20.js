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
	
	// Add congratulation text and score
	var congratsText = Crafty.e('CustomText')
		.text('THANKS&nbsp;&nbsp;FOR&nbsp;&nbsp;PLAYING&nbsp;&nbsp;THE&nbsp;&nbsp;GAME!')
		.place(0, 140)
		.textFont({size: '20px'})
		.textColor('#355157')
		.textAlign('center');
	
	var scoreText = Crafty.e('CustomText')
		.text('YOUR&nbsp;&nbsp;SCORE:&nbsp;&nbsp;' + finalTime.toFixed(1))
		.place(0, 180)
		.textFont({size: '20px'})
		.textColor('#355157')
		.textAlign('center');
	
	// Check if player qualifies for leaderboard
	Game.leaderboard.checkQualification(finalTime, function(qualifies) {
		if (qualifies) {
			// Create input fields for username and wallet
			var instructionText = Crafty.e('CustomText')
				.text('YOU&nbsp;&nbsp;QUALIFIED&nbsp;&nbsp;FOR&nbsp;&nbsp;THE&nbsp;&nbsp;LEADERBOARD!')
				.place(0, 220)
				.textFont({size: '16px'})
				.textColor('#355157')
				.textAlign('center');
			
			var usernamePrompt = Crafty.e('CustomText')
				.text('ENTER&nbsp;&nbsp;YOUR&nbsp;&nbsp;USERNAME:')
				.place(0, 250)
				.textFont({size: '14px'})
				.textColor('#355157')
				.textAlign('center');
			
			// Username input field placeholder
			var usernameField = Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({x: Game.width/2 - 100, y: 275, w: 200, h: 25, z: 1000})
				.color('#FFFFFF')
				.css({'border': '2px solid #355157', 'text-align': 'center', 'padding': '2px'})
				.text('Click to type username')
				.bind('Click', function() {
					if (this.text() === 'Click to type username') {
						this.text('');
					}
					var field = this;
					var input = prompt("Enter your username:");
					if (input) {
						field.text(input);
					} else {
						field.text('Click to type username');
					}
				});
			
			var walletPrompt = Crafty.e('CustomText')
				.text('ENTER&nbsp;&nbsp;YOUR&nbsp;&nbsp;SOLANA&nbsp;&nbsp;WALLET:')
				.place(0, 310)
				.textFont({size: '14px'})
				.textColor('#355157')
				.textAlign('center');
			
			// Wallet address input field placeholder
			var walletField = Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({x: Game.width/2 - 100, y: 335, w: 200, h: 25, z: 1000})
				.color('#FFFFFF')
				.css({'border': '2px solid #355157', 'text-align': 'center', 'padding': '2px'})
				.text('Click to type wallet address')
				.bind('Click', function() {
					if (this.text() === 'Click to type wallet address') {
						this.text('');
					}
					var field = this;
					var input = prompt("Enter your Solana wallet address:");
					if (input) {
						field.text(input);
					} else {
						field.text('Click to type wallet address');
					}
				});
			
			var submitButton = Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({x: Game.width/2 - 60, y: 375, w: 120, h: 30, z: 1000})
				.color('#355157')
				.text('SUBMIT')
				.textFont({size: '16px', family: 'arcade'})
				.textColor('#FFFFFF')
				.css({'text-align': 'center', 'padding-top': '5px'})
				.bind('MouseDown', function() {
					// Submit logic would go here - connect to backend
					if (usernameField.text() !== 'Click to type username' && 
						walletField.text() !== 'Click to type wallet address') {
						// Save to leaderboard
						var success = Game.leaderboard.saveScore(
							usernameField.text(),
							walletField.text(),
							finalTime
						);
						
						if (success) {
							// Show confirmation
							Crafty.e('FloatingMessage')
								.text('SCORE SUBMITTED!')
								.place(Game.width/2 - 100, 150);
							
							// Disable submit button to prevent multiple submissions
							submitButton.unbind('MouseDown');
							submitButton.color('#777777');
							submitButton.text('SUBMITTED');
						} else {
							// Show error
							Crafty.e('FloatingMessage')
								.text('SUBMISSION FAILED!')
								.place(Game.width/2 - 100, 150);
						}
					} else {
						// Show error if fields are not filled
						Crafty.e('FloatingMessage')
							.text('PLEASE FILL ALL FIELDS!')
							.place(Game.width/2 - 100, 150);
					}
				});
		} else {
			var notQualifiedText = Crafty.e('CustomText')
				.text('KEEP&nbsp;&nbsp;PRACTICING&nbsp;&nbsp;TO&nbsp;&nbsp;REACH&nbsp;&nbsp;THE&nbsp;&nbsp;LEADERBOARD!')
				.place(0, 230)
				.textFont({size: '14px'})
				.textColor('#355157')
				.textAlign('center');
		}
	});
	
	// Back to main menu button
	var menuButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 70, y: 420, w: 140, h: 30, z: 1000})
		.color('#355157')
		.text('MAIN MENU')
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.css({'text-align': 'center', 'padding-top': '5px'})
		.bind('MouseDown', function() {
			Crafty.scene('startMenu');
		});
});