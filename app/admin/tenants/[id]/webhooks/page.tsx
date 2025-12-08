// Admin Dashboard - Webhook Events Log
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  processed: boolean;
  processing_error?: string;
  retry_count: number;
  created_at: string;
  processed_at?: string;
}

export default function AdminWebhooksPage() {
  const params = useParams();
  const tenantId = params.id as string;
  
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      fetchWebhooks();
    }
  }, [tenantId]);

  async function fetchWebhooks() {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/webhooks`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching webhooks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function replayWebhook(eventId: string) {
    try {
      const response = await fetch('/api/admin/webhooks/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      if (response.ok) {
        alert('Webhook replayed successfully');
        await fetchWebhooks();
      } else {
        alert('Failed to replay webhook');
      }
    } catch (error) {
      console.error('Error replaying webhook:', error);
      alert('Failed to replay webhook');
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Webhook Events</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retries</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{event.event_id.slice(0, 8)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{event.event_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.processed ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Processed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{event.retry_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(event.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {!event.processed && (
                    <button
                      onClick={() => replayWebhook(event.event_id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Replay
                    </button>
                  )}
                  {event.processing_error && (
                    <span className="ml-2 text-xs text-red-600" title={event.processing_error}>
                      ⚠️
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

