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
  this.numRows = 15;
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
  this.enemyRows = [ 6, 7, 8, 10, 11, 12 ];
  this.variousImages = [
    'images/Selector',
    'images/Star',
    'images/Rock',
    'images/Key',
    'images/Heart',
    'images/corn',
    'images/Blue',
    'images/Green',
    'images/Orange'
  ];
  this.enemySprites = [
    'images/enemy-bug',
    'images/enemy-bug-left'
  ];
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
    'images/grass-block',
    'images/water-block2',
  ];

  this.slowFloaters = 70;
  this.medFloaters = -100;
  this.fastFloaters = 120;

  this.powerUpCount = 0;
  this.powerUpDelay = 500;
  this.powerUpsLeft = 5;
};

Map.prototype.update = function( dt ) {
  //if ( allPowerUps[0] ){
  //  console.log(allPowerUps[0].x);
  //}
  if ( this.powerUpCount === 0 ) {
    // Clean up array
    allPowerUps.length = 0;
  }
  if ( this.powerUpCount < 3 && this.powerUpsLeft > 0 ) {
    if ( this.powerUpDelay > 0 && !player.paused && player.charSelected ) {
      this.powerUpDelay -= dt * 100;
    } else if ( this.powerUpDelay <= 0 && !player.paused ) {
      this.powerUpDelay = 500;
      this.powerUpCount++;
      allPowerUps.push( new Item( 'power' ) );
      this.powerUpsLeft--;
      for ( var i = 0; i < allPowerUps.length; i++ ) {
        if ( allPowerUps[ i ].sprite === map.variousImages[ 3 ] ) {
          allPowerUps[ i ].choose();
        }
      }
    }
  }
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
  this.rowImages.push( map.mapTiles[ 3 ] );
  for ( var i = 1; i < numRows - 3; i++ ) {
    if ( i === 4 || i === 8 ) {
      this.rowImages.push( map.mapTiles[ 3 ] );
    } else if ( i === 1 || i === 2 || i === 3 ) {
      this.rowImages.push( map.mapTiles[ 4 ] );
    } else {
      this.rowImages.push( map.mapTiles[ 2 ] );
    }
  }
  this.rowImages.push( map.mapTiles[ 3 ] );
};

