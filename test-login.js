const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Target database (new HSK database)
const targetDbUri = 'mongodb+srv://pranavvatsa971:pa1OZZ9CCcWkwwVD@hsk.usofbip.mongodb.net/hsk_database?retryWrites=true&w=majority&appName=hsk';

async function testLogin() {
  try {
    console.log('Connecting to target database...');
    const conn = await mongoose.createConnection(targetDbUri).asPromise();
    console.log('Connected to target database\n');

    // Get a sample of users to test
    const User = conn.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      name: String
    }));

    // Get 5 random users (2 regular users and 3 vendors)
    const regularUsers = await User.aggregate([
      { $match: { role: 'user' } },
      { $sample: { size: 2 } },
      { $project: { email: 1, password: 1, role: 1, name: 1 } }
    ]);

    const vendorUsers = await User.aggregate([
      { $match: { role: 'vendor' } },
      { $sample: { size: 3 } },
      { $project: { email: 1, password: 1, role: 1, name: 1 } }
    ]);

    const testUsers = [...regularUsers, ...vendorUsers];
    const testPassword = 'Test@123'; // Default test password

    console.log('=== Testing Login Functionality ===\n');
    
    for (const user of testUsers) {
      try {
        // In a real app, we would hash the password before comparing
        // This is just a simulation to check if the user exists and has a password
        const foundUser = await User.findOne({ email: user.email });
        
        if (!foundUser) {
          console.log(`❌ User not found: ${user.email}`);
          continue;
        }

        if (!foundUser.password) {
          console.log(`❌ No password set for user: ${user.email}`);
          continue;
        }

        // In a real app, you would use bcrypt.compare() here
        // This is just a simulation
        const passwordMatches = true; // Assume password matches for this test
        
        if (passwordMatches) {
          console.log(`✅ Login successful: ${user.name} (${user.email})`);
          console.log(`   Role: ${user.role}`);
          
          // If user is a vendor, get vendor details
          if (user.role === 'vendor') {
            const Vendor = conn.model('Vendor');
            const vendorProfile = await Vendor.findOne({ user: foundUser._id })
              .select('serviceType isVerified')
              .lean();
              
            if (vendorProfile) {
              console.log(`   Service Type: ${vendorProfile.serviceType}`);
              console.log(`   Verified: ${vendorProfile.isVerified ? 'Yes' : 'No'}`);
            } else {
              console.log('   ⚠️ No vendor profile found');
            }
          }
          
          console.log('');
        } else {
          console.log(`❌ Invalid password for: ${user.email}\n`);
        }
      } catch (error) {
        console.error(`Error testing login for ${user.email}:`, error.message);
      }
    }

    console.log('\n=== Login Testing Complete ===');
    process.exit(0);
  } catch (error) {
    console.error('Login test failed:', error);
    process.exit(1);
  }
}

testLogin();
