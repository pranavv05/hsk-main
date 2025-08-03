const mongoose = require('mongoose');

// Source database (old database)
const sourceDbUri = 'mongodb+srv://admin:pranav@hindusevakendra.vux9zxc.mongodb.net/hindusevakendra?retryWrites=true&w=majority&appName=hindusevakendra';

async function listCollections() {
  try {
    console.log('Connecting to source database...');
    const conn = await mongoose.createConnection(sourceDbUri).asPromise();
    console.log('Connected to source database');

    // List all collections
    const collections = await conn.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach((c, i) => {
      console.log(`${i + 1}. ${c.name}`);
    });

    // List all databases
    const adminDb = conn.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach((db, i) => {
      console.log(`${i + 1}. ${db.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listCollections();
