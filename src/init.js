/***********************************************
init.js : game initialization
***********************************************/

// game properties
// can be accessed from anywhere
var Game = {
	container: document.getElementById('game-container'),
	height: 400,
	width: 600,
	mobile: false,
	mobileScale: 0.6,
	mobileGap: 0,
	started: false,
	startRoom: 'room-1',
	rooms: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
	mode: 'timeAttack', // Changed default to timeAttack only
	// time attack mode
	// see time-attack.js
	timeAttack: timeAttackMode(),
	// Leaderboard functionality with database integration
	leaderboard: {
		apiUrl: '/api/leaderboard', // This will be redirected to our Netlify function
		
		// These functions will be overridden by the ones in leaderboard.js
		getTopScores: function(callback) {
			setTimeout(function() {
				callback([], "LOADING...");
			}, 100);
		},
		
		checkQualification: function(score, callback) {
			setTimeout(function() {
				callback(true);
			}, 100);
		},
		
		saveScore: function(username, wallet, score) {
			console.log("This will be overridden by leaderboard.js");
			return Promise.resolve({success: false});
		}
	}
};

// player properties
// can be accessed from anywhere
// see : http://craftyjs.com/api/Crafty-keys.html
var Player = {
	keys: {
		keyUp: Crafty.keys.UP_ARROW, // for the menu
		keyDown: Crafty.keys.DOWN_ARROW, // for the menu
		keyLeft: Crafty.keys.LEFT_ARROW, // for the menu
		keyRight: Crafty.keys.RIGHT_ARROW, // for the menu
		keyAction: [Crafty.keys.ENTER, Crafty.keys.SPACE], // for the menu
		keyJump: ['UP_ARROW', 'SPACE', 'ENTER']
	}
};

// assets object 
// contains all the assets needed for the game : images/sprites/sounds... 
// they will be loaded later in this file with Crafty.load()
// see : http://craftyjs.com/api/Crafty-loader.html
var assetsObj = {
	'images': [
		'assets/images/ui/play.png',
	
		'assets/images/room/room-1.png',
		'assets/images/room/room-2.png',
		'assets/images/room/room-3.png',
		'assets/images/room/room-4.png',
		'assets/images/room/room-5.png',
		'assets/images/room/room-6.png',
		'assets/images/room/room-7.png',
		'assets/images/room/room-8.png',
		'assets/images/room/room-9.png',
		'assets/images/room/room-10.png',
		'assets/images/room/room-11.png',
		'assets/images/room/room-12.png',
		'assets/images/room/room-13.png',
		'assets/images/room/room-14.png',
		'assets/images/room/room-15.png',
		'assets/images/room/room-16.png',
		'assets/images/room/room-17.png',
		'assets/images/room/room-18.png',
		'assets/images/room/room-19.png',
		'assets/images/room/room-20.png',
		
		'assets/images/menu/background.png',
		'assets/images/menu/background-mobile.png',
		'assets/images/menu/choose.png',
		'assets/images/menu/unchoose.png',
		'assets/images/menu/room.png',
		
		'assets/images/platform/platform.png',
		'assets/images/platform/small-platform.png',
		'assets/images/platform/exit-platform.png',
		
		'assets/images/trap/killing-wall-left.png',
		'assets/images/trap/killing-wall-right.png',
		'assets/images/trap/killing-ground.png',
		'assets/images/trap/killing-ceiling.png',
		'assets/images/trap/projectile-shooter-top.png',
		'assets/images/trap/projectile-shooter-down.png',
		'assets/images/trap/projectile-shooter-left.png',
		'assets/images/trap/projectile-shooter-right.png',
		'assets/images/trap/projectile-top.png',
		'assets/images/trap/projectile-down.png',
		'assets/images/trap/projectile-left.png',
		'assets/images/trap/projectile-right.png',
		
		'assets/images/loot/key.png',
		'assets/images/loot/action-box.png',
		
		'assets/images/trophy/bronze.png',
		'assets/images/trophy/silver.png',
		'assets/images/trophy/gold.png',
		'assets/images/trophy/platinum.png',
		
		'assets/images/door/right-arrow.png'
	],
	'sprites': {
		'assets/images/player/player.png': { tile: 167, tileh: 167, map: { SpritePlayer: [0, 0] } },
		'assets/images/door/door.png': { tile: 32, tileh: 50, map: { SpriteDoor: [0, 0] } }
	},
	'audio': {
        'main': ['assets/audio/main.m4a','assets/audio/main.ogg']
	}
};

