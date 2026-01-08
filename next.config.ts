import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Next.js bundles polyfills (Array.at, Object.hasOwn, etc.) regardless
  // of browserslist. This is a known limitation with no official workaround.
  // See: https://github.com/vercel/next.js/discussions/64330
  // The browserslist in package.json still optimizes other transpilation.
};

export default nextConfig;
