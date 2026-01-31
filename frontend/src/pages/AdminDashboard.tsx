import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ServiceRequestsTable } from '../components/dashboard/ServiceRequestsTable';
import { VendorManagementTable } from '../components/dashboard/VendorManagementTable';
import { UserManagementTable } from '../components/dashboard/UserManagementTable';
import { Users, Briefcase, ClipboardList } from 'lucide-react'; // Assuming icons exist

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'vendors' | 'users'>('requests');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Stats Section - Always visible */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Overview</h2>
          <StatsCards />
        </div>

        {/* Custom Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'requests' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Service Requests
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'vendors' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Vendor Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            User Management
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'requests' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Service Requests</h2>
              <ServiceRequestsTable />
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Manage Vendors</h2>
              <VendorManagementTable />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Manage Users</h2>
              <UserManagementTable />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}