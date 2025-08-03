// Database Migration Script
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Source database (old database)
const sourceDbUri = 'mongodb+srv://admin:pranav@hindusevakendra.vux9zxc.mongodb.net/hindu_seva_kendra?retryWrites=true&w=majority&appName=hindusevakendra';

// Target database (new HSK database)
const targetDbUri = 'mongodb+srv://pranavvatsa971:pa1OZZ9CCcWkwwVD@hsk.usofbip.mongodb.net/hsk_database?retryWrites=true&w=majority&appName=hsk';

// Connect to both databases
const connectDBs = async () => {
  try {
    console.log('Connecting to source database...');
    const sourceConn = await mongoose.createConnection(sourceDbUri).asPromise();
    console.log('Connected to source database');

    console.log('Connecting to target database...');
    const targetConn = await mongoose.createConnection(targetDbUri).asPromise();
    console.log('Connected to target database');

    return { sourceConn, targetConn };
  } catch (error) {
    console.error('Error connecting to databases:', error);
    process.exit(1);
  }
};

// Main migration function
const migrateData = async () => {
  const { sourceConn, targetConn } = await connectDBs();

  try {
    // Get all collections from source database
    const collections = await sourceConn.db.listCollections().toArray();
    console.log('Available collections in source DB:', collections.map(c => c.name));

    // Migrate regular users (non-vendors) from users collection
    if (collections.some(c => c.name === 'users')) {
      console.log('\nMigrating regular users...');
      // Only migrate users who are not vendors (userType is 'user' or not specified)
      const users = await sourceConn.collection('users').find({ 
        userType: { $ne: 'vendor' } 
      }).toArray();
      
      if (users.length > 0) {
        console.log(`Found ${users.length} regular users to migrate`);
        const User = targetConn.model('User', require('./backend/models/user.model').schema);
        
        // Transform and insert users
        const userPromises = users.map(async (user) => {
          try {
            // Skip if user already exists in target
            const exists = await User.findOne({ email: user.email });
            if (exists) {
              console.log(`User ${user.email} already exists, skipping...`);
              return null;
            }

            // Create new user document
            const newUser = new User({
              name: user.name || 'User',
              email: user.email,
              phone: user.phone || '',
              password: user.password, // Passwords are already hashed
              role: 'user',
              address: user.address || '',
              status: user.status === 'active' ? 'active' : 'inactive',
              createdAt: user.createdAt || new Date(),
              updatedAt: new Date()
            });

            await newUser.save();
            console.log(`Migrated user: ${user.email}`);
            return { _id: newUser._id, email: user.email };
          } catch (error) {
            console.error(`Error migrating user ${user.email || user._id}:`, error.message);
            return null;
          }
        });

        await Promise.all(userPromises);
        console.log('Regular user migration completed');
      } else {
        console.log('No regular users found in source database');
      }
    } else {
      console.log('No users collection found in source database');
    }

    // Migrate vendors from vendors collection
    if (collections.some(c => c.name === 'vendors')) {
      console.log('\nMigrating vendors...');
      const vendors = await sourceConn.collection('vendors').find({}).toArray();
      
      if (vendors.length > 0) {
        console.log(`Found ${vendors.length} vendor records to migrate`);
        const Vendor = targetConn.model('Vendor', require('./backend/models/vendor.model').schema);
        const User = targetConn.model('User');
        
        // First, get all vendor user IDs for lookup
        const vendorUserIds = vendors.map(v => v.userId?.toString());
        const vendorUsers = await sourceConn.collection('users').find({
          _id: { $in: vendorUserIds.map(id => new mongoose.Types.ObjectId(id)) }
        }).toArray();
        
        // Create a map of user ID to user data for quick lookup
        const userMap = new Map(vendorUsers.map(user => [user._id.toString(), user]));
        
        for (const vendor of vendors) {
          try {
            const vendorUserId = vendor.userId?.toString();
            const vendorUser = userMap.get(vendorUserId);
            
            if (!vendorUser) {
              console.log(`Could not find user data for vendor with ID: ${vendor._id}`);
              continue;
            }
            
            // Check if user already exists in target
            let user = await User.findOne({ email: vendorUser.email });
            
            if (!user) {
              // Create new user for vendor
              user = new User({
                name: vendorUser.name || 'Vendor',
                email: vendorUser.email,
                phone: vendorUser.phone || '',
                password: vendorUser.password, // Already hashed
                role: 'vendor',
                address: vendorUser.address || '',
                status: vendorUser.status === 'active' ? 'active' : 'inactive',
                createdAt: vendorUser.createdAt || new Date(),
                updatedAt: new Date()
              });
              await user.save();
              console.log(`Created new user for vendor: ${vendorUser.email}`);
            } else if (user.role !== 'vendor') {
              // Update existing user to vendor role
              user.role = 'vendor';
              await user.save();
              console.log(`Updated user ${user.email} to vendor role`);
            }

            // Check if vendor profile already exists
            const existingVendor = await Vendor.findOne({ user: user._id });
            if (existingVendor) {
              console.log(`Vendor profile already exists for: ${user.email}`);
              continue;
            }

            // Create vendor profile
            const newVendor = new Vendor({
              user: user._id,
              fullName: vendorUser.name || 'Vendor',
              phone: vendorUser.phone || '',
              serviceType: vendor.serviceType || 'OTHER',
              description: vendor.description || '',
              experience: 0, // Not in source data
              isVerified: vendor.verificationStatus === 'verified',
              idProofUrl: vendor.idProofUrl || '',
              addressProofUrl: vendor.addressProofUrl || '',
              photoUrl: vendor.photoUrl || '',
              servicesCompleted: 0, // Not in source data
              rating: 0, // Not in source data
              createdAt: vendor.createdAt || new Date(),
              updatedAt: new Date()
            });

            await newVendor.save();
            console.log(`Migrated vendor: ${user.email} (${vendor.serviceType})`);
          } catch (error) {
            console.error(`Error migrating vendor ${vendor._id}:`, error.message);
          }
        }
        console.log('Vendor migration completed');
      } else {
        console.log('No vendor records found in source database');
      }
    } else {
      console.log('No vendors collection found in source database');
    }

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the migration
migrateData();
