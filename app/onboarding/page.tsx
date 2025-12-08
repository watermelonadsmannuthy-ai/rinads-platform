// Onboarding/Signup Flow
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    subdomain: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    logo: null as File | null,
  });

  async function handleSubmit() {
    setLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/onboarding/success?tenantId=${data.tenantId}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Get Started with RINADS</h1>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Step 1: Business Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input
                type="text"
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Trendy Cuts Salon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subdomain</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="trendy-cuts"
                />
                <span className="ml-2 text-gray-500">.rinads.com</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.tenantName || !formData.subdomain}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Step 2: Owner Account</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={formData.ownerPassword}
                onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.ownerName || !formData.ownerEmail || !formData.ownerPassword}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

