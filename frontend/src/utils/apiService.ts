// src/utils/apiService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
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
    const response = await apiClient.post('/auth/register', userData);
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
    const response = await apiClient.post('/auth/login', { email, password });
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
        const response = await apiClient.get('/requests');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch service requests');
    }
}

export async function createServiceRequest(requestData: any) {
    try {
        const response = await apiClient.post('/requests', requestData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create service request');
    }
}

export async function cancelServiceRequest(requestId: string) {
  try {
    const response = await apiClient.patch(`/requests/${requestId}/cancel`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to cancel service request');
  }
}


// --- VENDOR-SPECIFIC FUNCTIONS ---

export async function fetchVendorProfile() {
  try {
    const response = await apiClient.get('/vendors/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor profile');
  }
}

// THIS IS THE CORRECT, FINAL VERSION FOR FILE UPLOADS
export async function updateVendorProfile(profileData: FormData) {
    try {
        const response = await apiClient.put('/vendors/profile', profileData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch(error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update vendor profile');
    }
}

export async function fetchVendorServiceRequests() {
  try {
    const response = await apiClient.get('/requests/vendor');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch requests');
  }
}

export async function acceptServiceRequest(requestId: string) {
  try {
    const response = await apiClient.patch(`/requests/${requestId}/accept`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to accept request');
  }
}

export async function completeServiceRequest(requestId: string) {
  try {
    const response = await apiClient.patch(`/requests/${requestId}/complete`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to complete request');
  }
}


// --- ADMIN-SPECIFIC FUNCTIONS ---

export async function fetchAdminStats() {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
  }
}

export async function fetchAdminVendors() {
  try {
    const response = await apiClient.get('/admin/vendors');
    return response.data;
  } catch (error: any)    {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
  }
}

export async function assignVendorToRequest(requestId: string, vendorId: string) {
    try {
        const response = await apiClient.patch(`/admin/requests/${requestId}/assign`, { vendorId });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to assign vendor');
    }
}

export async function toggleVendorVerification(vendorId: string, isVerified: boolean) {
    try {
        const response = await apiClient.patch(`/admin/vendors/${vendorId}/verify`, { isVerified });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update verification');
    }
}

export async function fetchAllServiceRequests() {
  try {
    const response = await apiClient.get('/requests/all');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all requests');
  }
}


// --- PUBLIC DATA FUNCTIONS ---

export async function fetchServices() {
  try {
    const response = await apiClient.get('/public/services');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
}

export async function fetchTestimonials() {
  try {
    const response = await apiClient.get('/public/testimonials');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonials');
  }
}

export async function fetchFeatures() {
  try {
    const response = await apiClient.get('/public/features');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch features');
  }
}

export async function fetchAboutPageData() {
    try {
        const response = await apiClient.get('/public/about');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch About Us data');
    }
}

export async function sendContactForm(data: { fullName: string; email: string; message: string; }) {
  try {
    const response = await apiClient.post('/public/contact', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
}


// --- PASSWORD RESET FUNCTIONS ---

export async function forgotPassword(email: string) {
    try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to send reset link.');
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to reset password.');
    }
}
