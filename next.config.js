/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withOffline = require('next-offline');

module.exports = withOffline({
  redirects: async () => {
    return [
      {
        destination: '/events',
        permanent: false,
        source: '/',
      },
    ];
  },
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    return config;
  },
});
