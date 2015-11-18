var scoreKeeper = function() {
    // This links to my firebase data account:
    this.scoreListRef = new Firebase('https://burning-fire-615.firebaseio.com//scoreList');
    this.htmlForPath = {};
    this.SCOREBOARD_SIZE = 3;
    this.scoreListDisplay = this.scoreListRef.limitToLast(this.SCOREBOARD_SIZE);
};

scoreKeeper.prototype.adder = function(playerName, playerScore) {
	// Grab the third score (worst result that is still on the score board):
    var worstScore = parseInt($('#leaderboardTable tr:nth-child(3) td:nth-child(2)').text());
    if (playerName !== '' && (playerScore > worstScore || !worstScore)) {
        this.scoreListRef.push({
            name: playerName,
            score: playerScore
        });
    }
};

scoreKeeper.prototype.addToBoard = function(scoreSnapshot) {
    var newScoreRow = $("<tr/>");
    newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
    newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

    // Store a reference to the table row so we can get it again later.
    this.htmlForPath[scoreSnapshot.key()] = newScoreRow;

    // Insert the new score in the appropriate place in the table.
    if (true) {
        $("#leaderboardTable").append(newScoreRow);
    } else {
        var lowerScoreRow = this.htmlForPath[prevScoreName];
        lowerScoreRow.before(newScoreRow);
    }
};

// Instantiate scoreboard so that we can use its internal methods:
var scoreBoard = new scoreKeeper();

scoreBoard.scoreListDisplay.on('child_added', function(snapshot) {
    scoreBoard.addToBoard(snapshot);
});

/*
 function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };

*/
