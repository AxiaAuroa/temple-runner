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
	
	// Create a congratulations scene overlay
	var overlay = Crafty.e('2D, DOM, Color')
		.attr({x: 0, y: 0, w: Game.width, h: Game.height, z: 900})
		.color('#000000')
		.css({opacity: 0.8});
	
	// Add congratulation text and score
	var congratsText = Crafty.e('CustomText')
		.text('CONGRATULATIONS!')
		.place(0, 80)
		.textFont({size: '28px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	var completedText = Crafty.e('CustomText')
		.text('YOU&nbsp;&nbsp;COMPLETED&nbsp;&nbsp;ALL&nbsp;&nbsp;LEVELS!')
		.place(0, 120)
		.textFont({size: '20px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	var scoreText = Crafty.e('CustomText')
		.text('YOUR&nbsp;&nbsp;SCORE:&nbsp;&nbsp;' + finalTime.toFixed(1))
		.place(0, 160)
		.textFont({size: '20px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Create in-game form for player information
	var namePrompt = Crafty.e('CustomText')
		.text('ENTER&nbsp;&nbsp;YOUR&nbsp;&nbsp;NAME:')
		.place(0, 200)
		.textFont({size: '16px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Name input field
	var nameField = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 120, y: 230, w: 240, h: 30, z: 901})
		.color('#355157')
		.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '5px'})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('CLICK TO ENTER NAME')
		.bind('Click', function() {
			var currentName = this.text() === 'CLICK TO ENTER NAME' ? '' : this.text();
			var playerName = prompt("Enter your name:", currentName);
			if (playerName && playerName.trim() !== "") {
				// Limit name length to 20 characters
				playerName = playerName.trim().substring(0, 20);
				this.text(playerName);
			} else if (!playerName) {
				// If canceled, keep previous value or default
				if (currentName === '') {
					this.text('CLICK TO ENTER NAME');
				}
			}
		});
	
	var walletPrompt = Crafty.e('CustomText')
		.text('ENTER&nbsp;&nbsp;YOUR&nbsp;&nbsp;SOLANA&nbsp;&nbsp;WALLET:')
		.place(0, 270)
		.textFont({size: '16px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Wallet input field
	var walletField = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 120, y: 300, w: 240, h: 30, z: 901})
		.color('#355157')
		.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '5px'})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('CLICK TO ENTER WALLET')
		.bind('Click', function() {
			var currentWallet = this.text() === 'CLICK TO ENTER WALLET' ? '' : this.text();
			var walletAddress = prompt("Enter your Solana wallet address:", currentWallet);
			if (walletAddress && walletAddress.trim() !== "") {
				// Truncate if too long for display
				var displayWallet = walletAddress.trim();
				if (displayWallet.length > 24) {
					displayWallet = displayWallet.substring(0, 10) + '...' + 
						displayWallet.substring(displayWallet.length - 10);
				}
				this.text(displayWallet);
				this.fullWallet = walletAddress.trim(); // Store full address
			} else if (!walletAddress) {
				// If canceled, keep previous value or default
				if (currentWallet === '') {
					this.text('CLICK TO ENTER WALLET');
				}
			}
		});
	
	// Submit button
	var submitButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 60, y: 350, w: 120, h: 40, z: 901})
		.color('#355157')
		.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '10px'})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('SUBMIT')
		.bind('Click', function() {
			var name = nameField.text();
			var wallet = walletField.fullWallet || walletField.text();
			
			// Validate inputs
			if (name === 'CLICK TO ENTER NAME' || wallet === 'CLICK TO ENTER WALLET') {
				// Show error message
				var errorMsg = Crafty.e('CustomText')
					.text('PLEASE&nbsp;&nbsp;FILL&nbsp;&nbsp;ALL&nbsp;&nbsp;FIELDS')
					.place(0, 400)
					.textFont({size: '16px'})
					.textColor('#FF5555')
					.textAlign('center')
					.attr({z: 901});
				
				// Remove error message after 2 seconds
				Crafty.e('Delay').delay(function() {
					errorMsg.destroy();
				}, 2000);
				
				return;
			}
			
			// Disable submit button to prevent multiple submissions
			submitButton.unbind('Click');
			submitButton.color('#777777');
			submitButton.text('SUBMITTING...');
			
			// Save score to leaderboard
			Game.leaderboard.saveScore(name, wallet, finalTime)
				.then(function(result) {
					if (result.success) {
						// Show success message
						submitButton.text('SUBMITTED!');
						
						var successMsg = Crafty.e('CustomText')
							.text(result.madeLeaderboard ? 
								'YOU&nbsp;&nbsp;MADE&nbsp;&nbsp;THE&nbsp;&nbsp;LEADERBOARD!' : 
								'SCORE&nbsp;&nbsp;SAVED!')
							.place(0, 400)
							.textFont({size: '16px'})
							.textColor('#55FF55')
							.textAlign('center')
							.attr({z: 901});
						
						// Show main menu button after successful submission
						Crafty.e('Delay').delay(function() {
							menuButton.attr({y: 400});
						}, 2000);
					} else {
						// Show error message and re-enable submit
						submitButton.text('RETRY');
						submitButton.color('#355157');
						submitButton.bind('Click', submitButton._events.Click[0].fn);
						
						var errorMsg = Crafty.e('CustomText')
							.text('SUBMISSION&nbsp;&nbsp;FAILED')
							.place(0, 400)
							.textFont({size: '16px'})
							.textColor('#FF5555')
							.textAlign('center')
							.attr({z: 901});
						
						// Remove error message after 2 seconds
						Crafty.e('Delay').delay(function() {
							errorMsg.destroy();
						}, 2000);
					}
				});
		});
	
	// Main menu button
	var menuButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 60, y: 450, w: 120, h: 40, z: 901})
		.color('#355157')
		.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '10px'})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('MAIN MENU')
		.bind('Click', function() {
			Crafty.scene('startMenu');
		});
});