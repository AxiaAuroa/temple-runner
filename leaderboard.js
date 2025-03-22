// leaderboard.js
const Game = Game || {};

Game.leaderboard = {
  // Save a score to the leaderboard
  saveScore: function(playerName, wallet, score) {
    return fetch('/api/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playerName,
        wallet: wallet,
        score: score
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Score saved response:", data);
      return {
        success: !data.error,
        madeLeaderboard: data.madeLeaderboard || false,
        message: data.message || ""
      };
    })
    .catch(error => {
      console.error("Error saving score:", error);
      return {
        success: false,
        madeLeaderboard: false,
        message: "Error saving score"
      };
    });
  },
  
  // Get top scores for the leaderboard
  getTopScores: function(callback) {
    fetch('/api/leaderboard')
      .then(response => response.json())
      .then(data => {
        console.log("Leaderboard data:", data);
        callback(data.leaderboard || [], data.resetTime || "");
      })
      .catch(error => {
        console.error("Error getting leaderboard:", error);
        callback([], "");
      });
  }
};