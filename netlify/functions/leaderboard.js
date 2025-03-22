// netlify/functions/leaderboard.js
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'temple-runner';
const COLLECTION = 'leaderboard';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  // Allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  
  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Successful preflight call' }),
    };
  }
  
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);
    
    // GET request - fetch leaderboard
    if (event.httpMethod === 'GET') {
      // Calculate time until next Sunday at midnight
      const now = new Date();
      const daysUntilSunday = 7 - now.getDay();
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(0, 0, 0, 0);
      
      const timeRemaining = nextSunday - now;
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      
      const resetTimeText = `${days}D ${hours}H ${minutes}M`;
      
      // Get top 10 scores
      const leaderboardData = await collection
        .find({})
        .sort({ score: -1 })
        .limit(10)
        .toArray();
      
      const formattedData = leaderboardData.map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        score: entry.score
      }));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          leaderboard: formattedData,
          resetTime: resetTimeText
        }),
      };
    }
    
    // POST request - submit score
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      // Validate data
      if (!data.name || !data.score || 
          typeof data.name !== 'string' || 
          data.name.length > 20 || 
          typeof data.score !== 'number') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid data' }),
        };
      }
      
      // Check if this score is high enough to make the leaderboard
      const lowestScoreEntry = await collection
        .find({})
        .sort({ score: 1 })
        .limit(1)
        .toArray();
      
      const currentCount = await collection.countDocuments();
      
      // If we have less than 10 entries, or this score is higher than the lowest score
      if (currentCount < 10 || 
          (lowestScoreEntry.length > 0 && data.score > lowestScoreEntry[0].score)) {
        
        // If we already have 10 entries, remove the lowest one
        if (currentCount >= 10 && lowestScoreEntry.length > 0) {
          await collection.deleteOne({ _id: lowestScoreEntry[0]._id });
        }
        
        // Insert the new score
        await collection.insertOne({
          name: data.name,
          score: data.score,
          timestamp: new Date()
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Congratulations! You made it to the leaderboard!',
            madeLeaderboard: true
          }),
        };
      } else {
        // Score not high enough
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Score not high enough for the leaderboard',
            madeLeaderboard: false
          }),
        };
      }
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};