// src/components/dashboard/ServiceRequestsTable.tsx
import { useState, useEffect } from 'react';
import { fetchAdminServiceRequests, fetchAdminVendors, assignVendorToRequest } from '../../utils/apiService';

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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignModalRequest, setAssignModalRequest] = useState<Request | null>(null);
  const [detailsModalRequest, setDetailsModalRequest] = useState<Request | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [requestsData, vendorsData] = await Promise.all([
          fetchAdminServiceRequests(),
          fetchAdminVendors()
        ]);
        console.log('Admin Service Requests Data:', requestsData); // Debug log
        setRequests(requestsData);
        setVendors(vendorsData);
      } catch (err: any) { 
        console.error('Error loading data:', err);
        setError(err.message);
      } finally { 
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAssignVendor = async (vendorId: string) => {
    if (!assignModalRequest) return;
    try {
        await assignVendorToRequest(assignModalRequest._id, vendorId);
        const updatedRequests = await fetchAdminServiceRequests();
        setRequests(updatedRequests);
        setAssignModalRequest(null);
    } catch (err) { console.error("Failed to assign vendor", err); }
  };
  
  // getStatusBadgeClass is now defined at the module level

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">Could not load requests: {error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.title}</div>
                  <div className="text-xs text-gray-500">{request.serviceType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.user?.name || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{request.user?.email || 'No email'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.user?.phone ? (
                    <div>
                      <a 
                        href={`tel:${request.user.phone}`} 
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        {request.user.phone}
                      </a>
                      <a 
                        href={`mailto:${request.user.email}`}
                        className="text-xs text-gray-500 hover:text-blue-600 mt-1 block"
                      >
                        {request.user.email}
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not provided</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs" title={request.user?.address}>
                    {request.user?.address || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {request.vendor?.name || 'Not Assigned'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <button 
                    onClick={() => setDetailsModalRequest(request)} 
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  {request.status === 'PENDING' && (
                    <button 
                      onClick={() => setAssignModalRequest(request)} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modals */}
      {assignModalRequest && (
        <AssignVendorModal 
          request={assignModalRequest} 
          vendors={vendors} 
          onClose={() => setAssignModalRequest(null)} 
          onAssign={handleAssignVendor} 
        />
      )}
      
      {detailsModalRequest && (
        <RequestDetailsModal 
          request={detailsModalRequest} 
          onClose={() => setDetailsModalRequest(null)} 
        />
      )}
    </div>
  );
}