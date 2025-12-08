// React hook for feature flags (client-side)
'use client';

import { useState, useEffect } from 'react';
import { FeatureFlagResult, FeatureFlagContext } from '@/lib/types';

interface UseFeatureFlagsOptions {
  tenantId: string;
  userId?: string;
  userRole?: string;
  planSlug: string;
}

export function useFeatureFlags(
  flagKeys: string[],
  options: UseFeatureFlagsOptions
) {
  const [flags, setFlags] = useState<Record<string, FeatureFlagResult>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlags() {
      setLoading(true);
      try {
        const context: FeatureFlagContext = {
          tenantId: options.tenantId,
          userId: options.userId,
          userRole: options.userRole as any,
          planSlug: options.planSlug as any,
        };

        const response = await fetch('/api/feature-flags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flagKeys, context }),
        });

        if (response.ok) {
          const data = await response.json();
          setFlags(data.flags);
        }
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setLoading(false);
      }
    }

    if (options.tenantId && options.planSlug) {
      fetchFlags();
    }
  }, [flagKeys.join(','), options.tenantId, options.userId, options.planSlug]);

  const isEnabled = (flagKey: string): boolean => {
    return flags[flagKey]?.enabled ?? false;
  };

  const getLimits = (flagKey: string): Record<string, any> => {
    return flags[flagKey]?.limits ?? {};
  };

  return {
    flags,
    loading,
    isEnabled,
    getLimits,
  };
}

