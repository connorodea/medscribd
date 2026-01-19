/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.deepgram.com",
        port: "",
        pathname: "/examples/avatars/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (typeof config.externals === "function") {
        const originalExternals = config.externals;
        config.externals = async (...args) => {
          const resolved = await originalExternals(...args);
          return Array.isArray(resolved)
            ? [...resolved, { fsevents: "commonjs fsevents" }]
            : resolved;
        };
      } else {
        config.externals = [...(config.externals || []), { fsevents: "commonjs fsevents" }];
      }
    }
    return config;
  },
};

export default nextConfig;
