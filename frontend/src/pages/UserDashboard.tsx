import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
// CHANGED: Import from the new apiService file
import { fetchUserServiceRequests, createServiceRequest, cancelServiceRequest } from '../utils/apiService';
import { AlertCircle, PlusCircle, XCircle } from 'lucide-react';

// CHANGED: The interface now uses `_id` from MongoDB.
interface ServiceRequest {
  _id: string; 
  title: string;
  description: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  vendorName?: string;
  createdAt: string;
}

export function UserDashboard() {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    serviceType: 'ELECTRICIAN'
  });
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string; }>({});

  useEffect(() => {
    const loadServiceRequests = async () => {
      try {
        // This now calls the REAL backend API!
        const data = await fetchUserServiceRequests();
        setServiceRequests(data);
      } catch (error) {
        console.error('Error loading service requests:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServiceRequests();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: { title?: string; description?: string; } = {};
    if (!newRequest.title.trim()) { errors.title = 'Title is required'; }
    if (!newRequest.description.trim()) { errors.description = 'Description is required'; }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const newServiceRequest = await createServiceRequest(newRequest);
      setServiceRequests([newServiceRequest, ...serviceRequests]);
      setNewRequest({ title: '', description: '', serviceType: 'ELECTRICIAN' });
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating service request:', error);
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      // This now calls the REAL backend API!
      await cancelServiceRequest(requestId);
      // Optimistically update the UI. This is good practice.
      setServiceRequests(serviceRequests.map(request =>
        request._id === requestId ? { ...request, status: 'CANCELLED' } : request
      ));
    } catch (error) {
      console.error('Error cancelling service request:', error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      {/* ... (Your JSX for the header and user profile remains the same) ... */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          {isFormOpen ? <>
              <XCircle className="h-5 w-5 mr-2" />
              Cancel
            </> : <>
              <PlusCircle className="h-5 w-5 mr-2" />
              New Service Request
            </>}
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center">
          <div className="mr-4">
            {user?.profileImage ? <img src={user.profileImage} alt={user.name} className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">
                  {user?.name.charAt(0)}
                </span>
              </div>}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
      {/* ... (Your JSX for the form remains the same) ... */}
      {isFormOpen && <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Service Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select id="serviceType" name="serviceType" value={newRequest.serviceType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="ELECTRICIAN">Electrician</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="CARPENTER">Carpenter</option>
                <option value="WEB_DEVELOPER">Web Developer</option>
                <option value="CLEANER">Cleaner</option>
                <option value="TUTOR">Tutor</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input type="text" id="title" name="title" value={newRequest.title} onChange={handleInputChange} placeholder="Brief title for your service request" className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
              {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea id="description" name="description" value={newRequest.description} onChange={handleInputChange} rows={4} placeholder="Detailed description of what you need" className={`w-full px-3 py-2 border ${formErrors.description ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}></textarea>
              {formErrors.description && <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setIsFormOpen(false)} className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Submit Request
              </button>
            </div>
          </form>
        </div>}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Service Requests</h2>
        {loading ? ( <div className="text-center py-8">Loading your service requests...</div> ) 
        : serviceRequests.length === 0 ? (
          // ... (Your JSX for empty state remains the same) ...
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No service requests yet
            </h3>
            <p className="mt-2 text-gray-500">
              Create your first service request to find a vendor.
            </p>
            <button onClick={() => setIsFormOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Service Request
            </button>
          </div> 
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceRequests.map(request => (
                  // CHANGED: Use `_id` for the key prop
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{request.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.vendorName || 'Not assigned yet'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                      {request.status === 'PENDING' && (
                        // CHANGED: Use `_id` in the onClick handler
                        <button onClick={() => handleCancel(request._id)} className="text-red-600 hover:text-red-900">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}