Map.prototype.findImages = function() {
  var lengthChars = this.playerChars.length,
    lengthTiles = this.mapTiles.length,
    lengthOthers = this.variousImages.length,
    lengthEnemies = this.enemySprites.length;
  if ( this.size === 'large' ) {
    for ( var i = 0; i < lengthChars; i++ ) {
      this.playerChars[ i ] += '.png';
      this.playerCharsHurt[ i ] += '.png';
      this.playerCharsHappy[ i ] += '.png';
    }
    for ( i = 0; i < lengthEnemies; i++ ) {
      this.enemySprites[ i ] += '.png';
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
    for ( var j = 0; j < lengthChars; j++ ) {
      this.playerChars[ j ] += '-85.png';
      this.playerCharsHurt[ j ] += '-85.png';
      this.playerCharsHappy[ j ] += '-85.png';
    }
    for ( j = 0; j < lengthEnemies; j++ ) {
      this.enemySprites[ j ] += '-85.png';
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
    for ( k = 0; k < lengthChars; k++ ) {
      this.playerChars[ k ] += '-65.png';
      this.playerCharsHurt[ k ] += '-65.png';
      this.playerCharsHappy[ k ] += '-65.png';
    }
    for ( k = 0; k < lengthEnemies; k++ ) {
      this.enemySprites[ k ] += '-65.png';
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
    for ( m = 0; m < lengthChars; m++ ) {
      this.playerChars[ m ] += '-50.png';
      this.playerCharsHurt[ m ] += '-50.png';
      this.playerCharsHappy[ m ] += '-50.png';
    }
    for ( m = 0; m < lengthEnemies; m++ ) {
      this.enemySprites[ m ] += '-50.png';
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

Map.prototype.canGo = function( newX, newY ) {
  // Player can't walk into rocks:
  if ( ( newY === 9 && newX !== 1 && newX !== 5 && newX !== 9 ) ||
    ( newY === 5 && newX !== 3 && newX !== 7 ) ||
    newY === 0 || newY === map.numRows - 1 ) {
    return false;
  }
  return true;
};

Map.prototype.makeKeys = function() {
  allKeys.length = 0;
  allKeys.push( new Item( 'key', 1 ) );
  allKeys.push( new Item( 'key', 5 ) );
  allKeys.push( new Item( 'key', 9 ) );
};

Map.prototype.keysCollected = function() {
  var win = true;
  for ( var i = 0; i < allKeys.length; i++ ) {
    if ( allKeys[ i ].flying === false ) {
      win = false;
    }
  }
  return win;
};

var Float = function( row, pos, speed ) {
  this.sprite = map.variousImages[ 5 ];
  this.x = pos;
  // Random column
  this.y = this.floatRow( row );
  //this.stockSpeed = speed;
  this.speed = speed;
  // If 1, the floats are moving, if 0, they are not,
  // see Float.prototype.togglePause() This function allows the pause to work.
  this.moving = 1;
};

Float.prototype.update = function( dt ) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers. this.moving is changed to 0 when the game is paused.
  this.x = this.x + this.speed * dt * this.moving;
  // Set floats going in the correct directions:
  /*if ( this.speed === 0 ) {
    if ( this.y === map.yValues[ 2 ] || this.y === map.yValues[ 4 ] ) {
      this.speed = this.stockSpeed;
    } else {
      this.speed = this.stockSpeed * -1;
    }
  }*/
  // Reset floats when they go offscreen:
  if ( this.x > map.totalWidth + ( 2.5 * map.tileWidth ) ||
    this.x < -( 2.5 * map.tileWidth ) ) {
    if ( this.y === map.yValues[ 2 ] || this.y === map.yValues[ 4 ] ) {
      this.x = -1 * ( 2.25 * map.tileWidth );
    } else {
      this.x = map.totalWidth + ( 2.25 * map.tileWidth );
    }
  }
};

Float.prototype.render = function() {
  if ( player.charSelected === true ) {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
  }
};

Float.prototype.floatRow = function( row ) {
  // Picks one of the rows for the float:
  return map.yValues[ row ];
};

Float.prototype.togglePause = function( row ) {
  if ( this.moving === 1 ) {
    // this.moving gets multiplied by the speed of each float to determine
    // whether the float is moving or not:
    this.moving = 0;
  } else {
    this.moving = 1;
  }
};

Float.prototype.blurPause = function() {
  this.moving = 0;
};

var Item = function( type, pos ) {
  this.type = type;
  this.exists = true;
  this.moving = 1;
  this.flying = false;
  this.throwDelay = 30;
  this.movingRight = false;
  this.flyingOffset = ( function offsetter( type ) {
    if ( type === 'key' ) {
      return Math.floor( Math.random() * map.tileWidth * 3 );
    } else {
      return null;
    }
  } )( type );
  this.choice = ( function choiceMaker( type ) {
    if ( type === 'power' ) {
      var options = [ 6, 7, 8 ];
      // Choose a random gem:
      var choice = options[ Math.floor( Math.random() * options.length ) ];
      return choice;
    }
  } )( type );
  this.sprite = map.variousImages[ 3 ];
  this.x = ( function colMaker( type, pos ) {
    var options = [ -100, map.totalWidth + 100 ];
    var choice;
    if ( type === 'key' ) {
      return map.xValues[ pos ];
    } else {
      // powerup start offscreen:
      return options[ Math.floor( Math.random() * 2 ) ];
    }
  } )( type, pos );
  this.y = ( function rowMaker( type ) {
    if ( type === 'key' ) {
      return map.yValues[ 1 ];
    } else {
      return Enemy.prototype.startY();
    }
  } )( type );
  this.speed = ( function speedMaker( type ) {
    if ( type === 'key' ) {
      return null;
    } else {
      return Math.floor( 20 + Math.random() * 15 );
    }
  } )( type );

};

Item.prototype.choose = function() {
  if ( this.type === 'power' ) {
    this.sprite = map.variousImages[ this.choice ];
    if (this.choice === 6){
      this.gem = 'time';
    } else if (this.choice === 7){
      this.gem = 'shield';
    } else if (this.choice === 8){
      this.gem = 'enemy';
    }
  } else if ( this.type === 'enemy' ) {
    this.gem = 'enemy';
    this.sprite = map.variousImages[ 8 ];
  }
};

Item.prototype.update = function( dt ) {
  if ( this.type === 'power' || this.type === 'enemy' ) {
    if (this.x > -50 && this.movingRight === false){
      this.x -= this.moving * this.speed * dt;
    } else if (this.x <= -40 && !this.movingRight){
      this.movingRight = true;
    } else if (this.movingRight && this.x <= map.totalWidth + 50){
      this.x += this.moving * this.speed * dt;
    } else {
      this.movingRight = false;
    }
  }
  if ( this.flying ) {
    if ( this.throwDelay > 0 ) {
      this.throwDelay = this.throwDelay - 100 * dt * this.moving;
    } else {
      if ( this.x < map.xValues[ map.numColumns - 4 ] + this.flyingOffset ) {
        this.x = this.x + 100 * dt *
          // Slow down the x-movement as time goes on for a smoother animation:
          ( map.xValues[ map.numColumns - 2 ] / this.x ) * this.moving;
      }
      if ( this.y < map.yValues[ map.numRows - 2 ] ) {
        this.y = this.y + 300 * dt * this.moving;
      }
    }
  }
};

Item.prototype.render = function() {
  if ( player.charSelected === true ) {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
  }
};


Item.prototype.togglePause = function() {
  if ( this.moving === 1 ) {
    // this.moving gets multiplied by the speed of each bug to determine whether
    // an enemy is moving or not.
    this.moving = 0;
  } else {
    this.moving = 1;
  }
};

Item.prototype.blurPause = function() {
  this.moving = 0;
};

// Enemies the player must avoid
var Enemy = function() {

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = '';
  // Random value for the start of any given enemy
  this.x = this.startX();
  // Random column
  this.y = this.startY();
  this.speed = 0;
  this.boost = 1.0;
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
  // Picks one of the rows which enemies can use.
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
  if ( this.speed === 0 ) {
    if ( this.y === map.yValues[ 10 ] || this.y === map.yValues[ 7 ] ) {
      this.speed = this.newSpeed( 'left' );
      this.sprite = map.enemySprites[ 1 ];
    } else {
      this.speed = this.newSpeed( 'right' );
      this.sprite = map.enemySprites[ 0 ];
    }
  }
  if ( this.x > map.totalWidth + 100 || this.x < -100 ) {
    this.y = this.startY();
    if ( this.y === map.yValues[ 10 ] || this.y === map.yValues[ 7 ] ) {
      this.x = map.totalWidth + 80;
      // Change speed of the enemy for the next loop
      this.speed = this.newSpeed( 'left' );
      this.sprite = map.enemySprites[ 1 ];
    } else {
      this.x = -80;
      // Change speed of the enemy for the next loop
      this.speed = this.newSpeed( 'right' );
      this.sprite = map.enemySprites[ 0 ];
    }
  }
};

// Generate a random, appropriate speed for each enemy
Enemy.prototype.newSpeed = function( direction ) {
  if ( direction === 'right' ) {
    // this.boost is generated when the player picks up orange gems
    return map.tileWidth / 2 + ( Math.random() * map.tileWidth * 3 * this.boost );
  } else if ( direction === 'left' ) {
    return ( map.tileWidth / -2 + ( Math.random() * map.tileWidth * -3 * this.boost ) );
  }
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

Enemy.prototype.blurPause = function() {
  this.moving = 0;
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

  this.paused = false;
  this.victory = false;
  this.justWon = true;
  this.ouch = false;
  this.drowned = false;
  this.isDead = false;
  this.livesLeft = 5;
  // This value is used in anchoring the victory jumps the player does
  this.victorySpot = 0;
  // This is used to help guide the victory jumps as they loop in
  // Player.prototype.update()
  this.movingUp = true;
  // Is the player on a floater?
  this.floating = false;
  this.speed = null;
  this.moving = 1;

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
  this.timeLeft = 30;
  this.timeKeeper = 30;
  this.freeze = 0;
  this.shield = 0;
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
  var numKeys = allKeys.length,
    numEnemies = allEnemies.length,
    numFloats = allFloats.length,
    numPowerUps = allPowerUps.length;

  // Victory conditions:
  if ( map.keysCollected() && allKeys.length === 3 && this.justWon ) {
    this.justWon = false;
    this.victory = true;
    this.victorySpot = this.y;
    this.sprite = this.charHappy[ this.selection ];

    // Check if the countdown timer is still a number and not a string:
    if ( parseInt( Number( this.timeLeft ) ) === this.timeLeft ) {
      this.points = this.points + 100 + ( this.timeLeft * 10 );
    } else {
      this.points = this.points + 100;
    }
    this.togglePause();
  }

  // Pause game if window is not active:
  window.addEventListener( 'blur', function() {
    player.blurPause();
  } );

  // Player is on water floats:
  if ( this.floating && !this.paused ) {
    this.moving = 1;
    // Dynamically update the this.xCoord and this.x values;
    this.trackPosition();
    if ( this.yCoord === 2 ) {
      this.x += this.speed * dt * this.moving;
    } else if ( this.yCoord === 3 ) {
      this.x += this.speed * dt * this.moving;
    } else if ( this.yCoord === 4 ) {
      this.x += this.speed * dt * this.moving;
    }
  }

  // Keep countdown timer going when the game is not paused:
  if ( this.counting === true && !this.paused ) {
    this.timeKeeper -= dt;
    this.timeLeft = Math.round( this.timeKeeper );
  }
  if (this.freeze > 0 && this.counting === true ){
    // freeze all enemies
    this.freeze -= dt;
    for (var t = 0; t < numEnemies;t++){
      allEnemies[t].moving = 0;
    }
    this.paused = false;
  }
  if (this.freeze <= 0 && !this.paused){
    for ( var r = 0; r < numEnemies;r++){
      allEnemies[r].moving = 1;
    }
  }
  if (this.shield > 0){
    this.shield -= dt;
  }
  // Start counting down once a character is selected:
  if ( this.paused === false && this.charSelected === true ) {
    this.counting = true;
  }
  // Stop counting when the game is paused:
  if ( this.paused === true ) {
    this.counting = false;
  }
  if ( this.timeLeft <= 0 ) {
    this.timeLeft = "No bonus!";
  }
  // Holds current positions of all floats:
  var floatSpots = [];
  for ( var i = 0; i < numFloats; i++ ) {
    var x = allFloats[ i ].x;
    var y = allFloats[ i ].y;
    floatSpots.push( [ x, y ] );
  }
  this.floating = false;
  // Check to see if the player has stepped on a float:
  if ( this.yCoord === 2 || this.yCoord === 3 || this.yCoord === 4 &&
    !this.paused ) {
    for ( var b = 0; b < numFloats; b++ ) {
      if ( ( this.x + 30 < floatSpots[ b ][ 0 ] + 2 * map.tileWidth &&
          this.x + 25 > floatSpots[ b ][ 0 ] ) &&
        ( this.y - map.tileHeight / 8 < floatSpots[ b ][ 1 ] &&
          this.y + map.tileHeight / 8 > floatSpots[ b ][ 1 ] ) ) {
        // Floater there:
        this.floating = true;
        this.speed = allFloats[b].speed;
      }
    }
    if ( this.floating === false ) {
      this.drown();
    }
  }
  if ( this.yCoord === 1 && this.xCoord !== 1 && this.xCoord !== 5 &&
    this.xCoord !== 9 ) {
    this.drown();
  }
  // Holds current positions of all keys:
  var keySpots = [];
  for ( i = 0; i < numKeys; i++ ) {
    var xK = allKeys[ i ].x;
    var yK = allKeys[ i ].y;
    keySpots.push( [ xK, yK ] );
  }
  // Check to see if the player is close enough to any of the keys to
  // pick them up:
  for ( var p = 0; p < numKeys; p++ ) {
    if ( ( this.x - map.tileWidth / 2 < keySpots[ p ][ 0 ] &&
        this.x + map.tileWidth / 2 > keySpots[ p ][ 0 ] ) &&
      ( this.y - map.tileHeight / 8 < keySpots[ p ][ 1 ] &&
        this.y + map.tileHeight / 8 > keySpots[ p ][ 1 ] ) ) {
      // Key picked up:
      if (allKeys[p].flying === false){
        player.points += 50;
      }
      allKeys[ p ].flying = true;
    }
  }
  // Holds current positions of all powerUps:
  var powerSpots = [];
  for ( i = 0; i < numPowerUps; i++ ) {
    var xP = allPowerUps[ i ].x;
    var yP = allPowerUps[ i ].y;
    powerSpots.push( [ xP, yP ] );
  }
  // Check to see if the player is close enough to any of the enemies to
  // trigger a colission
  for ( p = 0; p < numPowerUps; p++ ) {
    if ( ( this.x - map.tileWidth / 2 < powerSpots[ p ][ 0 ] &&
        this.x + map.tileWidth / 2 > powerSpots[ p ][ 0 ] ) &&
      ( this.y - map.tileHeight / 8 < powerSpots[ p ][ 1 ] &&
        this.y + map.tileHeight / 8 > powerSpots[ p ][ 1 ] ) ) {
      // Collision detected:
      this.pickUp(allPowerUps[p]);
    }
  }
  // Holds current positions of all enemies:
  var enemySpots = [];
  for ( i = 0; i < numEnemies; i++ ) {
    var xE = allEnemies[ i ].x;
    var yE = allEnemies[ i ].y;
    enemySpots.push( [ xE, yE ] );
  }
  // Check to see if the player is close enough to any of the enemies to
  // trigger a colission
  for ( var k = 0; k < numEnemies; k++ ) {
    if ( ( this.x - map.tileWidth / 2 < enemySpots[ k ][ 0 ] &&
        this.x + map.tileWidth / 2 > enemySpots[ k ][ 0 ] ) &&
      ( this.y - map.tileHeight / 8 < enemySpots[ k ][ 1 ] &&
        this.y + map.tileHeight / 8 > enemySpots[ k ][ 1 ] ) ) {
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

Player.prototype.trackPosition = function() {
  for ( var i = 0; i < ( map.numColumns - 1 ); i++ ) {
    if ( this.x > map.xValues[ i ] - 25 && this.x < map.xValues[ i + 1 ] - 25 ) {
      this.xCoord = i;
    }
  }
};

// Moves player.sprite to the current grid coordinates which get updated by
// Player.prototype.handleInput()
Player.prototype.move = function() {
  var coordArray = map.giveCoordinates( this.xCoord, this.yCoord );
  this.x = coordArray[ 0 ];
  this.y = coordArray[ 1 ];
};

// Less frustrating way of moving on the water:
Player.prototype.waterMove = function( direc ) {
  if ( direc === 'left' ) {
    this.x = this.x - map.tileWidth;
  } else if ( direc === 'right' ) {
    this.x = this.x + map.tileWidth;
  } else if ( direc === 'up' ) {
    this.y = this.y - map.tileHeight;
  } else if ( direc === 'down' ) {
    this.y = this.y + map.tileHeight;
  }
};

Player.prototype.resetStart = function() {
  // Resets the player.sprite to the starting position near the bottom centre
  // part of the screen:
  this.xCoord = Math.floor( map.numColumns / 2 );
  this.yCoord = map.numRows - 2;
  this.move();

  this.timeLeft = 30;
  this.timeKeeper = 30;
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
    this.ouch === false && this.isDead === false ) {
    // If the game is paused due to pressing pause button, show pause message
    Player.prototype.pauseMessage();
  } else if ( this.drowned === true ) {
    this.drownMessage();
  } else if ( this.ouch === true ) {
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

  ctx.fillText( 'Good job!', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'Good job!', canvas.width / 2, canvas.height / 2 );
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

Player.prototype.drownMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'red';
  ctx.fillText( 'You can\'t swim!', canvas.width / 2, canvas.height - 140 );
  ctx.strokeText( 'You can\'t swim!', canvas.width / 2, canvas.height - 140 );
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
  var numEnemies = allEnemies.length,
    numFloats = allFloats.length,
    numPowerUps = allPowerUps.length;
  // Pause all enemies:
  for ( var i = 0; i < numEnemies; i++ ) {
    allEnemies[ i ].togglePause();
  }
  for ( i = 0; i < numFloats; i++ ) {
    allFloats[ i ].togglePause();
  }
  for ( i = 0; i < numPowerUps; i++ ) {
    allPowerUps[ i ].togglePause();
  }
  this.paused = !this.paused;
  if ( this.moving === 1 ) {
    this.moving = 0;
  } else {
    this.moving = 1;
  }
};

Player.prototype.blurPause = function() {
  var numEnemies = allEnemies.length,
    numFloats = allFloats.length,
    numPowerUps = allPowerUps.length;
  // Pause all enemies:
  for ( var i = 0; i < numEnemies; i++ ) {
    allEnemies[ i ].blurPause();
  }
  for ( i = 0; i < numFloats; i++ ) {
    allFloats[ i ].blurPause();
  }
  for ( i = 0; i < numPowerUps; i++ ) {
    allPowerUps[ i ].blurPause();
  }
  this.paused = true;
  this.moving = 0;
};

Player.prototype.pickUp = function(power){
  if (power.gem === 'enemy'){
    this.gemEnemy();
  } else if (power.gem === 'time') {
    this.gemTime();
  }else if (power.gem === 'shield') {
    this.gemShield();
  }
  this.points += 100;
  map.powerUpCount--;
  // Remove powerUp from array of powerUps
  var index = allPowerUps.indexOf(power);
  allPowerUps.splice(index, 1);
};

Player.prototype.gemEnemy = function (){
  this.points += 50;
  var numEnemies = allEnemies.length,
  numFloats = allFloats.length;
  for (var i=0;i<numEnemies;i++){
    allEnemies[i].speed *= 1.1;
    allEnemies[i].boost += 0.1;
  }
  for (i=0;i<numFloats;i++){
    allFloats[i].speed *= 1.05;
    map.slowFloaters *= 1.05;
    map.medFloaters *= 1.05;
    map.fastFloaters *= 1.05;
  }
};

Player.prototype.gemTime = function() {
  if (this.timeLeft === "No bonus!"){
    this.timeLeft = 10;
    this.timeKeeper = 10;
  } else {
    this.timeLeft += 10;
    this.timeKeeper += 10;
  } this.freeze = 5;
};

Player.prototype.gemShield = function() {
  this.shield = 5;
};

Player.prototype.hit = function() {
  if ( this.paused === false && this.shield <= 0 ) {
    this.freeze = 0;
    this.blurPause();
    // Allows user to reset game using enter button through this.handleInput
    this.ouch = true;
    // Change to dead sprite
    this.sprite = this.charHurt[ this.selection ];
    // Reduce lives:
    this.livesLeft--;
    if ( this.livesLeft < 1 ) {
      this.isDead = true;
      this.ouch = false;
    }
  }
};

Player.prototype.drown = function() {
  if ( this.paused === false ) {
    this.blurPause();
    this.drowned = true;
    // Allows user to reset game using enter button through this.handleInput
    this.ouch = true;
    // Change to dead sprite
    this.sprite = this.charHurt[ this.selection ];
    // Reduce lives:
    this.livesLeft--;
    if ( this.livesLeft < 1 ) {
      this.isDead = true;
      this.ouch = false;
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
  ctx.fillText( this.timeLeft, map.totalWidth - 5, 50 );
  ctx.strokeText( this.timeLeft, map.totalWidth - 5, 50 );
  ctx.textAlign = 'center';
};

Player.prototype.displayPoints = function() {
  this.bwMsgStyle();
  ctx.textAlign = 'right';
  ctx.drawImage( Resources.get( map.variousImages[ 1 ] ), map.totalWidth - map.tileWidth, 52 );
  ctx.fillText( this.points, map.totalWidth - ( 5 + map.tileWidth ), 100 );
  ctx.strokeText( this.points, map.totalWidth - ( 5 + map.tileWidth ), 100 );
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
      map.makeKeys();
    }
  }
  // Controls only work when game isn't paused
  else if ( this.charSelected === true && this.paused === false ) {

    if ( input === 'left' ) {
      // If on water, just move a tile width over, don't use coordinates:
      if ( this.floating ) {
        this.waterMove( 'left' );
        return;
      } // Leftmost position:
      if ( this.xCoord === 0 ) {
        // Move to rightmost tile:
        this.xCoord = map.numColumns - 1;
      } else {
        // Check if the tile is available:
        if ( map.canGo( ( this.xCoord - 1 ), this.yCoord ) ) {
          // Move left:
          this.xCoord--;
        }
      }
    } else if ( input === 'up' ) {
      /*{
            // Going up having selected the final key results in a victory:
            if ( map.keysCollected() ) {
              this.victory = true;
              this.victorySpot = this.y;
              this.sprite = this.charHappy[ this.selection ];
              addEnemies( 5 );
              // Check if the countdown timer is still a number and not a string:
              if ( parseInt( Number( this.timeLeft ) ) === this.timeLeft ) {
                this.points = this.points + 100 + ( this.timeLeft * 10 );
              } else {
                this.points = this.points + 100;
              }
              this.togglePause(); }*/
      // Check if the tile is available:
      if ( map.canGo( this.xCoord, this.yCoord - 1 ) ) {
        // Move up:
        this.yCoord--;
        // Avoid coordinates:
        if ( this.floating && this.yCoord !== 1 ) {
          this.waterMove( 'up' );
          return;
        }
      }
    } else if ( input === 'right' ) {
      // If on water, just move a tile width over, don't use coordinates:
      if ( this.floating ) {
        this.waterMove( 'right' );
        return;
      } // Rightmost position:
      if ( this.xCoord === map.numColumns - 1 ) {
        // Move to leftmost tile:
        this.xCoord = 0;
      } else {
        // Check if the tile is available:
        if ( map.canGo( this.xCoord + 1, this.yCoord ) ) {
          // Move right:
          this.xCoord++;
        }
      }
    } else if ( input === 'down' ) {
      // Check if the tile is available:
      if ( map.canGo( this.xCoord, this.yCoord + 1 ) ) {
        // Move down:
        this.yCoord++;
        if ( this.floating ) {
          this.waterMove( 'down' );
          return;
        }
      }
    } else if ( input === 'pause' ) {
      this.togglePause();
      return;
    }


    // Handles the move for all the possible changes in the if statements above:
    this.move();
  }
  // If the game is paused, only the unpause button will work:
  else if ( this.paused === true && this.victory === false &&
    this.ouch === false && this.isDead === false ) {
    if ( input === 'pause' ) {
      this.togglePause();
    }
  } // 'enter' can be used to reset the game:
  else if ( this.victory === true || this.ouch === true || this.isDead === true ||
    this.drowned === true ) {
    if ( input === 'enter' ) {
      if ( this.isDead === true ) {
        this.isDead = false;
        this.points = 0;
        this.livesLeft = 5;
        map.powerUpCount = 0;
        map.powerUpsLeft = 5;
        allPowerUps.length = 0;
        map.makeKeys();
        setEnemies( 15 );
        // Pause the enemies only, so that the new ones generated don't begin
        // the next game paused:
        this.blurPause();
      } else if ( this.victory === true ) {
        this.victory = false;
        this.justWon = true;
        map.makeKeys();
        addEnemies( 5 );
        map.powerUpsLeft = 5;
        this.blurPause();
      }
      this.ouch = false;
      this.drowned = false;
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
// Generate coordinate system for Player.prototyle.handleInput() to use:
map.makeCoordinates();

var player = new Player();

var allEnemies = [];
var allFloats = [];
var allKeys = [];
var allPowerUps = [];

function addEnemies( count ) {
  for ( var i = 0; i < count; i++ ) {
    allEnemies.push( new Enemy() );
  }
}

function addFloats() {
  // Add first row of floats:
  for ( var i = 0; i < 3; i++ ) {
    allFloats.push( new Float( 2, map.tileWidth * 3.5 * i, map.slowFloaters ) );
  } // Add second row of floats:
  for ( i = 0; i < 4; i++ ) {
    allFloats.push( new Float( 3, map.tileWidth * 4 * i, map.medFloaters ) );
  } // Add third row of floats:
  for ( i = 0; i < 3; i++ ) {
    allFloats.push( new Float( 4, map.tileWidth * 4.5 * i, map.fastFloaters ) );
  }
}

function setEnemies( count ) {
  allEnemies.length = 0;
  addEnemies( count );
}
// Pick a number of enemies:
addEnemies( 15 );

// Generate floats:
addFloats();


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



// TODO: Add nextsteps.txt features

// TODO: Add powerups, ex. time stop, take extra hit powerup,
// TODO: Add negative powerup that increases enemy speeds
// TODO: Change sprites to make a unique look

// TODO: signifier for pause button
// TODO: menu
// TODO: Refactor everything, particularly methods belonging to Float, Enemy and
// Item
// TODO: Explain controls
// TODO: Update player.numPowerUps
// TODO: Pause key when it is flying

// TODO: Signifier for shiled and time and enemy gems (really important)
// for shield the signifier should be a shield (protoss style) sprite change
