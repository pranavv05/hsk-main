const mongoose = require('mongoose');

// Source database (old database)
const sourceDbUri = 'mongodb+srv://admin:pranav@hindusevakendra.vux9zxc.mongodb.net/hindu_seva_kendra?retryWrites=true&w=majority&appName=hindusevakendra';

async function analyzeCollections() {
  try {
    console.log('Connecting to source database...');
    const conn = await mongoose.createConnection(sourceDbUri).asPromise();
    console.log('Connected to source database\n');

    // Analyze users collection
    console.log('=== Analyzing users collection ===');
    const users = await conn.collection('users').find({}).limit(1).toArray();
    if (users.length > 0) {
      console.log('Sample user document:');
      console.log(JSON.stringify(users[0], null, 2));
      
      // Count total users
      const userCount = await conn.collection('users').countDocuments();
      console.log(`\nTotal users: ${userCount}`);
      
      // Count users who might be vendors
      const vendorCount = await conn.collection('users').countDocuments({ role: 'vendor' });
      console.log(`Users with role 'vendor': ${vendorCount}`);
    } else {
      console.log('No users found in the users collection');
    }

    // Analyze vendors collection
    console.log('\n=== Analyzing vendors collection ===');
    const vendors = await conn.collection('vendors').find({}).limit(1).toArray();
    if (vendors.length > 0) {
      console.log('Sample vendor document:');
      console.log(JSON.stringify(vendors[0], null, 2));
      
      // Count total vendors
      const vendorCount = await conn.collection('vendors').countDocuments();
      console.log(`\nTotal vendors: ${vendorCount}`);
      
      // Get unique service types
      const serviceTypes = await conn.collection('vendors').distinct('serviceType');
      console.log('\nService types in vendors:');
      console.log(serviceTypes);
    } else {
      console.log('No vendors found in the vendors collection');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

analyzeCollections();