// initialization and loading when the page is ready
window.onload = function() {
	
	var loadError = false;
	Game.stageWidth = Game.width;
	Game.stageHeight = Game.height;
	
	// special behaviour if mobile device
	// properties are also changed in other files
	if(Crafty.mobile){
		Game.mobile = true;
		Game.stageWidth *= Game.mobileScale; 
		Game.stageHeight *= Game.mobileScale;
		// gap added by mobile version
		// used for reajusting some entities position
		Game.mobileGap = -40;
		// mobile version setup, called in every scene
		Game.mobileVersion = function(){
			// enable touch events handling
			Crafty.multitouch(true);
			// change game scale on mobile (smaller)
			Crafty.viewport.scale(Game.mobileScale);
		};
		// audio makes game buggy on mobile iOS
		// remove audio from assets before loading
		if(iOS){
			delete assetsObj.audio;
		}
	}
	
	// centered wrapper containing the game div
	// dimensioned to fit game width and height
	var generalContainer = document.getElementById('general-container');
	generalContainer.style.width = Game.stageWidth + 'px';
	generalContainer.style.height = Game.stageHeight  + 'px';
	
	// game initialization with stage setup
	Crafty.init(Game.stageWidth, Game.stageHeight, Game.container);
	
	// game UI functions : pause, restart, mute...
	// bound to the top page buttons onclick and ontouch
	var buttonRestart = document.querySelector('.ui-button.restart');
	var buttonMute = document.querySelector('.ui-button.mute');
	var buttonUnmute = document.querySelector('.ui-button.unmute');
	var buttonPause = document.querySelector('.ui-button.pause');
	var buttonUnpause = document.querySelector('.ui-button.unpause');
	
	// restart the game : reload the page
	function restart(){
		location.reload();
	}
	
	// mute audio
	function mute(){
		buttonMute.classList.add('hidden');
		buttonUnmute.classList.remove('hidden');
		if(!iOS){
			Crafty.audio.mute();
		}
	}
	
	// unmute audio
	function unmute(){
		buttonUnmute.classList.add('hidden');
		buttonMute.classList.remove('hidden');
		if(!iOS){
			Crafty.audio.unmute();
		}
	}
	
	// pause game and audio
	function pause(){
		buttonPause.classList.add('hidden');
		buttonUnpause.classList.remove('hidden');
		Game.container.classList.add('pause');
		Crafty.pause();
		if(!iOS){
			for(var audio in assetsObj.audio){
				Crafty.audio.pause(audio);
			}
		}
	}
	
	// unpause game and audio
	function unpause(){
		buttonUnpause.classList.add('hidden');
		buttonPause.classList.remove('hidden');
		Game.container.classList.remove('pause');
		Crafty.pause();
		if(!iOS){
			for(var audio in assetsObj.audio){
				Crafty.audio.unpause(audio);
			}
		}
	}

	buttonRestart.onclick = restart;
	buttonMute.onclick = mute;
	buttonUnmute.onclick = unmute;
	buttonPause.onclick = pause;
	buttonUnpause.onclick = unpause;

	// keyboard shortcuts
	Crafty.bind('KeyUp', function(e) {
		// refresh page with F5
		if(e.key == Crafty.keys.F5){
			restart();
		}
		// pause game with P
		if(e.key == Crafty.keys.P){
			if(Crafty.isPaused()){
				unpause();
			} else {
				pause();
			}
		}
	});
	
	// Add secret developer shortcut to skip to room 20
	// Only you will know this combination (Alt + :)
	document.addEventListener('keydown', function(e) {
		// Check for Alt + : (Alt + Shift + ;)
		if (e.altKey && e.key === ':') {
			console.log("Developer shortcut activated: Skipping to room 20");
			
			// Stop any existing timers if in time attack mode
			if (Game.mode === 'timeAttack' && Game.timeAttack) {
				Game.timeAttack.stop();
				// Reset timer to a reasonable testing value
				Game.timeAttack.timer = 120.5;
				Game.timeAttack.start();
			}
			
			// Skip to room 20
			Crafty.scene('room-20');
			
			// Prevent default browser behavior
			e.preventDefault();
		}
	});
	
	// game loading scene
	Crafty.scene('loading', function() {
		
		// show loading message
		var customLoadingMessage = Crafty.e('CustomText').setLoading();
		var loadingText = customLoadingMessage.text();
		
		// load all the assets for the game
		Crafty.load(assetsObj, function() { // when loaded
			
			if(!loadError){
				
				Crafty.e('Delay').delay(function(){
					
					// delete loading message
					customLoadingMessage.destroy();
					
					// show play button
					var playButton = Crafty.e('2D, DOM, Mouse').attr({w: 75, h: 75})
					.css({
						'background':'url(assets/images/ui/play.png) no-repeat center #131313',
						'border-radius':'5px'
					})
					.bind('MouseOver', function(e){ 
						if(!Crafty.isPaused()){
							this.css({'background-color':'#202020'}); 
						}
					})
					.bind('MouseOut', function(e){ 
						if(!Crafty.isPaused()){
							this.css({'background-color':'#131313'}); 
						}
					});
					
					// place the play button at the center
					playButton.attr({x: Game.stageWidth/2 - playButton.w/2, y: Game.stageHeight/2 - playButton.h/2});
					
					// start the game when pressing enter
					playButton.bind('KeyUp', function(e) {
						if(!Crafty.isPaused()){
							if(Player.keys.keyAction.indexOf(e.key) != -1) {
								play();
							}
						}
					});
					
					// start the game when clicking on play button
					playButton.bind('Click', function() {
						if(!Crafty.isPaused()){
							play();
						}
					});
				
					// start the game
					var play = function(){
						// used to prevent pause before starting the game
						Game.started = true;
						// destroy play button
						playButton.destroy();
						
						if(!iOS){
							// audio properties
							// main audio starts automatically
							Game.audio = {
								// store the audio object playing
								// will be used in fadeOut function
								main: Crafty.audio.play('main', -1, 1),
								// fade out the sound from an audio object
								// a callback function can be called when finished
								fadeOut: function(audio, callback){
									Crafty.e('Delay').delay(function(){
										if(audio.volume > 0){
											audio.volume -= 0.1;
										}
									},350, audio.volume*9, function(){
										if(typeof callback == 'function') callback();
										this.destroy();
									});
								}
							};
						}
						
						// alert if mobile device
						// Mobile version not available.
						if(Game.mobile){
							Crafty.e('2D, DOM, Text, Persist').attr({x: 0, y: 20, w: Game.width, h: 30})
							.text('Mobile version not available.').textAlign('center')
							.textColor('red').textFont({family: 'Open Sans Regular', size: '30px'});
						}
							
						// background image
						if(Game.mobile){
							Crafty.background('url(assets/images/menu/background-mobile.png)');
						} else {
							Crafty.background('url(assets/images/menu/background.png)');
						}
						
						// launch the start menu scene
						Crafty.e('Delay').delay(function(){ 
							Crafty.scene('startMenu'); 
						}, 1000, 0);
					};
				
				},1000);
			}
			
		}, function(loadingProperties){ // when loading
			
			// show loading percentage
			customLoadingMessage.text(loadingText + '&nbsp;&nbsp;&nbsp;' + Math.round(loadingProperties.percent) + '%');
			
		}, function(){ // when loading fails
			
			// show loading error message
			customLoadingMessage.text('LOADING &nbsp;&nbsp;ERROR, &nbsp;PLEASE &nbsp;&nbsp;REFRESH');
			loadError = true;
			
		});
		  
	});
	
	// launch the game loading scene
	Crafty.scene('loading');
	
};

