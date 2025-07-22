// src/pages/Contact.tsx
import React, { useState } from 'react';
// --- CHANGED: Importing from our real apiService ---
import { sendContactForm } from '../utils/apiService';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; message?: string; }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Your handleChange and validate functions are perfect, no changes needed.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors && errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: { fullName?: string; email?: string; message?: string; } = {};
    if (!formData.fullName.trim()) { newErrors.fullName = 'Full name is required'; }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Please enter a valid email address'; }
    if (!formData.message.trim()) { newErrors.message = 'Message is required'; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // --- CHANGED: This now calls our backend API ---
      const response = await sendContactForm(formData); 
      console.log('Backend response:', response); // You can see what the backend sent back
      
      setSubmitted(true);
      setFormData({ fullName: '', email: '', message: '' }); // Clear the form on success
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Display a more specific error if the backend provides one
      alert(error.message || 'There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Your JSX is perfect and does not need any changes ---
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 inline-flex justify-center mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Phone</h3>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-gray-600">+91 12345 67890</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 inline-flex justify-center mb-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <p className="text-gray-600">info@hindusevakendra.com</p>
                <p className="text-gray-600">support@hindusevakendra.com</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-3 inline-flex justify-center mb-3">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Address</h3>
                <p className="text-gray-600">123 Hindu Seva Road</p>
                <p className="text-gray-600">
                  Mumbai, Maharashtra, India 400001
                </p>
              </div>
            </div>
          </div>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Thank you for your message!
              </h2>
              <p className="text-green-700 mb-4">
                We will get back to you as soon as possible.
              </p>
              <button onClick={() => setSubmitted(false)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-4 py-2 border ${errors?.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Your full name" />
                  {errors?.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border ${errors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Your email address" />
                  {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} className={`w-full px-4 py-2 border ${errors?.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="How can we help you?"></textarea>
                  {errors?.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>
                <div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}