// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.freecsereview.online",
//         pathname: "/media/**",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fixes "Module Not Found" for specific libraries in Production
  transpilePackages: [
    "lucide-react",
    "@react-pdf-viewer/core",
    "@react-pdf-viewer/default-layout",
  ],

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
