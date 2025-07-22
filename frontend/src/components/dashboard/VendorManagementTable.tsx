// src/components/dashboard/VendorManagementTable.tsx
import React, { useState, useEffect } from 'react';
import { fetchAdminVendors, toggleVendorVerification } from '../../utils/apiService';

// --- Interface with all vendor details for the modal ---
interface Vendor {
  _id: string;
  fullName: string;
  user: { email: string };
  phone: string;
  serviceType: string;
  description: string;
  experience: number;
  isVerified: boolean;
  photoUrl?: string;
  idProofUrl?: string;
  addressProofUrl?: string;
  createdAt: string;
}

// --- The Modal component to display vendor details ---
const VendorDetailsModal = ({ vendor, onClose }: { vendor: Vendor; onClose: () => void; }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-start space-x-6">
                <img 
                    src={vendor.photoUrl || `https://ui-avatars.com/api/?name=${vendor.fullName.replace(/\s/g, '+')}&background=random`} 
                    alt={vendor.fullName} 
                    className="h-24 w-24 rounded-full object-cover" 
                />
                <div>
                    <h2 className="text-2xl font-bold">{vendor.fullName}</h2>
                    <p className="text-gray-600">{vendor.serviceType}</p>
                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {vendor.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
                <p className="text-gray-700">{vendor.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4 text-sm">
                <div><h4 className="font-semibold text-gray-500">Email</h4><p>{vendor.user.email}</p></div>
                <div><h4 className="font-semibold text-gray-500">Phone</h4><p>{vendor.phone || 'N/A'}</p></div>
                <div><h4 className="font-semibold text-gray-500">Experience</h4><p>{vendor.experience || 0} years</p></div>
                <div><h4 className="font-semibold text-gray-500">Joined On</h4><p>{new Date(vendor.createdAt).toLocaleDateString()}</p></div>
            </div>

            <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-gray-500 text-sm mb-2">Uploaded Documents</h4>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                    {vendor.idProofUrl ? <a href={vendor.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View ID Proof</a> : <span className="text-gray-400">ID Proof Not Uploaded</span>}
                    {vendor.addressProofUrl ? <a href={vendor.addressProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Address Proof</a> : <span className="text-gray-400">Address Proof Not Uploaded</span>}
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
            </div>
        </div>
    </div>
);

export function VendorManagementTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to manage which vendor is being viewed in the modal
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await fetchAdminVendors();
        setVendors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, []);
  
  const handleVerificationToggle = async (vendorId: string, currentStatus: boolean) => {
    try {
      setVendors(vendors.map(v => v._id === vendorId ? { ...v, isVerified: !currentStatus } : v));
      await toggleVendorVerification(vendorId, !currentStatus);
    } catch (err: any) {
      console.error("Failed to update verification", err);
      setVendors(vendors.map(v => v._id === vendorId ? { ...v, isVerified: currentStatus } : v));
    }
  };

  if (loading) return <p>Loading vendors...</p>;
  if (error) return <p className="text-red-500">Could not load vendors: {error}</p>;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map(vendor => (
              <tr key={vendor._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.serviceType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {vendor.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  {/* --- THIS IS THE RESTORED VIEW BUTTON --- */}
                  <button onClick={() => setViewingVendor(vendor)} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </button>
                  <button onClick={() => handleVerificationToggle(vendor._id, vendor.isVerified)} className="text-blue-600 hover:text-blue-800">
                    {vendor.isVerified ? 'Un-verify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- THIS IS THE RESTORED MODAL --- */}
      {viewingVendor && (
        <VendorDetailsModal vendor={viewingVendor} onClose={() => setViewingVendor(null)} />
      )}
    </>
  );
}