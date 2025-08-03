const mongoose = require('mongoose');

// Target database (new HSK database)
const targetDbUri = 'mongodb+srv://pranavvatsa971:pa1OZZ9CCcWkwwVD@hsk.usofbip.mongodb.net/hsk_database?retryWrites=true&w=majority&appName=hsk';

async function checkAdminAccount() {
  try {
    console.log('Connecting to target database...');
    const conn = await mongoose.createConnection(targetDbUri).asPromise();
    
    // Define the User model schema
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      name: String
    });
    
    const User = conn.model('User', userSchema);
    
    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    console.log('\n=== Admin Accounts ===');
    if (adminUsers.length > 0) {
      adminUsers.forEach((admin, index) => {
        console.log(`\nAdmin #${index + 1}:`);
        console.log(`Name: ${admin.name || 'Not set'}`);
        console.log(`Email: ${admin.email}`);
        console.log(`ID: ${admin._id}`);
      });
    } else {
      console.log('No admin accounts found in the database.');
      
      // Check if we have any users that could be made admin
      const potentialAdmins = await User.find().limit(5);
      if (potentialAdmins.length > 0) {
        console.log('\nPotential accounts to make admin:');
        potentialAdmins.forEach((user, index) => {
          console.log(`[${index + 1}] ${user.email} (${user.role || 'no role'})`);
        });
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin accounts:', error);
    process.exit(1);
  }
}

checkAdminAccount();
