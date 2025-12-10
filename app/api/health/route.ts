import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    const startTime = Date.now();

    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        checks: {
            database: { status: 'unknown', responseTime: 0 },
            openai: { status: 'unknown', configured: false },
            environment: { status: 'unknown', missingVars: [] as string[] },
        },
    };

    // Check database connection
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            const dbStartTime = Date.now();
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Simple query to test connection
            const { error } = await supabase.from('tenants').select('count').limit(1);

            health.checks.database = {
                status: error ? 'unhealthy' : 'healthy',
                responseTime: Date.now() - dbStartTime,
                error: error?.message,
            };
        } else {
            health.checks.database = {
                status: 'unhealthy',
                responseTime: 0,
                error: 'Supabase credentials not configured',
            };
        }
    } catch (error) {
        health.checks.database = {
            status: 'unhealthy',
            responseTime: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }

    // Check OpenAI configuration
    health.checks.openai = {
        status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        configured: !!process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'not_set',
    };

    // Check required environment variables
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'OPENAI_API_KEY',
        'CRON_SECRET',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    health.checks.environment = {
        status: missingVars.length === 0 ? 'healthy' : 'unhealthy',
        missingVars,
        totalRequired: requiredVars.length,
        configured: requiredVars.length - missingVars.length,
    };

    // Overall health status
    const isHealthy =
        health.checks.database.status === 'healthy' &&
        health.checks.environment.status === 'healthy';

    health.status = isHealthy ? 'healthy' : 'degraded';
    health.responseTime = Date.now() - startTime;

    const statusCode = isHealthy ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
}
