/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.freecsereview.online",
        pathname: "/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
