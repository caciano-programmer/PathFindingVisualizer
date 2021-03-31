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

module.exports = withBundleAnalyzer(config);
