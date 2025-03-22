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
	// Simple placeholder for leaderboard functionality
	// Will be replaced with actual implementation later
	leaderboard: {
		// Placeholder for saving scores
		saveScore: function(username, wallet, score) {
			console.log("Score saving will be implemented later:", username, wallet, score);
			return true;
		},
		
		// Placeholder for getting scores
		getTopScores: function(callback) {
			console.log("Leaderboard retrieval will be implemented later");
			// Return empty leaderboard with a message
			callback([], "COMING SOON");
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
		Game.stageWidth = window.innerWidth;
		Game.stageHeight = window.innerHeight;
	}
	
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
	
	// launch the game loading scene
	Crafty.scene('loading');
	
};

// loading scene
// launched at the beginning of the game
Crafty.scene('loading', function() {
	
	// loading text
	var loadingText = Crafty.e('2D, DOM, Text')
	.attr({w: 500, h: 20, x: Game.width/2-250, y: Game.height/2-10})
	.text('LOADING...')
	.textAlign('center')
	.textColor('#FFFFFF')
	.textFont({size: '20px', family: 'arcade'});
	
	// preload assets
	Crafty.load(assetsObj, 
		// when loaded
		function() {
			// wait a little
			setTimeout(function() {
				// launch the start menu
				Crafty.scene('startMenu');
			}, 1000);
		},
		// progress
		function(e) {
		},
		// on error
		function(e) {
			loadError = true;
			console.log(e);
		}
	);
	
});