// Script to delete all service requests from the database
require('dotenv').config();
const mongoose = require('mongoose');
const ServiceRequest = require('./backend/models/serviceRequest.model');

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hsk';

async function deleteAllServiceRequests() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get the count before deletion
    const countBefore = await ServiceRequest.countDocuments();
    console.log(`Found ${countBefore} service requests to delete`);

    if (countBefore === 0) {
      console.log('No service requests found to delete');
      process.exit(0);
    }

    // Ask for confirmation
    console.log('\nWARNING: This will permanently delete ALL service requests from the database.');
    console.log('This action cannot be undone!\n');
    
    // Simulate a confirmation prompt
    console.log('To confirm deletion, type "DELETE" and press Enter:');
    
    // Listen for user input
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', async (input) => {
      if (input.trim().toUpperCase() === 'DELETE') {
        try {
          // Delete all service requests
          const result = await ServiceRequest.deleteMany({});
          
          console.log(`\nSuccessfully deleted ${result.deletedCount} service requests`);
          
          // Verify deletion
          const countAfter = await ServiceRequest.countDocuments();
          console.log(`Total service requests remaining: ${countAfter}`);
          
          if (countAfter === 0) {
            console.log('All service requests have been successfully deleted.');
          } else {
            console.warn('Warning: Not all service requests were deleted.');
          }
        } catch (error) {
          console.error('Error deleting service requests:', error);
        } finally {
          // Close the connection
          await mongoose.disconnect();
          console.log('Disconnected from MongoDB');
          process.exit(0);
        }
      } else {
        console.log('Deletion cancelled. No changes were made.');
        await mongoose.disconnect();
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
deleteAllServiceRequests();
