// src/components/dashboard/StatsCards.tsx
import React, { useState, useEffect } from 'react';
import { fetchAdminStats } from '../../utils/apiService';
// --- CHANGED: 'Tool' is now 'Wrench' ---
import { Users, Wrench, FileText, CheckCircle, Clock } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalVendors: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
}

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p className="text-red-500">Could not load stats: {error}</p>;
  if (!stats) return <p>No statistics available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard icon={<Users size={24}/>} title="Total Users" value={stats.totalUsers} />
      {/* --- CHANGED: Using <Wrench /> instead of <Tool /> --- */}
      <StatCard icon={<Wrench size={24}/>} title="Total Vendors" value={stats.totalVendors} />
      <StatCard icon={<FileText size={24}/>} title="Total Requests" value={stats.totalRequests} />
      <StatCard icon={<Clock size={24}/>} title="Pending Requests" value={stats.pendingRequests} />
      <StatCard icon={<CheckCircle size={24}/>} title="Completed" value={stats.completedRequests} />
    </div>
  );
}