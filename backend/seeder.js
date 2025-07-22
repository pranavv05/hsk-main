// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --- Load All Mongoose Models ---
const User = require('./models/user.model');
const Vendor = require('./models/vendor.model');
const ServiceRequest = require('./models/serviceRequest.model');
const Service = require('./models/service.model');
const Testimonial = require('./models/testimonial.model');
const TeamMember = require('./models/teamMember.model');
const Value = require('./models/value.model');
const Feature = require('./models/feature.model');

// --- Load Environment Variables ---
dotenv.config();

// --- ALL MOCK DATA ---
const mockUsers = [
  { id: '1', name: 'Pradip Mishra', email: 'pradip@hindusevakendra.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Rahul Shah', email: 'rahul@hindusevakendra.com', password: 'admin123', role: 'admin' },
  { id: '3', name: 'Durgesh Rajpurohit', email: 'durgesh@hindusevakendra.com', password: 'admin123', role: 'admin' },
  { id: '4', name: 'Kapil Kanodiya', email: 'kapil@hindusevakendra.com', password: 'admin123', role: 'admin' },
  { id: '5', name: 'K K Parkhi', email: 'kk@hindusevakendra.com', password: 'admin123', role: 'admin' },
  { id: '6', name: 'L P Sanitary', email: 'lpsanitary111@gmail.com', password: '123456', role: 'vendor', profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' },
  { id: '7', name: 'JHALAM PUROHIT', email: 'jhalam101@gmail.com', password: '123456', role: 'user', profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61' },
  { id: '8', name: 'Hasmukh Kapadia', email: 'hasjay1945@gmail.com', password: '123456', role: 'user', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
  { id: '9', name: 'Deepak L Patel', email: 'patel.digvijay26@yahoo.com', password: '123456', role: 'vendor', profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5' },
  { id: '10', name: 'Hotel Pali In', email: 'dipakpatel3655@gmail.com', password: '123456', role: 'user', profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' },
  { id: '11', name: 'Mamta Hebbar', email: 'mamtaphebbar@gmail.com', password: '123456', role: 'user', profileImage: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f' },
  { id: '12', name: 'Satish Agrawal', email: 'satish2602agrawal@gmail.com', password: '123456', role: 'user' },
  { id: '13', name: 'Nilesh Kumar Tulsidas Bheshadadiya', email: 'pnilesh805@gmail.com', password: '123456', role: 'user' },
  { id: '14', name: 'Vaibhav A Patil', email: 'pintuvaibhav@gmail.com', password: '123456', role: 'user' },
  { id: '15', name: 'Naishadh Mehta', email: 'naishadh_m@yahoo.in', password: '123456', role: 'user' },
  { id: '16', name: 'Veerabhadra SB', email: 'veerbjrk@gmail.com', password: '123456', role: 'user' },
  { id: '17', name: 'Saroja sadananda shetty', email: 'Shettysaroja9@gmail.com', password: '123456', role: 'user' },
  { id: '18', name: 'Rahul thakor', email: 'dimpithakor9712@gmail.com', password: '123456', role: 'user' },
  { id: '19', name: 'SANJAY MAURYA', email: 'spowercontrols2013@gmail.com', password: '123456', role: 'user' },
  { id: '20', name: 'Dharmendra mishra', email: 'reshapeindia95@gmail.com', password: '123456', role: 'user' },
  { id: '21', name: 'Rajesh maurya', email: 'rluvp143@gmail.com', password: '123456', role: 'user' },
  { id: '22', name: 'Dharmendrasinh Thakor', email: 'tttrspt@yahoo.com', password: '123456', role: 'user' },
  { id: '23', name: 'Manish singh', email: 'singhmanishkumar707@gmail.com', password: '123456', role: 'user' },
  { id: '24', name: 'Raju sharma', email: 'Rajendrakail91@gmail.com', password: '123456', role: 'user' },
  { id: '25', name: 'Venugopal V', email: 'venugopal_19752000@yahoo.co.in', password: '123456', role: 'user' },
  { id: '26', name: 'Chiklit Jadav', email: 'chiklitjadav78@gmail.com', password: '123456', role: 'user' },
];

const mockServiceRequests = [
    { id: 'sr1', userId: '7', title: 'Electrical Repair', description: 'Need to fix some faulty wiring...', status: 'PENDING', serviceType: 'ELECTRICIAN', createdAt: '2023-09-15T10:30:00Z' },
    { id: 'sr2', userId: '8', title: 'Plumbing Services', description: 'Leaking tap in bathroom...', status: 'ASSIGNED', serviceType: 'PLUMBING', vendorId: '9', createdAt: '2023-09-14T09:15:00Z' },
    { id: 'sr3', userId: '10', title: 'Computer Repair', description: 'My laptop is not turning on', status: 'IN_PROGRESS', serviceType: 'OTHER', vendorId: '6', createdAt: '2023-09-12T14:45:00Z' },
];

const mockVendors = [
  { id: '6', fullName: 'L P Sanitary', phone: '9876543210', serviceType: 'ELECTRICIAN', description: 'All types of sanitary and electrical work.', experience: 10, isVerified: true, servicesCompleted: 45, rating: 4.8 },
  { id: '9', fullName: 'Deepak L Patel', phone: '8765432109', serviceType: 'PLUMBING', description: 'Licensed plumber specializing in repairs...', experience: 15, isVerified: true, servicesCompleted: 78, rating: 4.9 },
];

const mockServices = [
    { name: 'Electrician', icon: 'zap' }, { name: 'Plumber', icon: 'droplet' }, { name: 'Carpenter', icon: 'tool' }, { name: 'Web Developer', icon: 'code' }, { name: 'Tutor', icon: 'book' }, { name: 'Priest', icon: 'star' }, { name: 'Caterer', icon: 'coffee' }, { name: 'Cleaner', icon: 'home' }, { name: 'Painter', icon: 'droplet' }, { name: 'Gardener', icon: 'scissors' }, { name: 'Driver', icon: 'truck' }, { name: 'Mechanic', icon: 'tool' },
];

const mockTestimonials = [
    { name: 'Priya Sharma', role: 'Homeowner', content: 'Hindu Seva Kendra helped me find a reliable electrician...', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', rating: 5 },
    { name: 'Rajesh Patel', role: 'Vendor - Plumber', content: 'Being part of Hindu Seva Kendra has helped me grow my business...', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', rating: 5 },
];

const mockTeamMembers = [
    { name: 'Amit Patel', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', bio: 'Amit founded Hindu Seva Kendra...' },
    { name: 'Priya Singh', role: 'Operations Director', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', bio: 'Priya oversees daily operations...' },
];

const mockValues = [
    { icon: 'heart', title: 'Community Service', description: 'We are committed to serving our Hindu community...' },
    { icon: 'shield', title: 'Trust & Safety', description: 'We verify all vendors to ensure they provide quality services...' },
];

const mockFeatures = [
    { icon: 'shield', title: 'Verified Vendors', description: 'All vendors undergo thorough verification...' },
    { icon: 'users', title: 'Community Focused', description: 'Built by and for the Hindu community...' },
];


// --- DATABASE CONNECTION & SEEDING LOGIC ---

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(`Error connecting to DB: ${err.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        console.log('Destroying all data...');
        await User.deleteMany();
        await Vendor.deleteMany();
        await ServiceRequest.deleteMany();
        await Service.deleteMany();
        await Testimonial.deleteMany();
        await TeamMember.deleteMany();
        await Value.deleteMany();
        await Feature.deleteMany();
        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error destroying data: ${error}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        console.log('Clearing existing data...');
        await User.deleteMany();
        await Vendor.deleteMany();
        await ServiceRequest.deleteMany();
        await Service.deleteMany();
        await Testimonial.deleteMany();
        await TeamMember.deleteMany();
        await Value.deleteMany();
        await Feature.deleteMany();

        console.log('\n--- 1. Seeding Users ---');
        const userMap = {};
        for (const userData of mockUsers) {
            const user = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                profileImage: userData.profileImage,
            });
            const createdUser = await user.save();
            userMap[userData.id] = createdUser._id;
        }
        console.log(`✅ ${Object.keys(userMap).length} users created.`);
        
        console.log('\n--- 2. Seeding Vendor Profiles ---');
        for (const vendorData of mockVendors) {
            const vendor = new Vendor({
                ...vendorData,
                user: userMap[vendorData.id],
                fullName: vendorData.fullName,
            });
            await vendor.save();
        }
        console.log(`✅ ${mockVendors.length} vendor profiles created.`);

        console.log('\n--- 3. Seeding Service Requests ---');
        const requestsToCreate = mockServiceRequests.map(req => ({
            ...req,
            user: userMap[req.userId],
            vendor: req.vendorId ? userMap[req.vendorId] : undefined,
        }));
        await ServiceRequest.insertMany(requestsToCreate);
        console.log(`✅ ${requestsToCreate.length} service requests created.`);

        console.log('\n--- 4. Seeding Static Collections ---');
        await Service.insertMany(mockServices);
        await Testimonial.insertMany(mockTestimonials);
        await TeamMember.insertMany(mockTeamMembers);
        await Value.insertMany(mockValues);
        await Feature.insertMany(mockFeatures);
        console.log('✅ Static collections seeded.');

        console.log('\n✨✨✨ Data Imported Successfully! ✨✨✨');
        process.exit();
    } catch (error) {
        console.error('\n❌ ERROR with data import:', error);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
};

run();