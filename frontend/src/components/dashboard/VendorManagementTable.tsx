import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchAdminVendors, toggleVendorVerification, deleteVendor } from '../../utils/apiService';
import { Trash2 } from 'lucide-react';

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
const VendorDetailsModal = ({ vendor, onClose }: { vendor: Vendor; onClose: () => void; }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div className="flex items-center space-x-4">
                         <img 
                            src={vendor.photoUrl || `https://ui-avatars.com/api/?name=${vendor.fullName.replace(/\s/g, '+')}&background=random`} 
                            alt={vendor.fullName} 
                            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md" 
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{vendor.fullName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                 <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {vendor.serviceType}
                                 </span>
                                 <span className={`px-2 py-0.5 rounded text-xs font-medium ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {vendor.isVerified ? 'Verified' : 'Pending Verification'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                        title="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {vendor.description || "No description provided."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Contact Email</h4>
                                <p className="text-gray-900 font-medium">{vendor.user.email}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Phone Number</h4>
                                <p className="text-gray-900 font-medium">{vendor.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Experience</h4>
                                <p className="text-gray-900 font-medium">{vendor.experience ? `${vendor.experience} Years` : 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Joined On</h4>
                                <p className="text-gray-900 font-medium">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Uploaded Documents</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Document Cards */}
                            <a href={vendor.idProofUrl} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all ${vendor.idProofUrl ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                                <span className="text-sm font-medium">ID Proof</span>
                            </a>
                            <a href={vendor.addressProofUrl} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all ${vendor.addressProofUrl ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                <span className="text-sm font-medium">Address Proof</span>
                            </a>
                             <a href={vendor.photoUrl} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all ${vendor.photoUrl ? 'border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-sm font-medium">Photo</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export function VendorManagementTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVendors(vendors);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = vendors.filter(vendor => 
        vendor.fullName.toLowerCase().includes(term) ||
        (vendor.user?.email?.toLowerCase().includes(term)) ||
        (vendor.serviceType?.toLowerCase().includes(term)) ||
        (vendor.phone?.includes(term))
      );
      setFilteredVendors(filtered);
    }
  }, [searchTerm, vendors]);

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

  const handleDelete = async (vendorId: string) => {
    if (!window.confirm('Are you sure you want to delete this vendor? This will also delete their linked User account. This action cannot be undone.')) {
      return;
    }

    try {
      await deleteVendor(vendorId);
      setVendors(vendors.filter(v => v._id !== vendorId));
      alert('Vendor deleted successfully');
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50/30">
        <h3 className="text-xl font-bold text-gray-800">Vendors ({filteredVendors.length})</h3>
        <div className="relative">
             <input
            type="text"
            className="pl-4 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm w-64 transition-all"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="p-6 text-center text-gray-500">Loading vendors...</p>
      ) : error ? (
        <p className="p-6 text-center text-red-500">Could not load vendors: {error}</p>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No vendors found.</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{vendor.user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{vendor.serviceType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {vendor.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      <button onClick={() => setViewingVendor(vendor)} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                        View
                      </button>
                      <button onClick={() => handleVerificationToggle(vendor._id, vendor.isVerified)} className="text-blue-600 hover:text-blue-800 transition-colors">
                        {vendor.isVerified ? 'Un-verify' : 'Verify'}
                      </button>
                      <button 
                        onClick={() => handleDelete(vendor._id)} 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex align-middle"
                        title="Delete Vendor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4 p-4 bg-gray-50/50">
            {filteredVendors.map(vendor => (
              <div key={vendor._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {vendor.fullName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{vendor.fullName}</h3>
                            <p className="text-xs text-gray-500">{vendor.serviceType}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {vendor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                 </div>
                 
                 <div className="text-sm text-gray-600 mb-4 space-y-1 pl-13">
                    <p className="truncate">{vendor.user.email}</p>
                 </div>

                 <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button onClick={() => setViewingVendor(vendor)} className="text-sm font-medium text-indigo-600 p-2">
                        View Profile
                    </button>
                    <div className="flex space-x-2">
                         <button onClick={() => handleVerificationToggle(vendor._id, vendor.isVerified)} className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
                            {vendor.isVerified ? 'Un-verify' : 'Verify'}
                         </button>
                         <button onClick={() => handleDelete(vendor._id)} className="text-red-500 bg-red-50 p-1.5 rounded-md">
                            <Trash2 className="w-4 h-4" />
                         </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {viewingVendor && (
        <VendorDetailsModal vendor={viewingVendor} onClose={() => setViewingVendor(null)} />
      )}
    </div>
  );
}