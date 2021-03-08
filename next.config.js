const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = { poweredByHeader: false };

module.exports = withBundleAnalyzer(config);
