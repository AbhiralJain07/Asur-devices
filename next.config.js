/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: "three",
          chunks: "all",
        },
      },
    };
    return config;
  },
};

export default nextConfig;
