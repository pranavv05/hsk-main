// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://hsk-main.vercel.app',
  'https://hsk-main.vercel.app/',
  'https://hsk-backend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
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