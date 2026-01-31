// src/components/dashboard/ServiceRequestsTable.tsx
import { useState, useEffect } from 'react';
import { fetchAdminServiceRequests, fetchAdminVendors, assignVendorToRequest, deleteServiceRequest } from '../../utils/apiService';

// Interfaces for our data types
interface Request { 
  _id: string; 
  title: string; 
  description: string; 
  status: string; 
  serviceType: string; 
  user: { 
    _id: string;
    name: string; 
    email: string;
    phone: string;
    address?: string;
  }; 
  vendor?: { 
    _id: string;
    name: string; 
  }; 
  createdAt: string; 
  updatedAt: string;
}
interface Vendor { 
  _id: string; 
  fullName: string; 
  serviceType: string; 
}

// --- Assign Vendor Modal Component ---
const AssignVendorModal = ({ request, vendors, onClose, onAssign }: { request: Request, vendors: Vendor[], onClose: () => void, onAssign: (vendorId: string) => void }) => {
    const [selectedVendor, setSelectedVendor] = useState('');
    
    const normalizeString = (str: string) => str.toUpperCase().replace(/ /g, '_');
    
    const relevantVendors = vendors.filter(vendor => 
        normalizeString(vendor.serviceType) === normalizeString(request.serviceType)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Assign Vendor for "{request.title}"</h3>
                <p className="text-sm text-gray-600 mb-4">Service Type: <span className="font-semibold">{request.serviceType}</span></p>
                <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} className="w-full p-2 border rounded-md mb-4">
                    <option value="">-- Select a Vendor --</option>
                    {relevantVendors.length > 0 ? (
                        relevantVendors.map(v => <option key={v._id} value={v._id}>{v.fullName}</option>)
                    ) : (
                        <option disabled>No vendors found for this service type</option>
                    )}
                </select>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
                    <button onClick={() => onAssign(selectedVendor)} disabled={!selectedVendor} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">Assign</button>
                </div>
            </div>
        </div>
    );
};

// Helper function for status badge styling
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

// --- Details Modal Component ---
const RequestDetailsModal = ({ request, onClose }: { request: Request; onClose: () => void; }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{request.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Request Details</h4>
                        <div className="space-y-2 text-sm">
                            <p><strong>Service Type:</strong> <span className="text-gray-600">{request.serviceType}</span></p>
                            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(request.status)}`}>
                                {request.status.replace('_', ' ')}
                            </span></p>
                            <p><strong>Requested on:</strong> <span className="text-gray-600">
                                {new Date(request.createdAt).toLocaleString()}
                            </span></p>
                            {request.updatedAt !== request.createdAt && (
                                <p><strong>Last updated:</strong> <span className="text-gray-600">
                                    {new Date(request.updatedAt).toLocaleString()}
                                </span></p>
                            )}
                        </div>
                    </div>

                    {request.vendor && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-700 mb-2">Assigned Vendor</h4>
                            <div className="text-sm">
                                <p className="font-medium">{request.vendor.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">User Information</h4>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-gray-700">Name</p>
                                    <p className="text-gray-600">{request.user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Email</p>
                                    <p className="text-gray-600 break-all">
                                        {request.user?.email ? (
                                            <a href={`mailto:${request.user.email}`} className="text-blue-600 hover:underline">
                                                {request.user.email}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Phone</p>
                                    <p className="text-gray-600">
                                        {request.user?.phone ? (
                                            <a href={`tel:${request.user.phone}`} className="text-blue-600 hover:underline">
                                                {request.user.phone}
                                            </a>
                                        ) : 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">User ID</p>
                                    <p className="text-gray-600 text-xs font-mono break-all">{request.user?._id || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <p className="font-medium text-gray-700 mb-1">Address</p>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                    {request.user?.address ? (
                                        <address className="not-italic text-gray-600 whitespace-pre-line">
                                            {request.user.address}
                                        </address>
                                    ) : (
                                        <p className="text-gray-500 italic">No address provided</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <p className="font-medium text-gray-700 mb-1">Request ID</p>
                                <p className="text-xs font-mono text-gray-500 break-all">{request._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Service Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

// --- Main Table Component ---
export function ServiceRequestsTable() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Filter requests based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRequests(requests);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = requests.filter(request => 
        request.title.toLowerCase().includes(term) ||
        request.serviceType.toLowerCase().includes(term) ||
        request.status.toLowerCase().includes(term) ||
        (request.user?.name && request.user.name.toLowerCase().includes(term)) ||
        (request.user?.email && request.user.email.toLowerCase().includes(term)) ||
        (request.user?.phone && request.user.phone.includes(term)) ||
        (request.vendor?.name && request.vendor.name.toLowerCase().includes(term))
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, requests]);

  // Update filtered requests when requests data changes
  useEffect(() => {
    setFilteredRequests(requests);
  }, [requests]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsData, vendorsData] = await Promise.all([
          fetchAdminServiceRequests(),
          fetchAdminVendors()
        ]);
        setRequests(requestsData);
        setVendors(vendorsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignVendor = async (vendorId: string) => {
    if (!selectedRequest) return;
    try {
        await assignVendorToRequest(selectedRequest._id, vendorId);
        const updatedRequests = await fetchAdminServiceRequests();
        setRequests(updatedRequests);
        setShowAssignModal(false);
    } catch (err) { console.error("Failed to assign vendor", err); }
  };

  const handleDelete = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to delete this service request? This action cannot be undone.')) {
        return;
    }
    try {
        await deleteServiceRequest(requestId);
        setRequests(prev => prev.filter(r => r._id !== requestId));
        // Filtered requests will auto-update due to useEffect dependency on 'requests'
    } catch (error) {
        console.error('Failed to delete request:', error);
        alert('Failed to delete request');
    }
  };
  
  // getStatusBadgeClass is now defined at the module level

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search requests by title, service, status, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
        </p>
      </div>

      {loading ? (
        <div className="p-4">Loading service requests...</div>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No service requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'There are currently no service requests in the system.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.title}</div>
                    <div className="text-xs text-gray-500">{request.serviceType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.user?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{request.user?.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {request.user?.phone || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.user?.address || 'No address'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}
                    >
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => setSelectedRequest(request)} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      {request.status === 'PENDING' && (
                        <button 
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowAssignModal(true);
                          }} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Assign
                        </button>
                      )}
                      <button 
                          onClick={() => handleDelete(request._id)}
                          className="text-red-600 hover:text-red-900"
                      >
                          Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modals */}
      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
      
      {showAssignModal && selectedRequest && (
        <AssignVendorModal 
          request={selectedRequest} 
          vendors={vendors} 
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignVendor}
        />
      )}
    </div>
  );
}