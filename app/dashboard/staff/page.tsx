// Staff Dashboard
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, AlertCircle, Camera, Upload } from 'lucide-react';

export default function StaffDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    const tid = localStorage.getItem('tenant_id') || '';
    setTenantId(tid);
    fetchData(tid);
  }, []);

  async function fetchData(tid: string) {
    if (!tid) return;

    const headers = { 'x-tenant-id': tid };
    const userId = localStorage.getItem('user_id') || '';

    try {
      const [tasksRes, attendanceRes, contentRes] = await Promise.all([
        fetch(`/api/tasks?staff_id=${userId}`, { headers }),
        fetch(`/api/attendance/today`, { headers }),
        fetch(`/api/content-calendar?start_date=${new Date().toISOString().split('T')[0]}`, { headers }),
      ]);

      const tasksData = await tasksRes.json();
      const attendanceData = await attendanceRes.json().catch(() => ({ attendance: null }));
      const contentData = await contentRes.json();

      setTasks(tasksData.tasks || []);
      setAttendance(attendanceData.attendance);
      setContent(contentData.content || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleQRScan() {
    setScanning(true);
    // In production, integrate with QR scanner library
    // For now, show manual input option
  }

  async function handleCheckIn() {
    try {
      const qrToken = prompt('Enter your QR token or scan QR code:');
      if (!qrToken) return;

      const response = await fetch('/api/attendance/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
          'x-scan-action': 'check_in',
        },
        body: JSON.stringify({ action: 'scan', qr_token: qrToken }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Checked in successfully!');
        fetchData(tenantId);
      } else {
        alert(result.message || 'Failed to check in');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Error checking in');
    }
    setScanning(false);
  }

  async function handleCheckOut() {
    try {
      const qrToken = prompt('Enter your QR token or scan QR code:');
      if (!qrToken) return;

      const response = await fetch('/api/attendance/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
          'x-scan-action': 'check_out',
        },
        body: JSON.stringify({ action: 'scan', qr_token: qrToken }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Checked out successfully!');
        fetchData(tenantId);
      } else {
        alert(result.message || 'Failed to check out');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Error checking out');
    }
  }

  const todayTasks = tasks.filter((t) => {
    const dueDate = t.due_date ? new Date(t.due_date).toDateString() : null;
    return dueDate === new Date().toDateString();
  });

  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <div className="flex gap-2">
            <Link
              href="/dashboard/staff/attendance"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Attendance
            </Link>
            <Link
              href="/dashboard/staff/tasks"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              All Tasks
            </Link>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Attendance
            </h2>
            {attendance?.time_in && !attendance?.time_out && (
              <span className="text-sm text-green-600 font-medium">Currently Checked In</span>
            )}
          </div>

          {attendance ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Check In:</span>
                <span className="font-medium">
                  {attendance.time_in ? new Date(attendance.time_in).toLocaleTimeString() : 'Not checked in'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check Out:</span>
                <span className="font-medium">
                  {attendance.time_out ? new Date(attendance.time_out).toLocaleTimeString() : 'Not checked out'}
                </span>
              </div>
              {attendance.duration_minutes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.floor(attendance.duration_minutes / 60)}h {attendance.duration_minutes % 60}m
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No attendance record for today</p>
          )}

          <div className="flex gap-2 mt-4">
            {!attendance?.time_in ? (
              <button
                onClick={handleCheckIn}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Check In
              </button>
            ) : attendance?.time_in && !attendance?.time_out ? (
              <button
                onClick={handleCheckOut}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                Check Out
              </button>
            ) : null}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Tasks ({todayTasks.length})
          </h2>

          {todayTasks.length === 0 ? (
            <p className="text-gray-500">No tasks scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      {task.client && (
                        <p className="text-xs text-gray-500 mt-1">Client: {task.client.name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Pending Tasks ({pendingTasks.length})
          </h2>

          {pendingTasks.length === 0 ? (
            <p className="text-gray-500">No pending tasks</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.due_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upcoming Content ({content.length})
          </h2>

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
      </div>
    </div>
  );
}

