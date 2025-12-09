// Admin Dashboard
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tasks: { total: 0, pending: 0, overdue: 0 },
    clients: { total: 0, active: 0 },
    leads: { total: 0, new: 0 },
    invoices: { total: 0, pending: 0, amount: 0 },
    attendance: { present: 0 },
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const tenantId = localStorage.getItem('tenant_id') || '';
      const headers = { 'x-tenant-id': tenantId };

      const [tasks, clients, leads, invoices, attendance] = await Promise.all([
        fetch('/api/tasks', { headers }).then((r) => r.json()),
        fetch('/api/clients', { headers }).then((r) => r.json()),
        fetch('/api/leads', { headers }).then((r) => r.json()),
        fetch('/api/invoices?payment_status=pending', { headers }).then((r) => r.json()),
        fetch('/api/attendance/summary', { headers }).then((r) => r.json()).catch(() => ({ attendance: [] })),
      ]);

      setStats({
        tasks: {
          total: tasks.tasks?.length || 0,
          pending: tasks.tasks?.filter((t: any) => t.status === 'pending').length || 0,
          overdue: tasks.tasks?.filter((t: any) => t.status === 'overdue').length || 0,
        },
        clients: {
          total: clients.clients?.length || 0,
          active: clients.clients?.filter((c: any) => c.status === 'active').length || 0,
        },
        leads: {
          total: leads.leads?.length || 0,
          new: leads.leads?.filter((l: any) => l.status === 'new').length || 0,
        },
        invoices: {
          total: invoices.invoices?.length || 0,
          pending: invoices.invoices?.filter((i: any) => i.payment_status === 'pending').length || 0,
          amount: invoices.invoices?.reduce((sum: number, i: any) => sum + (i.total || 0), 0) || 0,
        },
        attendance: {
          present: attendance.attendance?.filter((a: any) => a.time_in && !a.time_out).length || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tasks"
            value={stats.tasks.total}
            subtitle={`${stats.tasks.pending} pending, ${stats.tasks.overdue} overdue`}
            color="blue"
            link="/dashboard/admin/tasks"
          />
          <StatCard
            title="Clients"
            value={stats.clients.total}
            subtitle={`${stats.clients.active} active`}
            color="green"
            link="/dashboard/admin/clients"
          />
          <StatCard
            title="Leads"
            value={stats.leads.total}
            subtitle={`${stats.leads.new} new`}
            color="purple"
            link="/dashboard/admin/leads"
          />
          <StatCard
            title="Pending Invoices"
            value={`₹${stats.invoices.amount.toLocaleString()}`}
            subtitle={`${stats.invoices.pending} invoices`}
            color="orange"
            link="/dashboard/admin/invoices"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/admin/tasks/new"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium">New Task</div>
            </Link>
            <Link
              href="/dashboard/admin/clients/new"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium">Add Client</div>
            </Link>
            <Link
              href="/dashboard/admin/invoices/new"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium">Create Invoice</div>
            </Link>
            <Link
              href="/dashboard/admin/content/new"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium">Schedule Content</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Loading recent tasks...</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Loading recent leads...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color, link }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  return (
    <Link href={link || '#'} className={`p-6 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} hover:shadow-md transition`}>
      <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </Link>
  );
}

