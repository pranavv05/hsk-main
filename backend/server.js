// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/requests', require('./routes/serviceRequest.routes.js'));
app.use('/api/vendors', require('./routes/vendor.routes.js'));
app.use('/api/admin', require('./routes/admin.routes.js'));
app.use('/api/public', require('./routes/public.routes.js'));

app.get('/', (req, res) => {
  res.send('HSK Backend API is running!');
});

// --- NEW AND IMPROVED CONNECTION LOGIC ---
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Could not connect to MongoDB:", err);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();