// leaderboard.js
const Game = Game || {};

Game.leaderboard = {
  // Save a score to the leaderboard
  saveScore: function(playerName, score) {
    // Simulate saving score locally
    console.log("Score saved for:", playerName, "Score:", score);
    return Promise.resolve({
      success: true,
      madeLeaderboard: true,
      message: "Score saved successfully"
    });
  },
  
  // Get top scores for the leaderboard
  getTopScores: function(callback) {
    // Simulated leaderboard data
    const mockData = [
      { rank: 1, name: "Player1", score: 145.5 },
      { rank: 2, name: "Player2", score: 160.2 },
      { rank: 3, name: "Player3", score: 175.8 },
      // ... more mock data
    ];
    callback(mockData, "5 DAYS 12 HOURS");
  }
};