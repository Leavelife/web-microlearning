/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storyset.com',
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
