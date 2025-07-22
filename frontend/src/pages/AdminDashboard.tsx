import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ServiceRequestsTable } from '../components/dashboard/ServiceRequestsTable';
import { VendorManagementTable } from '../components/dashboard/VendorManagementTable';
export function AdminDashboard() {
  return <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Real-time Statistics</h2>
        <StatsCards />
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Service Requests</h2>
        <ServiceRequestsTable />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Vendor Management</h2>
        <VendorManagementTable />
      </div>
    </DashboardLayout>;
}