var Map = function() {
  // These values are used to determine many other distances in the script, but
  // they should not be changed unless the Map.rowImages .pngs are changed too
  this.tileWidth = 101;
  this.tileHeight = 83;
  // The number of columns can be changed to widen or compress the playing field
  this.numColumns = 15;
  // Changing numRows requires items to be added to the rowImages array below
  this.numRows = 7;
  this.rowImages = [
    'images/water-block.png', // Top row is water
    'images/stone-block.png', // Row 1 of 5 of stone
    'images/stone-block.png', // Row 2 of 5 of stone
    'images/stone-block.png', // Row 3 of 5 of stone
    'images/stone-block.png', // Row 4 of 5 of stone
    'images/stone-block.png', // Row 5 of 5 of stone
    'images/grass-block.png' // Row 2 of 2 of grass
  ];
  // Determines size of canvase in engine.js
  this.totalWidth = this.tileWidth * this.numColumns;
  this.totalHeight = this.tileHeight * ( this.numRows + 1 );
  // xValues and yValues get generated at the bottom of app.js using
  // Map.makeCoordinates. This allows for different numbers of rows and columns
  // to work.
  this.xValues = {};
  this.yValues = {};
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
  for ( var i = 0; i < this.numColumns; i++ ){
    this.xValues[i] = this.tileWidth * i;
  }
  for (i = 0; i < this.numRows; i++ ){
    this.yValues[i] = 50 + this.tileHeight * i;
  }
};

// Enemies our player must avoid
var Enemy = function() {

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
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
  var options = [ 0, 1, 2, 3, 4 ];
  // Picks one of the first 5 rows which enemies can use.
  var result = map.yValues[ options[ Math.floor( Math.random() * options.length ) ] ];
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

// Used in certain conditions where a toggle is not appropriate (due to being
// called within a loop)
Enemy.prototype.pause = function() {
  this.moving = 0;
};

var Player = function() {
  this.sprite = '';
  // game begins when this is true
  this.charSelected = false;
  // selectX and selectY control the position of the character selection box,
  // this.x and this.y couldn't be used to due to possible collisions with
  // enemies whose position values are already generated when the selection
  // screen comes up.
  this.selectX = map.totalWidth / 7;
  this.selectY = (map.totalHeight / 2) + 50;
  // this.x, this.y, this.xCoord and this.yCoord are all generated for the first
  // time in Player.prototype.handleInput() when a player picks a character
  this.x = 0;
  this.y = 0;
  // xCoord and yCoord are to do with the dynamically generated grid system
  // which Player uses to move around the game map.
  this.xCoord = 0;
  this.yCoord = 0;
  this.victory = false;
  // numEnemies is generated at the bottom of app.js and is used in the
  // evaluation of colissions to cheapen the cost of the operation slightly.
  this.numEnemies = 0;
  this.paused = false;
  this.isDead = false;
  // This value is used in anchoring the victory jumps the player does
  this.victorySpot = 0;
  this.movingUp = true;
  this.charOptions = [ 'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ];
  this.charHappy = [ 'images/char-boy-happy.png',
    'images/char-cat-girl-happy.png',
    'images/char-horn-girl-happy.png',
    'images/char-pink-girl-happy.png',
    'images/char-princess-girl-happy.png'
  ];
  this.charHurt = [ 'images/char-boy-hurt.png',
    'images/char-cat-girl-hurt.png',
    'images/char-horn-girl-hurt.png',
    'images/char-pink-girl-hurt.png',
    'images/char-princess-girl-hurt.png',
  ];
  this.selection = 0;
};

Player.prototype.costumes = function() {
  var length = this.charOptions.length,
    position = map.totalWidth / ( length + 2 );
  this.pauseMsgStyle();
  ctx.fillText( 'Select a character', map.totalWidth / 2, map.totalHeight / 2 );
  ctx.strokeText( 'Select a character', map.totalWidth / 2, map.totalHeight / 2 );
  ctx.fillText( 'Press enter to choose', map.totalWidth / 2, ( map.totalHeight / 2 ) + 250 );
  ctx.strokeText( 'Press enter to choose', map.totalWidth / 2, ( map.totalHeight / 2 ) + 250 );
  ctx.fillRect( position - 10, map.totalHeight / 2, (position * (length - 1)) + 125, 200 );
  ctx.strokeRect( position - 10, map.totalHeight / 2, (position * (length - 1)) + 125, 200 );
  ctx.strokeStyle = 'lime';
  ctx.strokeRect( this.selectX, this.selectY, 100, 100 );
  for ( var i = 0; i < length; i++ ) {
    ctx.drawImage( Resources.get( this.charOptions[ i ] ), position, map.totalHeight / 2 );
    position = position + map.totalWidth / ( length + 2 );
  }
};

// Detect collisions
Player.prototype.update = function( dt ) {
  var currentSpots = [];
  for ( var i = 0; i < this.numEnemies; i++ ) {
    var x = allEnemies[ i ].x;
    var y = allEnemies[ i ].y;
    currentSpots.push( [ x, y ] );
  }
  for ( var b = 0; b < this.numEnemies; b++ ) {
    // Collision detected:
    if ( ( this.x - map.tileWidth / 2 < currentSpots[ b ][ 0 ] &&
        this.x + map.tileWidth / 2 > currentSpots[ b ][ 0 ] ) &&
      ( this.y - map.tileHeight / 8 < currentSpots[ b ][ 1 ]  &&
      this.y + map.tileHeight / 8 > currentSpots[ b ][ 1 ]) ) {
      this.dead();
    }
  }
  if ( this.victory === true ) {
    this.victoryBounce( this.victorySpot, dt );
  }
};

Player.prototype.move = function() {
  var coordArray = map.giveCoordinates( this.xCoord, this.yCoord );
  this.x = coordArray[ 0 ];
  this.y = coordArray[ 1 ];
};

Player.prototype.resetStart = function() {
  this.xCoord = Math.floor(map.numColumns/2);
  this.yCoord = map.numRows - 2;
  this.move();
};

Player.prototype.render = function() {
  if ( this.charSelected === false ) {
    this.costumes();
  }
  if ( this.charSelected === true ) {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
  }
  if ( this.victory === true ) {
    Player.prototype.victory();
  } else if ( this.victory === false && this.paused === true && this.isDead === false ) {
    Player.prototype.pauseMessage();
  } else if ( this.isDead === true ) {
    Player.prototype.deadMessage();
    this.deadOverlay();
  }
};

Player.prototype.victory = function() {
  Player.prototype.victoryMessage();
  Player.prototype.playAgainMessage();
};

Player.prototype.victoryMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'lime';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'You win!', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'You win!', canvas.width / 2, canvas.height / 2 );
};

