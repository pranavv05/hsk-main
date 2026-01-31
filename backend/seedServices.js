const mongoose = require('mongoose');
const Service = require('./models/service.model');
// filepath: c:\Users\prana\OneDrive\Desktop\hsk_final\hsk-main\backend\seedServices.js

const services = [
  { name: "Event planner", icon: "default-icon" },
  { name: "POP Wala", icon: "default-icon" },
  { name: "Tours and travels", icon: "default-icon" },
  { name: "House keeping", icon: "default-icon" },
  { name: "Hair and spa", icon: "default-icon" },
  { name: "Packers and movers", icon: "default-icon" },
  { name: "Transporter", icon: "default-icon" },
  { name: "Tent wala", icon: "default-icon" },
  { name: "Maharaj/achari", icon: "default-icon" },
  { name: "Bartan wala", icon: "default-icon" },
  { name: "Vedio,photogrpher", icon: "default-icon" },
  { name: "Mehandi wali", icon: "default-icon" },
  { name: "ब्युटी पार्लर", icon: "default-icon" },
  { name: "Tyre puncher", icon: "default-icon" },
  { name: "Carpenter", icon: "default-icon" },
  { name: "Plumber", icon: "default-icon" },
  { name: "Electrician", icon: "default-icon" },
  { name: "Moter machanic", icon: "default-icon" },
  { name: "Two-wheeler machanic", icon: "default-icon" },
  { name: "Battery repairing", icon: "default-icon" },
  { name: "Car washing", icon: "default-icon" },
  { name: "Scrap wala", icon: "default-icon" },
  { name: "Labour contractor", icon: "default-icon" },
  { name: "Labour supplier", icon: "default-icon" },
  { name: "House help", icon: "default-icon" },
  { name: "Medical help मेड/sister", icon: "default-icon" },
  { name: "Medical equipment supplier", icon: "default-icon" },
  { name: "Electrical material suppliers", icon: "default-icon" },
  { name: "Mechanical Workshop", icon: "default-icon" },
  { name: "Tiles and plumber", icon: "default-icon" },
  { name: "Retailers", icon: "default-icon" },
  { name: "Painter", icon: "default-icon" },
  { name: "General insurance", icon: "default-icon" },
  { name: "Computer and solutions", icon: "default-icon" },
  { name: "Digital marketing", icon: "default-icon" },
  { name: "Industrial electrition", icon: "default-icon" },
  { name: "Domestic electrition", icon: "default-icon" },
  { name: "Engg.workshop", icon: "default-icon" },
  { name: "Moter rewinding workshop", icon: "default-icon" },
  { name: "Car repairing", icon: "default-icon" },
  { name: "Mobile repairing", icon: "default-icon" },
  { name: "Tours and travels", icon: "default-icon" },
  { name: "Home decor", icon: "default-icon" },
  { name: "Sewing machine repairing", icon: "default-icon" },
  { name: "Tools and machinery maintenance", icon: "default-icon" },
  { name: "Flower decoration", icon: "default-icon" }
];

async function seedServices() {
  await mongoose.connect('mongodb+srv://pranavvatsa971:pa1OZZ9CCcWkwwVD@hsk.usofbip.mongodb.net/hsk_database?retryWrites=true&w=majority&appName=hsk'); // Replace with your DB name
  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log('Service categories seeded!');
  mongoose.disconnect();
}

seedServices();