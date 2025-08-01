// src/utils/apiService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Axios interceptor to automatically attach the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hindu_seva_kendra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- AUTHENTICATION FUNCTIONS ---

export async function registerUser(userData: any) {
  try {
    const response = await apiClient.post('/api/auth/register', userData);
    const { user, token } = response.data;
    if (token) {
      localStorage.setItem('hindu_seva_kendra_token', token);
    }
    localStorage.setItem('hindu_seva_kendra_user', JSON.stringify(user));
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { user, token } = response.data;
    if (token) {
      localStorage.setItem('hindu_seva_kendra_token', token);
    }
    localStorage.setItem('hindu_seva_kendra_user', JSON.stringify(user));
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}


// --- USER-SPECIFIC FUNCTIONS ---

export async function fetchUserServiceRequests() {
    try {
        const response = await apiClient.get('/api/requests');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch service requests');
    }
}

export async function createServiceRequest(requestData: any) {
    try {
        const response = await apiClient.post('/api/requests', requestData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create service request');
    }
}

export async function cancelServiceRequest(requestId: string) {
  try {
    const response = await apiClient.patch(`/api/requests/${requestId}/cancel`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to cancel service request');
  }
}


// --- VENDOR-SPECIFIC FUNCTIONS ---

export async function fetchVendorProfile() {
  try {
    const response = await apiClient.get('/api/vendors/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor profile');
  }
}

// THIS IS THE CORRECT, FINAL VERSION FOR FILE UPLOADS
export async function updateVendorProfile(profileData: FormData) {
    try {
        const response = await apiClient.put('/api/vendors/profile', profileData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch(error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update vendor profile');
    }
}

export async function fetchVendorServiceRequests() {
  try {
    const response = await apiClient.get('/api/requests/vendor');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch requests');
  }
}

export async function acceptServiceRequest(requestId: string) {
  try {
    const response = await apiClient.patch(`/api/requests/${requestId}/accept`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to accept request');
  }
}

export async function completeServiceRequest(requestId: string) {
  try {
    const response = await apiClient.patch(`/api/requests/${requestId}/complete`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to complete request');
  }
}


// --- ADMIN-SPECIFIC FUNCTIONS ---

export async function fetchAdminStats() {
  try {
    const response = await apiClient.get('/api/admin/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
  }
}

export async function fetchAdminVendors() {
  try {
    const response = await apiClient.get('/api/admin/vendors');
    return response.data;
  } catch (error: any)    {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
  }
}

export async function assignVendorToRequest(requestId: string, vendorId: string) {
    try {
        const response = await apiClient.patch(`/api/admin/requests/${requestId}/assign`, { vendorId });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to assign vendor');
    }
}

export async function toggleVendorVerification(vendorId: string, isVerified: boolean) {
    try {
        const response = await apiClient.patch(`/api/admin/vendors/${vendorId}/verify`, { isVerified });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update verification');
    }
}

export async function fetchAllServiceRequests() {
  try {
    const response = await apiClient.get('/api/requests/all');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all requests');
  }
}

export async function fetchAdminServiceRequests() {
  try {
    const response = await apiClient.get('/api/admin/service-requests');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin service requests');
  }
}


// --- PUBLIC DATA FUNCTIONS ---

export async function fetchServices() {
  try {
    const response = await apiClient.get('/api/public/services');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
}

export async function fetchTestimonials() {
  try {
    const response = await apiClient.get('/api/public/testimonials');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonials');
  }
}

export async function fetchFeatures() {
  try {
    const response = await apiClient.get('/api/public/features');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch features');
  }
}

export async function fetchAboutPageData() {
    try {
        const response = await apiClient.get('/api/public/about');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch About Us data');
    }
}

export async function sendContactForm(data: { fullName: string; email: string; message: string; }) {
  try {
    const response = await apiClient.post('/api/public/contact', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
}


// --- PASSWORD RESET FUNCTIONS ---

export async function forgotPassword(email: string) {
    try {
        const response = await apiClient.post('/api/auth/forgot-password', { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to send reset link.');
    }
}

export async function resetPassword(token: string, userId: string, newPassword: string) {
    try {
        const response = await apiClient.post('/api/auth/reset-password', { 
            token, 
            userId, 
            newPassword 
        });
        return response.data;
    } catch (error: any) {
        console.error('Reset password error:', error);
        throw new Error(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
    }
}
