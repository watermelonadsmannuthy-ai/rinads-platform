// API route for feature flags
import { NextRequest, NextResponse } from 'next/server';
import { getFeatureFlags } from '@/lib/feature-flags';
import { FeatureFlagContext } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { flagKeys, context } = await request.json();

    if (!flagKeys || !Array.isArray(flagKeys) || !context) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const featureContext: FeatureFlagContext = {
      tenantId: context.tenantId,
      userId: context.userId,
      userRole: context.userRole,
      planSlug: context.planSlug,
    };

    const flags = await getFeatureFlags(flagKeys, featureContext);

    return NextResponse.json({ flags });
  } catch (error: any) {
    console.error('Error in feature-flags API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

