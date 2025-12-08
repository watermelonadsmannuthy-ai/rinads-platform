// Simple script to check if environment variables are set
// Load .env.local file manually for Node.js scripts

const fs = require('fs');
const path = require('path');

// Load .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (key && value && !key.startsWith('#')) {
        process.env[key] = value;
      }
    }
  });
}

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const optionalVars = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
];

console.log('🔍 Checking environment variables...\n');

let allRequired = true;

console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask the value for security
    const masked = value.length > 20 
      ? value.substring(0, 10) + '...' + value.substring(value.length - 4)
      : '***';
    console.log(`  ✅ ${varName}: ${masked}`);
  } else {
    console.log(`  ❌ ${varName}: Missing`);
    allRequired = false;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const masked = value.length > 20 
      ? value.substring(0, 10) + '...' + value.substring(value.length - 4)
      : '***';
    console.log(`  ✅ ${varName}: ${masked}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (optional)`);
  }
});

console.log('');

if (allRequired) {
  console.log('✅ All required variables are set! You can run: npm run seed');
  process.exit(0);
} else {
  console.log('❌ Some required variables are missing.');
  console.log('   Please add them to .env.local file.');
  process.exit(1);
}

