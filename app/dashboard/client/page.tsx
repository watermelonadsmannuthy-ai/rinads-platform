// Client Dashboard
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, DollarSign, Calendar, MessageSquare, Upload, CheckCircle } from 'lucide-react';

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    const tid = localStorage.getItem('tenant_id') || '';
    setTenantId(tid);
    fetchData(tid);
  }, []);

  async function fetchData(tid: string) {
    if (!tid) return;

    const headers = { 'x-tenant-id': tid };
    const clientId = localStorage.getItem('client_id') || '';

    try {
      const [tasksRes, invoicesRes, contentRes] = await Promise.all([
        fetch(`/api/tasks?client_id=${clientId}`, { headers }),
        fetch(`/api/invoices?client_id=${clientId}`, { headers }),
        fetch(`/api/content-calendar?client_id=${clientId}`, { headers }),
      ]);

      const tasksData = await tasksRes.json();
      const invoicesData = await invoicesRes.json();
      const contentData = await contentRes.json();

      setProjects(tasksData.tasks || []);
      setInvoices(invoicesData.invoices || []);
      setContent(contentData.content || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const pendingInvoices = invoices.filter((i) => i.payment_status === 'pending');
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
          <Link
            href="/dashboard/client/messages"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Messages
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">{activeProjects.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Invoices</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Scheduled Content</p>
                <p className="text-3xl font-bold text-gray-900">{content.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Active Projects
            </h2>
            <Link href="/dashboard/client/projects" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <p className="text-gray-500">No active projects</p>
          ) : (
            <div className="space-y-3">
              {activeProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                      {project.due_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(project.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : project.status === 'pending'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoices
            </h2>
            <Link href="/dashboard/client/invoices" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>

          {invoices.length === 0 ? (
            <p className="text-gray-500">No invoices</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{invoice.invoice_number}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Amount: ₹{invoice.total?.toLocaleString()}
                      </p>
                      {invoice.due_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(invoice.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.payment_status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {invoice.payment_status}
                      </span>
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Calendar Preview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Content Calendar
            </h2>
            <Link href="/dashboard/client/content" className="text-blue-600 hover:underline text-sm">
              View Calendar
            </Link>
          </div>

          {content.length === 0 ? (
            <p className="text-gray-500">No content scheduled</p>
          ) : (
            <div className="space-y-3">
              {content.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(item.scheduled_date).toLocaleDateString()} at{' '}
                        {new Date(item.scheduled_date).toLocaleTimeString()}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {item.platform}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Requirements
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-gray-500">Supports images, videos, and documents</p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                // Handle file upload
                console.log('Files selected:', e.target.files);
              }}
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Choose Files
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

