// Admin Dashboard - Tenant Detail
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan_slug: string;
  status: string;
}

interface FeatureOverride {
  id: string;
  feature_flag_id: string;
  flag_key: string;
  flag_name: string;
  is_enabled: boolean;
}

export default function AdminTenantDetailPage() {
  const params = useParams();
  const tenantId = params.id as string;
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [featureOverrides, setFeatureOverrides] = useState<FeatureOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tenantId) {
      fetchTenant();
      fetchFeatureOverrides();
    }
  }, [tenantId]);

  async function fetchTenant() {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}`);
      if (response.ok) {
        const data = await response.json();
        setTenant(data.tenant);
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFeatureOverrides() {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/feature-overrides`);
      if (response.ok) {
        const data = await response.json();
        setFeatureOverrides(data.overrides || []);
      }
    } catch (error) {
      console.error('Error fetching feature overrides:', error);
    }
  }

  const [resyncing, setResyncing] = useState(false);

  async function updatePlan(planSlug: string) {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_slug: planSlug }),
      });

      if (response.ok) {
        await fetchTenant();
        alert('Plan updated successfully');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    } finally {
      setSaving(false);
    }
  }

  async function resyncPlan() {
    setResyncing(true);
    try {
      const response = await fetch('/api/admin/plan-resync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchTenant();
        alert(data.message || 'Plan resynced successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to resync plan');
      }
    } catch (error) {
      console.error('Error resyncing plan:', error);
      alert('Failed to resync plan');
    } finally {
      setResyncing(false);
    }
  }

  async function toggleFeatureOverride(featureFlagId: string, enabled: boolean) {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/feature-overrides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature_flag_id: featureFlagId, is_enabled: enabled }),
      });

      if (response.ok) {
        await fetchFeatureOverrides();
      }
    } catch (error) {
      console.error('Error toggling feature override:', error);
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!tenant) {
    return <div className="p-8">Tenant not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{tenant.name}</h1>

      <div className="space-y-6">
        {/* Tenant Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tenant Information</h2>
          <div className="space-y-2">
            <p><strong>Subdomain:</strong> {tenant.subdomain}</p>
            <p><strong>Status:</strong> {tenant.status}</p>
            <div className="flex items-center gap-4">
              <p><strong>Plan:</strong> {tenant.plan_slug}</p>
              <select
                value={tenant.plan_slug}
                onChange={(e) => updatePlan(e.target.value)}
                disabled={saving}
                className="border rounded px-2 py-1"
              >
                <option value="solo">Solo</option>
                <option value="studio">Studio</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <button
                onClick={resyncPlan}
                disabled={resyncing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {resyncing ? 'Resyncing...' : 'Resync from Razorpay'}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Overrides */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Feature Overrides</h2>
          {featureOverrides.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No feature overrides set. Features are controlled by the plan tier ({tenant.plan_slug}).
              You can override specific features by creating an override in the database.
            </p>
          ) : (
            <div className="space-y-2">
              {featureOverrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{override.flag_name}</p>
                    <p className="text-sm text-gray-500">{override.flag_key}</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={override.is_enabled}
                      onChange={(e) => toggleFeatureOverride(override.feature_flag_id, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Webhook Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Webhook Events</h2>
          <p className="text-gray-500 text-sm mb-4">
            View webhook events and replay failed webhooks.
          </p>
          <Link
            href={`/admin/tenants/${tenantId}/webhooks`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Webhook Logs →
          </Link>
        </div>
      </div>
    </div>
  );
}

