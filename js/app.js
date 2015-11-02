var Map = function() {
  // Determine map size
  // 'large', 'medium', 'small', 'tiny'
  this.size = 'tiny';
  // These values are used to determine many other distances in the script, but
  // they should not be changed unless the Map.rowImages .pngs are changed too
  this.tileWidth = 101;
  this.tileHeight = this.tileWidth * 0.821782178;
  // The number of columns can be changed
  this.numColumns = 11;
  // The number of columns can be changed, more enemy rows will be generated
  this.numRows = 14;
  // This is dynamically generated based this.numRows, see
  // Map.prototype.makeRows();
  this.rowImages = [];
  // Determines size of canvas in engine.js
  this.totalWidth = this.tileWidth * this.numColumns;
  this.totalHeight = this.tileHeight * ( this.numRows + 1 );
  // Offset value due to white space at the top of water tiles
  this.buffer = 50;
  // xValues and yValues get generated at the bottom of app.js using
  // Map.makeCoordinates. This allows for different numbers of rows and columns
  // to work.
  this.xValues = {};
  this.yValues = {};
  // Dynamically generated at the bottom of app.js to determine which rows
  // enemies can use. This is used by Enemy.startY()
  this.enemyRows = [];
  this.variousImages = [
    'images/Selector',
    'images/Star',
    'images/Rock',
    'images/Key',
    'images/Heart'
  ];
  this.enemySprite = 'images/enemy-bug';
  this.playerChars = [
    'images/char-boy',
    'images/char-cat-girl',
    'images/char-horn-girl',
    'images/char-pink-girl',
    'images/char-princess-girl'
  ];
  this.playerCharsHurt = [
    'images/char-boy-hurt',
    'images/char-cat-girl-hurt',
    'images/char-horn-girl-hurt',
    'images/char-pink-girl-hurt',
    'images/char-princess-girl-hurt'
  ];
  this.playerCharsHappy = [
    'images/char-boy-happy',
    'images/char-cat-girl-happy',
    'images/char-horn-girl-happy',
    'images/char-pink-girl-happy',
    'images/char-princess-girl-happy'
  ];
  this.mapTiles = [
    'images/white-block',
    'images/water-block',
    'images/stone-block',
    'images/grass-block'
  ];
};


// Allows Player.prototype.move to work to move the player around using
// coordinates
Map.prototype.giveCoordinates = function( xCoord, yCoord ) {
  var xCoordinate = this.xValues[ xCoord ];
  var yCoordinate = this.yValues[ yCoord ];
  return [ xCoordinate, yCoordinate ];
};

// Dynamically generate Map.xValues and yValues objects to allow for different
// map sizes.
Map.prototype.makeCoordinates = function() {
  for ( var i = 0; i < this.numColumns; i++ ) {
    this.xValues[ i ] = this.tileWidth * i;
  }
  for ( i = 0; i < this.numRows; i++ ) {
    this.yValues[ i ] = this.buffer + this.tileHeight * i;
  }
};

Map.prototype.makeRows = function( numRows ) {
  this.rowImages.push( map.mapTiles[ 0 ] );
  this.rowImages.push( map.mapTiles[ 0 ] );
  this.rowImages.push( map.mapTiles[ 1 ] );
  for ( var i = 1; i < numRows - 3; i++ ) {
    this.rowImages.push( map.mapTiles[ 2 ] );
  }
  this.rowImages.push( map.mapTiles[ 3 ] );
};

Map.prototype.findEnemyRows = function() {
  for ( var i = 2; i < this.numRows - 2; i++ ) {
    this.enemyRows.push( i );
  }
};

