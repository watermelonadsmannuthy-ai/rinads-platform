/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable raw body for webhook routes
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;


