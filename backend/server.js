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
  'https://hsk-backend.onrender.com',
  'https://hindusevakendra.in',
  'https://www.hindusevakendra.in',
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests with no origin (like mobile apps, curl, Postman) or from allowed origins
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  } else {
    // Origin not allowed
    return res.status(403).json({
      success: false,
      error: 'Not allowed by CORS',
      details: `The origin '${origin}' is not allowed to access this resource.`
    });
  }
  
  next();
});

// Regular CORS for other routes
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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