/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack: (config) => {
    // Recharts expects `react-is`; avoid resolving a missing nested
    // `node_modules/recharts/node_modules/react-is` (broken install / lock drift).
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-is': path.resolve(__dirname, 'node_modules/react-is'),
    };
    return config;
  },
};

module.exports = nextConfig;
