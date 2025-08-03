const mongoose = require('mongoose');

// Source database (old database)
const sourceDbUri = 'mongodb+srv://admin:pranav@hindusevakendra.vux9zxc.mongodb.net/hindu_seva_kendra?retryWrites=true&w=majority&appName=hindusevakendra';

// Target database (new HSK database)
const targetDbUri = 'mongodb+srv://pranavvatsa971:pa1OZZ9CCcWkwwVD@hsk.usofbip.mongodb.net/hsk_database?retryWrites=true&w=majority&appName=hsk';

async function verifyMigration() {
  try {
    console.log('Connecting to source database...');
    const sourceConn = await mongoose.createConnection(sourceDbUri).asPromise();
    console.log('Connected to source database');

    console.log('Connecting to target database...');
    const targetConn = await mongoose.createConnection(targetDbUri).asPromise();
    console.log('Connected to target database\n');

    const report = {
      timestamp: new Date(),
      users: { source: 0, target: 0, verified: 0, missing: [] },
      vendors: { source: 0, target: 0, verified: 0, missing: [] },
      issues: []
    };

    // Verify Users
    console.log('Verifying users...');
    const sourceUsers = await sourceConn.collection('users')
      .find({ userType: { $ne: 'vendor' } })
      .project({ email: 1, _id: 0 })
      .toArray();
    
    const targetUsers = await targetConn.collection('users')
      .find({ role: 'user' })
      .project({ email: 1, _id: 0 })
      .toArray();

    report.users.source = sourceUsers.length;
    report.users.target = targetUsers.length;
    
    const sourceUserEmails = new Set(sourceUsers.map(u => u.email?.toLowerCase()));
    const targetUserEmails = new Set(targetUsers.map(u => u.email?.toLowerCase()));
    
    // Find missing users
    for (const email of sourceUserEmails) {
      if (targetUserEmails.has(email)) {
        report.users.verified++;
      } else {
        report.users.missing.push(email);
      }
    }

    // Verify Vendors
    console.log('Verifying vendors...');
    const sourceVendors = await sourceConn.collection('vendors')
      .find({})
      .project({ _id: 1 })
      .toArray();
    
    const targetVendors = await targetConn.collection('vendors')
      .find({})
      .project({ _id: 1 })
      .toArray();

    report.vendors.source = sourceVendors.length;
    report.vendors.target = targetVendors.length;

    // Check vendor user accounts
    const vendorUserEmails = [];
    for (const vendor of sourceVendors) {
      const vendorUser = await sourceConn.collection('users').findOne({
        _id: vendor.userId
      }, { email: 1 });
      
      if (vendorUser?.email) {
        vendorUserEmails.push(vendorUser.email.toLowerCase());
      }
    }

    const targetVendorUsers = await targetConn.collection('users')
      .find({ role: 'vendor' })
      .project({ email: 1, _id: 0 })
      .toArray();
    
    const targetVendorEmails = new Set(targetVendorUsers.map(u => u.email?.toLowerCase()));
    
    // Find missing vendor accounts
    for (const email of vendorUserEmails) {
      if (targetVendorEmails.has(email)) {
        report.vendors.verified++;
      } else {
        report.vendors.missing.push(email);
      }
    }

    // Generate summary
    console.log('\n=== Migration Verification Report ===');
    console.log(`Generated at: ${report.timestamp.toISOString()}`);
    
    console.log('\n--- Users ---');
    console.log(`Source: ${report.users.source}`);
    console.log(`Migrated: ${report.users.target}`);
    console.log(`Verified: ${report.users.verified}`);
    console.log(`Missing: ${report.users.missing.length}`);
    
    if (report.users.missing.length > 0) {
      console.log('\nMissing Users:');
      report.users.missing.forEach((email, i) => console.log(`${i + 1}. ${email}`));
    }

    console.log('\n--- Vendors ---');
    console.log(`Source: ${report.vendors.source}`);
    console.log(`Migrated: ${report.vendors.target}`);
    console.log(`Verified: ${report.vendors.verified}`);
    console.log(`Missing: ${report.vendors.missing.length}`);
    
    if (report.vendors.missing.length > 0) {
      console.log('\nMissing Vendor Accounts:');
      report.vendors.missing.forEach((email, i) => console.log(`${i + 1}. ${email}`));
    }

    // Save report to file
    const fs = require('fs');
    const reportFile = `migration-verification-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\nVerification report saved to: ${reportFile}`);

    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

verifyMigration();
