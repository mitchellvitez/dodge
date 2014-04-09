var GAME_HEIGHT = 200;
var MARGIN = 10;
var SPACE = 100;
var PLAYER_WIDTH = 16;
var PLAYER_HEIGHT = 16;
var PADDLE_HEIGHT = 64;
var NUM_PADDLES = 10;
var INITIAL_SPEED = 2;
var SPEED_MULTIPLIER = 1.2;
var SPEED_ACCELERATOR = 0.1;
var FAIL_SECONDS = 2;
var FPS = 60;
var BACKGROUND_COLOR = "#FFFFFF";
var FAIL_BACKGROUND_COLOR = "#CCCCCC";

var game = new Phaser.Game(window.innerWidth, GAME_HEIGHT, Phaser.AUTO, 'game_div');

var main_state = {
	
    preload: function() {
	game.load.image('paddle', 'assets/paddle.png'); 
	game.load.image('player', 'assets/player.png'); 
    },

    create: function() { 
	
	// Create an array of ten paddles at random heights spaced evenly across the game window
	paddles = new Array();
	paddles.length = NUM_PADDLES;
	for (var i = 0; i < paddles.length; i++) {
		var r = Math.floor(Math.random() * (GAME_HEIGHT - PADDLE_HEIGHT + 1)) + 0;
		paddles[i] = game.add.sprite(window.innerWidth / NUM_PADDLES * i, r, 'paddle'); 
	}

	// Create player and initialize other variables
	player = game.add.sprite(window.innerWidth - SPACE - PLAYER_WIDTH, SPACE - PLAYER_WIDTH / 2, 'player');
	cursors = game.input.keyboard.createCursorKeys(); 
	count = 0;
	highcount = 0;
	speed = INITIAL_SPEED;
	this.game.stage.backgroundColor = BACKGROUND_COLOR;

	// Add text elements to game
	counter = this.game.add.text(MARGIN, MARGIN, "Score: "+ count, { font: "24px Arial", fill: "ff0000" });
	highcounter = this.game.add.text(MARGIN, GAME_HEIGHT - MARGIN - 24, "High Score: "+ highcount, { font: "24px Arial", fill: "#ff0000" });
	failtext = this.game.add.text(window.innerWidth / 2 - 150, MARGIN, "", { font: "48px Arial", fill: "#ff0000" });
	
	// Displays score after a single round
	fail = false;
	failCount = 0;
	failScore = 0;
	failScoreSet = false;
    },


    update: function() {

	if (cursors.up.isDown) {
        	player.y -= SPEED_MULTIPLIER * speed + 1;
       
    	}
    	else if (cursors.down.isDown) {
        	player.y += SPEED_MULTIPLIER * speed + 1;

    	}	

	if (player.y < 0 ) {
		player.y = 0;
	}
	else if (player.y > GAME_HEIGHT - PLAYER_HEIGHT) {
		player.y = GAME_HEIGHT - PLAYER_HEIGHT;
	}

	
	for (var i = 0; i < paddles.length; i++) {
		paddles[i].x += speed;
		if (paddles[i].x > window.innerWidth) {
			if (count < 0) {
				count = 0;
			}
			paddles[i].y = Math.floor(Math.random() * (GAME_HEIGHT - PADDLE_HEIGHT + 1)) + 0;
			paddles[i].x = 0;
			count++;
			if (count > highcount)
				highcount = count;
			highcounter.content = "High Score: " + highcount;
			speed += SPEED_ACCELERATOR;
			counter.content = "Score: " + count;
		}

		if (paddles[i].x > window.innerWidth - SPACE - PLAYER_WIDTH && paddles[i].x < window.innerWidth - SPACE) {
			if (paddles[i].y > player.y - PADDLE_HEIGHT && paddles[i].y < player.y + PLAYER_HEIGHT) {
				if (!failScoreSet) failScore = count;
				failScoreSet = true;
				count = 0;
				speed = INITIAL_SPEED;
				highcounter.content = "High Score: " + highcount;
				counter.content = "Score: " + count;
				fail = true;
			}
		}
	}
	if (failCount > FAIL_SECONDS * FPS)
		fail = false;
	if (fail) {
		this.game.stage.backgroundColor = FAIL_BACKGROUND_COLOR;
		failCount++;
		failtext.content = "Your score was: " + failScore;
	} else {
		failCount = 0;
		this.game.stage.backgroundColor = BACKGROUND_COLOR;
		failScoreSet = false;
		failtext.content = "";
	}
    }
}

game.state.add('main', main_state);  
game.state.start('main');
