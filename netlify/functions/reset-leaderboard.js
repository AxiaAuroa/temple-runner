const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'temple-runner';
const COLLECTION = 'leaderboard';
const ARCHIVE_COLLECTION = 'leaderboard_archive';

exports.handler = async (event, context) => {
  // Check for secret token to prevent unauthorized resets
  const token = event.queryStringParameters?.token;
  if (token !== process.env.RESET_TOKEN) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }
  
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = client.db(DB_NAME);
    const leaderboardCollection = db.collection(COLLECTION);
    const archiveCollection = db.collection(ARCHIVE_COLLECTION);
    
    // Get current leaderboard
    const leaderboard = await leaderboardCollection.find({}).toArray();
    
    // Archive current leaderboard
    if (leaderboard.length > 0) {
      await archiveCollection.insertOne({
        date: new Date(),
        entries: leaderboard
      });
    }
    
    // Clear current leaderboard
    await leaderboardCollection.deleteMany({});
    
    await client.close();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Leaderboard reset complete' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
