const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Target database (new HSK database)
const targetDbUri = 'mongodb+srv://pranavvatsa971:pa1OZZ9CCcWkwwVD@hsk.usofbip.mongodb.net/hsk_database?retryWrites=true&w=majority&appName=hsk';

async function resetAllAdminPasswords() {
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
    
    // Find all admin users
    const admins = await User.find({ role: 'admin' });
    
    if (!admins || admins.length === 0) {
      console.log('No admin accounts found in the database.');
      process.exit(1);
    }
    
    console.log(`\n=== Found ${admins.length} Admin Accounts ===`);
    
    // Common password for all admins (they should change it after login)
    const commonPassword = 'Admin@1234';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(commonPassword, salt);
    
    console.log('\n=== Resetting Passwords for All Admin Accounts ===');
    
    // Update all admin passwords
    const updatePromises = admins.map(async (admin) => {
      admin.password = hashedPassword;
      await admin.save();
      return {
        name: admin.name,
        email: admin.email,
        password: commonPassword
      };
    });
    
    const updatedAdmins = await Promise.all(updatePromises);
    
    console.log('\n=== All Admin Accounts Updated ===');
    console.log('Common credentials for all admin accounts:');
    console.log('Password: Admin@1234\n');
    
    console.log('Updated Admin Accounts:');
    updatedAdmins.forEach((admin, index) => {
      console.log(`\nAdmin #${index + 1}:`);
      console.log(`Name: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
    });
    
    console.log('\nIMPORTANT: All admins should change their password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
}

resetAllAdminPasswords();
