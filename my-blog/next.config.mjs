/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        fs: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