Map.prototype.findImages = function() {
  var lengthChars = this.playerChars.length,
    lengthTiles = this.mapTiles.length,
    lengthOthers = this.variousImages.length;
  if ( this.size === 'large' ) {
    this.enemySprite += '.png';
    for ( var i = 0; i < lengthChars; i++ ) {
      this.playerChars[ i ] += '.png';
      this.playerCharsHurt[ i ] += '.png';
      this.playerCharsHappy[ i ] += '.png';
    }
    for ( i = 0; i < lengthTiles; i++ ) {
      this.mapTiles[ i ] += '.png';
    }
    for ( i = 0; i < lengthOthers; i++ ) {
      this.variousImages[ i ] += '.png';
    }
  } else if ( this.size === 'medium' ) {
    this.tileWidth = 85;
    this.buffer = 42.08;
    this.enemySprite += '-85.png';
    for ( var j = 0; j < lengthChars; j++ ) {
      this.playerChars[ j ] += '-85.png';
      this.playerCharsHurt[ j ] += '-85.png';
      this.playerCharsHappy[ j ] += '-85.png';
    }
    for ( j = 0; j < lengthTiles; j++ ) {
      this.mapTiles[ j ] += '-85.png';
    }
    for ( j = 0; j < lengthOthers; j++ ) {
      this.variousImages[ j ] += '-85.png';
    }
  } else if ( this.size === 'small' ) {
    this.tileWidth = 65;
    this.buffer = 32.18;
    this.enemySprite += '-65.png';
    for ( k = 0; k < lengthChars; k++ ) {
      this.playerChars[ k ] += '-65.png';
      this.playerCharsHurt[ k ] += '-65.png';
      this.playerCharsHappy[ k ] += '-65.png';
    }
    for ( k = 0; k < lengthTiles; k++ ) {
      this.mapTiles[ k ] += '-65.png';
    }
    for ( k = 0; k < lengthOthers; k++ ) {
      this.variousImages[ k ] += '-65.png';
    }
  } else if ( this.size === 'tiny' ) {
    this.tileWidth = 50;
    this.buffer = 24.75;
    this.enemySprite += '-50.png';
    for ( m = 0; m < lengthChars; m++ ) {
      this.playerChars[ m ] += '-50.png';
      this.playerCharsHurt[ m ] += '-50.png';
      this.playerCharsHappy[ m ] += '-50.png';
    }
    for ( m = 0; m < lengthTiles; m++ ) {
      this.mapTiles[ m ] += '-50.png';
    }
    for ( m = 0; m < lengthOthers; m++ ) {
      this.variousImages[ m ] += '-50.png';
    }
  }
  this.tileHeight = this.tileWidth * 0.821782178;
  this.rowImages = [];
  this.totalWidth = this.tileWidth * this.numColumns;
  this.totalHeight = this.tileHeight * ( this.numRows + 1 );
};



// Enemies the player must avoid
var Enemy = function() {

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = map.enemySprite;
  // Random value for the start of any given enemy
  this.x = this.startX();
  // Random column
  this.y = this.startY();
  this.speed = this.newSpeed();
  // If 1, the enemies are moving, if 0, they are not,
  // see Enemy.prototype.togglePause() This function allows the pause to work.
  this.moving = 1;
};

// Generate a start position for each enemy
Enemy.prototype.startX = function() {
  return Math.random() * map.totalWidth * 1.0;
};

// Random value from array courtesy of:
// http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
Enemy.prototype.startY = function() {
  // Picks one of the first 5 rows which enemies can use.
  var result = map.yValues[ map.enemyRows[ Math.floor( Math.random() * map.enemyRows.length ) ] ];
  return result;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function( dt ) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers. this.moving is changed to 0 when the game is paused.
  this.x = this.x + this.speed * dt * this.moving;
  // Reset enemies to the left side of the screen when they are offscreen right.
  if ( this.x > map.totalWidth + 100 ) {
    this.x = -100;
    this.y = this.startY();
    // Change speed of the enemy for the next loop
    this.speed = this.newSpeed();
  }
};

// Generate a random, appropriate speed for each enemy
Enemy.prototype.newSpeed = function() {
  return map.tileWidth / 2 + ( Math.random() * map.tileWidth * 3 );
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  if ( player.charSelected === true ) {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
  }
};

