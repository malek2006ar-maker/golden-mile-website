/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  async rewrites() {
    return [
      // لإعادة توجيه /admin/* داخل المشروع الأصلي بعد الدمج
      { source: "/admin", destination: "/dashboard" },
    ];
  },
};

module.exports = nextConfig;