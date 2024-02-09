/** @type {import('next').NextConfig} */
const nextConfig = {};

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error);
});

export default nextConfig;
