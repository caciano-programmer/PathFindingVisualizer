const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
};
const pwaConfig = {
  ...config,
  pwa: {
    dest: 'public',
    sw: 'sw.js',
    disable: process.env.NODE_ENV === 'development',
  },
};

let myExport;
if (process.env.ANALYZE) myExport = withBundleAnalyzer(config);
else myExport = withPWA(pwaConfig);

module.exports = myExport;
