/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWAに必要なヘッダー設定
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
