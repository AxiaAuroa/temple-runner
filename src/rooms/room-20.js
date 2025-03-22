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
	
	// Create in-game form for player information
	var namePrompt = Crafty.e('CustomText')
		.text('ENTER YOUR NAME:')
		.place(0, 200)
		.textFont({size: '16px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Name input field - styled as a game element
	var playerName = "";
	var nameField = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 120, y: 230, w: 240, h: 30, z: 901})
		.color('#355157')
		.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '5px'})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('CLICK TO ENTER NAME')
		.bind('Click', function() {
			// Create in-game keyboard for name input
			showInGameKeyboard('name', this);
		});
	
	var walletPrompt = Crafty.e('CustomText')
		.text('ENTER YOUR SOLANA WALLET:')
		.place(0, 270)
		.textFont({size: '16px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Wallet input field - styled as a game element
	var playerWallet = "";
	var walletField = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 120, y: 300, w: 240, h: 30, z: 901})
		.color('#355157')
		.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '5px'})
		.textFont({size: '16px', family: 'arcade'})
		.textColor('#FFFFFF')
		.text('CLICK TO ENTER WALLET')
		.bind('Click', function() {
			// Create in-game keyboard for wallet input
			showInGameKeyboard('wallet', this);
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
			var name = nameField._text === 'CLICK TO ENTER NAME' ? '' : nameField._text;
			var wallet = walletField._text === 'CLICK TO ENTER WALLET' ? '' : walletField._text;
			
			// Validate inputs
			if (name === '' || wallet === '') {
				// Show error message
				var errorMsg = Crafty.e('CustomText')
					.text('PLEASE FILL ALL FIELDS')
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
								'YOU MADE THE LEADERBOARD!' : 
								'SCORE SAVED!')
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
						// Re-enable submit button
						submitButton.text('RETRY');
						submitButton.color('#355157');
						submitButton.bind('Click', submitHandler);
						
						var errorMsg = Crafty.e('CustomText')
							.text('SUBMISSION FAILED')
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
	
	// Main menu button (initially hidden, shown after submission)
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
	
	// Function to show in-game keyboard
	function showInGameKeyboard(type, targetField) {
		// Create keyboard overlay
		var keyboardOverlay = Crafty.e('2D, DOM, Color')
			.attr({x: 0, y: 0, w: Game.width, h: Game.height, z: 950})
			.color('#000000')
			.css({opacity: 0.9});
		
		var keyboardTitle = Crafty.e('CustomText')
			.text(type === 'name' ? 'ENTER YOUR NAME' : 'ENTER YOUR WALLET')
			.place(0, 50)
			.textFont({size: '20px'})
			.textColor('#FFFFFF')
			.textAlign('center')
			.attr({z: 951});
		
		// Current input display
		var currentValue = targetField._text;
		if (currentValue === 'CLICK TO ENTER NAME' || currentValue === 'CLICK TO ENTER WALLET') {
			currentValue = '';
		}
		
		var inputDisplay = Crafty.e('2D, DOM, Color, Text')
			.attr({x: Game.width/2 - 200, y: 100, w: 400, h: 40, z: 951})
			.color('#355157')
			.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '10px'})
			.textFont({size: '16px', family: 'arcade'})
			.textColor('#FFFFFF')
			.text(currentValue);
		
		// Create keyboard keys
		var keys = [];
		if (type === 'name') {
			// Alphabet for name input
			keys = [
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
				'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
				'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0',
				'1', '2', '3', '4', '5', '6', '7', '8', '9'
			];
		} else {
			// Alphanumeric for wallet input
			keys = [
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
				'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
				'U', 'V', 'W', 'X', 'Y', 'Z', '.', '_', '-', '@'
			];
		}
		
		// Create keyboard layout
		var keySize = 40;
		var keysPerRow = 10;
		var startX = Game.width/2 - (keySize * keysPerRow)/2;
		var startY = 160;
		
		keys.forEach(function(key, index) {
			var row = Math.floor(index / keysPerRow);
			var col = index % keysPerRow;
			
			Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({
					x: startX + col * keySize, 
					y: startY + row * keySize, 
					w: keySize - 4, 
					h: keySize - 4, 
					z: 951
				})
				.color('#355157')
				.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '8px'})
				.textFont({size: '16px', family: 'arcade'})
				.textColor('#FFFFFF')
				.text(key)
				.bind('Click', function() {
					// Add character to input
					var newValue = inputDisplay._text + key;
					
					// Limit length based on input type
					var maxLength = type === 'name' ? 20 : 44;
					if (newValue.length <= maxLength) {
						inputDisplay.text(newValue);
					}
				});
		});
		
		// Special keys
		// Backspace
		Crafty.e('2D, DOM, Color, Text, Mouse')
			.attr({x: startX, y: startY + 4 * keySize, w: keySize * 3 - 4, h: keySize - 4, z: 951})
			.color('#355157')
			.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '8px'})
			.textFont({size: '16px', family: 'arcade'})
			.textColor('#FFFFFF')
			.text('BACK')
			.bind('Click', function() {
				var currentText = inputDisplay._text;
				if (currentText.length > 0) {
					inputDisplay.text(currentText.substring(0, currentText.length - 1));
				}
			});
		
		// Space (for name input only)
		if (type === 'name') {
			Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({x: startX + 3 * keySize, y: startY + 4 * keySize, w: keySize * 4 - 4, h: keySize - 4, z: 951})
				.color('#355157')
				.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '8px'})
				.textFont({size: '16px', family: 'arcade'})
				.textColor('#FFFFFF')
				.text('SPACE')
				.bind('Click', function() {
					var newValue = inputDisplay._text + ' ';
					if (newValue.length <= 20) {
						inputDisplay.text(newValue);
					}
				});
		}
		
		// Done button
		Crafty.e('2D, DOM, Color, Text, Mouse')
			.attr({x: startX + 7 * keySize, y: startY + 4 * keySize, w: keySize * 3 - 4, h: keySize - 4, z: 951})
			.color('#355157')
			.css({'border': '2px solid #FFFFFF', 'text-align': 'center', 'padding-top': '8px'})
			.textFont({size: '16px', family: 'arcade'})
			.textColor('#FFFFFF')
			.text('DONE')
			.bind('Click', function() {
				// Update the target field with the input value
				var finalValue = inputDisplay._text.trim();
				if (finalValue !== '') {
					targetField.text(finalValue);
				} else {
					targetField.text(type === 'name' ? 'CLICK TO ENTER NAME' : 'CLICK TO ENTER WALLET');
				}
				
				// Remove keyboard
				keyboardOverlay.destroy();
				keyboardTitle.destroy();
				inputDisplay.destroy();
				Crafty('2D, DOM, Color, Text, Mouse, z(951)').each(function() {
					this.destroy();
				});
			});
	}
});