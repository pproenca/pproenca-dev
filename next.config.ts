import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  // Use webpack for builds (Serwist doesn't support Turbopack yet)
  // See: https://github.com/serwist/serwist/issues/54
  turbopack: {
    root: process.cwd(),
  },
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

export default withSerwist(nextConfig);