// get user browser
// will be used to adjust a few displays
// see : https://stackoverflow.com/a/9851769
var userBrowser = {
	// Opera 8.0+
	isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
	// Firefox 1.0+
	isFirefox: typeof InstallTrigger !== 'undefined',
	// Safari 3.0+ '[object HTMLElementConstructor]' 
	isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
	// Internet Explorer 6-11
	isIE: /*@cc_on!@*/false || !!document.documentMode,
	// Edge 20+
	isEdge: !this.isIE && !!window.StyleMedia,
	// Chrome 1 - 79
	isChrome: !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
};

// know if mobile iOS
var iOS = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

// Add this function to init.js
function gameOver(score) {
    // Display game over screen
    console.log("Game completed! Final score:", score);
    
    // Prompt for player name
    var playerName = prompt("Congratulations on completing all levels! Enter your name for the leaderboard:", "Player");
    
    if (playerName && playerName.trim() !== "") {
        // Limit name length
        playerName = playerName.trim().substring(0, 20);
        
        // Save score to leaderboard
        Game.leaderboard.saveScore(playerName, score).then(success => {
            if (success) {
                console.log("Score saved successfully");
                // Show success message
                Crafty.e("FloatingMessage").floatingMessage("Score saved to leaderboard!");
            } else {
                console.error("Failed to save score");
                // Show error message
                Crafty.e("FloatingMessage").floatingMessage("Failed to save score");
            }
        });
    }
    
    // Return to main menu after a delay
    setTimeout(function() {
        Crafty.scene('startMenu');
    }, 3000);
}

// Now we need to modify the code that handles level completion
// This should be called when the player completes level 20
Game.completeLevel = function(roomNumber, score) {
    console.log("Level " + roomNumber + " completed with score: " + score);
    
    // Check if this was the final level (room 20)
    if (roomNumber === 20) {
        // Player has completed all levels, trigger game over
        gameOver(score);
    } else {
        // Not the final level, proceed to next level
        var nextRoom = roomNumber + 1;
        console.log("Proceeding to room " + nextRoom);
        
        // Load the next room (you might already have this code)
        Crafty.scene('room-' + nextRoom);
    }
};