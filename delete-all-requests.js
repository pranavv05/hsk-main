// Direct MongoDB script to delete all service requests
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function deleteAllServiceRequests() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hsk';
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('servicerequests');
    
    // Get count before deletion
    const count = await collection.countDocuments();
    console.log(`Found ${count} service requests to delete`);

    if (count === 0) {
      console.log('No service requests found to delete');
      return;
    }

    // Delete all documents in the collection
    const result = await collection.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} service requests`);

    // Verify deletion
    const remaining = await collection.countDocuments();
    console.log(`Service requests remaining: ${remaining}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
deleteAllServiceRequests();
