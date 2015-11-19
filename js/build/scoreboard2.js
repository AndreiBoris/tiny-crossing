var scoreKeeper = function() {
    // This links to my firebase data account:
    this.scoreListRef = new Firebase('https://burning-fire-615.firebaseio.com//scoreList');
    this.htmlForPath = {};
    this.SCOREBOARD_SIZE = 3;
    this.scoreListDisplay = this.scoreListRef.limitToLast(this.SCOREBOARD_SIZE);
};

scoreKeeper.prototype.populateArray = function() {
    var fireBase = this.scoreListRef;
    fireBase.orderByChild('score');
    console.log(fireBase);
};

scoreKeeper.prototype.adder = function(playerName, playerScore) {
    // Grab the third score (worst result that is still on the scoreBoard):
    var worstScore = parseInt($('#leaderboardTable tr:nth-child(3) td:nth-child(2)').text());
    // If the player picked a name, and the curent score is better thab the 
    // worst score OR there aren't 3 scores on the table yet, add the new score
    // to firebase:
    console.log(this.htmlForPath);
    this.populateArray();
    if (playerName !== '' && (playerScore > worstScore || !worstScore)) {
        this.scoreListRef.push({
            name: playerName,
            score: playerScore
        });
    }
};

scoreKeeper.prototype.remover = function(scoreSnapshot) {
    var removedScoreRow = this.htmlForPath[scoreSnapshot.key()];
    removedScoreRow.remove();
    delete this.htmlForPath[scoreSnapshot.key()];
};

scoreKeeper.prototype.addToBoard = function(scoreSnapshot, prevScoreName) {
    var newScoreRow = $("<tr/>");
    newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
    newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

    // Store a reference to the table row so we can get it again later.
    this.htmlForPath[scoreSnapshot.key()] = newScoreRow;

    // Insert the new score in the appropriate place in the table.
    if (!prevScoreName) {
        $("#leaderboardTable").append(newScoreRow);
    } else {
        console.log(prevScoreName);
        var lowerScoreRow = this.htmlForPath[prevScoreName];
        lowerScoreRow.before(newScoreRow);
    }
};

// Instantiate scoreboard so that we can use its internal methods:
var scoreBoard = new scoreKeeper();

scoreBoard.scoreListDisplay.on('child_added', function(newScoreSnapshot, prevScoreName) {
    console.log(newScoreSnapshot);
    console.log(prevScoreName);
    scoreBoard.addToBoard(newScoreSnapshot);
});

// Add a callback to handle when a score is removed
scoreBoard.scoreListDisplay.on('child_removed', function(oldScoreSnapshot) {
    console.log('removing something');
    console.log('removing this:');
    console.log(oldScoreSnapshot);
    scoreBoard.remover(oldScoreSnapshot);
});
/*
 function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };

*/
