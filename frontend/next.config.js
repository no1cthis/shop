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
    domains: ["cdn.dribbble.com", "localhost"],
  },
};

// module.exports = {
//   distDir: "../server/public",
// };
