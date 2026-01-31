const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    console.error('❌ .env file not found at:', envPath);
    process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
}

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        // 1. Drop the existing email_1 index
        const indexes = await collection.indexes();
        const emailIndex = indexes.find(idx => idx.name === 'email_1');

        if (emailIndex) {
            console.log('Found existing unique email index. Dropping it...');
            try {
                await collection.dropIndex('email_1');
                console.log('✅ Dropped index: email_1');
            } catch (err) {
                console.error('⚠️ Could not drop index (might not exist):', err.message);
            }
        } else {
            console.log('ℹ️ Index email_1 not found, skipping drop.');
        }

        // 2. Create the new compound index
        console.log('Creating new compound index: { email: 1, role: 1 } ...');
        await collection.createIndex({ email: 1, role: 1 }, { unique: true, name: 'email_role_unique' });
        console.log('✅ Created unique compound index on { email, role }');

        console.log('🎉 Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