Enemy.prototype.togglePause = function() {
  if ( this.moving === 1 ) {
    // this.moving gets multiplied by the speed of each bug to determine whether
    // an enemy is moving or not.
    this.moving = 0;
  } else {
    this.moving = 1;
  }
};

var Player = function() {
  this.sprite = '';
  // this.x, this.y, this.xCoord and this.yCoord are all generated for the first
  // time in Player.prototype.handleInput() when a player picks a character
  this.x = 0;
  this.y = 0;
  // xCoord and yCoord are to do with the dynamically generated grid system
  // which Player uses to move around the game map.
  this.xCoord = 0;
  this.yCoord = 0;
  // numEnemies is generated at the bottom of app.js and is used in the
  // evaluation of colissions to cheapen the cost of the operation slightly.
  this.numEnemies = 0;
  this.paused = false;
  this.victory = false;
  this.isHit = false;
  this.isDead = false;
  this.livesLeft = 5;
  // This value is used in anchoring the victory jumps the player does
  this.victorySpot = 0;
  // This is used to help guide the victory jumps as they loop in
  // Player.prototype.update()
  this.movingUp = true;

  // game begins when this is true
  this.charSelected = false;
  // selectX and selectY control the position of the character selection box,
  // this.x and this.y couldn't be used to due to possible collisions with
  // enemies whose position values are already generated when the selection
  // screen comes up.
  this.selectX = map.totalWidth / 2 - 260;
  this.selectY = ( map.totalHeight / 2 ) + 50;
  // This selects which value from the above three arrays is used by handleInput
  this.selection = 0;
  // The following three arrays all get used through
  // Player.prototype.handleInput to choose the correct player.sprite
  this.charOptions = map.playerChars;
  this.charHappy = map.playerCharsHappy;
  this.charHurt = map.playerCharsHurt;

  // Countdown timer for each round
  this.timeLeft = 60;
  this.timeKeeper = 60;
  this.counting = false;

  this.points = 0;
};

// Until the player has selected a character, this gets rendered over the game
Player.prototype.character = function() {
  var length = this.charOptions.length,
    position = map.totalWidth / 2 - 260;
  // Change stroke and fillStyles
  this.bwMsgStyle();
  ctx.fillText( 'Select a character', map.totalWidth / 2, map.totalHeight / 2 );
  ctx.strokeText( 'Select a character', map.totalWidth / 2, map.totalHeight / 2 );
  ctx.fillText( 'Press enter to choose', map.totalWidth / 2, ( map.totalHeight / 2 ) + 190 );
  ctx.strokeText( 'Press enter to choose', map.totalWidth / 2, ( map.totalHeight / 2 ) + 190 );
  // Box to contain the characters
  ctx.fillStyle = 'silver';
  ctx.fillRect( 0, map.totalHeight / 2, map.totalWidth, 140 );
  ctx.strokeRect( 0, map.totalHeight / 2, map.totalWidth, 140 );
  // Box to indicate which character is being selected
  ctx.drawImage( Resources.get( map.variousImages[ 0 ] ), this.selectX, this.selectY );
  // Draw all of the characters so user can see which one is being selected
  for ( var i = 0; i < length; i++ ) {
    ctx.drawImage( Resources.get( this.charOptions[ i ] ), position, map.totalHeight / 2 );
    // spread the characters out evenly
    position = position + 112;
  }
};

