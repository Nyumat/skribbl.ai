/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Existing configuration
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals = config.externals || {};

    if (!isServer) {
      // Exclude 'chromadb' and '@xenova/transformers' from client-side bundles
      config.externals["chromadb"] = "commonjs chromadb";
      config.externals["@xenova/transformers"] =
        "commonjs @xenova/transformers";
    }

    return config;
  },
};

export default nextConfig;
