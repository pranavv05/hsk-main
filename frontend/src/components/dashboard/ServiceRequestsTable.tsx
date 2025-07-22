// src/components/dashboard/ServiceRequestsTable.tsx
import React, { useState, useEffect } from 'react';
import { fetchAllServiceRequests, fetchAdminVendors, assignVendorToRequest } from '../../utils/apiService';

// Interfaces for our data types
interface Request { 
  _id: string; 
  title: string; 
  description: string; 
  status: string; 
  serviceType: string; 
  user: { name: string }; 
  vendor?: { name: string }; 
  createdAt: string; 
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

// --- Details Modal Component ---
const RequestDetailsModal = ({ request, onClose }: { request: Request; onClose: () => void; }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{request.title}</h3>
            <div className="space-y-3 text-sm">
                <p><strong>User:</strong> {request.user.name}</p>
                <p><strong>Service Type:</strong> {request.serviceType}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Requested on:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold">Description:</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{request.description}</p>
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
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
        const [requestsData, vendorsData] = await Promise.all([ fetchAllServiceRequests(), fetchAdminVendors() ]);
        setRequests(requestsData);
        setVendors(vendorsData);
      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const handleAssignVendor = async (vendorId: string) => {
    if (!assignModalRequest) return;
    try {
        await assignVendorToRequest(assignModalRequest._id, vendorId);
        const updatedRequests = await fetchAllServiceRequests();
        setRequests(updatedRequests);
        setAssignModalRequest(null);
    } catch (err) { console.error("Failed to assign vendor", err); }
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

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">Could not load requests: {error}</p>;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(request => (
              <tr key={request._id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{request.title}</div>
                  <div className="text-sm text-gray-500">{request.serviceType}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{request.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{request.vendor?.name || 'Not Assigned'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>{request.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <button onClick={() => setDetailsModalRequest(request)} className="text-indigo-600 hover:text-indigo-900">View</button>
                  {request.status === 'PENDING' && ( <button onClick={() => setAssignModalRequest(request)} className="text-blue-600 hover:text-blue-900">Assign</button> )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assignModalRequest && ( <AssignVendorModal request={assignModalRequest} vendors={vendors} onClose={() => setAssignModalRequest(null)} onAssign={handleAssignVendor} /> )}
      {detailsModalRequest && ( <RequestDetailsModal request={detailsModalRequest} onClose={() => setDetailsModalRequest(null)} /> )}
    </>
  );
}