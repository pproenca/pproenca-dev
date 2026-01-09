import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Next.js bundles polyfills (Array.at, Object.hasOwn, etc.) regardless
  // of browserslist. This is a known limitation with no official workaround.
  // See: https://github.com/vercel/next.js/discussions/64330
  // The browserslist in package.json still optimizes other transpilation.
  async redirects() {
    return [
      // /posts index redirects to homepage
      {
        source: "/posts",
        destination: "/",
        permanent: true,
      },
      // Old category URL with dot redirects to new format
      {
        source: "/categories/next.js",
        destination: "/categories/nextjs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
