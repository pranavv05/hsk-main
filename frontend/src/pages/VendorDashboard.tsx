// src/pages/VendorDashboard.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { 
  fetchVendorServiceRequests, 
  acceptServiceRequest, 
  completeServiceRequest, 
  fetchVendorProfile, 
  updateVendorProfile,
  fetchServices
} from '../utils/apiService';
import { AlertCircle, Edit, Check, Loader2, CheckCircle, XCircle } from 'lucide-react';

// --- Interfaces for our data types ---
interface Service { _id: string; name: string; }
interface ServiceRequest {
  _id: string; 
  title: string; 
  description: string; 
  userName: string; 
  userContact: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'; 
  createdAt: string;
}
interface VendorProfile {
  _id: string; fullName: string; email: string; phone: string; serviceType: string;
  description: string; experience: number; isVerified: boolean; servicesCompleted: number; rating: number;
  photoUrl?: string; idProofUrl?: string; addressProofUrl?: string;
}

export function VendorDashboard() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<VendorProfile>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [requestsData, profileData, servicesData] = await Promise.all([
          fetchVendorServiceRequests(), fetchVendorProfile(), fetchServices()
        ]);
        setServiceRequests(requestsData);
        setVendorProfile(profileData);
        setProfileForm(profileData || {});
        setAvailableServices(servicesData);
      } catch (error) { console.error('Error loading vendor data:', error); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: name === 'experience' ? Number(value) : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files ? files[0] : null;
    if (name === 'idProof') setIdProofFile(file);
    if (name === 'addressProof') setAddressProofFile(file);
    if (name === 'photo') setPhotoFile(file);
  };
  
  const validateProfileForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!profileForm.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!profileForm.phone?.trim()) errors.phone = 'Phone number is required';
    if (!profileForm.description?.trim()) errors.description = 'Description is required';
    if (!profileForm.serviceType) errors.serviceType = 'Please select a service type';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    const formData = new FormData();
    Object.entries(profileForm).forEach(([key, value]) => {
        if(value !== null && value !== undefined) formData.append(key, String(value));
    });
    if (idProofFile) formData.append('idProof', idProofFile);
    if (addressProofFile) formData.append('addressProof', addressProofFile);
    if (photoFile) formData.append('photo', photoFile);

    try {
      const updatedProfile = await updateVendorProfile(formData);
      setVendorProfile(updatedProfile);
      setProfileForm(updatedProfile);
      setIdProofFile(null); setAddressProofFile(null); setPhotoFile(null);
      setIsEditingProfile(false);
      setSubmitStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error: any) {
      setSubmitStatus({ type: 'error', message: error.message || 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptServiceRequest(requestId);
      setServiceRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: 'IN_PROGRESS' } : r));
    } catch (error) { console.error('Error accepting service request:', error); }
  };

  const handleComplete = async (requestId: string) => {
    try {
      await completeServiceRequest(requestId);
      setServiceRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: 'COMPLETED' } : r));
      const refreshedProfile = await fetchVendorProfile();
      setVendorProfile(refreshedProfile);
    } catch (error) { console.error('Error completing service request:', error); }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
      
      {submitStatus && (
        <div className={`p-4 mb-4 rounded-md flex items-center justify-between ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex items-center">
            {submitStatus.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3" /> : <XCircle className="h-5 w-5 mr-3" />}
            {submitStatus.message}
          </div>
          <button onClick={() => setSubmitStatus(null)} className="text-xl font-bold leading-none">×</button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Your Profile</h2>
          {!isEditingProfile && (
            <button onClick={() => { setIsEditingProfile(true); setSubmitStatus(null); }} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
              <Edit className="h-4 w-4 mr-1" /> Edit Profile
            </button>
          )}
        </div>
        {loading ? <p>Loading profile...</p> : isEditingProfile ? (
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={profileForm.fullName || ''} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}/>
                {formErrors.fullName && <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" id="phone" name="phone" value={profileForm.phone || ''} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}/>
                {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select id="serviceType" name="serviceType" value={profileForm.serviceType || ''} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${formErrors.serviceType ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">-- Select Your Service --</option>
                  {availableServices.map(service => (<option key={service._id} value={service.name}>{service.name}</option>))}
                </select>
                {formErrors.serviceType && <p className="text-red-600 text-sm mt-1">{formErrors.serviceType}</p>}
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input type="number" id="experience" name="experience" value={profileForm.experience || 0} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="description" name="description" value={profileForm.description || ''} onChange={handleInputChange} rows={4} className={`w-full px-3 py-2 border rounded-md ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                {formErrors.description && <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>}
              </div>
            </div>
            <h3 className="text-md font-semibold mb-2 border-t pt-4">Document Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                    <label htmlFor="idProof" className="block text-sm font-medium text-gray-700 mb-1">ID Proof (Aadhar/PAN) *</label>
                    <input type="file" id="idProof" name="idProof" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    {idProofFile ? <span className="text-xs text-green-600 mt-1 block">New: {idProofFile.name}</span> : vendorProfile?.idProofUrl && <a href={vendorProfile.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View current ID Proof</a>}
                </div>
                <div>
                    <label htmlFor="addressProof" className="block text-sm font-medium text-gray-700 mb-1">Address Proof *</label>
                    <input type="file" id="addressProof" name="addressProof" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    {addressProofFile ? <span className="text-xs text-green-600 mt-1 block">New: {addressProofFile.name}</span> : vendorProfile?.addressProofUrl && <a href={vendorProfile.addressProofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View current Address Proof</a>}
                </div>
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Passport size photo</label>
                    <input type="file" id="photo" name="photo" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    {photoFile ? <span className="text-xs text-green-600 mt-1 block">New: {photoFile.name}</span> : vendorProfile?.photoUrl && <a href={vendorProfile.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View current Photo</a>}
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
                {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : vendorProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start">
                <img src={vendorProfile.photoUrl || `https://ui-avatars.com/api/?name=${vendorProfile.fullName.replace(/\s/g, '+')}&background=random`} alt={vendorProfile.fullName} className="h-32 w-32 rounded-full object-cover mb-4" />
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${vendorProfile.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{vendorProfile.isVerified ? 'Verified' : 'Pending Verification'}</span>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-2xl font-bold">{vendorProfile.fullName}</h3>
                <p className="text-gray-600">{vendorProfile.serviceType.replace(/_/g, ' ')}</p>
                <p className="text-gray-500 mt-4">{vendorProfile.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
                    <div><h4 className="text-sm text-gray-500">Email</h4><p>{vendorProfile.email}</p></div>
                    <div><h4 className="text-sm text-gray-500">Phone</h4><p>{vendorProfile.phone}</p></div>
                    <div><h4 className="text-sm text-gray-500">Experience</h4><p>{vendorProfile.experience} years</p></div>
                    <div><h4 className="text-sm text-gray-500">Services Completed</h4><p>{vendorProfile.servicesCompleted}</p></div>
                </div>
                 <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm text-gray-500 mb-2">Uploaded Documents</h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                    {vendorProfile.idProofUrl ? <a href={vendorProfile.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View ID Proof</a> : <span className="text-gray-400">ID Proof Not Uploaded</span>}
                    {vendorProfile.addressProofUrl ? <a href={vendorProfile.addressProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Address Proof</a> : <span className="text-gray-400">Address Proof Not Uploaded</span>}
                    {vendorProfile.photoUrl ? <a href={vendorProfile.photoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Photo</a> : <span className="text-gray-400">Photo Not Uploaded</span>}
                  </div>
              </div>
            </div>
          </div>
        ) : <p>Could not load vendor profile.</p> }
      </div>

      <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Your Service Requests</h2>
          {loading ? (
            <p>Loading service requests...</p>
          ) : serviceRequests.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No service requests</h3>
              <p className="mt-2 text-gray-500">You do not have any pending or assigned service requests.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceRequests.map(request => (
                    <tr key={request._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.title}</div>
                        <div className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                        <div className="text-sm text-gray-500">{request.userContact}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>{request.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'ASSIGNED' && (
                          <button onClick={() => handleAccept(request._id)} className="text-blue-600 hover:text-blue-900 flex items-center">
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </button>
                        )}
                        {request.status === 'IN_PROGRESS' && (
                          <button onClick={() => handleComplete(request._id)} className="text-green-600 hover:text-green-900 flex items-center">
                            <Check className="h-4 w-4 mr-1" /> Complete
                          </button>
                        )}
                        {request.status === 'COMPLETED' && <span className="text-gray-500">Finished</span>}
                        {request.status === 'PENDING' && <span className="text-gray-500">Awaiting Assignment</span>}
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