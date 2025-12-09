// Generate Vercel Environment Variables File
// Run: node scripts/generate-vercel-env.js

const fs = require('fs');
const path = require('path');

// Read .env.local if it exists
const envPath = path.join(process.cwd(), '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match && !match[1].startsWith('#')) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (key && value && value !== 'your-key-here' && value !== 'CHANGE_THIS_TO_RANDOM_SECRET') {
        envVars[key] = value;
      }
    }
  });
}

// Generate Vercel CLI format
const vercelEnv = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Generate markdown format for Vercel dashboard
const vercelMarkdown = Object.entries(envVars)
  .map(([key, value]) => `\`${key}\` = \`${value}\``)
  .join('\n');

// Write files
fs.writeFileSync('vercel-env.txt', vercelEnv);
fs.writeFileSync('vercel-env.md', `# Vercel Environment Variables\n\nCopy these to Vercel Dashboard:\n\n\`\`\`\n${vercelMarkdown}\n\`\`\`\n`);

console.log('✅ Generated vercel-env.txt and vercel-env.md');
console.log('\n📋 To add via Vercel CLI:');
console.log('   vercel env add NEXT_PUBLIC_SUPABASE_URL');
console.log('   (paste value when prompted)');
console.log('\n📋 Or copy from vercel-env.md to Vercel Dashboard');

