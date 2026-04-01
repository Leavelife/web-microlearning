/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storyset.com',
      },
    ],
  },
};

export default nextConfig;
