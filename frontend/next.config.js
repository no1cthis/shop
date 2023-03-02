/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "next/build",
};

module.exports = nextConfig;

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
      },
    ],
  },
};

module.exports = {
  images: {
    domains: [
      "cdn.dribbble.com",
      "localhost",
      process.env.NEXT_PUBLIC_BACKEND_URL,
      "13.39.108.216",
    ],
  },
};
