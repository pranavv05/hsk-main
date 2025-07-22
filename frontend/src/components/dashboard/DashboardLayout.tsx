import React from 'react';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  return <div className="bg-gray-50 min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>;
}