// This gets run for every frame of the game
Player.prototype.update = function( dt ) {
  if (this.counting === true){
    this.timeKeeper -= dt;
    this.timeLeft = Math.round(this.timeKeeper);
  } if (this.paused === false && this.charSelected === true){
    this.counting = true;
  } if (this.paused === true){
    this.counting = false;
  }
  // Holds current positions of all enemies
  var currentSpots = [];
  for ( var i = 0; i < this.numEnemies; i++ ) {
    var x = allEnemies[ i ].x;
    var y = allEnemies[ i ].y;
    currentSpots.push( [ x, y ] );
  }
  // Check to see if the player is close enough to any of the enemies to
  // trigger a colission
  for ( var b = 0; b < this.numEnemies; b++ ) {
    if ( ( this.x - map.tileWidth / 2 < currentSpots[ b ][ 0 ] &&
        this.x + map.tileWidth / 2 > currentSpots[ b ][ 0 ] ) &&
      ( this.y - map.tileHeight / 8 < currentSpots[ b ][ 1 ] &&
        this.y + map.tileHeight / 8 > currentSpots[ b ][ 1 ] ) ) {
      // Collision detected:
      this.hit();
    }
  }
  // If player reached the end objective, character does a little bounce,
  // this.victorySpot is determined when the player reaches the objective and
  // doesn't get changed by the loop
  if ( this.victory === true ) {
    this.victoryBounce( this.victorySpot, dt );
  }
};

// Moves player.sprite to the current grid coordinates which get updated by
// Player.prototype.handleInput()
Player.prototype.move = function() {
  var coordArray = map.giveCoordinates( this.xCoord, this.yCoord );
  this.x = coordArray[ 0 ];
  this.y = coordArray[ 1 ];
};

Player.prototype.resetStart = function() {
  // Resets the player.sprite to the starting position near the bottom centre
  // part of the screen:
  this.xCoord = Math.floor( map.numColumns / 2 );
  this.yCoord = map.numRows - 2;
  this.move();

  this.timeLeft = 60;
  this.timeKeeper = 60;
};

// Draws each frame.
Player.prototype.render = function() {
  // Show character selection at start of game
  if ( this.charSelected === false ) {
    this.character();
  }
  // Draw current position of appropriate player.sprite
  if ( this.charSelected === true ) {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
    this.displayTimer();
    this.displayPoints();
    this.displayHearts();
  }
  if ( this.victory === true ) {
    // Show appropriate messages for victory
    Player.prototype.victory();
  } else if ( this.victory === false && this.paused === true &&
    this.isHit === false && this.isDead === false ) {
    // If the game is paused due to pressing pause button, show pause message
    Player.prototype.pauseMessage();
  } else if ( this.isHit === true ) {
    this.hitMessage();
    this.hitOverlay();
  } else if ( this.isDead === true ) {
    this.deadOverlay();
    this.deadMessage();
  }
};

Player.prototype.victory = function() {
  Player.prototype.victoryMessage();
  Player.prototype.continueMessage();
};

Player.prototype.victoryMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'lime';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'You win!', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'You win!', canvas.width / 2, canvas.height / 2 );
};

Player.prototype.continueMessage = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'Press enter to continue', canvas.width / 2, canvas.height - 60 );
  ctx.strokeText( 'Press enter to continue', canvas.width / 2, canvas.height - 60 );
};

Player.prototype.playAgainMessage = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'Press enter to play again!', canvas.width / 2, canvas.height - 60 );
  ctx.strokeText( 'Press enter to play again!', canvas.width / 2, canvas.height - 60 );
};

Player.prototype.bwMsgStyle = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
};

Player.prototype.pauseMessage = function() {
  this.bwMsgStyle();
  ctx.fillText( 'Press "p" to unpause', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'Press "p" to unpause', canvas.width / 2, canvas.height / 2 );
};

Player.prototype.hitMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'red';
  ctx.fillText( 'You got hit!', canvas.width / 2, canvas.height - 140 );
  ctx.strokeText( 'You got hit!', canvas.width / 2, canvas.height - 140 );
  Player.prototype.continueMessage();
};

Player.prototype.deadMessage = function() {
  ctx.font = '64px Impact';
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'red';
  ctx.fillText( 'Game over!', canvas.width / 2, canvas.height - 140 );
  ctx.strokeText( 'Game over!', canvas.width / 2, canvas.height - 140 );
  Player.prototype.continueMessage();
};

