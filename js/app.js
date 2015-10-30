// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = Enemy.prototype.startX();
  this.y = Enemy.prototype.startY();
  this.speed = Enemy.prototype.speed();
  // If 1, the enemies are moving, if 0, they are not,
  // see Enemy.prototype.togglePause()
  this.moving = 1;
};

// Generate a start position for each enemy, slightly less than width of canvas
// which is 505.
Enemy.prototype.startX = function() {
  return Math.random() * 450;
};

// Appropriate start position are at 56 + n83, where n == 0, 1, or 2.
// Random value from array courtesy of:
// http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
Enemy.prototype.startY = function() {
  var options = [ 0, 1, 2 ];
  var result = 56 + 83 * options[ Math.floor( Math.random() * options.length ) ];
  return result;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function( dt ) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt * this.moving;
  if ( this.x > 600 ) {
    this.x = -150;
    this.y = Enemy.prototype.startY();
    this.speed = Enemy.prototype.speed();
  }
};

// Generate a random, appropriate speed for each bug
Enemy.prototype.speed = function() {
  return 100 + ( Math.random() * 200 );
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

Enemy.prototype.togglePause = function() {
  if ( this.moving === 1 ) {
    this.moving = 0;
  } else {
    this.moving = 1;
  }
};

Enemy.prototype.pause = function() {
  this.moving = 0;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 300;
  this.y = 388;
  this.victory = false;
  this.numEnemies = 0;
  this.paused = false;
  this.isDead = false;
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
    if ( ( this.x - 50 < currentSpots[ b ][ 0 ] && this.x + 50 > currentSpots[ b ][ 0 ] ) &&
      ( this.y - 10 < currentSpots[ b ][ 1 ] && this.y + 10 > currentSpots[ b ][ 1 ] ) ) {
      this.dead();
    }
  }
};

Player.prototype.render = function() {
  ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
  if ( this.victory === true ) {
    Player.prototype.victory();
  } else if ( this.victory === false && this.paused === true && this.isDead === false){
    Player.prototype.pauseMessage();
  } else if ( this.isDead === true ){
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

Player.prototype.pauseMessage = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
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
  this.isDead = true;
};

Player.prototype.deadOverlay = function() {
  var grd=ctx.createRadialGradient(this.x + 50, this.y + 100, 50, this.x + 50, this.y + 100, 105);

  //grd.addColorStop(1,'white');
  //grd.addColorStop(0,"red");
  grd.addColorStop(0,'rgba(255, 0, 0, 0.4)');
  grd.addColorStop(1,"rgba(255, 0, 0, 0)");

  ctx.arc(this.x, this.y + 50, 300, 0, 2*Math.PI);
  ctx.fillStyle = grd;
  ctx.fill();
};

Player.prototype.handleInput = function( input ) {
  // Controls only work when game isn't paused
  if ( this.paused === false ) {
    if ( input === 'left' ) {
      if ( this.x <= 50 ) {
        this.x = this.x + 101 * 4;
        return;
      }
      this.x = this.x - 101;
    } else if ( input === 'up' ) {
      // going to the top of the game field results in a victory
      if ( this.y <= 80 ) {
        this.victory = true;
        this.togglePause();
        return;
      }
      this.y = this.y - 83;
    } else if ( input === 'right' ) {
      if ( this.x >= 400 ) {
        this.x = this.x - 101 * 4;
        return;
      }
      this.x = this.x + 101;
    } else if ( input === 'down' ) {
      if ( this.y >= 360 ) {
        return;
      }
      this.y = this.y + 83;
    } else if ( input === 'pause' ) {
      this.togglePause();
    }
  }
  // If the game isn't over but is paused, only the unpause will work
  else if ( this.paused === true && this.victory === false && this.isDead === false ) {
    if ( input === 'pause' ) {
      this.togglePause();
    }
  } // When game is over, 'enter' can be used to reset it
  else if ( this.victory === true || this.isDead === true ) {
    if ( input === 'enter' ) {
      if ( this.victory === true ) {
        this.victory = false;
        this.x = 300;
        this.y = 388;
        this.togglePause();
      } else if ( this.isDead === true ){
        this.isDead = false;
        this.x = 300;
        this.y = 388;
        this.togglePause();
      }
    }

  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

//Pick number of enemies
var enemyCount = function( count ) {
  for ( var i = 0; i < count; i++ ) {
    allEnemies.push( new Enemy() );
  }
  player.numEnemies = count;
};

enemyCount( 3 );


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