Player.prototype.playAgainMessage = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'Press enter to play again', canvas.width / 2, canvas.height - 60 );
  ctx.strokeText( 'Press enter to play again', canvas.width / 2, canvas.height - 60 );
};

Player.prototype.pauseMsgStyle = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
};

Player.prototype.pauseMessage = function() {
  this.pauseMsgStyle();
  ctx.fillText( 'Press "p" to unpause', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'Press "p" to unpause', canvas.width / 2, canvas.height / 2 );
};

Player.prototype.deadMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'red';
  ctx.fillText( 'You got hit!', canvas.width / 2, canvas.height - 140 );
  ctx.strokeText( 'You got hit!', canvas.width / 2, canvas.height - 140 );
  Player.prototype.playAgainMessage();
};

Player.prototype.togglePause = function() {
  for ( var i = 0; i < this.numEnemies; i++ ) {
    allEnemies[ i ].togglePause();
  }
  // affects what happens in Player.prototype.render
  this.paused = !this.paused;
};

Player.prototype.dead = function() {
  for ( var i = 0; i < this.numEnemies; i++ ) {
    allEnemies[ i ].pause();
  }
  // affects what happens in Player.prototype.render
  this.paused = true;
  // Allows us to reset game using enter button in the handleInput method
  this.isDead = true;
  // Change to dead sprite
  this.sprite = this.charHurt[ this.selection ];
};

