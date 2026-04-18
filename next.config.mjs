/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/send-pdf': [
        'node_modules/@sparticuz/chromium/bin/**/*',
      ],
    },
  },
  serverExternalPackages: ["@sparticuz/chromium"],
};

export default nextConfig;