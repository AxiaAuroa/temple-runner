/***********************************************
time-attack.js : time attack mode
***********************************************/

// Add this to your time-attack.js file
// Function to show loading screen between levels
function showLevelLoadingScreen(nextLevelScene) {
    // Save current scene to restore later if needed
    var currentScene = Crafty._current;
    
    // Create loading screen scene
    Crafty.scene('levelLoadingScreen', function() {
        // Background
        Crafty.background('#000000');
        
        // Loading text
        var loadingText = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 150, w: Game.width})
            .text('LOADING NEXT LEVEL...')
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
            Crafty.scene(nextLevelScene);
        }, 2000);
    });
    
    // Switch to loading screen
    Crafty.scene('levelLoadingScreen');
}

// time attack mode
function timeAttackMode(){
	return {
		// displayed timer default value
		timer: 0.0,
		// trophy record values
		bronze: 400.0,
		silver: 285.0,
		gold: 200.0,
		platinum: 150.0,
		// start function : called in level-1.js
		start: function(player){
			// player can't move yet
			player.disableControl();
			// display a timer on top of the game
			var i = 0;
			var timerText = Crafty.e('2D, DOM, Text, Delay, Persist, TimerText').attr({x: 315, y: (userBrowser.isFirefox?-3:-1), w: 50, z: 200})
			.textColor('white').textFont({size: '16px', family: 'arcade'}).textAlign('right')
			// the timer text is updated each time the timer value changes
			.dynamicTextGeneration(true)
			.text(function(){ 
				return Game.timeAttack.timer.toFixed(1); 
			})
			// the timer blinks at start
			.delay(function(){
				if(i%2 == 0){
					this.textColor('black');
				} else this.textColor('white');
				i++;
			},250,7);
			// black background for timer
			var timerBackground =  Crafty.e('2D, DOM, Color, Persist')
			.color('black').attr({x: 312, y: 0, w: 55, h: 16, z: 199});
			// middle text displayed at start
			// GET READY 3 2 1 GO!
			var middleText = Crafty.e('2D, DOM, Text, Delay')
			.text('GET&nbsp;&nbsp;&nbsp;READY').attr({x: 0, y: (userBrowser.isFirefox?180:184), w: Game.width})
			.textColor('white').textFont({size: '27px', family: 'arcade'}).textAlign('center');
			middleText.delay(function(){ this.text('3'); },2000);
			middleText.delay(function(){ this.text('2'); },3000);
			middleText.delay(function(){ this.text('1'); },4000);
			middleText.delay(function(){
				this.text('GO!');
				// start the timer
				timerText.delay(function(){
					(Game.timeAttack.timer += 0.1);
				},100, -1);
				// player can move
				player.enableControl();
			},5000);
			// destroy middle text
			middleText.delay(function(){ this.destroy(); },6000);
			
		},
		// stop function : called in the last level
		stop: function(){
			Crafty('TimerText').each(function(){
				// stop the timer automatic display
				this.dynamicTextGeneration(false);
				// make it blink
				var i = 0;
				this.delay(function(){
					if(i%2 == 0){
						this.textColor('black');
					} else this.textColor('white');
					i++;
				},250,7,function(){
					// stop the timer
					this.pauseDelays();
				});
				// show the trophies and their records, half transparent by default
				var bronzeTrophy = Crafty.e('2D, DOM, Image, Renderable')
				.image('assets/images/trophy/bronze.png').attr({x: 209, y: 55, alpha: 0.5});
				var bronzeRecord = Crafty.e('2D, DOM, Text, Renderable')
				.text(Game.timeAttack.bronze.toFixed(1)).attr({x: 200, y: 30, w: 50, alpha: 0.5})
				.textColor('white').textFont({size: '16px', family: 'arcade'}).textAlign('center');
				
				var silverTrophy = Crafty.e('2D, DOM, Image, Renderable')
				.image('assets/images/trophy/silver.png').attr({x: 289, y: 55, alpha: 0.5});
				var silverRecord = Crafty.e('2D, DOM, Text, Renderable')
				.text(Game.timeAttack.silver.toFixed(1)).attr({x: 280, y: 30, w: 50, alpha: 0.5})
				.textColor('white').textFont({size: '16px', family: 'arcade'}).textAlign('center');
				
				var goldTrophy = Crafty.e('2D, DOM, Image, Renderable')
				.image('assets/images/trophy/gold.png').attr({x: 369, y: 55, alpha: 0.5});
				var goldRecord = Crafty.e('2D, DOM, Text, Renderable')
				.text(Game.timeAttack.gold.toFixed(1)).attr({x: 360, y: 30, w: 50, alpha: 0.5})
				.textColor('white').textFont({size: '16px', family: 'arcade'}).textAlign('center');
				
				var platinumTrophy = Crafty.e('2D, DOM, Image, Renderable')
				.image('assets/images/trophy/platinum.png').attr({x: 449, y: 55, alpha: 0.5});
				var platinumRecord = Crafty.e('2D, DOM, Text, Renderable')
				.text(Game.timeAttack.platinum.toFixed(1)).attr({x: 440, y: 30, w: 50, alpha: 0.5})
				.textColor('white').textFont({size: '16px', family: 'arcade'}).textAlign('center');
				
				// they lose transparency if the record is beaten 
				if(Game.timeAttack.timer <= Game.timeAttack.bronze){
					bronzeTrophy.alpha = 1;
					bronzeRecord.alpha = 1;
				}
				if(Game.timeAttack.timer <= Game.timeAttack.silver){
					silverTrophy.alpha = 1;
					silverRecord.alpha = 1;
				}
				if(Game.timeAttack.timer <= Game.timeAttack.gold){
					goldTrophy.alpha = 1;
					goldRecord.alpha = 1;
				}
				if(Game.timeAttack.timer <= Game.timeAttack.platinum){
					platinumTrophy.alpha = 1;
					platinumRecord.alpha = 1;
				}
			});
		}
	}
}