Player.prototype.deadOverlay = function() {
  var grd = ctx.createRadialGradient( this.x + map.tileWidth / 2,
    this.y + map.tileWidth, map.tileWidth / 2, this.x + map.tileWidth / 2,
    this.y + map.tileWidth, map.tileWidth );

  grd.addColorStop( 0, 'rgba(255, 0, 0, 0.4)' );
  grd.addColorStop( 1, "rgba(255, 0, 0, 0)" );

  ctx.arc( this.x, this.y + map.tileWidth / 2, map.tileWidth * 3, 0, 2 * Math.PI );
  ctx.fillStyle = grd;
  ctx.fill();
};

Player.prototype.victoryBounce = function( startingY, dt ) {
  var height = map.tileHeight / 4;
  if ( this.y > startingY - height && this.movingUp === true ) {
    // map.tileWidth here is used as a basis for a time measurement to so that
    // the game scales appropriately when bigger maps are used.
    this.y = this.y - map.tileWidth * dt;
  } else if ( this.y < startingY ) {
    this.movingUp = false;
    this.y = this.y + map.tileWidth * dt;
  } else {
    this.movingUp = true;
  }
};

Player.prototype.handleInput = function( input ) {
  // Character selection screen controls
  if ( this.charSelected === false ) {
    if ( input === 'left' ) {
      if ( this.selectX <= map.totalWidth / ( 7 ) ) {
        // Skip to rightmost character.
        this.selectX = this.selectX + 4 * map.totalWidth / ( 7 );
        this.selection = this.charOptions.length - 1;
      } else {
        this.selectX = this.selectX - map.totalWidth / ( 7 );
        this.selection--;
      }
    } else if ( input === 'right' ) {
      if ( this.selectX >= 5 * map.totalWidth / ( 7 ) )  {
        // Skip to leftmost character.
        this.selectX = this.selectX - 4 * map.totalWidth / ( 7 );
        this.selection = 0;
      } else {
        this.selectX = this.selectX + map.totalWidth / ( 7 );
        this.selection++;
      }
    } else if ( input === 'enter' ) {
      this.sprite = this.charOptions[ this.selection ];
      this.resetStart();
      this.charSelected = true;
    }
  } // Controls only work when game isn't paused
  else if ( this.charSelected === true && this.paused === false ) {
    if ( input === 'left' ) {
      if ( this.xCoord === 0 ) {
        this.xCoord = map.numColumns - 1;
      } else {
        this.xCoord--;
      }
    } else if ( input === 'up' ) {
      // going to the top of the game field results in a victory
      if ( this.yCoord === 0 ) {
        this.sprite = this.charHappy[ this.selection ];
        this.victory = true;
        this.togglePause();
        this.victorySpot = this.y;
      } else {
        this.yCoord--;
      }
    } else if ( input === 'right' ) {
      if ( this.xCoord === map.numColumns - 1 ) {
        this.xCoord = 0;
      } else {
        this.xCoord++;
      }
    } else if ( input === 'down' ) {
      if ( this.yCoord === map.numRows - 2 ) {
        return;
      } else {
        this.yCoord++;
      }
    } else if ( input === 'pause' ) {
      this.togglePause();
    }
    // Handles the move for all the possible changes in the if statements above
    this.move();
  }
  // If the game isn't over but is paused, only the unpause button will work
  else if ( this.paused === true && this.victory === false && this.isDead === false ) {
    if ( input === 'pause' ) {
      this.togglePause();
    }
  } // When game is over, 'enter' can be used to reset it
  else if ( this.victory === true || this.isDead === true ) {
    if ( input === 'enter' ) {
      if ( this.victory === true ) {
        // Change back to normal sprite
        this.sprite = this.charOptions[ this.selection ];
        this.victory = false;
        this.resetStart();
        this.togglePause();
      } else if ( this.isDead === true ) {
        this.isDead = false;
        // Change back to normal sprite
        this.sprite = this.charOptions[ this.selection ];
        this.resetStart();
        this.togglePause();
      }
    }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var map = new Map();
map.makeCoordinates();
var player = new Player();

//Pick number of enemies
var enemyCount = function( count ) {
  for ( var i = 0; i < count; i++ ) {
    allEnemies.push( new Enemy() );
  }
  player.numEnemies = count;
};

enemyCount( 10 );


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener( 'keyup', function( e ) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'enter',
    80: 'pause'
  };

  player.handleInput( allowedKeys[ e.keyCode ] );
} );

// refactor dead() from within a loop
