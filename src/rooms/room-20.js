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
	
	// Create an HTML input element for name
	var nameInputElement = document.createElement('input');
	nameInputElement.type = 'text';
	nameInputElement.maxLength = 20;
	nameInputElement.placeholder = 'Your Name';
	nameInputElement.style.width = '240px';
	nameInputElement.style.height = '30px';
	nameInputElement.style.backgroundColor = 'rgba(53, 81, 87, 0.8)';
	nameInputElement.style.color = '#FFFFFF';
	nameInputElement.style.border = '2px solid #FFFFFF';
	nameInputElement.style.borderRadius = '4px';
	nameInputElement.style.textAlign = 'center';
	nameInputElement.style.fontFamily = 'arcade, monospace';
	nameInputElement.style.fontSize = '16px';
	nameInputElement.style.outline = 'none';
	
	// Create a Crafty wrapper for the input
	var nameInput = Crafty.e('2D, DOM')
		.attr({x: Game.width/2 - 120, y: 230, w: 240, h: 30, z: 901})
		.append(nameInputElement);
	
	var walletPrompt = Crafty.e('CustomText')
		.text('ENTER YOUR SOLANA WALLET:')
		.place(0, 270)
		.textFont({size: '16px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901});
	
	// Create an HTML input element for wallet
	var walletInputElement = document.createElement('input');
	walletInputElement.type = 'text';
	walletInputElement.maxLength = 44;
	walletInputElement.placeholder = 'Your Solana Wallet Address (Optional)';
	walletInputElement.style.width = '240px';
	walletInputElement.style.height = '30px';
	walletInputElement.style.backgroundColor = 'rgba(53, 81, 87, 0.8)';
	walletInputElement.style.color = '#FFFFFF';
	walletInputElement.style.border = '2px solid #FFFFFF';
	walletInputElement.style.borderRadius = '4px';
	walletInputElement.style.textAlign = 'center';
	walletInputElement.style.fontFamily = 'arcade, monospace';
	walletInputElement.style.fontSize = '16px';
	walletInputElement.style.outline = 'none';
	
	// Create a Crafty wrapper for the input
	var walletInput = Crafty.e('2D, DOM')
		.attr({x: Game.width/2 - 120, y: 300, w: 240, h: 30, z: 901})
		.append(walletInputElement);
	
	// Status message for feedback
	var statusMessage = Crafty.e('CustomText')
		.text('')
		.place(0, 340)
		.textFont({size: '16px'})
		.textColor('#FFFFFF')
		.textAlign('center')
		.attr({z: 901, alpha: 0});
	
	// Submit button
	var submitButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 60, y: 370, w: 120, h: 40, z: 901})
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
		.text('SUBMIT')
		.bind('MouseOver', function() {
			this.color('rgba(73, 101, 107, 0.9)');
		})
		.bind('MouseOut', function() {
			this.color('rgba(53, 81, 87, 0.8)');
		})
		.bind('Click', function() {
			var name = nameInputElement.value.trim();
			var wallet = walletInputElement.value.trim();
			
			// Validate inputs
			if (name === '') {
				showStatus('PLEASE ENTER YOUR NAME', '#FF5555');
				return;
			}
			
			if (wallet === '') {
				showStatus('PLEASE ENTER YOUR WALLET', '#FF5555');
				return;
			}
			
			// Disable inputs and button while submitting
			nameInputElement.disabled = true;
			walletInputElement.disabled = true;
			this.unbind('Click');
			this.css({'cursor': 'default', 'opacity': '0.7'});
			
			// Show submitting message
			showStatus('SUBMITTING...', '#FFFFFF');
			
			// Submit score to leaderboard
			Game.leaderboard.saveScore(name, wallet, finalTime)
				.then(function(result) {
					if (result.success) {
						showStatus('SCORE SAVED SUCCESSFULLY!', '#55FF55');
						
						// Return to main menu after a delay
						setTimeout(function() {
							Crafty.scene('startMenu');
						}, 3000);
					} else {
						showStatus('FAILED TO SAVE SCORE', '#FF5555');
						
						// Re-enable inputs and button
						nameInputElement.disabled = false;
						walletInputElement.disabled = false;
						submitButton.bind('Click', submitScore);
						submitButton.css({'cursor': 'pointer', 'opacity': '1'});
					}
				});
		});
	
	// Skip button (for testing or if player doesn't want to submit)
	var skipButton = Crafty.e('2D, DOM, Color, Text, Mouse')
		.attr({x: Game.width/2 - 60, y: 420, w: 120, h: 30, z: 901})
		.color('rgba(40, 40, 40, 0.8)')
		.css({
			'border': '1px solid #AAAAAA', 
			'text-align': 'center', 
			'padding-top': '5px',
			'border-radius': '4px',
			'cursor': 'pointer'
		})
		.textFont({size: '14px', family: 'arcade'})
		.textColor('#AAAAAA')
		.text('SKIP')
		.bind('MouseOver', function() {
			this.color('rgba(60, 60, 60, 0.8)');
		})
		.bind('MouseOut', function() {
			this.color('rgba(40, 40, 40, 0.8)');
		})
		.bind('Click', function() {
			Crafty.scene('startMenu');
		});
	
	// Helper function to show status messages
	function showStatus(message, color) {
		statusMessage.text(message);
		statusMessage.textColor(color);
		statusMessage.attr({alpha: 1});
		
		// Fade out after 3 seconds
		statusMessage.tween({alpha: 0}, 3000);
	}
});