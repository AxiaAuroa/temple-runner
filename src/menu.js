/***********************************************
menu.js : game menus
***********************************************/

// start menu
// launched when loading is done
Crafty.scene('startMenu', function() {
	
	// mobile version setup
	if(Game.mobile) Game.mobileVersion();
	
	// title and subtitles
	var mainTitle = Crafty.e('CustomText').setTitle()
	.text('TEMPLE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RUNNER').place(0, 130);
	var timeAttackTitle = Crafty.e('CustomText').setSubtitle()
	.text('PLAY&nbsp;&nbsp;&nbsp;&nbsp;GAME').place(0, 215);
	
	// Add leaderboard subtitle
	var leaderboardTitle = Crafty.e('CustomText').setSubtitle()
	.text('LEADERBOARD').place(0, 245);
	
	// door
	var door = Crafty.e('Door').place(Game.width/2-15, Game.height-66).appear();
	
	// handling actions
	var handler = Crafty.e('Delay');
	
	// the title fades in
	handler.delay(function(){
		mainTitle.appear();
	},500);
	
	// the subtitles fade in
	handler.delay(function(){
		timeAttackTitle.appear();
		leaderboardTitle.appear();
		
		// choose between the subtitles
		var subtitles = [timeAttackTitle, leaderboardTitle];
		var chosenIndex = 0;
		timeAttackTitle.choose().bind('KeyUp', function(e) {
			if(!Crafty.isPaused()) {
				if(e.key == Player.keys.keyUp) {
					subtitles[chosenIndex].unchoose();
					chosenIndex = (chosenIndex == 0 ? subtitles.length-1 : chosenIndex-1);
					subtitles[chosenIndex].choose();
				} else if(e.key == Player.keys.keyDown) {
					subtitles[chosenIndex].unchoose();
					chosenIndex = (chosenIndex == subtitles.length-1 ? 0 : chosenIndex+1);
					subtitles[chosenIndex].choose();
				}
			}
			
			// if player presses keyAction
			if(!Crafty.isPaused() && Player.keys.keyAction.indexOf(e.key) != -1 && !door.isOpen) {
				if(timeAttackTitle.isChosen){
					// open the door
					door.open();
					// start first room in time attack
					Game.mode = 'timeAttack';
					handler.delay(function(){
						// Show loading screen with ad space before starting the game
						showLoadingScreen(function() {
							Crafty.scene(Game.startRoom);
						});
					},1100);
				} else if(leaderboardTitle.isChosen){
					// Show leaderboard
					showLeaderboard();
				}
			}
		});
	},1500);

	// Function to show loading screen with ad space
	function showLoadingScreen(callback) {
		// Create a new scene for loading
		Crafty.scene('loadingScreen', function() {
			// Background
			Crafty.background('#000000');
			
			// Loading text
			var loadingText = Crafty.e('2D, DOM, Text')
				.attr({x: 0, y: 150, w: Game.width})
				.text('LOADING...')
				.textColor('#FFFFFF')
				.textFont({size: '20px', family: 'arcade'})
				.textAlign('center');
			
			// Ad space placeholder
			var adSpace = Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({x: Game.width/2 - 150, y: 200, w: 300, h: 150})
				.color('#555555')
				.text('ADVERTISEMENT SPACE\nContact: example@email.com')
				.textColor('#FFFFFF')
				.textFont({size: '16px', family: 'arcade'})
				.css({'text-align': 'center', 'padding-top': '60px'});
			
			// Simulate loading time
			setTimeout(function() {
				if(callback) callback();
			}, 3000);
		});
		
		Crafty.scene('loadingScreen');
	}
	
	// Function to show leaderboard
	function showLeaderboard() {
		// Create a new scene for leaderboard
		Crafty.scene('leaderboard', function() {
			// Background
			Crafty.background('#000000');
			
			// Leaderboard title
			var leaderboardTitle = Crafty.e('2D, DOM, Text')
				.attr({x: 0, y: 50, w: Game.width})
				.text('WEEKLY LEADERBOARD')
				.textColor('#FFFFFF')
				.textFont({size: '24px', family: 'arcade'})
				.textAlign('center');
				
			// Time remaining text - calculated from server
			var resetText = Crafty.e('2D, DOM, Text')
				.attr({x: 0, y: 80, w: Game.width})
				.text('LOADING LEADERBOARD...')
				.textColor('#FFFFFF')
				.textFont({size: '14px', family: 'arcade'})
				.textAlign('center');
			
			// Loading message
			var loadingText = Crafty.e('2D, DOM, Text')
				.attr({x: 0, y: 200, w: Game.width})
				.text('LOADING...')
				.textColor('#FFFFFF')
				.textFont({size: '18px', family: 'arcade'})
				.textAlign('center');
			
			// Load leaderboard data
			Game.leaderboard.getTopScores(function(leaderboardData, resetTimeText) {
				// Update reset time text
				resetText.text('RESETS IN: ' + resetTimeText);
				
				// Remove loading text
				loadingText.destroy();
				
				// Display leaderboard entries
				if (leaderboardData.length === 0) {
					Crafty.e('2D, DOM, Text')
						.attr({x: 0, y: 200, w: Game.width})
						.text('NO SCORES YET')
						.textColor('#FFFFFF')
						.textFont({size: '18px', family: 'arcade'})
						.textAlign('center');
				} else {
					// Header row
					Crafty.e('2D, DOM, Text')
						.attr({x: Game.width/2 - 150, y: 120, w: 300})
						.text('RANK    PLAYER    SCORE')
						.textColor('#AAAAAA')
						.textFont({size: '16px', family: 'arcade'});
					
					// Leaderboard entries
					leaderboardData.forEach(function(entry, index) {
						var yPos = 150 + (index * 25);
						
						// Rank
						Crafty.e('2D, DOM, Text')
							.attr({x: Game.width/2 - 150, y: yPos, w: 50})
							.text(entry.rank)
							.textColor('#FFFFFF')
							.textFont({size: '16px', family: 'arcade'});
						
						// Name
						Crafty.e('2D, DOM, Text')
							.attr({x: Game.width/2 - 80, y: yPos, w: 150})
							.text(entry.name)
							.textColor('#FFFFFF')
							.textFont({size: '16px', family: 'arcade'});
						
						// Score
						Crafty.e('2D, DOM, Text')
							.attr({x: Game.width/2 + 80, y: yPos, w: 100})
							.text(entry.score)
							.textColor('#FFFFFF')
							.textFont({size: '16px', family: 'arcade'})
							.textAlign('right');
					});
				}
			});
			
			// Back button
			var backButton = Crafty.e('2D, DOM, HTML, Mouse')
				.attr({x: 20, y: 450, w: 100, h: 30, z: 1000})
				.replace('<div style="display: flex; align-items: center; justify-content: center; background-color: #355157; color: white; border-radius: 4px; padding: 5px;"><img src="assets/images/icon-back.png" style="height: 20px; margin-right: 5px;"> BACK</div>')
				.bind('MouseDown', function() {
					Crafty.scene('startMenu');
				});
			
			// Main menu button at bottom
			var menuButton = Crafty.e('2D, DOM, Color, Text, Mouse')
				.attr({x: Game.width/2 - 60, y: 450, w: 120, h: 30})
				.color('#355157')
				.text('MAIN MENU')
				.textColor('#FFFFFF')
				.textFont({size: '16px', family: 'arcade'})
				.css({'text-align': 'center', 'padding-top': '5px'})
				.bind('MouseDown', function() {
					Crafty.scene('startMenu');
				});
		});
		
		Crafty.scene('leaderboard');
	}
	
});