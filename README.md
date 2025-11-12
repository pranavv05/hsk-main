# Hindu Seva Kendra - Service Booking Platform

A full-stack web application that connects users with service providers (vendors) across various domains. This platform allows users to request services, vendors to fulfill them, and administrators to manage the entire ecosystem.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

## Features

### User Management
- Multi-role authentication system (User, Vendor, Admin)
- JWT-based secure authentication
- Password reset functionality with email verification
- Profile management for all user types

### Service Request System
- Users can create service requests with detailed descriptions
- Request tracking with status updates (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED)
- Ability for users to cancel pending requests

### Vendor Management
- Dedicated vendor profiles with verification system
- Document upload functionality (ID proof, address proof, photos)
- Service specialization and experience tracking
- Performance metrics (services completed, rating)

### Admin Dashboard
- Real-time statistics overview (users, vendors, requests)
- Vendor verification and management
- Service request assignment to vendors
- Monitoring of all platform activities

### File Management
- Cloudinary integration for file storage
- Support for vendor document uploads

## Technology Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Declarative routing for React
- **Framer Motion** - Animation library for React
- **Axios** - Promise based HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **JSON Web Tokens (JWT)** - Token-based authentication
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Cloud-based image and video management
- **Nodemailer** - Email sending service

## Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   Frontend      │    │    Backend       │
│   (React)       │    │   (Node/Express) │
├─────────────────┤    ├──────────────────┤
│                 │    │                  │
│  User Interface │◄──►│  RESTful API     │
│                 │    │                  │
├─────────────────┤    ├──────────────────┤
│                 │    │                  │
│  State Mgmt     │    │  Business Logic  │
│  (Context API)  │    │                  │
├─────────────────┤    ├──────────────────┤
│                 │    │                  │
│  API Service    │    │  Database        │
│  (Axios)        │    │  (MongoDB)       │
│                 │    │                  │
└─────────────────┘    └──────────────────┘
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hsk-main
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_for_sending_notifications
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

## Project Structure

```
hsk-main/
├── backend/
│   ├── config/           # Configuration files (Cloudinary)
│   ├── middleware/       # Custom middleware (auth)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   ├── App.tsx       # Main app component
│   │   └── index.tsx     # Entry point
│   ├── public/           # Static assets
│   └── .env              # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Service Requests
- `POST /api/requests` - Create new service request
- `GET /api/requests` - Get user's service requests
- `PATCH /api/requests/:id/cancel` - Cancel service request
- `GET /api/requests/vendor` - Get vendor's service requests
- `PATCH /api/requests/:id/accept` - Vendor accepts request
- `PATCH /api/requests/:id/complete` - Vendor completes request
- `GET /api/requests/all` - Admin gets all requests

### Vendor
- `GET /api/vendors/profile` - Get vendor profile
- `PUT /api/vendors/profile` - Update vendor profile

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/vendors` - Get all vendors
- `GET /api/admin/service-requests` - Get all service requests
- `PATCH /api/admin/vendors/:id/verify` - Verify vendor
- `PATCH /api/admin/requests/:id/assign` - Assign request to vendor

### Public
- `GET /api/public/services` - Get available services
- `GET /api/public/testimonials` - Get testimonials
- `GET /api/public/features` - Get features
- `GET /api/public/about` - Get about page data
- `POST /api/public/contact` - Submit contact form

## Database Schema

### User
- `name`: String
- `email`: String (unique)
- `phone`: String
- `password`: String (hashed)
- `role`: String (user/vendor/admin)
- `profileImage`: String (optional)
- `address`: String (optional)
- `passwordResetToken`: String (optional)
- `passwordResetExpires`: Date (optional)

### Vendor
- `user`: ObjectId (ref: User)
- `fullName`: String
- `phone`: String
- `serviceType`: String
- `description`: String
- `experience`: Number
- `isVerified`: Boolean
- `idProofUrl`: String
- `addressProofUrl`: String
- `photoUrl`: String
- `servicesCompleted`: Number
- `rating`: Number

### ServiceRequest
- `title`: String
- `description`: String
- `serviceType`: String
- `status`: String (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED)
- `user`: ObjectId (ref: User)
- `vendor`: ObjectId (ref: User, optional)

## Deployment

### Frontend
The frontend is configured for deployment on Vercel. Update the `vercel.json` file as needed for your specific deployment requirements.

### Backend
The backend is configured for deployment on Render. Ensure all environment variables are properly set in your Render dashboard.

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### User Dashboard
![User Dashboard](screenshots/user-dashboard.png)

### Vendor Dashboard
![Vendor Dashboard](screenshots/vendor-dashboard.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Authentication
![Login Page](screenshots/login.png)
![Registration Page](screenshots/register.png)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - your.email@example.com

Project Link: [https://github.com/yourusername/hsk-main](https://github.com/yourusername/hsk-main)