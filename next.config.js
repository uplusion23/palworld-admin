/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
};

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error);
});

module.exports = nextConfig