Player.prototype.togglePause = function() {
  // Pause all enemies:
  for ( var i = 0; i < this.numEnemies; i++ ) {
    allEnemies[ i ].togglePause();
  }
  // Causes this.render to show pause message:
  this.paused = !this.paused;
};

Player.prototype.hit = function() {
  if ( this.paused === false ) {
    // Pause all enemies:
    for ( var i = 0; i < this.numEnemies; i++ ) {
      allEnemies[ i ].togglePause();
    }
    this.paused = true;
    // Allows user to reset game using enter button through this.handleInput
    this.isHit = true;
    // Change to dead sprite
    this.sprite = this.charHurt[ this.selection ];
    // Reduce lives:
    this.livesLeft--;
    if ( this.livesLeft < 1 ) {
      this.isDead = true;
      this.isHit = false;
    }
  }
};

Player.prototype.displayHearts = function() {
  var position = 10;
  for ( var i = 0; i < this.livesLeft; i++ ) {
    ctx.drawImage( Resources.get( map.variousImages[ 4 ] ), position, 10 );
    position += map.tileWidth;
  }
};

Player.prototype.displayTimer = function() {
  this.bwMsgStyle();
  ctx.textAlign = 'right';
  ctx.fillText(this.timeLeft, map.totalWidth - 5, 50);
  ctx.strokeText(this.timeLeft, map.totalWidth - 5, 50);
  ctx.textAlign = 'center';
};

Player.prototype.displayPoints = function() {
  this.bwMsgStyle();
  ctx.textAlign = 'right';
  ctx.drawImage(Resources.get(map.variousImages[1]), map.totalWidth - map.tileWidth, 52 );
  ctx.fillText(this.points, map.totalWidth - (5 + map.tileWidth), 100);
  ctx.strokeText(this.points, map.totalWidth - (5 + map.tileWidth), 100);
  ctx.textAlign = 'center';
};

// Display red see-through overlay over player when player is hit:
Player.prototype.hitOverlay = function() {
  // Center gradient around current position of player:
  var grd = ctx.createRadialGradient( this.x + map.tileWidth / 2,
    this.y + map.tileWidth, map.tileWidth / 2, this.x + map.tileWidth / 2,
    this.y + map.tileWidth, map.tileWidth );

  // Fade gradient to completely see through away from the player:
  grd.addColorStop( 0, 'rgba(255, 0, 0, 0.4)' );
  grd.addColorStop( 1, "rgba(255, 0, 0, 0)" );

  // Overlay is a circle:
  ctx.arc( this.x, this.y + map.tileWidth / 2, map.tileWidth * 3, 0, 2 * Math.PI );
  ctx.fillStyle = grd;
  ctx.fill();
};

Player.prototype.deadOverlay = function() {
  ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
  ctx.fillRect( 0, map.buffer + 2 * map.tileHeight, map.totalWidth, map.totalHeight );
};

// player.sprite jumps up and down upon crossing the map:
Player.prototype.victoryBounce = function( startingY, dt ) {
  // Height of jumps is determined by the height of the tiles for easy scaling:
  var height = map.tileHeight / 4;
  // Will be moving up if below the highest point and is currently in ascend
  if ( this.y > startingY - height && this.movingUp === true ) {
    // map.tileWidth here is used as a basis for a time measurement so that
    // the game scales appropriately when bigger maps are used.
    this.y = this.y - map.tileWidth * dt;
  } else if ( this.y < startingY ) {
    // Move down
    this.movingUp = false;
    this.y = this.y + map.tileWidth * dt;
  } else {
    // player.sprite is assumed to have reached starting position:
    this.movingUp = true;
  }
};

Player.prototype.handleInput = function( input ) {
  // Character-selection screen controls
  if ( this.charSelected === false ) {
    if ( input === 'left' ) {
      // Leftmost selection:
      if ( this.selection === 0 ) {
        // Skip to rightmost character.
        this.selectX = this.selectX + ( this.charOptions.length - 1 ) * 112;
        this.selection = this.charOptions.length - 1;
      } else {
        // Move selection left:
        this.selectX = this.selectX - 112;
        this.selection--;
      }
    } else if ( input === 'right' ) {
      // Rightmost selection:
      if ( this.selection === this.charOptions.length - 1 ) {
        // Skip to leftmost character.
        this.selectX = this.selectX - ( this.charOptions.length - 1 ) * 112;
        this.selection = 0;
      } else {
        // Move selection right:
        this.selectX = this.selectX + 112;
        this.selection++;
      }
    } else if ( input === 'enter' ) {
      // Choose character
      this.charSelected = true;
      this.sprite = this.charOptions[ this.selection ];
      this.resetStart();
    }
  }
  // Controls only work when game isn't paused
  else if ( this.charSelected === true && this.paused === false ) {
    if ( input === 'left' ) {
      // Leftmost position:
      if ( this.xCoord === 0 ) {
        // Move to rightmost tile:
        this.xCoord = map.numColumns - 1;
      } else {
        // Move left:
        this.xCoord--;
      }
    } else if ( input === 'up' ) {
      // Going to the top of the game field results in a victory:
      if ( this.yCoord === 2 ) {
        this.victory = true;
        this.victorySpot = this.y;
        this.sprite = this.charHappy[ this.selection ];
        this.points = this.points + 100 + (this.timeLeft * 10);
        this.togglePause();
      } else {
        // Move up:
        this.yCoord--;
      }
    } else if ( input === 'right' ) {
      // Rightmost position:
      if ( this.xCoord === map.numColumns - 1 ) {
        // Move to leftmost tile:
        this.xCoord = 0;
      } else {
        // Move right:
        this.xCoord++;
      }
    } else if ( input === 'down' ) {
      // Bottom-most position:
      if ( this.yCoord === map.numRows - 2 ) {
        return;
      } else {
        // Move down:
        this.yCoord++;
      }
    } else if ( input === 'pause' ) {
      this.togglePause();
    }
    // Handles the move for all the possible changes in the if statements above:
    this.move();
  }
  // If the game is paused, only the unpause button will work:
  else if ( this.paused === true && this.victory === false &&
    this.isHit === false && this.isDead === false) {
    if ( input === 'pause' ) {
      this.togglePause();
    }
  } // 'enter' can be used to reset the game:
  else if ( this.victory === true || this.isHit === true || this.isDead === true ) {
    if ( input === 'enter' ) {
      if ( this.isDead === true ) {
        this.isDead = false;
        this.points = 0;
        this.livesLeft = 5;
      }
      this.victory = false;
      this.isHit = false;
      this.togglePause();
      // Back to starting position of game:
      this.sprite = this.charOptions[ this.selection ];
      this.resetStart();
    }
  }
};

// Instantiation of all objects:

var map = new Map();
// Determine which sprites and tile sizes to use:
map.findImages();
// Load correct tile images for each row:
map.makeRows( map.numRows );
// Determine which rows enemies can use:
map.findEnemyRows();
// Generate coordinate system for Player.prototyle.handleInput() to use:
map.makeCoordinates();

var player = new Player();

var allEnemies = [];
//Pick number of enemies
var enemyCount = function( count ) {
  for ( var i = 0; i < count; i++ ) {
    allEnemies.push( new Enemy() );
  }
  // Used in evaluating whether colissions occur:
  player.numEnemies = count;
};

enemyCount( 40 );


// This listens for key presses and sends the keys to the Player.handleInput()
// method:
document.addEventListener( 'keyup', function( e ) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'enter',
    80: 'pause',
    19: 'pause'
  };

  player.handleInput( allowedKeys[ e.keyCode ] );
} );

// TODO: signifiers for pause button
// TODO: menu
// TODO: Add nextsteps.txt features
